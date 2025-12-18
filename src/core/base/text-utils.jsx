// ============================================
// Text Utilities - Base Functions
// ============================================

/**
 * Set text content for layer
 * @param {Document} doc - Photoshop document
 * @param {String} layerName - Layer name
 * @param {String} text - New text content
 */
function setTextContent(doc, layerName, text) {
  try {
    var layer = findLayerByName(doc, layerName);
    
    if (!layer) {
      logWarning("Layer not found: " + layerName);
      return false;
    }
    
    if (layer.kind !== LayerKind.TEXT) {
      logWarning("Layer is not a text layer: " + layerName);
      return false;
    }
    
    layer.textItem.contents = text;
    logDebug("Set text content for layer '" + layerName + "': " + text);
    return true;
    
  } catch (e) {
    logError("setTextContent", e);
    return false;
  }
}

/**
 * Set font for text layer
 * @param {Document} doc - Photoshop document
 * @param {String} layerName - Layer name
 * @param {String} fontName - Font name (e.g., "Arial-BoldMT")
 */
function setTextFont(doc, layerName, fontName) {
  try {
    var layer = findLayerByName(doc, layerName);
    
    if (!layer || layer.kind !== LayerKind.TEXT) {
      logWarning("Text layer not found: " + layerName);
      return false;
    }
    
    // Check if font exists
    if (!isFontAvailable(fontName)) {
      logWarning("Font not available: " + fontName + ", using default");
      // Don't fail, just log warning
    }
    
    layer.textItem.font = fontName;
    logDebug("Set font for layer '" + layerName + "': " + fontName);
    return true;
    
  } catch (e) {
    logError("setTextFont", e);
    return false;
  }
}

/**
 * Set text size
 * @param {Document} doc - Photoshop document
 * @param {String} layerName - Layer name
 * @param {Number} size - Font size in points
 */
function setTextSize(doc, layerName, size) {
  try {
    var layer = findLayerByName(doc, layerName);
    
    if (!layer || layer.kind !== LayerKind.TEXT) {
      logWarning("Text layer not found: " + layerName);
      return false;
    }
    
    layer.textItem.size = new UnitValue(size, "pt");
    logDebug("Set text size for layer '" + layerName + "': " + size + "pt");
    return true;
    
  } catch (e) {
    logError("setTextSize", e);
    return false;
  }
}

/**
 * Check if font is available
 */
function isFontAvailable(fontName) {
  try {
    var fonts = app.fonts;
    for (var i = 0; i < fonts.length; i++) {
      if (fonts[i].postScriptName === fontName || fonts[i].name === fontName) {
        return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Get text layer content
 */
function getTextContent(doc, layerName) {
  try {
    var layer = findLayerByName(doc, layerName);
    if (layer && layer.kind === LayerKind.TEXT) {
      return layer.textItem.contents;
    }
    return null;
  } catch (e) {
    logError("getTextContent", e);
    return null;
  }
}

/**
 * Set text color
 */
function setTextColor(doc, layerName, hexColor) {
  try {
    var layer = findLayerByName(doc, layerName);
    
    if (!layer || layer.kind !== LayerKind.TEXT) {
      logWarning("Text layer not found: " + layerName);
      return false;
    }
    
    var color = hexToRGB(hexColor);
    layer.textItem.color = color;
    logDebug("Set text color for layer '" + layerName + "': " + hexColor);
    return true;
    
  } catch (e) {
    logError("setTextColor", e);
    return false;
  }
}

/**
 * Apply color range to text (gradient effect)
 */
function setTextColorRange(doc, layerName, colorArray) {
  return applyColorRangeToText(doc, layerName, colorArray);
}
