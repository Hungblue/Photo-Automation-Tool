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
 * @param {String} fontName - Font name (display name or PostScript name)
 */
function setTextFont(doc, layerName, fontName) {
  try {
    var layer = findLayerByName(doc, layerName);
    
    if (!layer || layer.kind !== LayerKind.TEXT) {
      logWarning("Text layer not found: " + layerName);
      return false;
    }
    
    // Try to resolve the font - could be display name or PostScript name
    var resolvedFont = resolveFontName(fontName);
    
    if (!resolvedFont) {
      logWarning("Font not found in system: '" + fontName + "' - layer '" + layerName + "' will keep default font");
      return false;
    }
    
    // Log the resolved font
    if (resolvedFont !== fontName) {
      logInfo("Font resolved: '" + fontName + "' -> PostScript: '" + resolvedFont + "'");
    }
    
    // Apply the font
    layer.textItem.font = resolvedFont;
    
    // Verify the font was applied
    var appliedFont = layer.textItem.font;
    if (appliedFont !== resolvedFont) {
      logWarning("Font verification failed: expected '" + resolvedFont + "' but got '" + appliedFont + "'");
      return false;
    }
    
    logDebug("Set font for layer '" + layerName + "': " + resolvedFont);
    return true;
    
  } catch (e) {
    logError("setTextFont", e);
    return false;
  }
}

/**
 * Resolve font name to PostScript name
 * @param {String} fontName - Display name or PostScript name
 * @returns {String|null} - PostScript name or null if not found
 */
function resolveFontName(fontName) {
  try {
    var fonts = app.fonts;
    
    // First pass: exact match on PostScript name
    for (var i = 0; i < fonts.length; i++) {
      if (fonts[i].postScriptName === fontName) {
        return fonts[i].postScriptName;
      }
    }
    
    // Second pass: match on display name (family + style or just family)
    for (var j = 0; j < fonts.length; j++) {
      if (fonts[j].name === fontName || fonts[j].family === fontName) {
        return fonts[j].postScriptName;
      }
    }
    
    // Third pass: case-insensitive partial match
    var lowerFontName = fontName.toLowerCase().replace(/[\s\-_]/g, "");
    for (var k = 0; k < fonts.length; k++) {
      var lowerPostScript = fonts[k].postScriptName.toLowerCase().replace(/[\s\-_]/g, "");
      var lowerName = fonts[k].name.toLowerCase().replace(/[\s\-_]/g, "");
      var lowerFamily = fonts[k].family.toLowerCase().replace(/[\s\-_]/g, "");
      
      if (lowerPostScript === lowerFontName || 
          lowerName === lowerFontName || 
          lowerFamily === lowerFontName) {
        logDebug("Font matched (fuzzy): '" + fontName + "' -> '" + fonts[k].postScriptName + "'");
        return fonts[k].postScriptName;
      }
    }
    
    return null;
  } catch (e) {
    logError("resolveFontName", e);
    return null;
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

// ============================================
// Shared Logic Functions (for handlers)
// ============================================

/**
 * Process font logic for provided layer target
 * @param {Document} doc - Photoshop document
 * @param {Object} personalization - Personalization object
 * @param {Function|Array|String} layerTarget - Layer name(s) or resolver function
 */
function processFontLogic(doc, personalization, layerTarget) {
  var results = {
    processed: [],
    errors: []
  };
  
  for (var key in personalization) {
    if (!personalization.hasOwnProperty(key)) continue;
    if (key.indexOf("name_font") !== 0) continue;
    
    var fontName = personalization[key];
    var layerNames = resolveLayerTarget(layerTarget, personalization, key);
    
    // Log when font is found
    if (typeof logInfo === "function") {
      logInfo("Font found: '" + fontName + "' (key: " + key + ")");
    }
    
    if (typeof logDebug === "function") {
      logDebug("Font: Setting '" + fontName + "' to layers: " + layerNames.join(", "));
    }
    
    var hasError = false;
    for (var i = 0; i < layerNames.length; i++) {
      var success = setTextFont(doc, layerNames[i], fontName);
      if (!success) {
        results.errors.push({key: key, error: "Font not applied: " + layerNames[i]});
        hasError = true;
      } else {
        if (typeof logInfo === "function") {
          logInfo("Font applied successfully: '" + fontName + "' to layer '" + layerNames[i] + "'");
        }
      }
    }
    
    if (!hasError && layerNames.length > 0) {
      results.processed.push(key);
    }
  }
  
  return results;
}

/**
 * Process size logic for provided layer target
 * @param {Document} doc - Photoshop document
 * @param {Object} personalization - Personalization object
 * @param {Function|Array|String} layerTarget - Layer name(s) or resolver function
 */
function processSizeLogic(doc, personalization, layerTarget) {
  var results = {
    processed: [],
    errors: []
  };
  
  for (var key in personalization) {
    if (!personalization.hasOwnProperty(key)) continue;
    if (key.indexOf("name_size") !== 0) continue;
    
    var sizeValue = parseInt(personalization[key]);
    if (isNaN(sizeValue)) {
      results.errors.push({key: key, error: "Invalid size value: " + personalization[key]});
      continue;
    }
    
    var layerNames = resolveLayerTarget(layerTarget, personalization, key);
    
    if (typeof logDebug === "function") {
      logDebug("Size: Setting " + sizeValue + "pt to layers: " + layerNames.join(", "));
    }
    
    var hasError = false;
    for (var i = 0; i < layerNames.length; i++) {
      var success = setTextSize(doc, layerNames[i], sizeValue);
      if (!success) {
        results.errors.push({key: key, error: "Size not applied: " + layerNames[i]});
        hasError = true;
      }
    }
    
    if (!hasError && layerNames.length > 0) {
      results.processed.push(key);
    }
  }
  
  return results;
}

/**
 * Process text logic for provided layer target
 * @param {Document} doc - Photoshop document
 * @param {Object} personalization - Personalization object
 * @param {Function|Array|String} layerTarget - Layer name(s) or resolver function
 */
function processTextLogic(doc, personalization, layerTarget) {
  var results = {
    processed: [],
    errors: []
  };
  
  for (var key in personalization) {
    if (!personalization.hasOwnProperty(key)) continue;
    if (key.indexOf("name_text") !== 0) continue;
    
    var text = personalization[key];
    var layerNames = resolveLayerTarget(layerTarget, personalization, key);
    
    if (typeof logDebug === "function") {
      logDebug("Text: Setting '" + text + "' to layers: " + layerNames.join(", "));
    }
    
    var hasError = false;
    for (var i = 0; i < layerNames.length; i++) {
      var success = setTextContent(doc, layerNames[i], text);
      if (!success) {
        results.errors.push({key: key, error: "Text not applied: " + layerNames[i]});
        hasError = true;
      }
    }
    
    if (!hasError && layerNames.length > 0) {
      results.processed.push(key);
    }
  }
  
  return results;
}

/**
 * Resolve layer target to array of layer names
 * @param {Function|Array|String} layerTarget - Layer target
 * @param {Object} personalization - Personalization object
 * @param {String} key - Current key being processed
 * @returns {Array} - Array of layer names
 */
function resolveLayerTarget(layerTarget, personalization, key) {
  if (typeof layerTarget === "function") {
    var result = layerTarget(personalization, key);
    if (typeof result === "string") return [result];
    return result || [];
  }
  if (typeof layerTarget === "string") {
    return [layerTarget];
  }
  if (Array.isArray(layerTarget)) {
    return layerTarget;
  }
  return [];
}
