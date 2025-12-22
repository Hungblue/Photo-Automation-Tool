// ============================================
// Two-Layers Text Handler
// ============================================

/**
 * Process text for 2-layers template
 */
function processText_2L(doc, personalization) {
  return processTextLogic(doc, personalization, ["layer_print_1_name", "layer_print_2_name", "layer_cut_1_name", "layer_cut_2_name"]);
}
