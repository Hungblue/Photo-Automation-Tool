// ============================================
// One-Layer Text Handler
// ============================================

/**
 * Process text for 1-layer template
 */
function processText_1L(doc, personalization) {
  return processTextLogic(doc, personalization, ["layer_print_1_name", "layer_cut_1_name"]);
}
