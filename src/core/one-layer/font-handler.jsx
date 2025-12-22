// ============================================
// One-Layer Font Handler
// ============================================

/**
 * Process font for 1-layer template
 */
function processFont_1L(doc, personalization) {
  return processFontLogic(doc, personalization, ["layer_print_1_name", "layer_cut_1_name"]);
}
