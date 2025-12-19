// ============================================
// Two-Layers Hex Color Handler
// ============================================

/**
 * Process hex color for 2-layers template
 * Only applies to layer_print_1_name
 * layer_cut_2_name is excluded from color changes
 */
function processHexColor_2L(doc, personalization) {
  var results = {
    processed: [],
    errors: []
  };
  
  // Find all color-related keys (but not color_range)
  for (var key in personalization) {
    if (personalization.hasOwnProperty(key) && 
        key.indexOf("name_color") === 0 && 
        key.indexOf("name_color_range") === -1) {
      
      // Target only layer_print_1_name (not print_2, cut_1, cut_2)
      var targetLayer = "layer_print_1_name";
      var colorValue = personalization[key];
      
      logDebug("2L Hex Color: Setting '" + colorValue + "' to layer: " + targetLayer);
      
      var success = setTextColor(doc, targetLayer, colorValue);
      
      if (success) {
        results.processed.push(key);
      } else {
        results.errors.push({
          key: key,
          error: "Color not applied: " + targetLayer
        });
      }
    }
  }
  
  return results;
}
