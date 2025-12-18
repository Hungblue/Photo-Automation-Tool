// ============================================
// Logger Utility
// ============================================

var LOG_LEVEL = {
  ERROR: 0,
  WARNING: 1,
  INFO: 2,
  DEBUG: 3
};

var currentLogLevel = LOG_LEVEL.INFO;
var logFile = null;

/**
 * Initialize logger with file path
 */
function initLogger(logFilePath) {
  try {
    logFile = new File(logFilePath);
    logFile.encoding = "UTF-8";
    logFile.open("w");
    logFile.writeln("=== Photoshop Tool Log Started: " + new Date().toString() + " ===");
    logFile.close();
    return true;
  } catch (e) {
    alert("Failed to initialize log file: " + e.message);
    return false;
  }
}

/**
 * Write log message to file
 */
function writeLog(level, message) {
  if (!logFile) return;
  
  try {
    logFile.open("a");
    var timestamp = new Date().toISOString();
    var levelStr = "";
    
    switch(level) {
      case LOG_LEVEL.ERROR: levelStr = "ERROR"; break;
      case LOG_LEVEL.WARNING: levelStr = "WARN"; break;
      case LOG_LEVEL.INFO: levelStr = "INFO"; break;
      case LOG_LEVEL.DEBUG: levelStr = "DEBUG"; break;
    }
    
    logFile.writeln("[" + timestamp + "] [" + levelStr + "] " + message);
    logFile.close();
  } catch (e) {
    // Silent fail
  }
}

/**
 * Log error message
 */
function logError(context, error) {
  var message = context + ": " + (error.message || error.toString());
  writeLog(LOG_LEVEL.ERROR, message);
  $.writeln("[ERROR] " + message);
}

/**
 * Log warning message
 */
function logWarning(message) {
  if (currentLogLevel >= LOG_LEVEL.WARNING) {
    writeLog(LOG_LEVEL.WARNING, message);
    $.writeln("[WARNING] " + message);
  }
}

/**
 * Log info message
 */
function logInfo(message) {
  if (currentLogLevel >= LOG_LEVEL.INFO) {
    writeLog(LOG_LEVEL.INFO, message);
    $.writeln("[INFO] " + message);
  }
}

/**
 * Log debug message
 */
function logDebug(message) {
  if (currentLogLevel >= LOG_LEVEL.DEBUG) {
    writeLog(LOG_LEVEL.DEBUG, message);
    $.writeln("[DEBUG] " + message);
  }
}

/**
 * Set log level
 */
function setLogLevel(level) {
  currentLogLevel = level;
}
