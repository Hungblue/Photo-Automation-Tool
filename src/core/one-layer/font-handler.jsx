// ============================================
// One-Layer Font Handler
// ============================================

/**
 * Process font for 1-layer template
 * Handles: name_font, name_font_1, name_font_2, etc.
 */
function processFont_1L(doc, personalization) {
  var results = {
    processed: [],
    errors: []
  };
  
  // Find all font-related keys
  for (var key in personalization) {
    if (personalization.hasOwnProperty(key) && key.indexOf("name_font") === 0) {
      var layerName = getLayerNameFromKey_1L(personalization, key);
      var fontName = personalization[key];
      
      logDebug("1L Font: Setting '" + fontName + "' to layer '" + layerName + "'");
      
      // Call base utility
      var success = setTextFont(doc, layerName, fontName);
      
      if (success) {
        results.processed.push(key);
      } else {
        results.errors.push({key: key, error: "Font not applied: " + layerName});
      }
    }
  }
  
  return results;
}
