// ============================================
// One-Layer Hex Color Handler
// ============================================

/**
 * Process hex color for 1-layer template
 * Note: For Bartex font, only stroke color is changed (not text color)
 */
function processHexColor_1L(doc, personalization) {
  // Use getLayerNameFromKey_1L to resolve layer name for each key
  return processColorHexLogic(doc, personalization, ["layer_print_1_name"]);
}
