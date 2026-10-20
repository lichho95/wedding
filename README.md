# Thiệp cưới Minh & Lan — V3.2 (nâng cấp font số, điều hướng, album, video)

Trang HTML/CSS/JS thuần, deploy lên Cloudflare Pages bằng Direct Upload (không cần Node.js, database, VPS).

## Cài đặt và deploy

1. Giải nén ZIP. Upload toàn bộ thư mục có `index.html` vào Cloudflare > Workers & Pages > Create > Pages > Direct Upload.
2. Cập nhật `config.js`: tên, ngày đếm ngược, thông tin 4 buổi lễ/tiệc, **hai ngày khác nhau trong schedules**, địa chỉ, Google Maps, hai tài khoản ngân hàng.
3. Thay ảnh tại `assets/` bằng ảnh của bạn, giữ nguyên tên hoặc sửa đường dẫn trong `index.html`.
4. Preview thử trên điện thoại và kiểm tra thông tin trước khi gửi link.

## Kích thước ảnh và nơi thay

Các comment trong `index.html` ghi rõ kích thước/đường dẫn:

| Vị trí | File | Kích thước đề xuất |
|---|---|---|
| Hero slider | `hero-01.webp`, `hero-02.webp`, `hero-03.webp` | 1920 × 1000 px |
| Polaroid | `polaroid.webp` | 600 × 750 px |
| 5 mốc câu chuyện | `story-01.webp`…`story-05.webp` | 800 × 800 px |
| Video bìa | `video-poster.webp` | 1920 × 1080 px |
| Gallery | `gallery-01.webp`…`gallery-06.webp` | 1200 × 900 px; ảnh chính có thể dọc 1200 × 1400 |
| Mã QR hai bên | `qr-nha-gai.svg`, `qr-nha-trai.svg` hoặc đổi sang `.png` trong `config.js` | 700 × 700 px |
| Bản đồ minh họa | `map-gai.webp`, `map-trai.webp` | 900 × 360 px |

**Lưu ý:** Những mã QR, bản đồ minh họa và thông tin tài khoản trong gói là dữ liệu demo. QR demo **không dùng để nhận tiền**. Trước khi gửi website, thay QR bằng mã ngân hàng đã kiểm tra; nhập link chỉ đường Google Maps thật. Các ảnh minh họa cũng không phải ảnh của cặp đôi thật.

## Video

- MP4: chép `wedding-film.mp4` vào `assets/`, điền `video.src: 'assets/wedding-film.mp4'` trong `config.js`.
- YouTube: điền `video.youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/VIDEO_ID'`.
- Để trống: nút Play vẫn mở thông báo, không phát một video giả.

## Animation

- Hero slider fade + Ken Burns, nút chuyển và chấm chọn, có vuốt cảm ứng.
- Tim/cánh hoa rơi nhẹ; vô hiệu khi bật Reduce Motion.
- Story 5 mốc là đường SVG động, hoạt động trên desktop và chuyển thành progress dọc ở mobile, có nút phát lại.
- Gallery lightbox; modal video; nút copy số tài khoản chỉ hoạt động với số thật đã khai báo.

## Chi tiết bố cục theo mockup đã duyệt

- Hero là banner liền mạch với typography overlay và ảnh polaroid.
- 4 card thông tin lễ/tiệc tại cùng một hàng desktop.
- Chuyện chúng mình 5 ảnh tròn trên progress heart.
- Video và album cùng hàng.
- 2 lịch trình theo hai ngày độc lập đặt cạnh hai hộp mừng cưới.
- Cuối trang hai thẻ bản đồ gia đình và lời cảm ơn.

Nếu cần màu sắc/font: chỉnh biến CSS đầu file `styles.css`. Không nên dùng trực tiếp một ảnh mockup toàn trang làm background vì khi đó chữ không sửa được và layout không responsive.

## Cập nhật V3.1 — Phong bì Mừng cưới

- Chỉ thay section **Mừng cưới**: hai phong bì pastel nắp gập, thiệp thông tin ngân hàng, mã QR, hoa và hộp quà SVG riêng (giữ layout những phần khác).
- Kích thước QR thực đề xuất **700 × 700 px**, tỉ lệ vuông 1:1, không crop và không chèn hoa vào vùng mã. Tên file tùy ý; sửa `gifts.bride.qrImage`, `gifts.groom.qrImage` trong `config.js`.
- Tên ngân hàng và chủ tài khoản đang là **ví dụ** để dễ review UI; số tài khoản rỗng và QR mẫu **không dùng thanh toán**. Thay đủ 4 trường `bank`, `owner`, `account`, `qrImage` cho *cả hai bên* trước khi chia sẻ website.
- Nếu ảnh QR không phải SVG mẫu mặc định, đủ thông tin tài khoản của hai bên, website tự ẩn cảnh báo dữ liệu mẫu dưới phong bì.
- Nút số tài khoản sao chép số thật nếu có; không tự tạo số tài khoản hoặc mã QR.
- Hộp quà có thể đổi trong HTML: `assets/gift-box-pink.svg`, `assets/gift-box-champagne.svg` (SVG vector, không cần cắt ảnh).

- Tùy chọn logo ngân hàng thật: thêm file PNG/SVG biểu tượng nền trong **128 × 128 px**, đặt ví dụ `assets/logo-ngan-hang.png`, khai báo `gifts.bride.bankLogo` hoặc `gifts.groom.bankLogo` trong `config.js`. Nếu không có thì website hiển thị biểu tượng màu trang trí.


## Cập nhật V3.2 — Cải thiện trải nghiệm và hiệu ứng

**Các phần nội dung, bố cục và hai phong bì Mừng cưới của V3.1 được giữ nguyên.**

### 1. Font dành riêng cho số

- Dùng **Manrope** cho số đếm ngược, ngày cưới, mốc thời gian, giờ sự kiện, số tài khoản; các chữ Việt vẫn dùng bộ font như V3.1.
- Các chuỗi trộn chữ và số (ví dụ `Chủ Nhật, 14/11/2027`) được JS bọc **chỉ phần số** bằng `.beautiful-number`, tuyệt đối không sửa chữ gốc.
- Đổi font số tại đầu phần `V3.2` cuối `styles.css`: `--numeric` và các class `.count-grid b`, `.hero-date`, `.love-year`.
- Google Fonts được tải từ CDN; nếu người xem chặn kết nối fonts, trình duyệt dùng font hệ thống dự phòng.

### 2. Điều hướng đơn giản hơn

- Hero đổi sang icon SVG mũi tên nét mảnh, không còn nút tròn.
- Album luôn có mũi tên trái/phải cố định ở cạnh màn hình. Trên desktop dùng **phím ← / →**, trên điện thoại **vuốt trái/phải**, hoặc nhấn mũi tên. Nút **×** đóng, phím **Esc** cũng đóng được.
- Album xem toàn màn hình trên điện thoại, ảnh **không bị crop**, giữ nguyên tỉ lệ; có số thứ tự và chú thích ảnh.
- Tải trước ảnh kế bên bằng `Image.decode()` nhằm giảm nháy/giật; hiệu ứng đổi ảnh chạy nhẹ trên `transform + opacity`.

### 3. Video fullscreen

- Khi `video.src` chứa file MP4 hợp lệ, nút Play mở modal và **thử gọi fullscreen trên video** ngay trong thao tác click. Browser có thể từ chối fullscreen do hạn chế thiết bị hoặc quyền; khi đó video vẫn chạy ở khung trình chiếu lớn, có nút điều khiển và đóng.
- Ví dụ: `video: {src:'assets/wedding-film.mp4',youtubeEmbedUrl:'',poster:'assets/video-poster.webp'}`. Sao chép file MP4 vào đúng đường dẫn.
- Khi dùng YouTube, phải cung cấp **link embed** chứ không phải link `watch?v=`. Khung YouTube được phép fullscreen; người xem có thể sử dụng nút fullscreen của YouTube nếu trình duyệt không cho mở ngay.
- Để trống cả hai nguồn thì website chỉ hiển thị thông báo demo, không phát video giả.
- Video nên dùng MP4/H.264, 1920×1080 (16:9), tối ưu dung lượng để tải nhanh trên điện thoại. Video quá nặng không nên upload cùng HTML; cân nhắc dùng YouTube unlisted nếu muốn.

### 4. Animation khi cuộn

- Những section / ảnh album / thẻ sự kiện có fade-in + dịch nhẹ, xuất hiện tuần tự theo thứ tự.
- Tôn trọng cài đặt **Reduce Motion** của hệ điều hành để tránh gây khó chịu.

### Triển khai lên Cloudflare Pages

Upload **toàn bộ nội dung thư mục** (hoặc ZIP có `index.html` ở gốc) qua Direct Upload. Không cần build và không cần backend. Hãy thay ảnh, video, ngày giờ, tài khoản, QR và địa chỉ mẫu trước khi chia sẻ cho khách.
