// ============================================
// API Service - Handle API calls and data parsing
// ============================================

/**
 * Fetch products from API
 * @param {Number} limit - Number of products to fetch
 * @returns {Array} - Array of product objects
 */
function fetchProductsFromAPI(limit) {
  limit = limit || 10;
  
  try {
    logInfo("Fetching " + limit + " products from API...");
    
    // TODO: Implement actual API call when endpoint is available
    // For now, return mock data
    var mockData = generateMockAPIData(limit);
    
    logInfo("Fetched " + mockData.length + " products");
    return mockData;
    
  } catch (e) {
    logError("fetchProductsFromAPI", e);
    return [];
  }
}

/**
 * Generate mock API data for testing
 */
function generateMockAPIData(count) {
  var products = [];
  var productTypes = ["NP53", "NP54", "CF750"];
  
  for (var i = 0; i < count; i++) {
    var productType = productTypes[i % productTypes.length];
    var productId = "P" + (1000 + i);
    
    var product = {
      product_id: productId,
      product_type: productType,
      template_name: "template_1.psd",
      personalization: generateMockPersonalization(productType, i)
    };
    
    products.push(product);
  }
  
  return products;
}

/**
 * Generate mock personalization string
 */
function generateMockPersonalization(productType, index) {
  var names = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Williams", "Charlie Brown"];
  var fonts = ["Arial-BoldMT", "TimesNewRomanPS-BoldMT", "Helvetica-Bold"];
  var colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"];
  
  var name = names[index % names.length];
  var font = fonts[index % fonts.length];
  var color = colors[index % colors.length];
  
  // Basic personalization
  var parts = [
    "layer:TextLayer",
    "name_text:" + name,
    "name_font:" + font,
    "name_color:" + color,
    "name_size:24"
  ];
  
  // Add color range for some products
  if (index % 3 === 0) {
    parts.push("name_color_range:#FF0000,#00FF00,#0000FF");
  }
  
  // Add multiple text fields for some products
  if (index % 2 === 0) {
    parts.push("name_text_1:Subtitle " + index);
    parts.push("name_font_1:Arial");
    parts.push("name_color_1:#000000");
  }
  
  return parts.join("|");
}

/**
 * Parse API response
 * @param {Object} response - API response object
 * @returns {Array} - Array of product objects
 */
function parseAPIResponse(response) {
  try {
    if (!response || !response.products) {
      logError("parseAPIResponse", "Invalid API response structure");
      return [];
    }
    
    var products = response.products;
    var validProducts = [];
    
    for (var i = 0; i < products.length; i++) {
      if (validateProductData(products[i])) {
        validProducts.push(products[i]);
      } else {
        logWarning("Invalid product data at index " + i);
      }
    }
    
    logInfo("Parsed " + validProducts.length + " valid products from API response");
    return validProducts;
    
  } catch (e) {
    logError("parseAPIResponse", e);
    return [];
  }
}

/**
 * Make HTTP request (placeholder for actual implementation)
 */
function makeHttpRequest(url, method, data) {
  // TODO: Implement actual HTTP request
  // ExtendScript doesn't have built-in HTTP support
  // Options:
  // 1. Use Socket class for HTTP
  // 2. Use external library
  // 3. Use system commands
  
  logWarning("HTTP request not implemented yet: " + url);
  return null;
}
