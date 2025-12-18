// ============================================
// Layer Router - Routes to appropriate layer handler
// ============================================

// Debug log to confirm load
if (typeof logInfo === "function") logInfo("Loading Layer Router...");

/**
 * Route to appropriate layer handler based on personalization
 * @param {Document} doc - Photoshop document
 * @param {Object} personalization - Parsed personalization object
 * @returns {Object} - Processing results
 */
function routeToLayerHandler(doc, personalization) {
  var layerType = personalization.layer || "1";
  
  // Clean layer type (extract number)
  // Handles: "1", "2", "Layer 1", "Layer 2", "Layer1", "Layer2"
  if (typeof layerType === "string") {
    var match = layerType.match(/(\d+)/);
    if (match) {
      layerType = match[1];
    }
  }
  
  if (typeof logInfo === "function") logInfo("Routing to layer type: " + layerType);
  
  // Route to appropriate handler
  if (layerType === "1") {
    return processOneLayer(doc, personalization);
  } else if (layerType === "2") {
    return processTwoLayers(doc, personalization);
  } else {
    if (typeof logWarning === "function") logWarning("Unknown layer type: " + layerType + ", defaulting to 1-layer");
    return processOneLayer(doc, personalization);
  }
}

/**
 * Process 1-layer template
 * Calls all 1-layer handlers sequentially
 */
function processOneLayer(doc, personalization) {
  if (typeof logInfo === "function") logInfo("=== Processing 1-Layer Template ===");
  
  var allResults = {
    processed: [],
    errors: []
  };
  
  // Process text
  if (typeof processText_1L !== "undefined") {
      var textResults = processText_1L(doc, personalization);
      mergeResults(allResults, textResults);
  }
  
  // Process font
  if (typeof processFont_1L !== "undefined") {
      var fontResults = processFont_1L(doc, personalization);
      mergeResults(allResults, fontResults);
  }
  
  // Process size
  if (typeof processSize_1L !== "undefined") {
      var sizeResults = processSize_1L(doc, personalization);
      mergeResults(allResults, sizeResults);
  }
  
  // Process hex color
  if (typeof processHexColor_1L !== "undefined") {
      var hexResults = processHexColor_1L(doc, personalization);
      mergeResults(allResults, hexResults);
  }

  // Process color range
  if (typeof processColorRange_1L !== "undefined") {
      var rangeResults = processColorRange_1L(doc, personalization);
      mergeResults(allResults, rangeResults);
  }
  
  // Process images
  if (typeof processImage_1L !== "undefined") {
      var imageResults = processImage_1L(doc, personalization);
      mergeResults(allResults, imageResults);
  }
  
  if (typeof logInfo === "function") logInfo("1-Layer processing complete. Processed: " + allResults.processed.join(", "));
  
  return allResults;
}

/**
 * Process 2-layers template
 * Calls all 2-layers handlers sequentially
 */
function processTwoLayers(doc, personalization) {
  if (typeof logInfo === "function") logInfo("=== Processing 2-Layers Template ===");
  
  var allResults = {
    processed: [],
    errors: []
  };
  
  // Process text
  if (typeof processText_2L !== "undefined") {
      var textResults = processText_2L(doc, personalization);
      mergeResults(allResults, textResults);
  }
  
  // Process font
  if (typeof processFont_2L !== "undefined") {
      var fontResults = processFont_2L(doc, personalization);
      mergeResults(allResults, fontResults);
  }
  
  // Process size
  if (typeof processSize_2L !== "undefined") {
      var sizeResults = processSize_2L(doc, personalization);
      mergeResults(allResults, sizeResults);
  }
  
  // Process hex color
  if (typeof processHexColor_2L !== "undefined") {
      var hexResults = processHexColor_2L(doc, personalization);
      mergeResults(allResults, hexResults);
  }

  // Process color range
  if (typeof processColorRange_2L !== "undefined") {
      var rangeResults = processColorRange_2L(doc, personalization);
      mergeResults(allResults, rangeResults);
  }
  
  // Process images
  if (typeof processImage_2L !== "undefined") {
      var imageResults = processImage_2L(doc, personalization);
      mergeResults(allResults, imageResults);
  }
  
  if (typeof logInfo === "function") logInfo("2-Layers processing complete. Processed: " + allResults.processed.join(", "));
  
  return allResults;
}

/**
 * Merge handler results into accumulated results
 */
function mergeResults(allResults, handlerResults) {
  if (!handlerResults) return;
  
  // Merge processed keys
  if (handlerResults.processed) {
    for (var i = 0; i < handlerResults.processed.length; i++) {
        // Use polyfilled indexOf
      if (allResults.processed.indexOf(handlerResults.processed[i]) === -1) {
        allResults.processed.push(handlerResults.processed[i]);
      }
    }
  }
  
  // Merge errors
  if (handlerResults.errors) {
    for (var j = 0; j < handlerResults.errors.length; j++) {
      allResults.errors.push(handlerResults.errors[j]);
    }
  }
}
