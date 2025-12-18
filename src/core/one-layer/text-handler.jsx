// ============================================
// One-Layer Text Handler
// ============================================

/**
 * Process text for 1-layer template
 * Handles: name_text, name_text_1, name_text_2, etc.
 */
function processText_1L(doc, personalization) {
  var results = {
    processed: [],
    errors: []
  };
  
  // Find all text-related keys
  for (var key in personalization) {
    if (personalization.hasOwnProperty(key) && key.indexOf("name_text") === 0) {
      var layerName = getLayerNameFromKey_1L(personalization, key);
      var text = personalization[key];
      
      logDebug("1L Text: Setting '" + text + "' to layer '" + layerName + "'");
      
      // Call base utility
      var success = setTextContent(doc, layerName, text);
      
      if (success) {
        results.processed.push(key);
      } else {
        results.errors.push({key: key, error: "Layer not found: " + layerName});
      }
    }
  }
  
  return results;
}

/**
 * Get layer name for 1-layer template
 * Examples:
 * - name_text → "TextLayer"
 * - name_text_1 → "TextLayer 1"
 * - name_text_2 → "TextLayer 2"
 */
function getLayerNameFromKey_1L(personalization, key) {
  var baseLayer = personalization.layer_name || personalization.layer || "TextLayer";
  
  // Remove "1" or "2" prefix if present (layer type indicator)
  baseLayer = baseLayer.replace(/^[12]\s*/, "");
  
  // Extract index from key (name_text_1 -> "1")
  var match = key.match(/_(\d+)$/);
  if (match) {
    var index = match[1];
    
    // Try different naming patterns
    var patterns = [
      baseLayer + " " + index,
      baseLayer + "_" + index,
      baseLayer + index
    ];
    
    for (var i = 0; i < patterns.length; i++) {
      if (checkLayerExists(doc, patterns[i])) {
        return patterns[i];
      }
    }
    
    // Default to first pattern
    return patterns[0];
  }
  
  return baseLayer;
}
