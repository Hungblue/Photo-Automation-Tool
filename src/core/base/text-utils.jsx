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

/**
 * Process text keys using standard or custom layer naming
 * @param {Document} doc - Photoshop document
 * @param {Object} personalization - Personalization object
 * @param {Function} [layerNameGenerator] - Optional function to generate layer names
 */
function processTextLayers(doc, personalization, layerNameGenerator) {
  var results = {
    processed: [],
    errors: []
  };

  // Default generator if not provided
  if (typeof layerNameGenerator !== "function") {
      layerNameGenerator = getStandardTextLayerNames;
  }

  // Find all text-related keys
  for (var key in personalization) {
    if (personalization.hasOwnProperty(key) && key.indexOf("name_text") === 0) {
      var layerNames = layerNameGenerator(personalization, key);
      var text = personalization[key];
      
      if (typeof logDebug === "function") logDebug("Text Processing: Setting '" + text + "' to layers: " + layerNames.join(", "));
      
      var hasError = false;
      for (var i = 0; i < layerNames.length; i++) {
        var success = setTextContent(doc, layerNames[i], text);
        
        if (!success) {
          results.errors.push({
            key: key,
            error: "Layer not found: " + layerNames[i]
          });
          hasError = true;
        }
      }
      
      if (!hasError) {
        results.processed.push(key);
      }
    }
  }
  
  return results;
}

/**
 * Get standard layer names (print/cut, 1/2) for text fields
 */
function getStandardTextLayerNames(personalization, key) {
  // Extract field name from key (e.g., "name_text" -> "name")
  var field = key;
  
  // Remove known suffixes
  field = field.replace("_text", "")
               .replace("_font", "")
               .replace("_color", "")
               .replace("_size", "");
  
  // Remove trailing numbers (e.g., "name_1" -> "name")
  field = field.replace(/_\d+$/, "");
  
  var types = ["print", "cut"];
  var indices = ["1", "2"];
  var layerNames = [];
  
  for (var t = 0; t < types.length; t++) {
    for (var i = 0; i < indices.length; i++) {
        // Construct: layer_print_1_name
        var layerName = "layer_" + types[t] + "_" + indices[i] + "_" + field;
        layerNames.push(layerName);
    }
  }
  
  return layerNames;
}
