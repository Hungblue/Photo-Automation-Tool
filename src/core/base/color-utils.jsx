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
 * Apply stroke (outline) color to layer via layer effects
 * Uses Action Manager to modify layer style stroke color
 * @param {Layer} layer - Target layer
 * @param {SolidColor} color - Color to apply to stroke
 * @returns {Boolean} - Success status
 */
function applyStrokeColorToLayer(layer, color) {
  try {
    if (!layer) {
      logError("applyStrokeColorToLayer", "Layer is null");
      return false;
    }
    
    // Make layer active
    app.activeDocument.activeLayer = layer;
    
    // Get layer descriptor to check if it has stroke effect
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var layerDesc = executeActionGet(ref);
    
    // Check if layer has effects
    if (!layerDesc.hasKey(stringIDToTypeID("layerEffects"))) {
      logWarning("applyStrokeColorToLayer", "Layer has no effects, cannot apply stroke color");
      return false;
    }
    
    var effects = layerDesc.getObjectValue(stringIDToTypeID("layerEffects"));
    
    // Check if layer has stroke effect (frameFX)
    if (!effects.hasKey(stringIDToTypeID("frameFX"))) {
      logWarning("applyStrokeColorToLayer", "Layer has no stroke effect");
      return false;
    }
    
    // Build action descriptor to set stroke color
    var desc = new ActionDescriptor();
    var ref2 = new ActionReference();
    ref2.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
    ref2.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    desc.putReference(charIDToTypeID("null"), ref2);
    
    // Create layer effects descriptor
    var effectsDesc = new ActionDescriptor();
    effectsDesc.putUnitDouble(stringIDToTypeID("scale"), charIDToTypeID("#Prc"), 100);
    
    // Create stroke (frameFX) descriptor
    var strokeDesc = new ActionDescriptor();
    strokeDesc.putBoolean(stringIDToTypeID("enabled"), true);
    strokeDesc.putBoolean(stringIDToTypeID("present"), true);
    strokeDesc.putBoolean(stringIDToTypeID("showInDialog"), true);
    
    // Set stroke color
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(charIDToTypeID("Rd  "), color.rgb.red);
    colorDesc.putDouble(charIDToTypeID("Grn "), color.rgb.green);
    colorDesc.putDouble(charIDToTypeID("Bl  "), color.rgb.blue);
    strokeDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
    
    // Copy other stroke properties from existing effect
    var existingStroke = effects.getObjectValue(stringIDToTypeID("frameFX"));
    
    // Copy paint type
    if (existingStroke.hasKey(stringIDToTypeID("paintType"))) {
      strokeDesc.putEnumerated(stringIDToTypeID("paintType"), 
        existingStroke.getEnumerationType(stringIDToTypeID("paintType")),
        existingStroke.getEnumerationValue(stringIDToTypeID("paintType")));
    } else {
      strokeDesc.putEnumerated(stringIDToTypeID("paintType"), stringIDToTypeID("frameFill"), stringIDToTypeID("solidColor"));
    }
    
    // Copy style (inside/outside/center)
    if (existingStroke.hasKey(stringIDToTypeID("style"))) {
      strokeDesc.putEnumerated(stringIDToTypeID("style"),
        existingStroke.getEnumerationType(stringIDToTypeID("style")),
        existingStroke.getEnumerationValue(stringIDToTypeID("style")));
    }
    
    // Copy size
    if (existingStroke.hasKey(stringIDToTypeID("size"))) {
      strokeDesc.putUnitDouble(stringIDToTypeID("size"), charIDToTypeID("#Pxl"), 
        existingStroke.getUnitDoubleValue(stringIDToTypeID("size")));
    }
    
    // Copy opacity
    if (existingStroke.hasKey(stringIDToTypeID("opacity"))) {
      strokeDesc.putUnitDouble(stringIDToTypeID("opacity"), charIDToTypeID("#Prc"),
        existingStroke.getUnitDoubleValue(stringIDToTypeID("opacity")));
    }
    
    // Copy blend mode
    if (existingStroke.hasKey(stringIDToTypeID("mode"))) {
      strokeDesc.putEnumerated(stringIDToTypeID("mode"),
        existingStroke.getEnumerationType(stringIDToTypeID("mode")),
        existingStroke.getEnumerationValue(stringIDToTypeID("mode")));
    }
    
    // Add stroke to effects
    effectsDesc.putObject(stringIDToTypeID("frameFX"), stringIDToTypeID("frameFX"), strokeDesc);
    
    // Execute the action
    desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), effectsDesc);
    executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    
    logInfo("Applied stroke color to layer: " + layer.name);
    return true;
    
  } catch (e) {
    logError("applyStrokeColorToLayer", e);
    return false;
  }
}

/**
 * Check if a font name indicates Bartex font
 * @param {String} fontName - Font name to check
 * @returns {Boolean} - True if font is Bartex
 */
function isBartexFont(fontName) {
  if (!fontName) return false;
  var lowerName = fontName.toLowerCase();
  return lowerName.indexOf("bartex") !== -1;
}

/**
 * Get the current font name from personalization object
 * Checks name_font key
 * @param {Object} personalization - Personalization object
 * @returns {String|null} - Font name or null
 */
function getCurrentFontFromPersonalization(personalization) {
  if (!personalization) return null;
  
  // Check name_font first (most common)
  if (personalization.name_font) {
    return personalization.name_font;
  }
  
  // Check for indexed font keys (name_font_1, etc.)
  for (var key in personalization) {
    if (personalization.hasOwnProperty(key) && key.indexOf("name_font") === 0) {
      return personalization[key];
    }
  }
  
  return null;
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
 * Apply color range to text (randomly per character)
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
 * Get color palette by name (returns array of Hex strings)
 * @param {String} name - Palette name (e.g. "Rainbow")
 */
function getColorPalette(name) {
    // Config is loaded globally in main.jsx
    var config = $.global.COLOR_RANGES_CONFIG;
    if (!config || !config[name]) return null;
    
    var rgbArray = config[name];
    var hexArray = [];
    
    for (var i = 0; i < rgbArray.length; i++) {
        var rgb = rgbArray[i];
        if (Array.isArray(rgb) && rgb.length >= 3) {
            hexArray.push(rgbToHex(rgb[0], rgb[1], rgb[2]));
        }
    }
    
    return hexArray;
}

/**
 * Get color palette by name (returns array of RGB arrays [[r,g,b], ...])
 * @param {String} name - Palette name (e.g. "Rainbow")
 */
function getRgbPalette(name) {
    var config = $.global.COLOR_RANGES_CONFIG;
    if (!config || !config[name]) return null;
    return config[name]; // Returns [[r,g,b], ...]
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

/**
 * Get Text Layer Scale Factor from Transform Matrix
 * @param {Layer} layer - Text layer
 * @returns {Number} - Scale factor (default 1.0)
 */
function getLayerScaleFactor(layer) {
    try {
        app.activeDocument.activeLayer = layer;
        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        var desc = executeActionGet(ref);
        var textKey = desc.getObjectValue(stringIDToTypeID("textKey"));
        
        if (textKey.hasKey(stringIDToTypeID("transform"))) {
            var t = textKey.getObjectValue(stringIDToTypeID("transform"));
            if (t.hasKey(stringIDToTypeID("yy"))) {
                return t.getDouble(stringIDToTypeID("yy"));
            }
        }
        return 1.0;
    } catch(e) { return 1.0; }
}

// ============================================================================
// ACTION MANAGER GRADIENT FUNCTIONS
// ============================================================================

/**
 * Apply sequential gradient colors to text layer (letter by letter)
 * Uses Action Manager for reliable per-character coloring
 * @param {Document} doc - Photoshop document
 * @param {String} layerName - Layer name
 * @param {Array} palette - Array of RGB arrays [[r,g,b], ...]
 * @param {Number} colorOffset - Offset for gradient (default 0)
 */
function applySequentialGradientToLayer(doc, layerName, palette, colorOffset) {
    try {
        var layer = findLayerByName(doc, layerName);
        if (!layer || layer.kind !== LayerKind.TEXT) {
            logError("applySequentialGradientToLayer", "Layer not found or not text: " + layerName);
            return false;
        }
        
        // Make the layer active
        doc.activeLayer = layer;
        
        var textContent = layer.textItem.contents;
        if (!textContent || textContent.length === 0) {
            logWarning("applySequentialGradientToLayer", "Empty text content in layer: " + layerName);
            return false;
        }
        
        // --- CALCULATE CORRECT SIZE WITH MATRIX COMPENSATION ---
        var baseSizeVal = layer.textItem.size.value;
        var transformScale = getLayerScaleFactor(layer);
        var targetSizeVal = baseSizeVal * transformScale;
        
        // logInfo("DEBUG: Base: " + baseSizeVal + ", Scale: " + transformScale + ", Target: " + targetSizeVal);

        return applyGradientWithCalculatedSize(layer, textContent, palette, targetSizeVal, colorOffset || 0);
        
    } catch (e) {
        logError("applySequentialGradientToLayer", e);
        return false;
    }
}

/**
 * Core gradient application using Action Manager
 * Preserves text formatting using logic from NP53tool.jsx
 */
function applyGradientWithCalculatedSize(layer, textContent, palette, targetSizeVal, colorOffset) {
    try {
        if (colorOffset === undefined || colorOffset === null) {
            colorOffset = 0;
        }
        
        // 1. Get current layer descriptor
        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        var layerDesc = executeActionGet(ref);
        var textKey = layerDesc.getObjectValue(stringIDToTypeID("textKey"));

        // 2. Backup Transform Matrix
        var savedTransform = null;
        if (textKey.hasKey(stringIDToTypeID("transform"))) {
            savedTransform = textKey.getObjectValue(stringIDToTypeID("transform"));
        }

        // 3. Get Template Style (from first character)
        var currentStyleList = textKey.getList(stringIDToTypeID("textStyleRange"));
        var templateRange = currentStyleList.getObjectValue(0);
        var templateStyle = templateRange.getObjectValue(stringIDToTypeID("textStyle"));

        // 4. Build new style list with colors
        var newStyleList = new ActionList();

        for (var i = 0; i < textContent.length; i++) {
            var paletteIndex = (colorOffset + i) % palette.length;
            var rgb = palette[paletteIndex];
            var charStyle = new ActionDescriptor();
            
            // --- Copy Attributes Safely (Reference Logic) ---
            safeCopyString(templateStyle, charStyle, "fontPostScriptName");
            safeCopyString(templateStyle, charStyle, "fontName");
            
            // Inject Size
            charStyle.putUnitDouble(stringIDToTypeID("size"), charIDToTypeID("#Pnt"), targetSizeVal);
            
            safeCopyInteger(templateStyle, charStyle, "tracking");
            safeCopyBoolean(templateStyle, charStyle, "autoKern");
            safeCopyBoolean(templateStyle, charStyle, "syntheticBold");
            safeCopyEnumerated(templateStyle, charStyle, "fontCaps");
            safeCopyEnumerated(templateStyle, charStyle, "baseline");

            // --- Set Color ---
            var colorDesc = new ActionDescriptor();
            colorDesc.putDouble(stringIDToTypeID("red"), rgb[0]);
            colorDesc.putDouble(stringIDToTypeID("green"), rgb[1]);
            colorDesc.putDouble(stringIDToTypeID("blue"), rgb[2]);
            charStyle.putObject(stringIDToTypeID("color"), stringIDToTypeID("RGBColor"), colorDesc);

            // --- Define Range ---
            var rangeDesc = new ActionDescriptor();
            rangeDesc.putInteger(stringIDToTypeID("from"), i);
            rangeDesc.putInteger(stringIDToTypeID("to"), i + 1);
            rangeDesc.putObject(stringIDToTypeID("textStyle"), stringIDToTypeID("textStyle"), charStyle);

            newStyleList.putObject(stringIDToTypeID("textStyleRange"), rangeDesc);
        }

        // 5. Update textKey with new styles
        textKey.putList(stringIDToTypeID("textStyleRange"), newStyleList);

        // 6. Restore transform matrix
        if (savedTransform) {
            textKey.putObject(stringIDToTypeID("transform"), stringIDToTypeID("transform"), savedTransform);
        }

        // 7. Execute the action
        var finalDesc = new ActionDescriptor();
        var targetRef = new ActionReference();
        targetRef.putEnumerated(stringIDToTypeID("textLayer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
        finalDesc.putReference(stringIDToTypeID("null"), targetRef);
        finalDesc.putObject(stringIDToTypeID("to"), stringIDToTypeID("textLayer"), textKey);

        executeAction(charIDToTypeID("setd"), finalDesc, DialogModes.NO);
        
        logInfo("Applied sequential gradient to " + textContent.length + " characters");
        return true;
    } catch (e) {
        logError("applyGradientWithCalculatedSize", e);
        return false;
    }
}

// ============================================================================
// ACTION MANAGER HELPERS
// ============================================================================
function safeCopyString(src, dest, keyName) {
    var id = stringIDToTypeID(keyName);
    if (src.hasKey(id)) dest.putString(id, src.getString(id));
}

function safeCopyInteger(src, dest, keyName) {
    var id = stringIDToTypeID(keyName);
    if (src.hasKey(id)) dest.putInteger(id, src.getInteger(id));
}

function safeCopyBoolean(src, dest, keyName) {
    var id = stringIDToTypeID(keyName);
    if (src.hasKey(id)) {
        if (keyName === "autoKern" && src.getType(id) === DescValueType.ENUMERATEDTYPE) {
             dest.putEnumerated(id, src.getEnumerationType(id), src.getEnumerationValue(id));
        } else {
             dest.putBoolean(id, src.getBoolean(id));
        }
    } else if (keyName === "autoKern") {
        dest.putBoolean(id, true);
    }
}



function safeCopyEnumerated(src, dest, keyName) {
    var id = stringIDToTypeID(keyName);
    if (src.hasKey(id)) dest.putEnumerated(id, src.getEnumerationType(id), src.getEnumerationValue(id));
}


/**
 * Smartly apply color range (named palette or hex list) to layer
 * Favors sequential gradient application using Action Manager
 * @param {Document} doc - Photoshop document
 * @param {String} layerName - Layer name
 * @param {String} rawValue - Raw personalization value (palette name or comma-separated hex)
 */
function applySmartColorRange(doc, layerName, rawValue) {
    var palette = getRgbPalette(rawValue);
    var source = "named palette";
    
    if (!palette) {
        source = "hex fallback";
        // Fallback: comma-separated hex values
        var hexArray = rawValue.split(",");
        palette = [];
        
        for (var j = 0; j < hexArray.length; j++) {
            var hex = hexArray[j].replace(/^\s+|\s+$/g, "").replace("#", "");
            if (hex) {
                 var r = parseInt(hex.substring(0, 2), 16) || 0;
                 var g = parseInt(hex.substring(2, 4), 16) || 0;
                 var b = parseInt(hex.substring(4, 6), 16) || 0;
                 palette.push([r, g, b]);
            }
        }
    }
    
    if (palette && palette.length > 0) {
        logDebug("Applying " + source + " '" + rawValue + "' to " + layerName);
        return applySequentialGradientToLayer(doc, layerName, palette, 0);
    }
    
    return false;
}

/**
 * Process color range logic for provided layer names
 * Boilerplate wrapper for applying color range
 * @param {Document} doc - Photoshop document
 * @param {Object} personalization - Personalization object
 * @param {Array} layerNames - List of layer names to target
 */
function processColorRangeLogic(doc, personalization, layerNames) {
  var results = {
    processed: [],
    errors: []
  };
  
  if (personalization.name_color_range) {
    var successCount = 0;
    
    // Ensure array
    if (typeof layerNames === "string") layerNames = [layerNames];
    
    for (var i = 0; i < layerNames.length; i++) {
        var layerName = layerNames[i];
        if (applySmartColorRange(doc, layerName, personalization.name_color_range)) {
            successCount++;
        } else {
            results.errors.push({
                key: "name_color_range",
                error: "Color range not applied to: " + layerName
            });
        }
    }
    
    if (successCount > 0) {
        results.processed.push("name_color_range");
    }
  }
  
  return results;
}

/**
 * Process hex color logic for provided layer names
 * Special handling for Bartex font: only change stroke color, not text color
 * @param {Document} doc - Photoshop document
 * @param {Object} personalization - Personalization object
 * @param {Function|Array|String} layerTarget - Resolver for layer names (Function, Array, or String)
 */
function processColorHexLogic(doc, personalization, layerTarget) {
  var results = {
    processed: [],
    errors: []
  };
  
  // Check if current font is Bartex - special handling required
  var currentFont = getCurrentFontFromPersonalization(personalization);
  var isBartex = isBartexFont(currentFont);
  
  if (isBartex && typeof logInfo === "function") {
    logInfo("Bartex font detected: '" + currentFont + "' - applying stroke color only (not text color)");
  }
  
  for (var key in personalization) {
    // Check for name_color prefix but exclude name_color_range
    if (personalization.hasOwnProperty(key) && 
        key.indexOf("name_color") === 0 && 
        key.indexOf("name_color_range") === -1) {
      
      var layerNames = [];
      
      // Resolve target layers
      if (typeof layerTarget === 'function') {
         var res = layerTarget(personalization, key);
         if (res) {
             layerNames = Array.isArray(res) ? res : [res];
         }
      } else if (Array.isArray(layerTarget)) {
         layerNames = layerTarget;
      } else if (typeof layerTarget === 'string') {
         layerNames = [layerTarget];
      }
      
      var colorValue = personalization[key];
      var colorObj = hexToRGB(colorValue);
      var hasError = false;
      
      if (typeof logDebug === "function") {
          if (isBartex) {
              logDebug("Bartex Mode - Stroke Color: Setting '" + colorValue + "' to layers: " + layerNames.join(", "));
          } else {
              logDebug("Hex Color: Setting '" + colorValue + "' to layers: " + layerNames.join(", "));
          }
      }
      
      for (var i = 0; i < layerNames.length; i++) {
         var layerName = layerNames[i];
         var layer = findLayerByName(doc, layerName);
         
         if (!layer) {
             results.errors.push({key: key, error: "Layer not found: " + layerName});
             hasError = true;
             continue;
         }
         
         var success = false;
         
         // Bartex font: only apply stroke color, skip text color
         if (isBartex) {
             success = applyStrokeColorToLayer(layer, colorObj);
             if (!success) {
                 // Log warning but don't treat as error - layer might not have stroke effect
                 if (typeof logWarning === "function") {
                     logWarning("Bartex mode: Could not apply stroke color to '" + layerName + "' (layer may not have stroke effect)");
                 }
                 // Still mark as success since this is expected behavior
                 success = true;
             }
         } else {
             // Normal mode: apply text color
             success = applyColorToLayer(layer, colorObj);
             if (!success) {
                 results.errors.push({key: key, error: "Color not applied to: " + layerName});
                 hasError = true;
             }
         }
      }
      
      if (!hasError && layerNames.length > 0) {
          results.processed.push(key);
      }
    }
  }
  
  return results;
}

/**
 * Special handling for NP53 "Letter Max 16+8 elements" (Multi-line Gradient)
 * Splits name into 2 lines, applies sequential gradient to layer_print_1_name_1 and layer_print_1_name_2,
 * and sets formatted text (with \r) to layer_cut_2_name.
 * 
 * @param {Document} doc - Photoshop document
 * @param {String} text - Full name text
 * @param {String} paletteName - Color palette name
 */
function processNP53MultiLineGradient(doc, text, paletteName) {
    if (!text || !paletteName) return false;

    var colorPalette = getRgbPalette(paletteName);
    if (!colorPalette) {
        logWarning("processNP53MultiLineGradient", "Palette not found: " + paletteName);
        return false;
    }

    // Split text into two parts at the first whitespace to maintain consistency with formatting logic
    var parts = text.split(/\s+/);
    var line1 = parts[0] || "";
    var line2 = parts.slice(1).join(" ");
    
    if (typeof logDebug === "function") {
        logDebug("NP53 Multi-line: Line 1: '" + line1 + "', Line 2: '" + line2 + "'");
    }

    // --- Process layer_print_1_name_1 (Line 1) ---
    var name1Layer = findLayerByName(doc, "layer_print_1_name_1");
    if (name1Layer && name1Layer.kind === LayerKind.TEXT) {
        var baseSizeVal = name1Layer.textItem.size.value;
        var transformScale = getLayerScaleFactor(name1Layer);
        var calculatedTargetSize = baseSizeVal * transformScale;
        
        name1Layer.textItem.contents = line1;
        doc.activeLayer = name1Layer;
        
        // Offset 0 for first line
        applyGradientWithCalculatedSize(name1Layer, line1, colorPalette, calculatedTargetSize, 0);
    } else {
        if (typeof logWarning === "function") logWarning("Layer 'layer_print_1_name_1' not found for multi-line processing.");
    }

    // --- Process layer_print_1_name_2 (Line 2) ---
    var name2Layer = findLayerByName(doc, "layer_print_1_name_2");
    if (name2Layer && name2Layer.kind === LayerKind.TEXT) {
        var baseSizeVal2 = name2Layer.textItem.size.value;
        var transformScale2 = getLayerScaleFactor(name2Layer);
        var calculatedTargetSize2 = baseSizeVal2 * transformScale2;
        
        name2Layer.textItem.contents = line2;
        doc.activeLayer = name2Layer;
        
        // Offset starts after line 1
        var colorOffset = line1.length;
        applyGradientWithCalculatedSize(name2Layer, line2, colorPalette, calculatedTargetSize2, colorOffset);
    } else {
        // Line 2 might not always exist or be required, but warn if missing
        if (typeof logWarning === "function") logWarning("Layer 'layer_print_1_name_2' not found for multi-line processing.");
    }

    // --- Process layer_cut_2_name (Formatted Text) ---
    var cutLayer = findLayerByName(doc, "layer_cut_2_name");
    if (cutLayer && cutLayer.kind === LayerKind.TEXT) {
        // Replace first space with return for standard text layer formatting
        // "Harrison Golden" -> "Harrison\rGolden"
        var formattedText = text.replace(/\s+/, '\r');
        cutLayer.textItem.contents = formattedText;
    }
    
    return true;
}
