// ============================================
// Main Entry Point - Photoshop Tool
// ============================================

// Include all dependencies
// @include "utils/logger.jsx"
// @include "utils/validator.jsx"
// @include "core/base/layer-utils.jsx"
// @include "core/base/color-utils.jsx"
// @include "core/base/text-utils.jsx"
// @include "core/base/image-utils.jsx"
// @include "core/base/export-utils.jsx"
// @include "services/api-service.jsx"
// @include "services/csv-service.jsx"
// @include "services/template-service.jsx"
// @include "core/template-handler.jsx"
// @include "core/processor.jsx"
// @include "ui/main-panel.jsx"

/**
 * Load all script files
 */
function loadScripts() {
  var scriptFolder = new File($.fileName).parent;
  var scripts = [
    "utils/logger.jsx",
    "utils/validator.jsx",
    "core/base/layer-utils.jsx",
    "core/base/color-utils.jsx",
    "core/base/text-utils.jsx",
    "core/base/image-utils.jsx",
    "core/base/export-utils.jsx",
    "services/api-service.jsx",
    "services/csv-service.jsx",
    "services/template-service.jsx",
    "core/template-handler.jsx",
    "core/processor.jsx",
    "ui/main-panel.jsx"
  ];
  
  for (var i = 0; i < scripts.length; i++) {
    var scriptPath = scriptFolder.fsName + "/" + scripts[i];
    try {
      $.evalFile(scriptPath);
    } catch (e) {
      alert("Error loading " + scripts[i] + ": " + e.message);
      return false;
    }
  }
  
  return true;
}

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
    
    // Load all script files
    if (!loadScripts()) {
      alert("Failed to load required script files");
      return;
    }
    
    // Set Photoshop preferences for better automation
    app.displayDialogs = DialogModes.NO;
    
    // Show main panel
    showMainPanel();
    
  } catch (e) {
    alert("Error: " + e.message + "\n\nLine: " + e.line);
  }
}

// Run main function
main();
