# Photoshop Tool - Quick Fix Guide

## ✅ Fixed Issues (2025-12-18)

### 1. **ExtendScript Regex Syntax Error**
**Problem:** Line 110 in `validator.jsx` had regex syntax incompatible with ExtendScript  
**Solution:** Replaced regex with character-by-character iteration

### 2. **Reserved Word 'char'**
**Problem:** Variable name `char` is reserved in ExtendScript  
**Solution:** Renamed to `ch` in:
- `validator.jsx` (line 114)
- `csv-service.jsx` (line 70)

### 3. **Script Loading Method**
**Problem:** `#include` directives don't work in all ExtendScript environments  
**Solution:** Implemented dynamic script loading via `$.evalFile()`

### 4. **JSON Include Issue**
**Problem:** Can't include JSON files directly in ExtendScript  
**Solution:** Added `loadSettings()` function in `template-service.jsx`

---

## 🚀 How to Run (Updated)

### Method 1: Run from Photoshop (Recommended)
1. Open Adobe Photoshop
2. **File → Scripts → Browse...**
3. Navigate to: `PhotoshopTool/src/main.jsx`
4. Click **Open**
5. UI panel will appear

### Method 2: Install as Script
1. Copy `src/main.jsx` to Photoshop Scripts folder:
   - **Windows:** `C:\Program Files\Adobe\Adobe Photoshop [version]\Presets\Scripts\`
   - **Mac:** `/Applications/Adobe Photoshop [version]/Presets/Scripts/`
2. Restart Photoshop
3. **File → Scripts → main.jsx**

---

## ⚠️ Common Errors & Fixes

### Error: "Syntax error in validator.jsx"
✅ **FIXED** - Updated to use character iteration instead of regex

### Error: "Cannot include JSON"
✅ **FIXED** - Settings now loaded dynamically

### Error: "Script file not found"
**Check:**
- All files are in correct folders under `src/`
- Path uses forward slashes `/` not backslashes `\`
- File names match exactly (case-sensitive)

### Error: "undefined is not an object"
**Possible causes:**
- Scripts loaded in wrong order
- Missing dependency
- Check console for which script failed to load

---

## 📁 Verified File Structure

```
PhotoshopTool/
├── src/
│   ├── main.jsx ⭐ RUN THIS FILE
│   ├── config/
│   │   ├── settings.json
│   │   └── product-config.json
│   ├── core/
│   │   ├── base/ (5 JSX files)
│   │   ├── template-handler.jsx
│   │   └── processor.jsx
│   ├── services/ (3 JSX files)
│   ├── ui/
│   │   └── main-panel.jsx
│   └── utils/ (2 JSX files)
├── templates/
│   ├── NP53/
│   ├── NP54/
│   └── CF750/
├── output/
├── logs/
└── test-data/
    └── sample-products.csv
```

---

## 🧪 Test Steps

### 1. Basic Test (Mock API)
```
1. Run src/main.jsx
2. Select "Call API"
3. Enter: 5
4. Click "Start Processing"
5. Check: Logs show "Fetched 5 products"
```

### 2. CSV Test
```
1. Run src/main.jsx
2. Select "Select CSV File"
3. Browse to: test-data/sample-products.csv
4. Click "Start Processing"
5. Check: output/ folder for PNGs
```

### 3. Expected Behavior
- ✅ UI panel opens without errors
- ✅ Progress bar animates during processing
- ✅ Logs appear in text area
- ✅ Alert shows summary when complete

---

## 🔍 Debugging Tips

### Enable Debug Mode
In `src/utils/logger.jsx`, change:
```javascript
var currentLogLevel = LOG_LEVEL.INFO;
```
To:
```javascript
var currentLogLevel = LOG_LEVEL.DEBUG;
```

### Check Log Files
After running, check:
```
logs/process_[timestamp].log
```

### Photoshop ExtendScript Toolkit
For advanced debugging:
1. Open **ExtendScript Toolkit**
2. Open `src/main.jsx`
3. Set target to **Photoshop**
4. Click **Debug → Run**

---

## 📝 Change Log

### v1.0.1 (2025-12-18 11:54)
- Fixed regex syntax error in `validator.jsx`
- Implemented dynamic script loading
- Fixed JSON loading in `template-service.jsx`
- Updated documentation

### v1.0.0 (2025-12-18 11:20)
- Initial release
- All 9 phases completed

---

## 💡 Next Steps

1. **Add Real Templates**
   - Create PSD files with layers
   - Place in `templates/NP53/`, etc.
   - Ensure layer names match personalization keys

2. **Test with Real Data**
   - Create CSV with actual product data
   - Run full processing
   - Verify outputs

3. **Configure S3 (Optional)**
   - Update `src/config/settings.json`
   - Implement download in `template-service.jsx`

---

## 📞 Support

If you encounter issues:
1. Check error message in alert dialog
2. Review log files in `logs/`
3. Enable DEBUG logging
4. Verify file structure is intact

---

**Status:** ✅ Ready to Use  
**Last Updated:** 2025-12-18 11:54
