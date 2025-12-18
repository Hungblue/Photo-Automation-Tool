// ============================================
// One-Layer Size Handler
// ============================================

/**
 * Process size for 1-layer template
 * Handles: name_size, name_size_1, name_size_2, etc.
 */
function processSize_1L(doc, personalization) {
  var results = {
    processed: [],
    errors: []
  };
  
  // Find all size-related keys
  for (var key in personalization) {
    if (personalization.hasOwnProperty(key) && key.indexOf("name_size") === 0) {
      var layerName = getLayerNameFromKey_1L(personalization, key);
      var sizeValue = parseInt(personalization[key]);
      
      if (isNaN(sizeValue)) {
        results.errors.push({key: key, error: "Invalid size value: " + personalization[key]});
        continue;
      }
      
      logDebug("1L Size: Setting " + sizeValue + "pt to layer '" + layerName + "'");
      
      // Call base utility
      var success = setTextSize(doc, layerName, sizeValue);
      
      if (success) {
        results.processed.push(key);
      } else {
        results.errors.push({key: key, error: "Size not applied: " + layerName});
      }
    }
  }
  
  return results;
}
