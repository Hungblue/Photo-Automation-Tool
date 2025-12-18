# Photoshop Automation Tool

Công cụ tự động hóa xử lý hàng loạt sản phẩm cho Photoshop với khả năng đọc dữ liệu từ API hoặc CSV, thay thế nội dung trong template và export ảnh PNG.

## 📋 Tính năng

- ✅ **Multi-input**: Hỗ trợ cả API và CSV
- ✅ **Dynamic Keys**: Tự động xử lý các personalization keys động (`name_text_1`, `name_text_2`, ...)
- ✅ **Template Management**: Auto-check local, fallback to S3 download
- ✅ **Flexible Processing**: Không cần phân biệt 1-layer hay 2-layers
- ✅ **Batch Export**: Export PNG với nhiều scale options (100%, 150%, 200%, 300%)
- ✅ **Logging & Reports**: CSV reports và log files chi tiết
- ✅ **User-friendly UI**: ScriptUI panel trực quan

## 🏗️ Cấu trúc Project

```
PhotoshopTool/
├── src/
│   ├── main.jsx                    # Entry point - chạy file này
│   ├── config/
│   │   ├── settings.json           # Cấu hình S3, paths, export
│   │   └── product-config.json     # Map product types → templates
│   ├── core/
│   │   ├── base/                   # Base utilities
│   │   │   ├── layer-utils.jsx
│   │   │   ├── color-utils.jsx
│   │   │   ├── text-utils.jsx
│   │   │   ├── image-utils.jsx
│   │   │   └── export-utils.jsx
│   │   ├── template-handler.jsx    # BaseTemplateHandler
│   │   └── processor.jsx           # Main processor
│   ├── services/
│   │   ├── api-service.jsx         # API integration
│   │   ├── csv-service.jsx         # CSV reader
│   │   └── template-service.jsx    # Template validation
│   ├── ui/
│   │   └── main-panel.jsx          # Main UI
│   └── utils/
│       ├── logger.jsx              # Logging system
│       └── validator.jsx           # Data validation
├── templates/                      # Templates by product type
│   ├── NP53/
│   ├── NP54/
│   └── CF750/
├── output/                         # Exported PNGs
├── logs/                           # Log files
└── test-data/                      # Test CSV files
```

## 🚀 Installation

### Yêu cầu
- Adobe Photoshop CC 2019 trở lên
- Windows/MacOS

### Setup
1. Copy thư mục `PhotoshopTool` vào máy
2. Đảm bảo cấu trúc thư mục đầy đủ (templates, output, logs)
3. Cấu hình `src/config/settings.json` nếu cần (S3 URL, v.v.)
4. Thêm product types vào `src/config/product-config.json`

## 📖 Usage

### Cách 1: Chạy từ Photoshop
1. Mở Photoshop
2. **File → Scripts → Browse...**
3. Chọn file `src/main.jsx`
4. UI panel sẽ hiển thị

### Cách 2: Double-click (Windows)
- Click đúp vào `src/main.jsx` (nếu đã associate .jsx với Photoshop)

## 🎯 Sử dụng UI Panel

### Input Method
**Option 1: Call API**
- Chọn "Call API"
- Nhập số lượng products cần fetch
- (Hiện tại sử dụng mock data)

**Option 2: CSV File**
- Chọn "Select CSV File"
- Browse và chọn CSV file
- CSV format:
  ```csv
  product_id,product_type,template_name,personalization
  P1001,NP53,template_1.psd,"layer:TextLayer|name_text:John|..."
  ```

### Export Options
- **Export Scale**: Chọn tỷ lệ export (100%, 150%, 200%, 300%)
- **Generate CSV Report**: Bật/tắt tạo report CSV

### Processing
1. Click **"Start Processing"**
2. Theo dõi progress bar
3. Xem log output realtime
4. Khi hoàn thành, kiểm tra:
   - Ảnh PNG trong `output/{product_type}/`
   - Report CSV trong `logs/`
   - Log file trong `logs/`

## 📝 Personalization Format

Format: `key:value|key:value|...`

### Supported Keys

| Key Pattern | Description | Example |
|------------|-------------|---------|
| `layer` | Layer reference | `layer:TextLayer` |
| `name_text` | Text content | `name_text:John Doe` |
| `name_text_1`, `name_text_2` | Multiple text fields | `name_text_1:Subtitle` |
| `name_font` | Font name | `name_font:Arial-BoldMT` |
| `name_font_1`, `name_font_2` | Fonts for multiple fields | `name_font_1:Helvetica` |
| `name_color` | Text color (hex) | `name_color:#FF0000` |
| `name_color_1`, `name_color_2` | Colors for multiple fields | `name_color_1:#00FF00` |
| `name_size` | Font size (pt) | `name_size:24` |
| `name_size_1`, `name_size_2` | Sizes for multiple fields | `name_size_1:18` |
| `name_color_range` | Gradient colors | `name_color_range:#FF0000,#00FF00,#0000FF` |
| `image` | Image paths (comma-separated) | `image:img1.png,img2.png` |

### Ví dụ đầy đủ
```
layer:TextLayer|name_text:John Doe|name_font:Arial-BoldMT|name_color:#FF0000|name_size:24|name_text_1:Subtitle|name_font_1:Arial|name_color_1:#000000|name_color_range:#FF0000,#00FF00,#0000FF
```

## 🔧 Configuration

### settings.json
```json
{
  "s3": {
    "baseUrl": "https://s3.amazonaws.com/your-bucket/templates/",
    "enabled": true
  },
  "paths": {
    "templates": "./templates",
    "output": "./output",
    "logs": "./logs"
  },
  "export": {
    "defaultScale": 1.0,
    "scaleOptions": [1.0, 1.5, 2.0, 3.0],
    "dpi": 300
  }
}
```

### product-config.json
```json
{
  "NP53": {
    "templates": ["template_1.psd", "template_2.psd"],
    "defaultTemplate": "template_1.psd"
  },
  "NP54": {
    "templates": ["template_1.psd"],
    "defaultTemplate": "template_1.psd"
  }
}
```

## 📂 Adding New Product Types

1. Tạo folder mới trong `templates/`:
   ```
   templates/NEW_PRODUCT_TYPE/
   ```

2. Copy template PSD vào folder

3. Thêm config vào `product-config.json`:
   ```json
   "NEW_PRODUCT_TYPE": {
     "templates": ["template_1.psd"],
     "defaultTemplate": "template_1.psd"
   }
   ```

4. **Không cần sửa code!** Tool tự động detect và xử lý.

## 📊 Reports & Logs

### CSV Report Format
```csv
product_id,product_type,status,error_message,output_path,processing_time_ms
P1001,NP53,success,,C:\...\output\NP53\P1001.png,1234
P1002,NP54,failed,Template not found,,,2000
```

### Log Files
- Location: `logs/process_{timestamp}.log`
- Levels: ERROR, WARNING, INFO, DEBUG
- Includes detailed processing steps

## 🧪 Testing

### Test với Sample Data
```bash
# File test có sẵn
test-data/sample-products.csv
```

Chứa 10 products mẫu với:
- Các product types khác nhau (NP53, NP54, CF750)
- Multiple text fields
- Color ranges
- Các template khác nhau

### Test Workflow
1. Load `test-data/sample-products.csv`
2. Click "Start Processing"
3. Verify:
   - [ ] 10 PNGs exported
   - [ ] Organized by product type folders
   - [ ] Report CSV generated
   - [ ] No errors in log

## ⚠️ Troubleshooting

### "Template not found"
- ✅ Check template exists trong `templates/{product_type}/`
- ✅ Kiểm tra tên file chính xác (case-sensitive)
- ✅ Nếu S3 enabled, check S3 URL

### "Layer not found"
- ✅ Verify layer name trong template
- ✅ Check `layer` value trong personalization
- ✅ Layer có thể ở trong group/folder

### "Font not available"
- ✅ Install font vào system
- ✅ Check font PostScript name (Arial-BoldMT, không phải "Arial Bold")
- ✅ Tool sẽ log warning nhưng tiếp tục xử lý

### Performance Issues
- ✅ Process theo batches nhỏ hơn
- ✅ Close các documents không cần thiết trong Photoshop
- ✅ Giảm export scale nếu không cần resolution cao

## 🔄 Workflow Overview

```
[Input] → [Validate] → [Get Template] → [Process] → [Export] → [Report]
   ↓           ↓              ↓            ↓           ↓           ↓
 API/CSV   Check data   Local/S3    BaseHandler    PNG     CSV + Log
```

## 📞 Support

Nếu gặp vấn đề:
1. Check log files trong `logs/`
2. Verify input data format
3. Test với sample data trước
4. Check template structure

## 🎉 Features Coming Soon

- [ ] Real API integration
- [ ] S3 download implementation
- [ ] More advanced image manipulation
- [ ] Custom export formats (JPG, TIFF)
- [ ] Scheduled batch processing
- [ ] Email notifications

## 📄 License

Internal tool - All rights reserved

---

**Version:** 1.0.0  
**Last Updated:** 2025-12-18
