// ============================================
// Two-Layers Size Handler
// ============================================

/**
 * Process size for 2-layers template
 */
function processSize_2L(doc, personalization) {
  return processSizeLogic(doc, personalization, ["layer_print_1_name", "layer_print_2_name", "layer_cut_1_name", "layer_cut_2_name"]);
}
