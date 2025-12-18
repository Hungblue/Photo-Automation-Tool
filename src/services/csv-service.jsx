// ============================================
// CSV Service - Handle CSV file reading and parsing
// ============================================

/**
 * Read CSV file and parse to product array
 * @param {String} filePath - Path to CSV file
 * @returns {Array} - Array of product objects
 */
function readCSVFile(filePath) {
  try {
    var csvFile = new File(filePath);
    
    if (!csvFile.exists) {
      logError("readCSVFile", "CSV file not found: " + filePath);
      return [];
    }
    
    csvFile.encoding = "UTF-8";
    if (!csvFile.open("r")) {
      logError("readCSVFile", "Cannot open CSV file: " + filePath);
      return [];
    }
    
    var products = [];
    var headers = null;
    var lineNumber = 0;
    
    while (!csvFile.eof) {
      var line = csvFile.readln();
      lineNumber++;
      
      // Skip if line is empty, null, or undefined
      if (!line || line === null || line === undefined) {
        continue;
      }
      
      // Convert to string for safety
      line = line.toString();
      
      // Check if line is valid string
      if (typeof line !== "string") {
        logWarning("Line " + lineNumber + " is not a string, skipping");
        continue;
      }
      
      // Trim and skip empty lines
      var trimmedLine = line.replace(/^\s+|\s+$/g, ""); // Manual trim for safety
      if (trimmedLine === "" || trimmedLine.length === 0) {
        continue;
      }
      
      if (!headers) {
        // First line is headers
        headers = parseCSVLine(trimmedLine);
        if (!headers || headers.length === 0) {
          logError("readCSVFile", "Failed to parse CSV headers");
          csvFile.close();
          return [];
        }
        logDebug("CSV Headers: " + headers.join(", "));
        continue;
      }
      
      // Parse data row
      var values = parseCSVLine(trimmedLine);
      var product = parseCSVRow(headers, values);
      
      if (product && validateProductData(product)) {
        products.push(product);
      } else {
        logWarning("Invalid CSV row at line " + lineNumber);
      }
    }
    
    csvFile.close();
    
    logInfo("Read " + products.length + " products from CSV: " + filePath);
    return products;
    
  } catch (e) {
    logError("readCSVFile", e);
    return [];
  }
}

/**
 * Parse CSV line (handle quoted fields)
 */
function parseCSVLine(line) {
  var fields = [];
  var currentField = "";
  var inQuotes = false;
  
  for (var i = 0; i < line.length; i++) {
    var ch = line.charAt(i);
    
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      // Manual trim using regex
      var trimmed = currentField.replace(/^\s+|\s+$/g, "");
      fields.push(trimmed);
      currentField = "";
    } else {
      currentField += ch;
    }
  }
  
  // Add last field (manual trim)
  if (currentField !== "") {
    var trimmed = currentField.replace(/^\s+|\s+$/g, "");
    fields.push(trimmed);
  }
  
  return fields;
}

/**
 * Parse CSV row to product object
 * @param {Array} headers - Column headers
 * @param {Array} values - Row values
 * @returns {Object} - Product object
 */
function parseCSVRow(headers, values) {
  try {
    var product = {};
    
    for (var i = 0; i < headers.length && i < values.length; i++) {
      // Manual trim for both header and value
      var header = headers[i].replace(/^\s+|\s+$/g, "").toLowerCase();
      var value = values[i].replace(/^\s+|\s+$/g, "");
      
      // Remove quotes if present
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.substring(1, value.length - 1);
      }
      
      product[header] = value;
    }
    
    return product;
    
  } catch (e) {
    logError("parseCSVRow", e);
    return null;
  }
}

/**
 * Validate CSV structure
 * @param {String} filePath - Path to CSV file
 * @returns {Boolean} - True if valid
 */
function validateCSVStructure(filePath) {
  try {
    var csvFile = new File(filePath);
    
    if (!csvFile.exists) {
      logError("validateCSVStructure", "File not found");
      return false;
    }
    
    csvFile.encoding = "UTF-8";
    csvFile.open("r");
    
    // Read first line (headers)
    var headerLine = csvFile.readln();
    var headers = parseCSVLine(headerLine);
    
    csvFile.close();
    
    // Check required columns
    var requiredColumns = ["product_id", "product_type", "template_name", "personalization"];
    
    for (var i = 0; i < requiredColumns.length; i++) {
      var found = false;
      for (var j = 0; j < headers.length; j++) {
        if (headers[j].toLowerCase() === requiredColumns[i]) {
          found = true;
          break;
        }
      }
      
      if (!found) {
        logError("validateCSVStructure", "Missing required column: " + requiredColumns[i]);
        return false;
      }
    }
    
    logInfo("CSV structure is valid");
    return true;
    
  } catch (e) {
    logError("validateCSVStructure", e);
    return false;
  }
}

/**
 * Select CSV file using dialog
 */
function selectCSVFile() {
  var file = File.openDialog("Select CSV file", "*.csv");
  if (file) {
    return file.fsName;
  }
  return null;
}
