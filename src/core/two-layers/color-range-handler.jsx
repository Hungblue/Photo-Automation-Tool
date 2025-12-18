// ============================================
// Two-Layers Color Range Handler
// ============================================

/**
 * Process color range for 2-layers template
 * Applies random colors from range to each character
 */
function processColorRange_2L(doc, personalization) {
  var results = {
    processed: [],
    errors: []
  };
  
  // Handle color_range
  if (personalization.name_color_range) {
    // Target field is "name"
    var layerNames = getLayerNamesFromKey_2L(personalization, "name");
    
    var colorArray = personalization.name_color_range.split(",");
    
    // Trim whitespace
    for (var j = 0; j < colorArray.length; j++) {
      colorArray[j] = colorArray[j].replace(/^\s+|\s+$/g, "");
    }
    
    logDebug("2L Color Range: Applying random gradient to layers: " + layerNames.join(", "));
    
    var hasError = false;
    for (var k = 0; k < layerNames.length; k++) {
      // Use new Random utility
      var success = applyRandomColorRangeToText(doc, layerNames[k], colorArray);
      
      if (!success) {
        results.errors.push({
          key: "name_color_range",
          error: "Color range not applied to: " + layerNames[k]
        });
        hasError = true;
      }
    }
    
    if (!hasError) {
      results.processed.push("name_color_range");
    }
  }
  
  return results;
}
