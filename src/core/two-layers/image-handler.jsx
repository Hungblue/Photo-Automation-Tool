// ============================================
// Two-Layers Image Handler
// ============================================

/**
 * Process images for 2-layers template
 * Layer naming: layer_print_1_image_1, layer_print_1_image_2, etc. (Sequential)
 * Image path: images/{product_type}/layer_print_1/{ImageID}.png
 * CSV input: image:L4,L2 -> 
 *   layer_print_1_image_1 gets L4
 *   layer_print_1_image_2 gets L2
 */
function processImage_2L(doc, personalization) {
  var results = {
    processed: [],
    errors: []
  };
  
  // Get image list from CSV input
  if (!personalization.image) {
    logInfo("2L Image: No 'image' field in personalization, skipping");
    return results;
  }
  
  var productType = personalization.product_type || "default";
  
  // Parse image IDs from CSV (e.g., "L4,L2" -> ["L4", "L2"])
  var imageIds = personalization.image.split(",");
  for (var j = 0; j < imageIds.length; j++) {
    imageIds[j] = imageIds[j].replace(/^\s+|\s+$/g, ""); // Trim whitespace
  }
  
  logInfo("2L Image: Processing images: " + imageIds.join(", ") + " for product_type: " + productType);
  
  // Define layer patterns (layer name prefix) and folder names
  var layerMappings = [
    { layerPrefix: "layer_print_1_image", folder: "layer_print_1" },
    { layerPrefix: "layer_print_2_image", folder: "layer_print_2" },
    { layerPrefix: "layer_cut_1_image", folder: "layer_cut_1" },
    { layerPrefix: "layer_cut_2_image", folder: "layer_cut_2" }
  ];
  
  // Get base images folder path
  var imagesFolder = getImagesBasePath() + "/" + productType;
  
  var processedCount = 0;
  
  // For each layer mapping/pattern (print_1, cut_2, etc.)
  for (var p = 0; p < layerMappings.length; p++) {
    var mapping = layerMappings[p];
    var folderPath = imagesFolder + "/" + mapping.folder;
    
    // For each image ID in the list, map to index 1, 2, 3...
    for (var i = 0; i < imageIds.length; i++) {
        var imageId = imageIds[i];
        var itemIndex = i + 1; // 1-based index
        
        // Construct layer name: prefix + "_" + index
        // e.g., layer_cut_2_image_1
        var layerName = mapping.layerPrefix + "_" + itemIndex;
        
        logInfo("2L Image: Mapping " + imageId + " to layer " + layerName);
        
        // Find the image file
        var imageFile = findImageFile(folderPath, imageId);
        
        if (!imageFile) {
            logInfo("2L Image: File not found in " + mapping.folder + " for " + imageId);
            continue;
        }
        
        logInfo("2L Image: Replacing layer: " + layerName);
        
        // Try to find and replace
        var success = replaceLayerImage(doc, layerName, imageFile.fsName);
        
        if (success) {
            processedCount++;
            logInfo("2L Image: SUCCESS - Replaced " + layerName);
        } else {
            // Only log as error if this is expected to succeed (optional)
            // But since layers might not exist for every index, we just log info
            logInfo("2L Image: Skipped/Failed " + layerName + " (Layer might not exist)");
        }
    }
  }
  
  if (processedCount > 0) {
    results.processed.push("image (" + processedCount + " layers)");
  }
  
  logInfo("2L Image: Processed " + processedCount + " image replacements");
  
  return results;
}

/**
 * Find image file with any supported extension
 */
function findImageFile(folderPath, imageId) {
  var extensions = ["png", "jpg", "jpeg", "psd", "tif", "tiff"];
  
  for (var i = 0; i < extensions.length; i++) {
    var filePath = folderPath + "/" + imageId + "." + extensions[i];
    var file = new File(filePath);
    if (file.exists) {
      return file;
    }
  }
  
  return null;
}

/**
 * Get base path for images folder
 */
function getImagesBasePath() {
  var scriptFile = new File($.fileName);
  // src/core/two-layers -> src/core -> src -> root
  var srcFolder = scriptFile.parent.parent.parent.parent;
  return srcFolder.fsName + "/images";
}
