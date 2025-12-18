// ============================================
// Two-Layers Hex Color Handler
// ============================================

/**
 * Process hex color for 2-layers template
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
      
      var layerNames = getLayerNamesFromKey_2L(personalization, key);
      var colorValue = personalization[key];
      
      logDebug("2L Hex Color: Setting '" + colorValue + "' to layers: " + layerNames.join(", "));
      
      // Apply to both layers
      var hasError = false;
      for (var i = 0; i < layerNames.length; i++) {
        var success = setTextColor(doc, layerNames[i], colorValue);
        
        if (!success) {
          results.errors.push({
            key: key,
            error: "Color not applied: " + layerNames[i]
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
