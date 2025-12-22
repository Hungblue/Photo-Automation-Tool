// ============================================
// Fake API Data - Mock data for testing
// ============================================

/**
 * Fake API response data structure
 * Based on test-data CSV structure:
 * - product_id: Unique product identifier
 * - product_type: Product type code (NP53, NP54, CF750, TN01, BB02)
 * - template_name: Template file name
 * - personalization: Pipe-separated personalization string
 */

var FAKE_API_DATA = {
  // ============================================
  // NP53 Products - Name Plates
  // ============================================
  NP53: [
    {
      product_id: "NP53-001",
      product_type: "NP53",
      template_name: "4-letters-2-elements.psd",
      personalization: "layer:2|name_text:John|name_color_range:Rainbow|image:L1,L4"
    },
    {
      product_id: "NP53-002",
      product_type: "NP53",
      template_name: "16-letters-8-elements.psd",
      personalization: "layer:2|name_text:Harrison Golden|name_color_range: Gold Pink|image:L11, L18, L16, L1, L21, L5, L19, L21"
    },
    {
      product_id: "NP53-003",
      product_type: "NP53",
      template_name: "4-letters-2-elements.psd",
      personalization: "layer:2|name_text:Michael|name_color_range:Rainbow|image:L1,L4"
    },
    {
      product_id: "NP53-004",
      product_type: "NP53",
      template_name: "4-letters-2-elements.psd",
      personalization: "layer:2|name_text:Sarah|name_color_range:Rainbow|image:L1,L4"
    },
    {
      product_id: "NP53-005",
      product_type: "NP53",
      template_name: "4-letters-2-elements.psd",
      personalization: "layer:2|name_text:David|name_color_range:Rainbow|image:L1,L4"
    }
  ],

  // ============================================
  // TN01 Products - Tag/Name Products
  // ============================================
  TN01: [
    {
      product_id: "TN01-001",
      product_type: "TN01",
      template_name: "TN01.psd",
      personalization: "layer:TextLayer|name_text:Welcome Home|name_font:Lobster-Regular|name_color:#D35400|name_size:32"
    },
    {
      product_id: "TN01-002",
      product_type: "TN01",
      template_name: "TN01.psd",
      personalization: "layer:TextLayer|name_text:The Smiths|name_font:Pacifico-Regular|name_color:#27AE60|name_size:28|name_text_1:EST. 1998|name_font_1:Arial|name_color_1:#666666"
    },
    {
      product_id: "TN01-003",
      product_type: "TN01",
      template_name: "TN01.psd",
      personalization: "layer:TextLayer|name_text:Love Lives Here|name_font:GreatVibes-Regular|name_color:#C0392B|name_size:30"
    },
    {
      product_id: "TN01-004",
      product_type: "TN01",
      template_name: "TN01.psd",
      personalization: "layer:TextLayer|name_text:Blessed Family|name_font:Sacramento-Regular|name_color:#2980B9|name_size:26|name_color_range:#E74C3C,#F39C12,#3498DB"
    }
  ],

  // ============================================
  // BB02 Products - Badge/Button Products
  // ============================================
  BB02: [
    {
      product_id: "BB02-001",
      product_type: "BB02",
      template_name: "BB02.psd",
      personalization: "layer:TextLayer|name_text:Best Mom|name_font:Impact|name_color:#FF1493|name_size:18"
    },
    {
      product_id: "BB02-002",
      product_type: "BB02",
      template_name: "BB02.psd",
      personalization: "layer:TextLayer|name_text:Super Dad|name_font:Impact|name_color:#4169E1|name_size:18"
    },
    {
      product_id: "BB02-003",
      product_type: "BB02",
      template_name: "BB02.psd",
      personalization: "layer:TextLayer|name_text:Happy Birthday|name_font:ComicSansMS-Bold|name_color:#FF6347|name_size:16|name_text_1:2024|name_font_1:Arial|name_color_1:#000000"
    },
    {
      product_id: "BB02-004",
      product_type: "BB02",
      template_name: "BB02.psd",
      personalization: "layer:TextLayer|name_text:Team Leader|name_font:Arial-Black|name_color:#32CD32|name_size:14"
    }
  ]
};

/**
 * Get all fake products as flat array
 * @returns {Array} - All products from all types
 */
function getAllFakeProducts() {
  var allProducts = [];
  
  for (var productType in FAKE_API_DATA) {
    if (FAKE_API_DATA.hasOwnProperty(productType)) {
      var products = FAKE_API_DATA[productType];
      for (var i = 0; i < products.length; i++) {
        allProducts.push(products[i]);
      }
    }
  }
  
  return allProducts;
}

/**
 * Get fake products by type
 * @param {String} productType - Product type code
 * @returns {Array} - Products of specified type
 */
function getFakeProductsByType(productType) {
  if (FAKE_API_DATA.hasOwnProperty(productType)) {
    return FAKE_API_DATA[productType];
  }
  return [];
}

/**
 * Get fake product by ID
 * @param {String} productId - Product ID
 * @returns {Object|null} - Product object or null
 */
function getFakeProductById(productId) {
  var allProducts = getAllFakeProducts();
  
  for (var i = 0; i < allProducts.length; i++) {
    if (allProducts[i].product_id === productId) {
      return allProducts[i];
    }
  }
  
  return null;
}

/**
 * Get random fake products
 * @param {Number} count - Number of products to return
 * @returns {Array} - Random selection of products
 */
function getRandomFakeProducts(count) {
  var allProducts = getAllFakeProducts();
  var result = [];
  
  count = Math.min(count || 5, allProducts.length);
  
  // Simple shuffle using current time as seed
  var shuffled = allProducts.slice();
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  
  for (var k = 0; k < count; k++) {
    result.push(shuffled[k]);
  }
  
  return result;
}

/**
 * Simulate API response structure
 * @param {String} productType - Optional filter by product type
 * @param {Number} limit - Optional limit
 * @returns {Object} - Simulated API response
 */
function simulateAPIResponse(productType, limit) {
  var products;
  
  if (productType) {
    products = getFakeProductsByType(productType);
  } else {
    products = getAllFakeProducts();
  }
  
  if (limit && limit > 0) {
    products = products.slice(0, limit);
  }
  
  return {
    success: true,
    timestamp: new Date().toISOString(),
    total: products.length,
    products: products
  };
}

/**
 * Get available product types
 * @returns {Array} - Array of product type codes
 */
function getAvailableProductTypes() {
  var types = [];
  for (var productType in FAKE_API_DATA) {
    if (FAKE_API_DATA.hasOwnProperty(productType)) {
      types.push(productType);
    }
  }
  return types;
}

// Export for testing
// Usage: var fakeData = getAllFakeProducts();
