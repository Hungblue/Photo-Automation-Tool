// ============================================
// Image Utilities - Base Functions
// ============================================

/**
 * Replace image in layer (Smart Object or raster)
 * @param {Document} doc - Photoshop document
 * @param {String} layerName - Layer name
 * @param {String} imagePath - Path to new image
 */
/**
 * Replace image in layer using appropriate method for layer type
 * Preserves original layer position and size
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
    
    doc.activeLayer = layer;
    var success = false;
    
    // Method 1: If Smart Object, use replace contents (preserves transform)
    if (layer.kind === LayerKind.SMARTOBJECT) {
       success = replaceSmartObject(layer, imageFile);
    } 
    // Method 2: If Raster/Normal, use Place -> Resize -> Move
    else {
       success = replaceRasterLayer(doc, layer, imageFile);
    }
    
    if (success) {
      logInfo("Replaced image for layer '" + layerName + "' with: " + imageFile.name);
    }
    
    return success;
    
  } catch (e) {
    logError("replaceLayerImage", e);
    return false;
  }
}

/**
 * Replace Smart Object content (preserves transform)
 */
function replaceSmartObject(layer, file) {
    try {
        var idplacedLayerReplaceContents = stringIDToTypeID( "placedLayerReplaceContents" );
        var desc = new ActionDescriptor();
        desc.putPath( charIDToTypeID( "null" ), file );
        executeAction( idplacedLayerReplaceContents, desc, DialogModes.NO );
        return true;
    } catch(e) {
        logError("replaceSmartObject", e);
        return false;
    }
}

/**
 * Replace Raster Layer content (manually preserves bounds)
 */
function replaceRasterLayer(doc, layer, file) {
    try {
        // 1. Save original bounds
        var origBounds = layer.bounds;
        var origLeft = origBounds[0].as("px");
        var origTop = origBounds[1].as("px");
        var origWidth = origBounds[2].as("px") - origLeft;
        var origHeight = origBounds[3].as("px") - origTop;
        
        // 2. Place new image
        var idPlc = charIDToTypeID("Plc ");
        var desc = new ActionDescriptor();
        desc.putPath(charIDToTypeID("null"), file);
        desc.putBoolean(charIDToTypeID("Lnkd"), true); // Create Smart Object
        executeAction(idPlc, desc, DialogModes.NO);
        
        // New layer is active
        var newLayer = doc.activeLayer;
        
        // 3. Resize to match original dimensions
        // Get new bounds
        var newBounds = newLayer.bounds;
        var newWidth = newBounds[2].as("px") - newBounds[0].as("px");
        var newHeight = newBounds[3].as("px") - newBounds[1].as("px");
        
        if (newWidth > 0 && newHeight > 0 && origWidth > 0 && origHeight > 0) {
            var scaleX = (origWidth / newWidth) * 100;
            var scaleY = (origHeight / newHeight) * 100;
            newLayer.resize(scaleX, scaleY, AnchorPosition.MIDDLECENTER);
        }
        
        // 4. Move to original center
        // Recalculate center of new layer
        newBounds = newLayer.bounds;
        var newLeft = newBounds[0].as("px");
        var newTop = newBounds[1].as("px");
        var newCenterX = newLeft + (newBounds[2].as("px") - newLeft)/2;
        var newCenterY = newTop + (newBounds[3].as("px") - newTop)/2;
        
        var origCenterX = origLeft + origWidth/2;
        var origCenterY = origTop + origHeight/2;
        
        newLayer.translate(origCenterX - newCenterX, origCenterY - newCenterY);
        
        // 5. Remove old layer
        var oldName = layer.name;
        layer.remove();
        newLayer.name = oldName;
        
        return true;
    } catch(e) {
        logError("replaceRasterLayer", e);
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
