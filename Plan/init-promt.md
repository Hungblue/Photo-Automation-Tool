- Tôi muốn tạo một tool giống như một project cho photoshop với luồng hoạt động như sau:
    + Đầu vào là call api từ server hoặc file CSV
    + Cấu trúc dữ liệu trả về sẽ có các thông tin như sau:
        * product_id: id của sản phẩm
        * product_type: loại sản phẩm
        * template_name: tên template
        * personalization: có cấu trúc như sau: "key: value | key: value | ...." 
          các key trong personalization: layer, name_text, name_font, name_color, name_size, name_color_range, image.
    + Sau khi nhận được dữ liệu đầu vào, tool sẽ thực hiện các bước sau:
        * Kiểm tra dữ liệu đầu vào
        * Kiểm tra xem template và product_type trong dữ liệu đầu vào có tồn tại trong thư mục template và product_type tương ứng hay không
        * Nếu tồn tại, tool sẽ thực hiện các bước sau:
            * Dừng file template đó và thay thế các giá trị trong personalization vào file template đó, các item trong template sẽ được thay thế theo key trong personalization
        * Sau khi thay thế xong, tool export ra ảnh PNG và lưu vào thư mục output với tên là product_id, chia folder theo product_type

- Dưới đây là mô tả chi tiết hơn về các công việc :
    1, Setup	Thiết lập môi trường, cấu trúc dự án.
    2, Kết nối API Viết JavaScript để gọi API, xử lý dữ liệu thô, lấy product_id, template_name, và personalization. Map với cấu trúc trong template.
    3, Check template	download các template từ S3, drive, .., tool tự động check tồn tại template (báo lỗi trong list hoặc tự động download template)
    4, Fake data input
    5, Giao diện (UI) 	Dưng UI và các select option:
    - Call API (nhập số lượng) hoặc chọn CSV
    - Chọn tỉ lệ ảnh export
    6, Các function sẽ được dùng lại cho nhiều product type, và có thể tái sử dụng, chỉ cần thêm template vào thư mục template và thêm product type vào thư mục product type, không cần phải sửa code. 
    - Chia ra 2 core layer chính là 1 layer và 2 layers, và các function con cũng sẽ chia thành 2 loại function con 1 layer và 2 layer và dùng cho function layer tương ứng. 
    - Layer 1 và Layer 2 có cấu trúc template khác nhau, các item trong template sẽ khác nhau nên các function con sẽ được dùng cho layer tương ứng. 
    - Viết thêm các Base function để tái sử dụng cho các function con.
    7, Core Functions - Text & Font & Size (1 layer và 2 layer)	Phát triển các hàm JSX tái sử dụng: setLayerTextContent, setLayerFont, setLayerSize.
    8, Core Functions - Color & Range (1 layer và 2 layer)	Phát triển các hàm JSX tái sử dụng: setLayerColor / setColorRange (Áp dụng 1 color hoặc color lần lượt theo dải màu).
    9, Core Functions - Icon/Image (1 layer và 2 layer)	Phát triển hàm JSX tái sử dụng: handleIconReplacement (Thay thế các icon ảnh tương ứng)
    10, Ghép các core functions theo layer, và ghép các core function vào layer tương ứng
    11, Export & File Handling 	"Hàm JSX exportDocument (xuất file PNG, đặt tên file theo mã sản phẩm) và lưu vào thư mục tạm.
Tạo file report."
    12, Test	Test & fix lại các tính năng và đóng gói
        