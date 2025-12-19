// ============================================
// One-Layer Color Range Handler
// ============================================

/**
 * Process color range for 1-layer template
 * Applies random colors from range to each character
 */
function processColorRange_1L(doc, personalization) {
  var results = {
    processed: [],
    errors: []
  };
  
  // Handle color_range
  if (personalization.name_color_range) {
    var layerName = personalization.layer_name || personalization.layer || "TextLayer";
    layerName = layerName.replace(/^[12]\s*/, ""); // Remove layer type prefix
    
    var rawValue = personalization.name_color_range;
    var colorArray = getColorPalette(rawValue);
    
    if (colorArray) {
        logDebug("1L Color Range: Using named palette '" + rawValue + "'");
    } else {
        colorArray = rawValue.split(",");
        // Trim whitespace
        for (var i = 0; i < colorArray.length; i++) {
          colorArray[i] = colorArray[i].replace(/^\s+|\s+$/g, "");
        }
    }
    
    logDebug("1L Color Range: Applying random gradient to '" + layerName + "'");
    
    // Use Random utility
    var success = applyColorRangeToText(doc, layerName, colorArray);
    
    if (success) {
      results.processed.push("name_color_range");
    } else {
      results.errors.push({key: "name_color_range", error: "Color range not applied"});
    }
  }
  
  return results;
}
