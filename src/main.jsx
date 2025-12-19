// ============================================
// Main Entry Point - Photoshop Tool
// ============================================

// Libraries
//@include "lib/polyfills.js"
//@include "lib/json2.js"

// Utilities
//@include "utils/logger.jsx"
//@include "utils/validator.jsx"

// Base Utilities
//@include "core/base/layer-utils.jsx"
//@include "core/base/color-utils.jsx"
//@include "core/base/text-utils.jsx"
//@include "core/base/image-utils.jsx"
//@include "core/base/export-utils.jsx"

// Services
//@include "services/api-service.jsx"
//@include "services/csv-service.jsx"
//@include "services/template-service.jsx"

// 1-Layer Handlers
//@include "core/one-layer/text-handler.jsx"
//@include "core/one-layer/font-handler.jsx"
//@include "core/one-layer/size-handler.jsx"
//@include "core/one-layer/color-hex-handler.jsx"
//@include "core/one-layer/color-range-handler.jsx"
//@include "core/one-layer/image-handler.jsx"

// 2-Layers Handlers
//@include "core/two-layers/text-handler.jsx"
//@include "core/two-layers/font-handler.jsx"
//@include "core/two-layers/size-handler.jsx"
//@include "core/two-layers/color-hex-handler.jsx"
//@include "core/two-layers/color-range-handler.jsx"
//@include "core/two-layers/image-handler.jsx"

// Core Logic
//@include "config/color-ranges.jsx"
//@include "core/layer-router.jsx"
//@include "core/processor.jsx"

// UI
//@include "ui/main-panel.jsx"

/**
 * Main function - entry point
 */
function main() {
  try {
    // Check if Photoshop is running
    if (typeof app === "undefined") {
      alert("This script must be run from Adobe Photoshop");
      return;
    }
    
    // Set Photoshop preferences for better automation
    app.displayDialogs = DialogModes.NO;
    
    // Show main panel
    // Note: functions might be in global scope now
    if (typeof showMainPanel === "function") {
        showMainPanel();
    } else if (typeof $.global.showMainPanel === "function") {
        $.global.showMainPanel();
    } else {
        alert("Error: showMainPanel function not found!");
    }
    
  } catch (e) {
    alert("Error: " + e.message + "\n\nLine: " + e.line);
  }
}

// Run main function
main();
