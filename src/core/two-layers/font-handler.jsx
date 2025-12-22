// ============================================
// Two-Layers Font Handler
// ============================================

/**
 * Process font for 2-layers template
 */
function processFont_2L(doc, personalization) {
  return processFontLogic(doc, personalization, ["layer_print_1_name", "layer_print_2_name", "layer_cut_1_name", "layer_cut_2_name"]);
}
