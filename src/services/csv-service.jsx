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
    csvFile.open("r");
    
    var products = [];
    var headers = null;
    var lineNumber = 0;
    
    while (!csvFile.eof) {
      var line = csvFile.readln();
      lineNumber++;
      
      if (line.trim() === "") continue;
      
      if (!headers) {
        // First line is headers
        headers = parseCSVLine(line);
        logDebug("CSV Headers: " + headers.join(", "));
        continue;
      }
      
      // Parse data row
      var values = parseCSVLine(line);
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
      fields.push(currentField.trim());
      currentField = "";
    } else {
      currentField += ch;
    }
  }
  
  // Add last field
  if (currentField !== "") {
    fields.push(currentField.trim());
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
      var header = headers[i].toLowerCase().trim();
      var value = values[i].trim();
      
      // Remove quotes if present
      if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
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
