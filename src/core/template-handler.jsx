// ============================================
// BaseTemplateHandler - Unified Template Processing
// Xử lý tất cả personalization keys động
// ============================================

/**
 * BaseTemplateHandler Constructor
 * @param {Document} doc - Photoshop document
 * @param {Object} personalization - Parsed personalization object
 */
function BaseTemplateHandler(doc, personalization) {
  this.doc = doc;
  this.personalization = personalization;
  this.processedKeys = [];
  this.errors = [];
}

/**
 * Main processing method - tự động detect và xử lý keys
 */
BaseTemplateHandler.prototype.process = function() {
  try {
    var keys = [];
    for (var key in this.personalization) {
      if (this.personalization.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    
    logInfo("Processing " + keys.length + " personalization keys");
    
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = this.personalization[key];
      
      logDebug("Processing key: " + key + " = " + value);
      
      // Route to appropriate handler based on key pattern
      if (key.indexOf("name_text") === 0) {
        this.handleTextContent(key, value);
        
      } else if (key.indexOf("name_font") === 0) {
        this.handleFont(key, value);
        
      } else if (key.indexOf("name_color") === 0 && key !== "name_color_range") {
        this.handleColor(key, value);
        
      } else if (key.indexOf("name_size") === 0) {
        this.handleSize(key, value);
        
      } else if (key === "name_color_range") {
        this.handleColorRange(key, value);
        
      } else if (key === "image") {
        this.handleImages(value);
        
      } else if (key === "layer") {
        // Layer info - skip, used as reference
        logDebug("Layer reference: " + value);
        continue;
        
      } else {
        logWarning("Unknown key: " + key);
      }
    }
    
    logInfo("Processed keys: " + this.processedKeys.join(", "));
    if (this.errors.length > 0) {
      logWarning("Errors encountered: " + this.errors.length);
    }
    
    return {
      processedKeys: this.processedKeys,
      errors: this.errors
    };
    
  } catch (e) {
    logError("BaseTemplateHandler.process", e);
    return {
      processedKeys: this.processedKeys,
      errors: this.errors
    };
  }
};

/**
 * Handle text content (name_text, name_text_1, name_text_2, ...)
 */
BaseTemplateHandler.prototype.handleTextContent = function(key, value) {
  try {
    var layerName = this.getLayerNameForKey(key);
    var success = setTextContent(this.doc, layerName, value);
    
    if (success) {
      this.processedKeys.push(key);
      logDebug("Set text: " + layerName + " = " + value);
    } else {
      this.errors.push({key: key, error: "Layer not found: " + layerName});
    }
  } catch (e) {
    logError("handleTextContent", e);
    this.errors.push({key: key, error: e.message});
  }
};

/**
 * Handle font (name_font, name_font_1, name_font_2, ...)
 */
BaseTemplateHandler.prototype.handleFont = function(key, value) {
  try {
    var layerName = this.getLayerNameForKey(key);
    var success = setTextFont(this.doc, layerName, value);
    
    if (success) {
      this.processedKeys.push(key);
      logDebug("Set font: " + layerName + " = " + value);
    } else {
      this.errors.push({key: key, error: "Font not applied: " + layerName});
    }
  } catch (e) {
    logError("handleFont", e);
    this.errors.push({key: key, error: e.message});
  }
};

/**
 * Handle color (name_color, name_color_1, name_color_2, ...)
 */
BaseTemplateHandler.prototype.handleColor = function(key, value) {
  try {
    var layerName = this.getLayerNameForKey(key);
    var success = setTextColor(this.doc, layerName, value);
    
    if (success) {
      this.processedKeys.push(key);
      logDebug("Set color: " + layerName + " = " + value);
    } else {
      this.errors.push({key: key, error: "Color not applied: " + layerName});
    }
  } catch (e) {
    logError("handleColor", e);
    this.errors.push({key: key, error: e.message});
  }
};

/**
 * Handle size (name_size, name_size_1, name_size_2, ...)
 */
BaseTemplateHandler.prototype.handleSize = function(key, value) {
  try {
    var layerName = this.getLayerNameForKey(key);
    var size = parseInt(value);
    var success = setTextSize(this.doc, layerName, size);
    
    if (success) {
      this.processedKeys.push(key);
      logDebug("Set size: " + layerName + " = " + size);
    } else {
      this.errors.push({key: key, error: "Size not applied: " + layerName});
    }
  } catch (e) {
    logError("handleSize", e);
    this.errors.push({key: key, error: e.message});
  }
};

/**
 * Handle color range (gradient on text)
 */
BaseTemplateHandler.prototype.handleColorRange = function(key, value) {
  try {
    var layerName = this.personalization.layer || "TextLayer";
    var colorArray = value.split(","); // "#FF0000,#00FF00,#0000FF"
    
    // Trim whitespace from colors
    for (var i = 0; i < colorArray.length; i++) {
      colorArray[i] = colorArray[i].replace(/^\s+|\s+$/g, "");
    }
    
    var success = setTextColorRange(this.doc, layerName, colorArray);
    
    if (success) {
      this.processedKeys.push(key);
      logDebug("Set color range: " + layerName);
    } else {
      this.errors.push({key: key, error: "Color range not applied"});
    }
  } catch (e) {
    logError("handleColorRange", e);
    this.errors.push({key: key, error: e.message});
  }
};

/**
 * Handle multiple images
 * @param {String|Array} value - Can be single path or comma-separated paths
 */
BaseTemplateHandler.prototype.handleImages = function(value) {
  try {
    var imageArray = [];
    
    // Parse image value (could be "img1.png,img2.png" or array)
    if (typeof value === "string") {
      var imagePaths = value.split(",");
      for (var i = 0; i < imagePaths.length; i++) {
      var path = imagePaths[i].replace(/^\s+|\s+$/g, "");
      imageArray.push({
          layerName: "Image Layer " + (i + 1),
          imagePath: path
        });
      }
    }
    
    var results = handleMultipleImages(this.doc, imageArray);
    this.processedKeys.push("image");
    
    // Check for errors
    for (var j = 0; j < results.length; j++) {
      if (!results[j].success) {
        this.errors.push({
          key: "image",
          error: "Failed to replace image: " + results[j].layer
        });
      }
    }
    
  } catch (e) {
    logError("handleImages", e);
    this.errors.push({key: "image", error: e.message});
  }
};

/**
 * Get layer name from personalization key
 * name_text → use personalization.layer
 * name_text_1 → use personalization.layer + " 1"
 * name_text_2 → use personalization.layer + " 2"
 */
BaseTemplateHandler.prototype.getLayerNameForKey = function(key) {
  try {
    // Extract number from key (name_text_1 → "1")
    var match = key.match(/_(\d+)$/);
    
    if (match) {
      var index = match[1];
      var baseLayerName = this.personalization.layer || "TextLayer";
      
      // Try different naming patterns
      // Pattern 1: "TextLayer 1", "TextLayer 2"
      var layerName1 = baseLayerName + " " + index;
      if (checkLayerExists(this.doc, layerName1)) {
        return layerName1;
      }
      
      // Pattern 2: "TextLayer_1", "TextLayer_2"
      var layerName2 = baseLayerName + "_" + index;
      if (checkLayerExists(this.doc, layerName2)) {
        return layerName2;
      }
      
      // Pattern 3: "TextLayer1", "TextLayer2"
      var layerName3 = baseLayerName + index;
      if (checkLayerExists(this.doc, layerName3)) {
        return layerName3;
      }
      
      // Default: return pattern 1
      return layerName1;
    }
    
    // No number, use base layer name
    return this.personalization.layer || "TextLayer";
    
  } catch (e) {
    logError("getLayerNameForKey", e);
    return "TextLayer";
  }
};
