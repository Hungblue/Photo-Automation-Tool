// ============================================
// Two-Layers Image Handler
// ============================================

/**
 * Process images for 2-layers template
 * Note: Images typically don't need to be duplicated across layers
 * This handler applies images to standard image layers
 */
function processImage_2L(doc, personalization) {
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
    
    var types = ["print", "cut"];
    var indices = ["1", "2"];
    
    for (var i = 0; i < imagePaths.length; i++) {
      var path = imagePaths[i].replace(/^\s+|\s+$/g, "");
      var imgIndex = i + 1; // L1, L2...
      
      // Add entry for each of the 4 frames
      for (var t = 0; t < types.length; t++) {
        for (var k = 0; k < indices.length; k++) {
            var layerName = "layer_" + types[t] + "_" + indices[k] + "_image_L" + imgIndex;
            imageArray.push({
                layerName: layerName,
                imagePath: path
            });
        }
      }
    }
  }
  
  logDebug("2L Image: Processing " + imageArray.length + " images");
  
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
