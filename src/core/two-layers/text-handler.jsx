// ============================================
// Two-Layers Text Handler
// ============================================

/**
 * Process text for 2-layers template
 */
function processText_2L(doc, personalization) {
  // Use shared logic with standard layer naming
  return processTextLayers(doc, personalization, getStandardTextLayerNames);
}

