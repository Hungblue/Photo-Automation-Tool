// ============================================
// Two-Layers Color Range Handler
// ============================================

/**
 * Process color range for 2-layers template
 * Only applies to layer_print_1_name (sequential gradient)
 */
function processColorRange_2L(doc, personalization) {
  // Target only layer_print_1_name
  return processColorRangeLogic(doc, personalization, ["layer_print_1_name"]);
}
