// ============================================
// One-Layer Size Handler
// ============================================

/**
 * Process size for 1-layer template
 */
function processSize_1L(doc, personalization) {
  return processSizeLogic(doc, personalization, ["layer_print_1_name", "layer_cut_1_name"]);
}
