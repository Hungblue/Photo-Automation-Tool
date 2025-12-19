// Multi-Product Type Photoshop Tool
// Author: Auto-generated
// Description: Process CSV files to generate personalized product images for multiple product types

// target photoshop

// ============================================================================
// CONFIGURATION
// ============================================================================

var CONFIG = {
    // Color palettes for each Color type (from color chart)
    colorPalettes: {
        "Rainbow": [
            [199, 42, 65],    // #c72a41
            [244, 120, 94],   // #f4785e
            [240, 189, 30],   // #f0bd1e
            [51, 185, 144],   // #33b990
            [23, 153, 205],   // #1799cd
            [36, 68, 156],    // #24449c
            [181, 35, 151]    // #b523e97
        ],
        "Pastel Boy": [
            [182, 186, 192],  // #b6bac0
            [142, 237, 243],  // #8eedf3
            [255, 255, 255],  // #ffffff
            [230, 239, 198],  // #e6efc6
            [255, 240, 161]   // #fff0a1
        ],
        "Khaki": [
            [84, 119, 78],    // #54774e
            [255, 255, 255],  // #ffffff
            [244, 120, 94],   // #f4785e
            [255, 240, 161]   // #fff0a1
        ],
        "Pastel Girl": [
            [250, 195, 191],  // #fac3bf
            [252, 222, 226],  // #fcdee2
            [255, 255, 255]   // #ffffff
        ],
        "Black Rose": [
            [153, 118, 100],  // #99766d
            [65, 69, 106],    // #41d546a
            [255, 255, 255],  // #ffffff
            [196, 55, 102],   // #437666
            [223, 176, 113]   // #dfb071
        ],
        "Baby Blue": [
            [32, 68, 146],    // #204492
            [185, 227, 232],  // #b9e3e8
            [119, 135, 163],  // #7787a3
            [182, 186, 192]   // #b6bac0
        ],
        "Green": [
            [16, 68, 39],     // #104427
            [228, 78, 199],   // #e4efc7
            [255, 255, 255],  // #ffffff
            [56, 136, 143],   // #388f8f
            [182, 186, 192]   // #b6bac0
        ],
        "New Pastel Rainbow": [
            [164, 188, 164],  // #a4bca4
            [152, 139, 201],  // #98b7c9
            [118, 138, 169],  // #768aa9
            [172, 135, 142],  // #ac878e
            [223, 154, 147],  // #df9a93
            [250, 204, 186],  // #faccba
            [168, 134, 201],  // #a86c69
            [223, 141, 88],   // #df8d58
            [248, 204, 150]   // #f8cc96
        ],
        "Gold Pink": [
            [241, 119, 174],  // #f177ae
            [232, 206, 227],  // #e8cee3
            [205, 184, 105]   // #cdb869
        ]
    },
    
    
    // Default output folder name (relative to the script folder)
    // A folder with this name will be created next to the script if it does not exist.
    defaultOutputFolder: "results"
};

// ============================================================================
// PRODUCT TYPE HANDLER SYSTEM
// ============================================================================

/**
 * Helper function for inheritance in ExtendScript (replaces Object.create)
 */
function inheritPrototype(subType, superType) {
    var F = function() {};
    F.prototype = superType.prototype;
    subType.prototype = new F();
    subType.prototype.constructor = subType;
}

/**
 * Helper function to get object keys (replaces Object.keys for ExtendScript compatibility)
 */
function getObjectKeys(obj) {
    var keys = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
}

/**
 * Base Product Type Handler Interface
 * Each product type must implement this interface
 */
var ProductTypeHandler = function() {
    this.typeName = "";
};

/**
 * Process a single row of data
 * @param {Object} rowData - Row data object with: productionId, productType, personalize, size
 * @param {Folder} scriptFolder - Script folder path
 * @param {Folder} outputFolder - Output folder path
 * @returns {Boolean} - Success status
 */
ProductTypeHandler.prototype.process = function(rowData, scriptFolder, outputFolder) {
    throw new Error("process() must be implemented by product type handler");
};

/**
 * Get template file path for a given size
 * @param {String} size - Size field from CSV
 * @param {Folder} scriptFolder - Script folder path
 * @returns {File|null} - Template file or null if not found
 */
ProductTypeHandler.prototype.getTemplateFile = function(size, scriptFolder) {
    throw new Error("getTemplateFile() must be implemented by product type handler");
};

// ============================================================================
// NP53 PRODUCT TYPE HANDLER
// ============================================================================

var NP53ProductHandler = function() {
    ProductTypeHandler.call(this);
    this.typeName = "NP53";
    
    // NP53 specific template mapping
    this.templateMapping = {
        "Letter Max Only 6": "6-letters.psd",
        "Letter Max Only 8": "8-letters.psd",
        "Letter Max Only 10": "10-letters.psd",
        "Letter Max 4+2 elements": "4-letters-2-elements.psd",
        "Letter Max 6+2 elements": "6-letters-2-elements.psd",
        "Letter Max 8+2 elements": "8-letters-2-elements.psd",
        "Letter Max 8+4 elements": "8-letters-4-elements.psd",
        "Letter Max 8+8 elements": "8-letters-8-elements.psd",
        "Letter Max 16+8 elements": "16-letters-8-elements.psd"
    };
};
inheritPrototype(NP53ProductHandler, ProductTypeHandler);

NP53ProductHandler.prototype.getTemplateFile = function(size, scriptFolder) {
    var templateFileName = this.templateMapping[size];
    if (!templateFileName) {
        logError("NP53: No template mapping for size: " + size);
        return null;
    }
    
    // Template files are now in template_types/NP53/ folder
    var templateFile = new File(scriptFolder + "/template_types/NP53/" + templateFileName);
    if (!templateFile.exists) {
        logError("NP53: Template file not found: " + templateFile.fsName);
        return null;
    }
    
    return templateFile;
};

NP53ProductHandler.prototype.process = function(rowData, scriptFolder, outputFolder) {
    var productionId = rowData.productionId;
    var personalize = rowData.personalize;
    var size = rowData.size;
    
    log("NP53 Processing: " + productionId + " (" + size + ")");
    logDebug("  Name: " + personalize.name);
    logDebug("  Color: " + personalize.color);
    logDebug("  Icons: " + personalize.icons.join(", "));
    
    // Get template file
    var templateFile = this.getTemplateFile(size, scriptFolder);
    if (!templateFile) {
        return false;
    }
    
    logDebug("Using NP53 template: " + templateFile.name);
    
    // Create output subfolder for this product type
    var productTypeOutputFolder = new Folder(outputFolder + "/" + this.typeName);
    if (!productTypeOutputFolder.exists) {
        productTypeOutputFolder.create();
        logDebug("Created output folder: " + productTypeOutputFolder.fsName);
    }
    
    // Open template
    try {
        var doc = app.open(templateFile);
        
        // Replace icons if any
        if (personalize.icons.length > 0) {
            replaceIcons(doc, personalize.icons, scriptFolder, this.typeName);
        }
        
        // Replace text with gradient coloring
        replaceTextWithGradient(doc, personalize.name, personalize.color, size);
        
        // Export as PNG to product type subfolder with DPI = 300
        var outputFile = new File(productTypeOutputFolder + "/" + productionId + ".png");
        var pngOptions = new PNGSaveOptions();
        pngOptions.compression = 0; // No compression for best quality
        pngOptions.interlaced = false;
        
        // Set document resolution to 300 DPI before saving
        doc.resizeImage(undefined, undefined, 300, ResampleMethod.NONE);
        
        doc.saveAs(outputFile, pngOptions, true, Extension.LOWERCASE);
        log("NP53 Exported: " + outputFile.fsName);
        
        // Close document without saving
        doc.close(SaveOptions.DONOTSAVECHANGES);
        
        return true;
        
    } catch (e) {
        logError("NP53 Error processing row: " + e.message);
        return false;
    }
};

// ============================================================================
// NP54 PRODUCT TYPE HANDLER (Example - Implement your logic here)
// ============================================================================

var NP54ProductHandler = function() {
    ProductTypeHandler.call(this);
    this.typeName = "NP54";
    
    // NP54 specific template mapping (example - customize as needed)
    this.templateMapping = {
        // Add NP54 specific template mappings here
        // Example: "Size1": "np54-template-1.psd"
    };
};
inheritPrototype(NP54ProductHandler, ProductTypeHandler);

NP54ProductHandler.prototype.getTemplateFile = function(size, scriptFolder) {
    var templateFileName = this.templateMapping[size];
    if (!templateFileName) {
        logError("NP54: No template mapping for size: " + size);
        return null;
    }
    
    // Template files are now in template_types/NP54/ folder
    var templateFile = new File(scriptFolder + "/template_types/NP54/" + templateFileName);
    if (!templateFile.exists) {
        logError("NP54: Template file not found: " + templateFile.fsName);
        return null;
    }
    
    return templateFile;
};

NP54ProductHandler.prototype.process = function(rowData, scriptFolder, outputFolder) {
    var productionId = rowData.productionId;
    var personalize = rowData.personalize;
    var size = rowData.size;
    
    log("NP54 Processing: " + productionId + " (" + size + ")");
    
    // Get template file
    var templateFile = this.getTemplateFile(size, scriptFolder);
    if (!templateFile) {
        return false;
    }
    
    logDebug("Using NP54 template: " + templateFile.name);
    
    // Create output subfolder for this product type
    var productTypeOutputFolder = new Folder(outputFolder + "/" + this.typeName);
    if (!productTypeOutputFolder.exists) {
        productTypeOutputFolder.create();
        logDebug("Created output folder: " + productTypeOutputFolder.fsName);
    }
    
    // TODO: Implement NP54 specific processing logic here
    // Example:
    try {
        var doc = app.open(templateFile);
        
        // Replace icons if any
        if (personalize.icons.length > 0) {
            replaceIcons(doc, personalize.icons, scriptFolder, this.typeName);
        }
        
        // Add NP54 specific processing steps here
        // For example, different layer names, different text formatting, etc.
        
        // Export as PNG to product type subfolder with DPI = 300
        var outputFile = new File(productTypeOutputFolder + "/" + productionId + ".png");
        var pngOptions = new PNGSaveOptions();
        pngOptions.compression = 0; // No compression for best quality
        pngOptions.interlaced = false;
        
        // Set document resolution to 300 DPI before saving
        doc.resizeImage(undefined, undefined, 300, ResampleMethod.NONE);
        
        doc.saveAs(outputFile, pngOptions, true, Extension.LOWERCASE);
        log("NP54 Exported: " + outputFile.fsName);
        
        doc.close(SaveOptions.DONOTSAVECHANGES);
        
        return true;
        
    } catch (e) {
        logError("NP54 Error processing row: " + e.message);
        return false;
    }
};

// ============================================================================
// PRODUCT TYPE HANDLER FACTORY
// ============================================================================

var ProductTypeHandlerFactory = function() {
    this.handlers = {};
    
    // Register built-in handlers
    this.register(new NP53ProductHandler());
    this.register(new NP54ProductHandler());
};

ProductTypeHandlerFactory.prototype.register = function(handler) {
    if (!handler || !handler.typeName) {
        logError("Cannot register handler: invalid handler object");
        return;
    }
    
    this.handlers[handler.typeName] = handler;
    logDebug("Registered product type handler: " + handler.typeName);
};

ProductTypeHandlerFactory.prototype.getHandler = function(productType) {
    var handler = this.handlers[productType];
    if (!handler) {
        logError("No handler registered for product type: " + productType);
        return null;
    }
    return handler;
};

ProductTypeHandlerFactory.prototype.hasHandler = function(productType) {
    return this.handlers.hasOwnProperty(productType);
};

// Global factory instance
var productTypeFactory = new ProductTypeHandlerFactory();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function log(message) {
    $.writeln("[NP53Tool] " + message);
}

function logError(message) {
    $.writeln("[ERROR] " + message);
}

function logDebug(message) {
    $.writeln("[DEBUG] " + message);
}

// Trim whitespace from string
function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

// Generate timestamp folder name: Output_HH-MM-SS_DD-MM-YYYY
function generateTimestampFolderName() {
    var now = new Date();
    
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var day = now.getDate();
    var month = now.getMonth() + 1; // Months are 0-indexed
    var year = now.getFullYear();
    
    // Pad with zeros
    function pad(num) {
        return (num < 10 ? '0' : '') + num;
    }
    
    var timeStr = pad(hours) + '-' + pad(minutes) + '-' + pad(seconds);
    var dateStr = pad(day) + '-' + pad(month) + '-' + year;
    
    return 'Output_' + timeStr + '_' + dateStr;
}

// Parse CSV line (handles quoted fields)
function parseCSVLine(line) {
    var fields = [];
    var field = '';
    var inQuotes = false;
    
    for (var i = 0; i < line.length; i++) {
        var ch = line.charAt(i);
        
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
            fields.push(trim(field));
            field = '';
        } else {
            field += ch;
        }
    }
    fields.push(trim(field));
    
    return fields;
}

// Parse Personalize field to extract Name, Color, and Icons
function parsePersonalize(personalizeStr) {
    var result = {
        name: '',
        color: '',
        icons: []
    };
    
    // Split by pipe
    var parts = personalizeStr.split('|');
    
    for (var i = 0; i < parts.length; i++) {
        var part = trim(parts[i]);
        
        if (part.indexOf('Name:') === 0) {
            result.name = trim(part.substring(5));
        } else if (part.indexOf('Color:') === 0) {
            result.color = trim(part.substring(6));
        } else if (part.indexOf('Icon:') === 0) {
            var iconStr = trim(part.substring(5));
            var iconList = iconStr.split(',');
            for (var j = 0; j < iconList.length; j++) {
                result.icons.push(trim(iconList[j]));
            }
        }
    }
    
    return result;
}

// Find layer by name (recursive search)
function findLayerByName(parent, layerName) {
    try {
        for (var i = 0; i < parent.layers.length; i++) {
            var layer = parent.layers[i];
            
            if (layer.name === layerName) {
                return layer;
            }
            
            // Recursively search in layer sets
            if (layer.typename === "LayerSet") {
                var found = findLayerByName(layer, layerName);
                if (found) return found;
            }
        }
    } catch (e) {
        // Layer access error
    }
    
    return null;
}

// Replace smart object with image file
function replaceSmartObject(layer, imageFile) {
    try {
        app.activeDocument.activeLayer = layer;
        
        // Open the replacement image
        var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
        var desc = new ActionDescriptor();
        desc.putPath(charIDToTypeID("null"), new File(imageFile));
        desc.putInteger(charIDToTypeID("PgNm"), 1);
        executeAction(idplacedLayerReplaceContents, desc, DialogModes.NO);
        
        return true;
    } catch (e) {
        logError("Failed to replace smart object: " + e.message);
        return false;
    }
}



// ============================================================================
// MAIN PROCESSING FUNCTIONS
// ============================================================================

// Replace icons in all 4 frames
// Now supports product type specific item_options folders
function replaceIcons(doc, icons, scriptFolder, productType) {
    logDebug("Starting icon replacement with " + icons.length + " icons for product type: " + productType);
    
    // Item options folder is now organized by product type: item_options/NP53/, item_options/NP54/, etc.
    var itemOptionsFolder = new Folder(scriptFolder + "/item_options/" + productType);
    
    if (!itemOptionsFolder.exists) {
        logError("Item options folder not found for product type " + productType + ": " + itemOptionsFolder.fsName);
        return false;
    }
    
    // Process each frame (1 to 4), but skip frame_3
    for (var frameNum = 1; frameNum <= 4; frameNum++) {
        // Skip frame_3 - no icon replacement needed
        if (frameNum === 3) {
            continue;
        }
        
        var frameFolder = new Folder(itemOptionsFolder + "/frame_" + frameNum);
        
        if (!frameFolder.exists) {
            logError("Frame folder not found: " + frameFolder.fsName);
            continue;
        }
        
        // Replace items in this frame
        for (var itemNum = 1; itemNum <= icons.length; itemNum++) {
            var layerName = "frame_" + frameNum + "_item_" + itemNum;
            var iconName = icons[itemNum - 1];
            var iconFile = new File(frameFolder + "/" + iconName + ".png");
            
            if (!iconFile.exists) {
                logError("Icon file not found: " + iconFile.fsName);
                continue;
            }
            
            var layer = findLayerByName(doc, layerName);
            
            if (layer) {
                logDebug("Replacing " + layerName + " with " + iconName);
                replaceSmartObject(layer, iconFile);
            } else {
                logDebug("Layer not found: " + layerName);
            }
        }
    }
    
    logDebug("Icon replacement completed");
}


/*
  Photoshop Script: Rainbow Text
  Fix: Pre-multiplies font size by the Matrix Scale to prevent shrinking.
*/

// ============================================================================
// MAIN FUNCTION
// ============================================================================
function replaceTextWithGradient(doc, name, color, size) {
    logDebug("=== START PROCESS: " + name + " (" + color + ") ===");

    var colorPalette = CONFIG.colorPalettes[color] || CONFIG.colorPalettes["Rainbow"];
    var formattedName = name;
    var isMultiLineSize = (size === "Letter Max 16+8 elements");

    // Xử lý đặc biệt cho "Letter Max 16+8 elements" - có 2 layer riêng: Name_1_1 và Name_1_2
    if (isMultiLineSize) {
        // Tách tên thành 2 phần tại khoảng trắng đầu tiên
        var nameParts = name.split(/\s+/, 2);
        var line1 = nameParts[0] || "";
        var line2 = nameParts[1] || "";
        
        logDebug("Multi-line size detected. Line 1: '" + line1 + "', Line 2: '" + line2 + "'");
        
        // Xử lý Name_1_1 (dòng đầu)
        var name1_1Layer = findLayerByName(doc, "Name_1_1");
        if (name1_1Layer && name1_1Layer.kind === LayerKind.TEXT) {
            var baseSizeVal = name1_1Layer.textItem.size.value;
            var transformScale = getLayerScaleFactor(name1_1Layer);
            var calculatedTargetSize = baseSizeVal * transformScale;
            
            logDebug("Name_1_1 - Base Size: " + baseSizeVal + " pt, Matrix Scale: " + transformScale);
            
            name1_1Layer.textItem.contents = line1;
            app.activeDocument.activeLayer = name1_1Layer;
            
            // Tính offset màu để gradient tiếp tục từ đầu palette
            var colorOffset = 0;
            var success = applyGradientWithCalculatedSize(name1_1Layer, line1, colorPalette, calculatedTargetSize, colorOffset);
            
            if (success) logDebug("SUCCESS: Name_1_1 updated.");
            else logError("FAIL: Name_1_1 update failed.");
        } else {
            logError("Layer 'Name_1_1' not found.");
        }
        
        // Xử lý Name_1_2 (dòng thứ hai)
        var name1_2Layer = findLayerByName(doc, "Name_1_2");
        if (name1_2Layer && name1_2Layer.kind === LayerKind.TEXT) {
            var baseSizeVal2 = name1_2Layer.textItem.size.value;
            var transformScale2 = getLayerScaleFactor(name1_2Layer);
            var calculatedTargetSize2 = baseSizeVal2 * transformScale2;
            
            logDebug("Name_1_2 - Base Size: " + baseSizeVal2 + " pt, Matrix Scale: " + transformScale2);
            
            name1_2Layer.textItem.contents = line2;
            app.activeDocument.activeLayer = name1_2Layer;
            
            // Tính offset màu để gradient tiếp tục từ vị trí sau dòng đầu
            var colorOffset = line1.length;
            var success2 = applyGradientWithCalculatedSize(name1_2Layer, line2, colorPalette, calculatedTargetSize2, colorOffset);
            
            if (success2) logDebug("SUCCESS: Name_1_2 updated.");
            else logError("FAIL: Name_1_2 update failed.");
        } else {
            logError("Layer 'Name_1_2' not found.");
        }
        
        // Name_4: giữ nguyên logic cũ (chỉ set text với xuống dòng, không gradient)
        // Name_4 sẽ nhận tên với \r để xuống dòng như logic cũ
        var name4Layer = findLayerByName(doc, "Name_4");
        if (name4Layer && name4Layer.kind === LayerKind.TEXT) {
            // Tạo formatted name với xuống dòng \r như logic cũ
            var name4Formatted = name.replace(/\s+/, '\r');
            name4Layer.textItem.contents = name4Formatted;
        }
        
    } else {
        // Xử lý bình thường cho các size khác (dùng Name_1)
    var name1Layer = findLayerByName(doc, "Name_1");
    if (name1Layer && name1Layer.kind === LayerKind.TEXT) {
        
        // --- BƯỚC 1: LẤY THÔNG SỐ SCALE HIỆN TẠI ---
        var baseSizeVal = name1Layer.textItem.size.value;
            var baseSizeType = name1Layer.textItem.size.type;

        var transformScale = getLayerScaleFactor(name1Layer);
        var calculatedTargetSize = baseSizeVal * transformScale;

        logDebug("Base Size: " + baseSizeVal + " " + baseSizeType);
        logDebug("Matrix Scale: " + transformScale);
        logDebug(">>> Calculated Target Size to Inject: " + calculatedTargetSize);

        // --- BƯỚC 2: ĐỔI TEXT ---
        name1Layer.textItem.contents = formattedName; 
        
        // --- BƯỚC 3: UPDATE MÀU + NẠP SIZE ĐÃ NHÂN ---
        app.activeDocument.activeLayer = name1Layer;
        
            var colorOffset = 0;
            var success = applyGradientWithCalculatedSize(name1Layer, formattedName, colorPalette, calculatedTargetSize, colorOffset);
        
        if (success) logDebug("SUCCESS: Name_1 updated.");
        else logError("FAIL: Name_1 update failed.");
        
    } else {
        logError("Layer 'Name_1' not found.");
    }

    // Name_4
    var name4Layer = findLayerByName(doc, "Name_4");
    if (name4Layer && name4Layer.kind === LayerKind.TEXT) {
        name4Layer.textItem.contents = formattedName;
        }
    }
}

// ============================================================================
// CORE: GET SCALE FACTOR
// ============================================================================
function getLayerScaleFactor(layer) {
    try {
        app.activeDocument.activeLayer = layer;
        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        var desc = executeActionGet(ref);
        var textKey = desc.getObjectValue(stringIDToTypeID("textKey"));
        
        if (textKey.hasKey(stringIDToTypeID("transform"))) {
            var t = textKey.getObjectValue(stringIDToTypeID("transform"));
            if (t.hasKey(stringIDToTypeID("yy"))) {
                return t.getDouble(stringIDToTypeID("yy"));
            }
        }
        return 1.0;
    } catch(e) { return 1.0; }
}

// ============================================================================
// CORE: APPLY WITH CALCULATED SIZE & KEEP MATRIX
// ============================================================================
function applyGradientWithCalculatedSize(layer, textContent, palette, targetSizeVal, colorOffset) {
    try {
        // colorOffset: offset để tính màu gradient (dùng cho multi-line text)
        if (colorOffset === undefined || colorOffset === null) {
            colorOffset = 0;
        }
        
        // 1. Get Data
        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        var layerDesc = executeActionGet(ref);
        var textKey = layerDesc.getObjectValue(stringIDToTypeID("textKey"));

        // 2. Backup Matrix (Rất quan trọng)
        var savedTransform = null;
        if (textKey.hasKey(stringIDToTypeID("transform"))) {
            savedTransform = textKey.getObjectValue(stringIDToTypeID("transform"));
        }

        // 3. Template Style
        var currentStyleList = textKey.getList(stringIDToTypeID("textStyleRange"));
        var templateRange = currentStyleList.getObjectValue(0);
        var templateStyle = templateRange.getObjectValue(stringIDToTypeID("textStyle"));

        // 4. Build New List
        var newStyleList = new ActionList();

        for (var i = 0; i < textContent.length; i++) {
            // Tính màu với offset để gradient tiếp tục từ vị trí đúng
            var paletteIndex = (colorOffset + i) % palette.length;
            var rgb = palette[paletteIndex];
            var charStyle = new ActionDescriptor();
            
            // --- A. Font Attributes ---
            safeCopyString(templateStyle, charStyle, "fontPostScriptName");
            safeCopyString(templateStyle, charStyle, "fontName");
            
            // --- B. INJECT CALCULATED SIZE (218.97) ---
            // Photoshop tự động chia cho Matrix (4.6) => Base Size về lại 47.55
            // Luôn dùng đơn vị Points (#Pnt) để đồng bộ với logic tính toán
            charStyle.putUnitDouble(stringIDToTypeID("size"), charIDToTypeID("#Pnt"), targetSizeVal);

            // --- C. Other Attributes ---
            safeCopyInteger(templateStyle, charStyle, "tracking");
            safeCopyBoolean(templateStyle, charStyle, "autoKern");
            safeCopyBoolean(templateStyle, charStyle, "syntheticBold");
            safeCopyEnumerated(templateStyle, charStyle, "fontCaps");
            safeCopyEnumerated(templateStyle, charStyle, "baseline");

            // --- D. Color ---
            var colorDesc = new ActionDescriptor();
            colorDesc.putDouble(stringIDToTypeID("red"), rgb[0]);
            colorDesc.putDouble(stringIDToTypeID("green"), rgb[1]);
            colorDesc.putDouble(stringIDToTypeID("blue"), rgb[2]);
            charStyle.putObject(stringIDToTypeID("color"), stringIDToTypeID("RGBColor"), colorDesc);

            // --- E. Range ---
            var rangeDesc = new ActionDescriptor();
            rangeDesc.putInteger(stringIDToTypeID("from"), i);
            rangeDesc.putInteger(stringIDToTypeID("to"), i + 1);
            rangeDesc.putObject(stringIDToTypeID("textStyle"), stringIDToTypeID("textStyle"), charStyle);

            newStyleList.putObject(stringIDToTypeID("textStyleRange"), rangeDesc);
        }

        // 5. Update TextKey
        textKey.putList(stringIDToTypeID("textStyleRange"), newStyleList);

        // 6. RESTORE TRANSFORM
        if (savedTransform) {
            textKey.putObject(stringIDToTypeID("transform"), stringIDToTypeID("transform"), savedTransform);
        }

        // 7. Execute
        var finalDesc = new ActionDescriptor();
        var targetRef = new ActionReference();
        targetRef.putEnumerated(stringIDToTypeID("textLayer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
        finalDesc.putReference(stringIDToTypeID("null"), targetRef);
        finalDesc.putObject(stringIDToTypeID("to"), stringIDToTypeID("textLayer"), textKey);

        executeAction(charIDToTypeID("setd"), finalDesc, DialogModes.NO);
        
        return true;

    } catch (e) {
        logError("Error in applyGradient: " + e.message);
        return false;
    }
}

// ============================================================================
// HELPERS
// ============================================================================
function safeCopyString(src, dest, keyName) {
    var id = stringIDToTypeID(keyName);
    if (src.hasKey(id)) dest.putString(id, src.getString(id));
}
function safeCopyInteger(src, dest, keyName) {
    var id = stringIDToTypeID(keyName);
    if (src.hasKey(id)) dest.putInteger(id, src.getInteger(id));
}
function safeCopyBoolean(src, dest, keyName) {
    var id = stringIDToTypeID(keyName);
    if (src.hasKey(id)) {
        if (keyName === "autoKern" && src.getType(id) === DescValueType.ENUMERATEDTYPE) {
             dest.putEnumerated(id, src.getEnumerationType(id), src.getEnumerationValue(id));
        } else {
             dest.putBoolean(id, src.getBoolean(id));
        }
    } else if (keyName === "autoKern") dest.putBoolean(id, true);
}
function safeCopyEnumerated(src, dest, keyName) {
    var id = stringIDToTypeID(keyName);
    if (src.hasKey(id)) dest.putEnumerated(id, src.getEnumerationType(id), src.getEnumerationValue(id));
}


// Process a single CSV row
function processRow(rowData, scriptFolder, outputFolder) {
    var productionId = rowData[0];
    var productType = rowData[1];
    var personalizeStr = rowData[2];
    var size = rowData[3];
    
    // Validate product type
    if (!productType || productType === '') {
        logError("Row " + productionId + ": Product Type is empty");
        return false;
    }
    
    // Get handler for this product type
    var handler = productTypeFactory.getHandler(productType);
    if (!handler) {
        logError("Row " + productionId + ": No handler available for product type: " + productType);
        return false;
    }
    
    // Parse personalization data
    var personalize = parsePersonalize(personalizeStr);
    logDebug("  Name: " + personalize.name);
    logDebug("  Color: " + personalize.color);
    logDebug("  Icons: " + personalize.icons.join(", "));
    
    // Prepare row data object for handler
    var rowDataObj = {
        productionId: productionId,
        productType: productType,
        personalize: personalize,
        size: size
    };
        
    // Process using the appropriate handler
    return handler.process(rowDataObj, scriptFolder, outputFolder);
}

// ============================================================================
// UI AND MAIN EXECUTION
// ============================================================================

function main() {
    log("=== Multi-Product Type Photoshop Tool Started ===");
    
    // Get script folder
    var scriptFile = new File($.fileName);
    var scriptFolder = scriptFile.parent;
    
    logDebug("Script folder: " + scriptFolder.fsName);
    
    // Log registered handlers
    log("Registered product types: " + getObjectKeys(productTypeFactory.handlers).join(", "));
    
    // Select CSV file
    var csvFile = File.openDialog("Select CSV file", "CSV Files:*.csv");
    if (!csvFile) {
        alert("No CSV file selected. Exiting.");
        return;
    }
    
    log("CSV file: " + csvFile.fsName);
    
    // Determine default results folder (relative to the script folder)
    var defaultResultsFolder = new Folder(scriptFolder + "/" + CONFIG.defaultOutputFolder);
    if (!defaultResultsFolder.exists) {
        defaultResultsFolder.create();
        logDebug("Created default results folder: " + defaultResultsFolder.fsName);
    }
    
    // Let the user choose an output folder, defaulting to the "results" folder
    // If the user cancels, fall back to the default "results" folder.
    var chosenFolder = Folder.selectDialog(
        "Select output folder (Cancel to use the default 'results' folder next to this script):",
        defaultResultsFolder
    );
    
    var resultsFolder = chosenFolder || defaultResultsFolder;
    log("Using base results folder: " + resultsFolder.fsName);
    
    // Create timestamped subfolder for this run
    var timestampFolderName = generateTimestampFolderName();
    var outputFolder = new Folder(resultsFolder + "/" + timestampFolderName);
    
    if (!outputFolder.exists) {
        outputFolder.create();
    }
    
    log("Output folder: " + outputFolder.fsName);
    
    // Read CSV file
    csvFile.open('r');
    var lines = [];
    while (!csvFile.eof) {
        var line = csvFile.readln();
        if (line.length > 0) {
            lines.push(line);
        }
    }
    csvFile.close();
    
    log("Read " + lines.length + " lines from CSV");
    
    // Build list of valid data rows (skip header and empty rows)
    var dataRows = [];
    var productTypeStats = {};
    
    for (var i = 1; i < lines.length; i++) {
        var tmpRow = parseCSVLine(lines[i]);
        if (tmpRow.length >= 4 && tmpRow[0] !== '') {
            dataRows.push(tmpRow);
            
            // Count by product type
            var pt = tmpRow[1] || "Unknown";
            productTypeStats[pt] = (productTypeStats[pt] || 0) + 1;
        }
    }

    var totalRows = dataRows.length;
    log("Total valid data rows: " + totalRows);
    
    // Log product type distribution
    log("Product type distribution:");
    for (var pt in productTypeStats) {
        log("  " + pt + ": " + productTypeStats[pt]);
    }

    // Create a simple progress UI so the user can see row‑by‑row status
    var progressWin = new Window("palette", "Multi-Product Processing Progress");
    progressWin.orientation = "column";
    progressWin.alignChildren = ["fill", "top"];

    var progressText = progressWin.add("statictext", undefined, "Preparing...");
    var progressBar = progressWin.add("progressbar", undefined, 0, Math.max(1, totalRows));
    progressBar.preferredSize = [300, 20];

    var detailText = progressWin.add("statictext", undefined, "");

    progressWin.show();
    
    // Process each valid data row
    var successCount = 0;
    var errorCount = 0;
    var productTypeResults = {};
    
    for (var idx = 0; idx < dataRows.length; idx++) {
        var rowData = dataRows[idx];

        var currentRowNumber = idx + 1;
        var productionId = rowData[0];
        var productType = rowData[1] || "Unknown";

        // Update progress UI for this row
        progressBar.value = currentRowNumber;
        progressText.text = "Row " + currentRowNumber + " / " + totalRows;
        detailText.text = "Processing ID: " + productionId + " (" + productType + ")";
        progressWin.update();
        
        log("--- Row " + currentRowNumber + " [" + productType + "] ---");
        
        // Initialize product type results counter
        if (!productTypeResults[productType]) {
            productTypeResults[productType] = { success: 0, error: 0 };
        }
        
        if (processRow(rowData, scriptFolder, outputFolder)) {
            successCount++;
            productTypeResults[productType].success++;
        } else {
            errorCount++;
            productTypeResults[productType].error++;
        }
    }
    
    // Close progress window when done
    try {
        progressWin.close();
    } catch (e) {
        // ignore if already closed
    }
    
    log("=== Processing Complete ===");
    log("Total - Success: " + successCount + ", Errors: " + errorCount);
    
    // Log results by product type
    for (var pt in productTypeResults) {
        var stats = productTypeResults[pt];
        log(pt + " - Success: " + stats.success + ", Errors: " + stats.error);
    }
    
    var resultMessage = "Processing complete!\n\nTotal - Success: " + successCount + "\nTotal - Errors: " + errorCount + "\n\n";
    for (var pt in productTypeResults) {
        var stats = productTypeResults[pt];
        resultMessage += pt + " - Success: " + stats.success + ", Errors: " + stats.error + "\n";
    }
    resultMessage += "\nOutput folder: " + outputFolder.fsName;
    
    alert(resultMessage);
}

// Run the script
try {
    main();
} catch (e) {
    logError("Fatal error: " + e.message);
    alert("Error: " + e.message);
}
