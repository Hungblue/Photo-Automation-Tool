// ============================================
// Export Utilities - Base Functions
// ============================================

// Global constants
var TEMPLATES_FOLDER = "./templates";
var OUTPUT_FOLDER = "./output";
var LOGS_FOLDER = "./logs";

/**
 * Export document to PNG
 * @param {Document} doc - Photoshop document
 * @param {String} productId - Product ID for file naming
 * @param {String} productType - Product type for folder organization
 * @param {Number} scale - Export scale (default 1.0)
 */
function exportToPNG(doc, productId, productType, scale) {
  scale = scale || 1.0;
  
  try {
    // Create output folder for product type
    var outputPath = createOutputFolder(productType);
    if (!outputPath) {
      throw new Error("Failed to create output folder");
    }
    
    // Generate file name
    var fileName = sanitizeFileName(productId) + ".png";
    var fullPath = outputPath + "/" + fileName;
    var outputFile = new File(fullPath);
    
    // Resize document if scale != 1.0
    if (scale !== 1.0) {
      var currentWidth = doc.width.as("px");
      var currentHeight = doc.height.as("px");
      var newWidth = currentWidth * scale;
      var newHeight = currentHeight * scale;
      
      doc.resizeImage(
        new UnitValue(newWidth, "px"),
        new UnitValue(newHeight, "px"),
        doc.resolution,
        ResampleMethod.BICUBIC
      );
    }
    
    // PNG save options
    var pngOptions = new PNGSaveOptions();
    pngOptions.compression = 9;
    pngOptions.interlaced = false;
    
    // Save as PNG
    doc.saveAs(outputFile, pngOptions, true, Extension.LOWERCASE);
    
    logInfo("Exported PNG: " + fullPath);
    return fullPath;
    
  } catch (e) {
    logError("exportToPNG", e);
    return null;
  }
}

/**
 * Create output folder for product type
 * @param {String} productType - Product type name
 * @returns {String} - Folder path or null if failed
 */
function createOutputFolder(productType) {
  try {
    var basePath = new Folder(OUTPUT_FOLDER);
    if (!basePath.exists) {
      basePath.create();
    }
    
    var productFolder = new Folder(OUTPUT_FOLDER + "/" + productType);
    if (!productFolder.exists) {
      productFolder.create();
    }
    
    return productFolder.absoluteURI;
    
  } catch (e) {
    logError("createOutputFolder", e);
    return null;
  }
}

/**
 * Generate file name from product ID
 */
function generateFileName(productId, extension) {
  extension = extension || "png";
  var safeName = sanitizeFileName(productId);
  return safeName + "." + extension;
}

/**
 * Generate report from results
 * @param {Array} results - Array of processing results
 */
function generateReport(results) {
  try {
    var timestamp = new Date().getTime();
    var reportPath = LOGS_FOLDER + "/report_" + timestamp + ".csv";
    var reportFile = new File(reportPath);
    
    reportFile.encoding = "UTF-8";
    reportFile.open("w");
    
    // CSV header
    reportFile.writeln("product_id,product_type,status,error_message,output_path,processing_time_ms");
    
    // Write results
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var line = [
        r.product_id || "",
        r.product_type || "",
        r.status || "unknown",
        (r.error || "").replace(/,/g, ";"), // Escape commas
        r.output_path || "",
        r.processing_time || 0
      ].join(",");
      
      reportFile.writeln(line);
    }
    
    reportFile.close();
    
    logInfo("Generated report: " + reportPath);
    return reportPath;
    
  } catch (e) {
    logError("generateReport", e);
    return null;
  }
}

/**
 * Get summary from results
 */
function getResultsSummary(results) {
  var total = results.length;
  var success = 0;
  var failed = 0;
  var totalTime = 0;
  
  for (var i = 0; i < results.length; i++) {
    if (results[i].status === "success") {
      success++;
    } else {
      failed++;
    }
    totalTime += results[i].processing_time || 0;
  }
  
  return {
    total: total,
    success: success,
    failed: failed,
    successRate: (success / total * 100).toFixed(2) + "%",
    totalTime: totalTime,
    avgTime: (totalTime / total).toFixed(2)
  };
}
