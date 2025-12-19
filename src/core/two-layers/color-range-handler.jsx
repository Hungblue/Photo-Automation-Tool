// ============================================
// Two-Layers Color Range Handler
// ============================================

/**
 * Process color range for 2-layers template
 * Only applies to layer_print_1_name (sequential gradient)
 * layer_cut_2_name is excluded from color changes
 */
function processColorRange_2L(doc, personalization) {
  var results = {
    processed: [],
    errors: []
  };
  
  // Handle color_range - only for layer_print_1_name
  if (personalization.name_color_range) {
    // Target only layer_print_1_name (not print_2, cut_1, cut_2)
    var targetLayer = "layer_print_1_name";
    
    var rawValue = personalization.name_color_range;
    
    // Get RGB palette (not hex)
    var rgbPalette = getRgbPalette(rawValue);
    
    if (rgbPalette) {
        logDebug("2L Color Range: Using named palette '" + rawValue + "' for " + targetLayer);
        
        // Apply sequential gradient using Action Manager
        var success = applySequentialGradientToLayer(doc, targetLayer, rgbPalette, 0);
        
        if (success) {
            results.processed.push("name_color_range");
        } else {
            results.errors.push({
                key: "name_color_range",
                error: "Sequential gradient not applied to: " + targetLayer
            });
        }
    } else {
        // Fallback: comma-separated hex values
        var hexArray = rawValue.split(",");
        for (var j = 0; j < hexArray.length; j++) {
            hexArray[j] = hexArray[j].replace(/^\s+|\s+$/g, "");
        }
        
        // Convert hex to RGB for the gradient function
        var fallbackPalette = [];
        for (var k = 0; k < hexArray.length; k++) {
            var hex = hexArray[k].replace("#", "");
            var r = parseInt(hex.substring(0, 2), 16) || 0;
            var g = parseInt(hex.substring(2, 4), 16) || 0;
            var b = parseInt(hex.substring(4, 6), 16) || 0;
            fallbackPalette.push([r, g, b]);
        }
        
        logDebug("2L Color Range: Using hex fallback for " + targetLayer);
        var success = applySequentialGradientToLayer(doc, targetLayer, fallbackPalette, 0);
        
        if (success) {
            results.processed.push("name_color_range");
        } else {
            results.errors.push({
                key: "name_color_range",
                error: "Color range not applied to: " + targetLayer
            });
        }
    }
  }
  
  return results;
}
