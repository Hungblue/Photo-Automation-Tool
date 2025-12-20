// ============================================
// One-Layer Color Range Handler
// ============================================

/**
 * Process color range for 1-layer template
 */
function processColorRange_1L(doc, personalization) {
  // Call shared logic
  return processColorRangeLogic(doc, personalization, ["layer_print_1_name"]);
}
