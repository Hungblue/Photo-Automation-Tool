// ============================================
// Export Utilities - Base Functions
// ============================================

// Global constants
// Resolve paths based on script location to avoid Current Working Directory issues
// export-utils.jsx is in src/core/base/
var scriptFile = new File($.fileName);
var baseFolder = scriptFile.parent; // src/core/base
var coreFolder = baseFolder.parent; // src/core
var srcFolder = coreFolder.parent;  // src
var projectRoot = srcFolder.parent; // PhotoshopTool

var TEMPLATES_FOLDER = projectRoot.fsName + "/templates";
var OUTPUT_FOLDER = projectRoot.fsName + "/output";
var LOGS_FOLDER = projectRoot.fsName + "/logs";

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
    
    logInfo("DEBUG: Output file path: " + fullPath);

    // PNG save options
    var pngOptions = new PNGSaveOptions();
    pngOptions.compression = 0; // User requested 0
    pngOptions.interlaced = false;
    logInfo("DEBUG: PNG Options created");

    // Resize logic
    if (Math.abs(scale - 1.0) > 0.001) {
         logInfo("DEBUG: Scaling to " + scale);
         // Scaling required
         try {
             var w_val = doc.width;
             var h_val = doc.height;
             logInfo("DEBUG: Current dimensions: " + w_val + " x " + h_val);
             
             // Check if .as method exists
             if (typeof w_val.as === 'undefined') {
                 logInfo("DEBUG: UnitValue.as method undefined!");
                 // Fallback or throw?
             }
             
             var w_px = w_val.as("px");
             var h_px = h_val.as("px");
             logInfo("DEBUG: Pixel dimensions: " + w_px + " x " + h_px);
             
             var newWidth = new UnitValue(w_px * scale, "px");
             var newHeight = new UnitValue(h_px * scale, "px");
             
             doc.resizeImage(newWidth, newHeight, 300, ResampleMethod.BICUBIC);
             logInfo("DEBUG: Resize complete");
         } catch(resizeErr) {
             logError("DEBUG: Resize failed: " + resizeErr.message);
             throw resizeErr;
         }
    } else {
        // Just set DPI (safe method)
        if (doc.resolution !== 300) {
             logInfo("DEBUG: Adjusting DPI only from " + doc.resolution);
             doc.resizeImage(undefined, undefined, 300, ResampleMethod.NONE);
        }
    }
    
    // Resolve Extension.LOWERCASE safely
    var extType = undefined;
    try {
        extType = Extension.LOWERCASE;
        logInfo("DEBUG: Extension.LOWERCASE available");
    } catch(e) {
        logInfo("DEBUG: Extension object or LOWERCASE undefined");
    }

    // Save as PNG
    try {
        logInfo("DEBUG: Saving to " + outputFile.fsName);
        if (extType) {
            doc.saveAs(outputFile, pngOptions, true, extType);
        } else {
            doc.saveAs(outputFile, pngOptions, true);
        }
        logInfo("DEBUG: Save successful");
    } catch (saveErr) {
        logError("Failed to save PNG (Line " + (saveErr.line || "?") + "): " + saveErr.message);
        throw saveErr;
    }
    
    logInfo("Exported PNG (300dpi, x" + scale + "): " + fullPath);
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
