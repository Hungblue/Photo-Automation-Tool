// ============================================
// Template Service - Handle template validation and download
// ============================================

// Global constants
// Resolve absolute path based on script location: src/services/template-service.jsx
// Need to go up 3 levels: services -> src -> root
var scriptFile = new File($.fileName);
var scriptFolder = scriptFile.parent; // src/services
var srcFolder = scriptFolder.parent;  // src
var rootFolder = srcFolder.parent;    // root

// Normalize path separators to forward slashes
var rootPath = rootFolder.fsName.replace(/\\/g, "/");
var TEMPLATES_FOLDER = rootPath + "/templates";

// Log the resolved path for debugging
try {
  if (typeof logInfo === "function") {
    logInfo("Resolved TEMPLATES_FOLDER: " + TEMPLATES_FOLDER);
  }
} catch(e) {}

/**
 * Load settings from JSON file
 * @returns {Object} - Settings object
 */
function loadSettings() {
  try {
    var settingsFile = new File("./src/config/settings.json");
    if (!settingsFile.exists) {
      logError("loadSettings", "Settings file not found");
      return {};
    }
    
    settingsFile.encoding = "UTF-8";
    settingsFile.open("r");
    var content = settingsFile.read();
    settingsFile.close();
    
    // Parse JSON (ExtendScript doesn't have native JSON.parse)
    return eval("(" + content + ")");
  } catch (e) {
    logError("loadSettings", e);
    return {};
  }
}

/**
 * Check if template exists locally
 * @param {String} productType - Product type
 * @param {String} templateName - Template filename
 * @returns {Boolean} - True if exists
 */
function checkTemplateExists(productType, templateName) {
  try {
    // Ensure template name has .psd extension
    var fileName = templateName;
    var lowerName = fileName.toLowerCase();
    var hasPsdExt = lowerName.substring(lowerName.length - 4) === ".psd";
    if (!hasPsdExt) {
      fileName = fileName + ".psd";
    }
    
    var templatePath = TEMPLATES_FOLDER + "/" + productType + "/" + fileName;
    var file = new File(templatePath);
    
    var exists = file.exists;
    
    if (exists) {
      logDebug("Template found locally: " + templatePath);
    } else {
      logDebug("Template not found locally: " + templatePath);
    }
    
    return exists;
    
  } catch (e) {
    logError("checkTemplateExists", e);
    return false;
  }
}

/**
 * Download template from S3
 * @param {String} productType - Product type
 * @param {String} templateName - Template filename
 * @returns {Boolean} - True if download successful
 */
function downloadTemplate(productType, templateName) {
  try {
    // TODO: Implement actual S3 download
    // This is a placeholder implementation
    
    logInfo("Attempting to download template from S3...");
    logInfo("Product Type: " + productType);
    logInfo("Template Name: " + templateName);
    
    // Example S3 URL construction
    // var s3Url = settings.s3.baseUrl + productType + "/" + templateName;
    
    logWarning("S3 download not implemented yet");
    return false;
    
  } catch (e) {
    logError("downloadTemplate", e);
    return false;
  }
}

/**
 * Validate template file
 * @param {String} templatePath - Path to template file
 * @returns {Boolean} - True if valid
 */
function validateTemplate(templatePath) {
  try {
    var file = new File(templatePath);
    
    if (!file.exists) {
      logError("validateTemplate", "Template file not found: " + templatePath);
      return false;
    }
    
    // Check file extension
    var lowerPath = templatePath.toLowerCase();
    var hasPsdExt = lowerPath.substring(lowerPath.length - 4) === ".psd";
    if (!hasPsdExt) {
      logError("validateTemplate", "Template must be a PSD file");
      return false;
    }
    
    // Try to open template
    var doc = app.open(file);
    if (!doc) {
      logError("validateTemplate", "Failed to open template");
      return false;
    }
    
    // Close without saving
    doc.close(SaveOptions.DONOTSAVECHANGES);
    
    logInfo("Template is valid: " + templatePath);
    return true;
    
  } catch (e) {
    logError("validateTemplate", e);
    return false;
  }
}

/**
 * Get template configuration for product type
 * @param {String} productType - Product type
 * @returns {Object} - Template config or null
 */
function getTemplateConfig(productType) {
  try {
    // Load product config
    var configFile = new File("./src/config/product-config.json");
    if (!configFile.exists) {
      logError("getTemplateConfig", "Product config file not found");
      return null;
    }
    
    configFile.encoding = "UTF-8";
    configFile.open("r");
    var configContent = configFile.read();
    configFile.close();
    
    // Parse JSON (ExtendScript doesn't have native JSON.parse)
    var config = eval("(" + configContent + ")");
    
    if (config[productType]) {
      logDebug("Found config for product type: " + productType);
      return config[productType];
    } else {
      logWarning("No config found for product type: " + productType);
      return null;
    }
    
  } catch (e) {
    logError("getTemplateConfig", e);
    return null;
  }
}

/**
 * Get template path (check local, download if needed)
 * @param {String} productType - Product type
 * @param {String} templateName - Template filename
 * @returns {String} - Template path or null
 */
function getTemplatePath(productType, templateName) {
  try {
    // Ensure template name has .psd extension
    var fileName = templateName;
    var lowerName = fileName.toLowerCase();
    var hasPsdExt = lowerName.substring(lowerName.length - 4) === ".psd";
    if (!hasPsdExt) {
      fileName = fileName + ".psd";
    }
    
    var localPath = TEMPLATES_FOLDER + "/" + productType + "/" + fileName;
    var file = new File(localPath);
    
    logDebug("Checking template path: " + localPath);
    
    // Check if exists locally
    if (file.exists) {
      logInfo("Using local template: " + localPath);
      return localPath;
    }
    
    // Try to download from S3
    logInfo("Template not found locally, attempting download...");
    var downloaded = downloadTemplate(productType, fileName);
    
    if (downloaded && file.exists) {
      logInfo("Template downloaded successfully");
      return localPath;
    }
    
    // Template not available
    logError("getTemplatePath", "Template not available: " + fileName);
    return null;
    
  } catch (e) {
    logError("getTemplatePath", e);
    return null;
  }
}

/**
 * List all available templates for product type
 */
function listTemplates(productType) {
  try {
    var folder = new Folder(TEMPLATES_FOLDER + "/" + productType);
    
    if (!folder.exists) {
      logWarning("Template folder not found: " + productType);
      return [];
    }
    
    var files = folder.getFiles("*.psd");
    var templateNames = [];
    
    for (var i = 0; i < files.length; i++) {
      templateNames.push(files[i].name);
    }
    
    logInfo("Found " + templateNames.length + " templates for " + productType);
    return templateNames;
    
  } catch (e) {
    logError("listTemplates", e);
    return [];
  }
}
