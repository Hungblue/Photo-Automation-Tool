// ============================================
// One-Layer Image Handler
// ============================================

/**
 * Process images for 1-layer template
 * Layer naming: L1, L2, etc.
 * Image path: images/{product_type}/L1.png
 */
function processImage_1L(doc, personalization) {
  var results = {
    processed: [],
    errors: []
  };
  
  var productType = personalization.product_type || "default";
  
  // Get base images folder path for this product type
  var imagesFolder = getImagesBasePath_1L() + "/" + productType;
  var folder = new Folder(imagesFolder);
  
  if (!folder.exists) {
    logDebug("1L Image: Folder not found: " + folder.fsName);
    return results;
  }
  
  // Get all image files in the folder
  var imageFiles = folder.getFiles(/\.(png|jpg|jpeg|psd|tif|tiff)$/i);
  
  var processedCount = 0;
  
  for (var i = 0; i < imageFiles.length; i++) {
    var imageFile = imageFiles[i];
    var fileName = imageFile.name;
    
    // Extract image ID (e.g., "L1" from "L1.png")
    var imageId = fileName.replace(/\.[^.]+$/, "");
    
    // For 1-layer, layer name is the image ID itself
    var layerName = imageId;
    
    // Try to find and replace
    var success = replaceLayerImage(doc, layerName, imageFile.fsName);
    
    if (success) {
      processedCount++;
      logDebug("1L Image: Replaced " + layerName + " with " + fileName);
    } else {
      results.errors.push({
        key: "image",
        error: "Failed to replace: " + layerName
      });
    }
  }
  
  if (processedCount > 0) {
    results.processed.push("image (" + processedCount + " layers)");
  }
  
  logInfo("1L Image: Processed " + processedCount + " image replacements");
  
  return results;
}

/**
 * Get base path for images folder (1L)
 */
function getImagesBasePath_1L() {
  var scriptFile = new File($.fileName);
  // src/core/one-layer -> src/core -> src
  var srcFolder = scriptFile.parent.parent.parent;
  return srcFolder.fsName + "/images";
}
