// ============================================
// Main Processor - Orchestrates Product Processing
// ============================================

/**
 * Main product processor - orchestrates entire workflow
 * @param {Object} productData - Product data object
 * @returns {Object} - Processing result
 */
function processProduct(productData, scale) {
  var result = {
    product_id: productData.product_id,
    product_type: productData.product_type,
    status: 'pending',
    error: null,
    output_path: null,
    processing_time: 0
  };
  
  var startTime = new Date().getTime();
  
  try {
    logInfo("========================================");
    logInfo("Processing product: " + productData.product_id);
    
    // 1. Validate product data
    if (!validateProductData(productData)) {
      throw new Error("Invalid product data");
    }
    
    // 2. Get template path (local or download from S3)
    var templatePath = getTemplatePath(productData.product_type, productData.template_name);
    if (!templatePath) {
      throw new Error("Template not found: " + productData.template_name);
    }
    
    logInfo("Using template: " + templatePath);
    
    // 3. Open template
    var doc = app.open(new File(templatePath));
    if (!doc) {
      throw new Error("Failed to open template");
    }
    
    logInfo("Template opened successfully");
    
    // 4. Parse personalization string
    var personalization = parsePersonalization(productData.personalization);
    
    // Inject product_type and template_name into personalization for handlers that need it
    personalization.product_type = productData.product_type;
    personalization.template_name = productData.template_name;
    
    logInfo("Personalization parsed: " + Object.keys(personalization).length + " keys");
    
    // 5. Process template using layer router
    var processResult = routeToLayerHandler(doc, personalization);
    
    logInfo("Processed keys: " + processResult.processed.join(", "));
    if (processResult.errors.length > 0) {
      logWarning("Processing errors: " + processResult.errors.length);
      for (var i = 0; i < processResult.errors.length; i++) {
        logWarning("  - " + processResult.errors[i].key + ": " + processResult.errors[i].error);
      }
    }
    
    // 6. Export PNG
    scale = scale || 1.0;
    var outputPath = exportToPNG(doc, productData.product_id, productData.product_type, scale);
    
    if (!outputPath) {
      throw new Error("Failed to export PNG");
    }
    
    logInfo("Exported to: " + outputPath);
    
    // 7. Close document without saving
    doc.close(SaveOptions.DONOTSAVECHANGES);
    logInfo("Template closed");
    
    // 8. Update result
    result.status = 'success';
    result.output_path = outputPath;
    result.processing_time = new Date().getTime() - startTime;
    
    logInfo("Product processed successfully in " + result.processing_time + "ms");
    
  } catch (error) {
    result.status = 'failed';
    result.error = error.message || error.toString();
    result.processing_time = new Date().getTime() - startTime;
    
    logError("processProduct", error);
    logInfo("Product failed in " + result.processing_time + "ms");
    
    // Try to close document if open
    try {
      if (app.documents.length > 0) {
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
      }
    } catch (e) {
      // Silent fail
    }
  }
  
  return result;
}

/**
 * Parse personalization string to object
 * Input: "layer:TextLayer|name_text_1:John|name_font_1:Arial|name_color_1:#FF0000|image:img1.png,img2.png"
 * Output: {layer: "TextLayer", name_text_1: "John", name_font_1: "Arial", ...}
 */
function parsePersonalization(personalizationString) {
  var result = {};
  
  try {
    var pairs = personalizationString.split("|");
    
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split(":");
      if (pair.length === 2) {
        var key = pair[0].replace(/^\s+|\s+$/g, "");
        var value = pair[1].replace(/^\s+|\s+$/g, "");
        result[key] = value;
      } else {
        logWarning("Invalid personalization pair: " + pairs[i]);
      }
    }
    
    logDebug("Parsed personalization: " + JSON.stringify(result));
    
  } catch (e) {
    logError("parsePersonalization", e);
  }
  
  return result;
}

/**
 * Batch process multiple products
 * @param {Array} products - Array of product data objects
 * @returns {Array} - Array of results
 */
function batchProcessProducts(products) {
  var results = [];
  
  logInfo("========================================");
  logInfo("Starting batch processing: " + products.length + " products");
  logInfo("========================================");
  
  for (var i = 0; i < products.length; i++) {
    logInfo("Processing product " + (i + 1) + " of " + products.length);
    
    var result = processProduct(products[i]);
    results.push(result);
    
    // Small delay between products
    $.sleep(100);
  }
  
  // Generate summary
  var summary = getResultsSummary(results);
  logInfo("========================================");
  logInfo("Batch processing completed");
  logInfo("Total: " + summary.total);
  logInfo("Success: " + summary.success);
  logInfo("Failed: " + summary.failed);
  logInfo("Success rate: " + summary.successRate);
  logInfo("Total time: " + summary.totalTime + "ms");
  logInfo("Average time: " + summary.avgTime + "ms");
  logInfo("========================================");
  
  return results;
}
