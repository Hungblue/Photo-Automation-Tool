// ============================================
// API Service - Handle API calls and data parsing
// ============================================

// Include fake API data
//@include "../data/fake-api-data.jsx"

/**
 * Fetch products from API
 * @param {Number} limit - Number of products to fetch
 * @param {String} productType - Optional product type filter
 * @returns {Array} - Array of product objects
 */
function fetchProductsFromAPI(limit, productType) {
  limit = limit || 10;
  
  try {
    logInfo("Fetching " + limit + " products from API...");
    
    // TODO: Implement actual API call when endpoint is available
    // For now, return fake data from fake-api-data.jsx
    var fakeData;
    
    if (productType) {
      fakeData = getFakeProductsByType(productType);
      logInfo("Filtered by product type: " + productType);
    } else {
      fakeData = getAllFakeProducts();
    }
    
    // Apply limit
    if (fakeData.length > limit) {
      fakeData = fakeData.slice(0, limit);
    }
    
    logInfo("Fetched " + fakeData.length + " products");
    return fakeData;
    
  } catch (e) {
    logError("fetchProductsFromAPI", e);
    return [];
  }
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
