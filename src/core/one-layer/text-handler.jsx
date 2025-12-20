// ============================================
// One-Layer Text Handler
// ============================================

/**
 * Process text for 1-layer template
 */
function processText_1L(doc, personalization) {
  // Use shared logic with standard layer naming
  return processTextLayers(doc, personalization, getStandardTextLayerNames);
}
