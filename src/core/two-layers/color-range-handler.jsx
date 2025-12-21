// ============================================
// Two-Layers Color Range Handler
// ============================================

/**
 * Process color range for 2-layers template
 * Only applies to layer_print_1_name (sequential gradient)
 */
function processColorRange_2L(doc, personalization) {
  // Special handling for NP53 "16-letters-8-elements.psd"
  var pType = (personalization.product_type || "").toString().toUpperCase().replace(/^\s+|\s+$/g, "");
  var tName = (personalization.template_name || "").toString().replace(/^\s+|\s+$/g, "");
  
  if (pType === "NP53" && tName === "16-letters-8-elements.psd") {
      var results = { processed: [], errors: [] };
      // Try to find the primary text content. Assuming 'name_text'
      var text = personalization.name_text;
      var palette = personalization.name_color_range;
      
      if (text && palette) {
          if (processNP53MultiLineGradient(doc, text, palette)) {
              results.processed.push("NP53_special_handling");
          } else {
              results.errors.push({ key: "NP53_special", error: "Failed to apply multi-line gradient" });
          }
      } else {
          results.errors.push({ key: "NP53_special", error: "Missing name_text or name_color_range" });
      }
      return results;
  }

  // Target only layer_print_1_name
  return processColorRangeLogic(doc, personalization, ["layer_print_1_name"]);
}
