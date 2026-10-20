/*
 * CẤU HÌNH THIỆP CƯỚI — ĐIỀN THÔNG TIN THẬT TRƯỚC KHI CHIA SẺ.
 * Không cần sửa HTML/CSS/JS để đổi tên, ngày, địa chỉ, video, lịch trình, ngân hàng.
 * Tất cả số liệu dưới đây chỉ là VÍ DỤ, không phải thông tin đám cưới thực tế.
 */
window.WEDDING_CONFIG = {
  groomName: 'Minh',
  brideName: 'Lan',
  weddingDate: '2027-11-15T08:00:00+07:00', // Ngày đếm ngược, múi giờ Việt Nam
  dateDisplay: '15 . 11 . 2027',
  weddingTitle: 'Minh & Lan | Our Wedding',

  // CÁC LỄ VÀ TIỆC HAI BÊN: tách ngày độc lập; ngày ví dụ 14 và 15/11/2027.
  events: {
    brideCeremony: { date: 'Chủ Nhật, 14/11/2027', time: '09:00 – 10:00', address: 'Tư gia nhà gái · [Cập nhật địa chỉ]' },
    groomCeremony: { date: 'Thứ Hai, 15/11/2027', time: '09:00 – 10:00', address: 'Tư gia nhà trai · [Cập nhật địa chỉ]' },
    brideParty: { date: 'Chủ Nhật, 14/11/2027', time: '11:00 – 13:00', address: 'Tiệc nhà gái · [Cập nhật địa chỉ]' },
    groomParty: { date: 'Thứ Hai, 15/11/2027', time: '11:30 – 13:30', address: 'Tiệc nhà trai · [Cập nhật địa chỉ]' }
  },

  // LỊCH TRÌNH HAI NGÀY — muốn thêm sự kiện: thêm một object {time, title, detail, icon}.
  // icon có thể dùng: '♡', '✿', '♧', '✧', '⌖', '♫' (ký tự đơn giản, không cần thư viện icon).
  schedules: {
    bride: {
      date: 'Chủ Nhật · 14.11.2027',
      items: [
        { time: '08:30', title: 'Đón khách', detail: 'Tại tư gia nhà gái', icon: '✿' },
        { time: '09:00', title: 'Nghi lễ gia đình', detail: 'Khoảnh khắc thân thương', icon: '♡' },
        { time: '10:00', title: 'Chụp ảnh lưu niệm', detail: 'Cùng người thân, bạn bè', icon: '✧' },
        { time: '11:00', title: 'Tiệc cưới', detail: 'Chung vui tại nhà gái', icon: '♧' }
      ]
    },
    groom: {
      date: 'Thứ Hai · 15.11.2027',
      items: [
        { time: '08:30', title: 'Đón khách', detail: 'Tại tư gia nhà trai', icon: '✿' },
        { time: '09:00', title: 'Lễ Thành Hôn', detail: 'Hai gia đình chung vui', icon: '♡' },
        { time: '10:00', title: 'Chụp ảnh lưu niệm', detail: 'Lưu giữ ngày hạnh phúc', icon: '✧' },
        { time: '11:30', title: 'Tiệc cưới', detail: 'Chung vui tại nhà trai', icon: '♧' }
      ]
    }
  },

  // VIDEO CƯỚI: Nếu có MP4, chép vào assets/wedding-film.mp4 rồi điền src.
  // Nếu dùng YouTube, điền URL nhúng dạng https://www.youtube-nocookie.com/embed/VIDEO_ID .
  // Để cả hai trống, website hiển thị poster và một thông báo lịch sự khi nhấn xem.
  video: {
    src: '', // ví dụ: 'assets/wedding-film.mp4' hoặc URL MP4
    youtubeEmbedUrl: '', // ví dụ: 'https://www.youtube-nocookie.com/embed/AbCdEfGh123'
    poster: 'assets/video-poster.webp' // ảnh 16:9, khuyên dùng 1920×1080 px
  },

  locations: {
    bride: { address: '[Cập nhật địa điểm tổ chức tiệc nhà gái]', mapUrl: '' },
    groom: { address: '[Cập nhật địa điểm tổ chức tiệc nhà trai]', mapUrl: '' }
  },

  // KHÔNG dùng QR mẫu để giao dịch; hãy thay bằng ảnh QR thật đã kiểm tra.
  gifts: {
    bride: { bank: '', owner: '', account: '', qrImage: 'assets/qr-nha-gai.svg' },
    groom: { bank: '', owner: '', account: '', qrImage: 'assets/qr-nha-trai.svg' }
  },

  sliderInterval: 6500, // milliseconds, 0 = tắt autoplay
  loveStoryDuration: 8500, // ms: tổng thời gian trái tim di chuyển qua các cột mốc
  fallingHearts: true
};
