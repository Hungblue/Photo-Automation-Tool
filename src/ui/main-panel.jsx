// ============================================
// Main UI Panel for Photoshop Tool
// ============================================

// UI Configuration
var UI_CONFIG = {
  title: "Photoshop Automation Tool",
  width: 500,
  height: 600
};

/**
 * Create and show main UI panel
 */
function showMainPanel() {
  // Create dialog window
  var dialog = new Window("dialog", UI_CONFIG.title, undefined, {closeButton: true});
  dialog.orientation = "column";
  dialog.alignChildren = ["fill", "top"];
  dialog.spacing = 10;
  dialog.margins = 16;
  
  // === Header Group ===
  var headerGroup = dialog.add("group");
  headerGroup.orientation = "column";
  headerGroup.alignChildren = ["left", "top"];
  var titleText = headerGroup.add("statictext", undefined, "Photoshop Product Automation");
  titleText.graphics.font = ScriptUI.newFont("Arial", "BOLD", 14);
  
  // === Input Method Group ===
  var inputGroup = dialog.add("panel", undefined, "Input Method");
  inputGroup.orientation = "column";
  inputGroup.alignChildren = ["fill", "top"];
  inputGroup.margins = 10;
  
  var radioAPI = inputGroup.add("radiobutton", undefined, "Call API");
  radioAPI.value = true;
  var radioCSV = inputGroup.add("radiobutton", undefined, "Select CSV File");
  
  // === API Options Group ===
  var apiGroup = dialog.add("group");
  apiGroup.orientation = "row";
  apiGroup.alignChildren = ["left", "center"];
  apiGroup.add("statictext", undefined, "Number of products:");
  var apiLimitInput = apiGroup.add("edittext", undefined, "10");
  apiLimitInput.characters = 5;
  
  // === CSV Options Group ===
  var csvGroup = dialog.add("group");
  csvGroup.orientation = "row";
  csvGroup.alignChildren = ["fill", "center"];
  csvGroup.enabled = false;
  var csvPathInput = csvGroup.add("edittext", undefined, "");
  csvPathInput.characters = 30;
  var csvBrowseBtn = csvGroup.add("button", undefined, "Browse...");
  
  // === Export Options Group ===
  var exportGroup = dialog.add("panel", undefined, "Export Options");
  exportGroup.orientation = "column";
  exportGroup.alignChildren = ["fill", "top"];
  exportGroup.margins = 10;
  
  var scaleGroup = exportGroup.add("group");
  scaleGroup.orientation = "row";
  scaleGroup.add("statictext", undefined, "Export Scale:");
  var scaleDropdown = scaleGroup.add("dropdownlist", undefined, ["100%", "150%", "200%", "300%"]);
  scaleDropdown.selection = 0;
  
  var reportCheckbox = exportGroup.add("checkbox", undefined, "Generate CSV Report");
  reportCheckbox.value = true;
  
  // === Progress Group ===
  var progressGroup = dialog.add("panel", undefined, "Progress");
  progressGroup.orientation = "column";
  progressGroup.alignChildren = ["fill", "top"];
  progressGroup.margins = 10;
  
  var progressBar = progressGroup.add("progressbar", undefined, 0, 100);
  progressBar.preferredSize = [450, 20];
  
  var statusText = progressGroup.add("statictext", undefined, "Ready to start...");
  statusText.preferredSize = [450, 20];
  
  // === Log Output Group ===
  var logGroup = dialog.add("panel", undefined, "Log Output");
  logGroup.orientation = "column";
  logGroup.alignChildren = ["fill", "fill"];
  logGroup.margins = 10;
  
  var logOutput = logGroup.add("edittext", undefined, "", {multiline: true, scrolling: true});
  logOutput.preferredSize = [450, 150];
  logOutput.enabled = false;
  
  // === Action Buttons ===
  var buttonGroup = dialog.add("group");
  buttonGroup.orientation = "row";
  buttonGroup.alignChildren = ["center", "center"];
  buttonGroup.alignment = ["fill", "bottom"];
  
  var startBtn = buttonGroup.add("button", undefined, "Start Processing", {name: "ok"});
  startBtn.preferredSize = [150, 30];
  var cancelBtn = buttonGroup.add("button", undefined, "Cancel", {name: "cancel"});
  cancelBtn.preferredSize = [150, 30];
  
  // === Event Handlers ===
  
  // Radio button handlers
  radioAPI.onClick = function() {
    apiGroup.enabled = true;
    csvGroup.enabled = false;
  };
  
  radioCSV.onClick = function() {
    apiGroup.enabled = false;
    csvGroup.enabled = true;
  };
  
  // CSV Browse button
  csvBrowseBtn.onClick = function() {
    var file = File.openDialog("Select CSV file", "*.csv");
    if (file) {
      csvPathInput.text = file.fsName;
    }
  };
  
  // Start button
  startBtn.onClick = function() {
    // Disable buttons during processing
    startBtn.enabled = false;
    cancelBtn.text = "Close";
    
    // Clear log
    logOutput.text = "";
    
    // Add log function
    var addLog = function(message) {
      logOutput.text += message + "\n";
      dialog.update();
    };
    
    try {
      var products = [];
      
      // Get products based on input method
      if (radioAPI.value) {
        addLog("Fetching products from API...");
        var limit = parseInt(apiLimitInput.text) || 10;
        products = fetchProductsFromAPI(limit);
        addLog("Fetched " + products.length + " products");
      } else {
        addLog("Reading CSV file...");
        var csvPath = csvPathInput.text;
        
        if (!csvPath || csvPath === "") {
          alert("Please select a CSV file");
          startBtn.enabled = true;
          cancelBtn.text = "Cancel";
          return;
        }
        
        products = readCSVFile(csvPath);
        addLog("Read " + products.length + " products from CSV");
      }
      
      if (products.length === 0) {
        alert("No products to process");
        startBtn.enabled = true;
        cancelBtn.text = "Cancel";
        return;
      }
      
      // Get export scale
      var scaleValue = 1.0;
      switch (scaleDropdown.selection.index) {
        case 0: scaleValue = 1.0; break;
        case 1: scaleValue = 1.5; break;
        case 2: scaleValue = 2.0; break;
        case 3: scaleValue = 3.0; break;
      }
      
      // Initialize logger
      var timestamp = new Date().getTime();
      var logPath = LOGS_FOLDER + "/process_" + timestamp + ".log";
      initLogger(logPath);
      addLog("Log file: " + logPath);
      
      // Process products
      addLog("Starting batch processing...");
      statusText.text = "Processing...";
      progressBar.value = 0;
      
      var results = [];
      
      for (var i = 0; i < products.length; i++) {
        statusText.text = "Processing " + (i + 1) + " of " + products.length + ": " + products[i].product_id;
        progressBar.value = (i / products.length) * 100;
        dialog.update();
        
        addLog("---");
        addLog("Processing: " + products[i].product_id);
        
        var result = processProduct(products[i], scaleValue);
        results.push(result);
        
        if (result.status === "success") {
          addLog("✓ Success: " + result.output_path);
        } else {
          addLog("✗ Failed: " + result.error);
        }
      }
      
      progressBar.value = 100;
      statusText.text = "Processing complete!";
      
      // Generate report
      if (reportCheckbox.value) {
        addLog("---");
        addLog("Generating report...");
        var reportPath = generateReport(results);
        addLog("Report saved: " + reportPath);
      }
      
      // Show summary
      var summary = getResultsSummary(results);
      addLog("---");
      addLog("=== SUMMARY ===");
      addLog("Total: " + summary.total);
      addLog("Success: " + summary.success);
      addLog("Failed: " + summary.failed);
      addLog("Success Rate: " + summary.successRate);
      addLog("Total Time: " + summary.totalTime + "ms");
      addLog("Average Time: " + summary.avgTime + "ms");
      
      alert("Processing complete!\n\n" +
            "Total: " + summary.total + "\n" +
            "Success: " + summary.success + "\n" +
            "Failed: " + summary.failed + "\n" +
            "Success Rate: " + summary.successRate);
      
    } catch (e) {
      addLog("ERROR: " + e.message);
      alert("Error during processing: " + e.message);
    }
    
    startBtn.enabled = true;
    cancelBtn.text = "Close";
  };
  
  // Show dialog
  dialog.center();
  dialog.show();
}
