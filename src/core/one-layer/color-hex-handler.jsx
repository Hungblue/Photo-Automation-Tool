// ============================================
// One-Layer Hex Color Handler
// ============================================

/**
 * Process hex color for 1-layer template
 */
function processHexColor_1L(doc, personalization) {
  var results = {
    processed: [],
    errors: []
  };
  
  // Find all color-related keys
  for (var key in personalization) {
    if (personalization.hasOwnProperty(key) && 
        key.indexOf("name_color") === 0 && 
        key.indexOf("name_color_range") === -1) {
      
      var layerName = getLayerNameFromKey_1L(personalization, key);
      var colorValue = personalization[key];
      
      logDebug("1L Hex Color: Setting '" + colorValue + "' to layer '" + layerName + "'");
      
      // Call base utility
      var success = setTextColor(doc, layerName, colorValue);
      
      if (success) {
        results.processed.push(key);
      } else {
        results.errors.push({key: key, error: "Color not applied: " + layerName});
      }
    }
  }
  
  return results;
}
