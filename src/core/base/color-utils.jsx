// ============================================
// Color Utilities - Base Functions
// ============================================

/**
 * Convert hex color to RGB object
 * @param {String} hexColor - Hex color (e.g., "#FF0000")
 * @returns {SolidColor} - Photoshop SolidColor object
 */
function hexToRGB(hexColor) {
  try {
    // Remove # if present
    var hex = hexColor.replace("#", "");
    
    // Parse RGB values
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    
    // Create SolidColor object
    var color = new SolidColor();
    color.rgb.red = r;
    color.rgb.green = g;
    color.rgb.blue = b;
    
    return color;
  } catch (e) {
    logError("hexToRGB", e);
    // Return black as fallback
    var fallback = new SolidColor();
    fallback.rgb.red = 0;
    fallback.rgb.green = 0;
    fallback.rgb.blue = 0;
    return fallback;
  }
}

/**
 * Apply color to text layer
 * @param {Layer} layer - Text layer
 * @param {SolidColor} color - Color to apply
 */
function applyColorToLayer(layer, color) {
  try {
    if (layer && layer.kind === LayerKind.TEXT) {
      layer.textItem.color = color;
      return true;
    }
    return false;
  } catch (e) {
    logError("applyColorToLayer", e);
    return false;
  }
}

/**
 * Apply color to specific character range in text
 * @param {Layer} layer - Text layer
 * @param {SolidColor} color - Color to apply
 * @param {Number} startIndex - Start character index (0-based)
 * @param {Number} endIndex - End character index (0-based)
 */
function applyColorToCharRange(layer, color, startIndex, endIndex) {
  try {
    if (layer && layer.kind === LayerKind.TEXT) {
      var textItem = layer.textItem;
      
      for (var i = startIndex; i <= endIndex && i < textItem.contents.length; i++) {
        textItem.characters[i].color = color;
      }
      return true;
    }
    return false;
  } catch (e) {
    logError("applyColorToCharRange", e);
    return false;
  }
}

/**
 * Create gradient from multiple colors
 * @param {Array} colorArray - Array of hex colors
 * @returns {Array} - Array of SolidColor objects
 */
function createGradient(colorArray) {
  var colors = [];
  
  try {
    for (var i = 0; i < colorArray.length; i++) {
      var color = hexToRGB(colorArray[i]);
      colors.push(color);
    }
  } catch (e) {
    logError("createGradient", e);
  }
  
  return colors;
}

/**
 * Apply color range to text (gradient effect on characters)
 * @param {Document} doc - Photoshop document
 * @param {String} layerName - Layer name
 * @param {Array} colorArray - Array of hex colors
 */
function applyColorRangeToText(doc, layerName, colorArray) {
  try {
    var layer = findLayerByName(doc, layerName);
    if (!layer || layer.kind !== LayerKind.TEXT) {
      logError("applyColorRangeToText", "Layer not found or not a text layer: " + layerName);
      return false;
    }
    
    var text = layer.textItem.contents;
    var charCount = text.length;
    
    // Convert hex colors to SolidColor objects
    var colors = createGradient(colorArray);
    if (colors.length === 0) {
      logError("applyColorRangeToText", "No valid colors in array");
      return false;
    }
    
    // Apply colors to characters cyclically
    for (var i = 0; i < charCount; i++) {
      var colorIndex = i % colors.length;
      layer.textItem.characters[i].color = colors[colorIndex];
    }
    
    logInfo("Applied color range to " + charCount + " characters");
    return true;
    
  } catch (e) {
    logError("applyColorRangeToText", e);
    return false;
  }
}

/**
 * Apply color range to text (randomly per character)
 * @param {Document} doc - Photoshop document
 * @param {String} layerName - Layer name
 * @param {Array} colorArray - Array of hex colors
 */
function applyRandomColorRangeToText(doc, layerName, colorArray) {
  try {
    var layer = findLayerByName(doc, layerName);
    if (!layer || layer.kind !== LayerKind.TEXT) {
      logError("applyRandomColorRangeToText", "Layer not found or not a text layer: " + layerName);
      return false;
    }
    
    var text = layer.textItem.contents;
    var charCount = text.length;
    
    // Convert hex colors to SolidColor objects
    var colors = createGradient(colorArray);
    if (colors.length === 0) {
      logError("applyRandomColorRangeToText", "No valid colors in array");
      return false;
    }
    
    // Apply colors randomly to characters
    for (var i = 0; i < charCount; i++) {
        // Random index
        var colorIndex = Math.floor(Math.random() * colors.length);
        layer.textItem.characters[i].color = colors[colorIndex];
    }
    
    logInfo("Applied random color range to " + charCount + " characters");
    return true;
    
  } catch (e) {
    logError("applyRandomColorRangeToText", e);
    return false;
  }
}

/**
 * RGB to Hex converter (utility)
 */
function rgbToHex(r, g, b) {
  return "#" + 
    ("0" + parseInt(r).toString(16)).slice(-2) +
    ("0" + parseInt(g).toString(16)).slice(-2) +
    ("0" + parseInt(b).toString(16)).slice(-2);
}
