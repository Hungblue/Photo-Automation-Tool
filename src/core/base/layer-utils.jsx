// ============================================
// Layer Utilities - Base Functions
// ============================================

/**
 * Find layer by name recursively
 * @param {Document|LayerSet} parent - Parent document or layer set
 * @param {String} layerName - Name of layer to find
 * @returns {Layer|null} - Found layer or null
 */
function findLayerByName(parent, layerName) {
  try {
    // If parent is document, search in all layers
    var layers = parent.layers || parent.artLayers;
    if (!layers) return null;
    
    for (var i = 0; i < layers.length; i++) {
      var layer = layers[i];
      
      // Check if this is the layer we're looking for
      if (layer.name === layerName) {
        return layer;
      }
      
      // If it's a layer set (group), search recursively
      if (layer.typename === "LayerSet") {
        var found = findLayerByName(layer, layerName);
        if (found) return found;
      }
    }
    
    return null;
  } catch (e) {
    logError("findLayerByName", e);
    return null;
  }
}

/**
 * Check if layer exists
 */
function checkLayerExists(doc, layerName) {
  var layer = findLayerByName(doc, layerName);
  return layer !== null;
}

/**
 * Get active layer
 */
function getActiveLayer(doc) {
  try {
    return doc.activeLayer;
  } catch (e) {
    logError("getActiveLayer", e);
    return null;
  }
}

/**
 * Show layer
 */
function showLayer(layer) {
  try {
    if (layer) {
      layer.visible = true;
      return true;
    }
    return false;
  } catch (e) {
    logError("showLayer", e);
    return false;
  }
}

/**
 * Hide layer
 */
function hideLayer(layer) {
  try {
    if (layer) {
      layer.visible = false;
      return true;
    }
    return false;
  } catch (e) {
    logError("hideLayer", e);
    return false;
  }
}

/**
 * Select layer
 */
function selectLayer(doc, layer) {
  try {
    if (layer) {
      doc.activeLayer = layer;
      return true;
    }
    return false;
  } catch (e) {
    logError("selectLayer", e);
    return false;
  }
}

/**
 * Get all layers (flatten hierarchy)
 */
function getAllLayers(parent) {
  var allLayers = [];
  
  try {
    var layers = parent.layers || parent.artLayers;
    if (!layers) return allLayers;
    
    for (var i = 0; i < layers.length; i++) {
      var layer = layers[i];
      allLayers.push(layer);
      
      // If it's a layer set, get its children recursively
      if (layer.typename === "LayerSet") {
        var childLayers = getAllLayers(layer);
        allLayers = allLayers.concat(childLayers);
      }
    }
  } catch (e) {
    logError("getAllLayers", e);
  }
  
  return allLayers;
}
