// ============================================
// Two-Layers Hex Color Handler
// ============================================

/**
 * Process hex color for 2-layers template
 * Only applies to layer_print_1_name
 * Note: For Bartex font, only stroke color is changed (not text color)
 */
function processHexColor_2L(doc, personalization) {
  // Always target layer_print_1_name, layer_print_2_name
  return processColorHexLogic(doc, personalization, ["layer_print_1_name", "layer_print_2_name"]);
}
