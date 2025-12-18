// ============================================
// Two-Layers Text Handler
// ============================================

/**
 * Process text for 2-layers template
 * Handles both layers simultaneously
 */
function processText_2L(doc, personalization) {
  var results = {
    processed: [],
    errors: []
  };
  
  // Find all text-related keys
  for (var key in personalization) {
    if (personalization.hasOwnProperty(key) && key.indexOf("name_text") === 0) {
      var layerNames = getLayerNamesFromKey_2L(personalization, key);
      var text = personalization[key];
      
      logDebug("2L Text: Setting '" + text + "' to layers: " + layerNames.join(", "));
      
      // Apply to both layers
      var hasError = false;
      for (var i = 0; i < layerNames.length; i++) {
        var success = setTextContent(doc, layerNames[i], text);
        
        if (!success) {
          results.errors.push({
            key: key,
            error: "Layer not found: " + layerNames[i]
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

/**
 * Get all layer names for 2-layers template (4 frames)
 * Pattern: layer_{type}_{index}_{field}
 * types: print, cut
 * indices: 1, 2
 */
function getLayerNamesFromKey_2L(personalization, key) {
  // Extract field name from key (e.g., "name_text" -> "name")
  var field = key;
  
  // Remove known suffixes
  field = field.replace("_text", "")
               .replace("_font", "")
               .replace("_color", "")
               .replace("_size", "");
  
  // Remove trailing numbers (e.g., "name_1" -> "name")
  field = field.replace(/_\d+$/, "");
  
  var types = ["print", "cut"];
  var indices = ["1", "2"];
  var layerNames = [];
  
  for (var t = 0; t < types.length; t++) {
    for (var i = 0; i < indices.length; i++) {
        // Construct: layer_print_1_name
        var layerName = "layer_" + types[t] + "_" + indices[i] + "_" + field;
        layerNames.push(layerName);
    }
  }
  
  return layerNames;
}

