// ============================================
// Two-Layers Size Handler
// ============================================

/**
 * Process size for 2-layers template
 * Applies size to both layers
 */
function processSize_2L(doc, personalization) {
  var results = {
    processed: [],
    errors: []
  };
  
  // Find all size-related keys
  for (var key in personalization) {
    if (personalization.hasOwnProperty(key) && key.indexOf("name_size") === 0) {
      var layerNames = getLayerNamesFromKey_2L(personalization, key);
      var sizeValue = parseInt(personalization[key]);
      
      if (isNaN(sizeValue)) {
        results.errors.push({key: key, error: "Invalid size value: " + personalization[key]});
        continue;
      }
      
      logDebug("2L Size: Setting " + sizeValue + "pt to layers: " + layerNames.join(", "));
      
      // Apply to both layers
      var hasError = false;
      for (var i = 0; i < layerNames.length; i++) {
        var success = setTextSize(doc, layerNames[i], sizeValue);
        
        if (!success) {
          results.errors.push({
            key: key,
            error: "Size not applied: " + layerNames[i]
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
