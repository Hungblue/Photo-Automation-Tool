// ============================================
// Two-Layers Font Handler
// ============================================

/**
 * Process font for 2-layers template
 * Applies font to both layers
 */
function processFont_2L(doc, personalization) {
  var results = {
    processed: [],
    errors: []
  };
  
  // Find all font-related keys
  for (var key in personalization) {
    if (personalization.hasOwnProperty(key) && key.indexOf("name_font") === 0) {
      var layerNames = getLayerNamesFromKey_2L(personalization, key);
      var fontName = personalization[key];
      
      logDebug("2L Font: Setting '" + fontName + "' to layers: " + layerNames.join(", "));
      
      // Apply to both layers
      var hasError = false;
      for (var i = 0; i < layerNames.length; i++) {
        var success = setTextFont(doc, layerNames[i], fontName);
        
        if (!success) {
          results.errors.push({
            key: key,
            error: "Font not applied: " + layerNames[i]
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
