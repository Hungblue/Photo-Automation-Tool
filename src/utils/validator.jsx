// ============================================
// Data Validator Utility
// ============================================

/**
 * Validate product data structure
 */
function validateProductData(productData) {
  if (!productData) {
    logError("validateProductData", "Product data is null or undefined");
    return false;
  }
  
  // Check required fields
  var requiredFields = ["product_id", "product_type", "template_name", "personalization"];
  
  for (var i = 0; i < requiredFields.length; i++) {
    var field = requiredFields[i];
    if (!productData[field]) {
      logError("validateProductData", "Missing required field: " + field);
      return false;
    }
  }
  
  // Validate product_id format
  if (typeof productData.product_id !== "string" || productData.product_id.replace(/^\s+|\s+$/g, "") === "") {
    logError("validateProductData", "Invalid product_id");
    return false;
  }
  
  // Validate product_type
  if (typeof productData.product_type !== "string" || productData.product_type.replace(/^\s+|\s+$/g, "") === "") {
    logError("validateProductData", "Invalid product_type");
    return false;
  }
  
  // Validate template_name
  if (typeof productData.template_name !== "string" || productData.template_name.replace(/^\s+|\s+$/g, "") === "") {
    logError("validateProductData", "Invalid template_name");
    return false;
  }
  
  // Validate personalization
  if (typeof productData.personalization !== "string" || productData.personalization.replace(/^\s+|\s+$/g, "") === "") {
    logError("validateProductData", "Invalid personalization");
    return false;
  }
  
  return true;
}

/**
 * Validate personalization string format
 */
function validatePersonalizationFormat(personalizationString) {
  if (!personalizationString || typeof personalizationString !== "string") {
    return false;
  }
  
  // Check if it contains at least one key:value pair
  var pairs = personalizationString.split("|");
  if (pairs.length === 0) {
    return false;
  }
  
  // Check each pair has key:value format
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split(":");
    if (pair.length !== 2) {
      logWarning("Invalid personalization pair: " + pairs[i]);
      return false;
    }
  }
  
  return true;
}

/**
 * Validate file path exists
 */
function validateFilePath(filePath) {
  if (!filePath) return false;
  
  try {
    var file = new File(filePath);
    return file.exists;
  } catch (e) {
    return false;
  }
}

/**
 * Validate color format (hex)
 */
function validateHexColor(color) {
  if (!color || typeof color !== "string") return false;
  
  // Check for #RRGGBB format
  var hexPattern = /^#[0-9A-Fa-f]{6}$/;
  return hexPattern.test(color);
}

/**
 * Sanitize file name (remove invalid characters)
 */
function sanitizeFileName(fileName) {
  if (!fileName) return "";
  
  // Remove invalid characters for file names
  var invalidChars = '<>:"/\\|?*';
  var sanitized = "";
  
  for (var i = 0; i < fileName.length; i++) {
    var ch = fileName.charAt(i);
    if (invalidChars.indexOf(ch) === -1) {
      sanitized += ch;
    } else {
      sanitized += "_";
    }
  }
  
  return sanitized;
}
