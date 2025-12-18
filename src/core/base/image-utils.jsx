// ============================================
// Image Utilities - Base Functions
// ============================================

/**
 * Replace image in layer (Smart Object or raster)
 * @param {Document} doc - Photoshop document
 * @param {String} layerName - Layer name
 * @param {String} imagePath - Path to new image
 */
function replaceLayerImage(doc, layerName, imagePath) {
  try {
    var layer = findLayerByName(doc, layerName);
    
    if (!layer) {
      logWarning("Layer not found: " + layerName);
      return false;
    }
    
    // Check if image file exists
    var imageFile = new File(imagePath);
    if (!imageFile.exists) {
      logError("replaceLayerImage", "Image file not found: " + imagePath);
      return false;
    }
    
    // Select the layer
    doc.activeLayer = layer;
    
    // Place image using Action Manager (supports Smart Objects)
    var idPlc = charIDToTypeID("Plc ");
    var desc = new ActionDescriptor();
    desc.putPath(charIDToTypeID("null"), imageFile);
    desc.putBoolean(charIDToTypeID("Lnkd"), true); // Create Smart Object
    executeAction(idPlc, desc, DialogModes.NO);
    
    logInfo("Replaced image for layer '" + layerName + "' with: " + imagePath);
    return true;
    
  } catch (e) {
    logError("replaceLayerImage", e);
    return false;
  }
}

/**
 * Handle multiple images (for image array in personalization)
 * @param {Document} doc - Photoshop document
 * @param {Array} imageArray - Array of {layerName: "Layer1", imagePath: "path/to/img.png"}
 */
function handleMultipleImages(doc, imageArray) {
  var results = [];
  
  try {
    for (var i = 0; i < imageArray.length; i++) {
      var item = imageArray[i];
      var success = replaceLayerImage(doc, item.layerName, item.imagePath);
      
      results.push({
        layer: item.layerName,
        imagePath: item.imagePath,
        success: success
      });
    }
    
    logInfo("Processed " + imageArray.length + " images");
    
  } catch (e) {
    logError("handleMultipleImages", e);
  }
  
  return results;
}

/**
 * Place image at specific position
 * @param {Document} doc - Photoshop document
 * @param {String} imagePath - Path to image
 * @param {Number} x - X position
 * @param {Number} y - Y position
 */
function placeImageAtPosition(doc, imagePath, x, y) {
  try {
    var imageFile = new File(imagePath);
    if (!imageFile.exists) {
      logError("placeImageAtPosition", "Image file not found: " + imagePath);
      return false;
    }
    
    // Place image
    var placedLayer = doc.artLayers.add();
    placedLayer.kind = LayerKind.NORMAL;
    
    // Open image and paste
    var tempDoc = app.open(imageFile);
    tempDoc.selection.selectAll();
    tempDoc.selection.copy();
    tempDoc.close(SaveOptions.DONOTSAVECHANGES);
    
    // Paste into document
    doc.activeLayer = placedLayer;
    doc.paste();
    
    // Move to position
    placedLayer.translate(x, y);
    
    logInfo("Placed image at position (" + x + ", " + y + ")");
    return true;
    
  } catch (e) {
    logError("placeImageAtPosition", e);
    return false;
  }
}

/**
 * Resize image layer
 */
function resizeImageLayer(layer, width, height) {
  try {
    if (!layer) return false;
    
    var bounds = layer.bounds;
    var currentWidth = bounds[2] - bounds[0];
    var currentHeight = bounds[3] - bounds[1];
    
    var widthPercent = (width / currentWidth) * 100;
    var heightPercent = (height / currentHeight) * 100;
    
    layer.resize(widthPercent, heightPercent, AnchorPosition.MIDDLECENTER);
    
    logDebug("Resized layer to " + width + "x" + height);
    return true;
    
  } catch (e) {
    logError("resizeImageLayer", e);
    return false;
  }
}
