// ============================================
// One-Layer Image Handler
// ============================================

/**
 * Process images for 1-layer template
 * Handles: image (comma-separated paths)
 */
function processImage_1L(doc, personalization) {
  var results = {
    processed: [],
    errors: []
  };
  
  if (!personalization.image) {
    return results;
  }
  
  var imageValue = personalization.image;
  var imageArray = [];
  
  // Parse image value (comma-separated paths)
  if (typeof imageValue === "string") {
    var imagePaths = imageValue.split(",");
    
    for (var i = 0; i < imagePaths.length; i++) {
      var path = imagePaths[i].replace(/^\s+|\s+$/g, "");
      imageArray.push({
        layerName: "Image Layer " + (i + 1),
        imagePath: path
      });
    }
  }
  
  logDebug("1L Image: Processing " + imageArray.length + " images");
  
  // Call base utility
  var imageResults = handleMultipleImages(doc, imageArray);
  
  // Check results
  var allSuccess = true;
  for (var j = 0; j < imageResults.length; j++) {
    if (!imageResults[j].success) {
      results.errors.push({
        key: "image",
        error: "Failed to replace image: " + imageResults[j].layer
      });
      allSuccess = false;
    }
  }
  
  if (allSuccess && imageArray.length > 0) {
    results.processed.push("image");
  }
  
  return results;
}
