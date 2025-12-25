# Hành trình An toàn Giao thông 🚦

Trò chơi giáo dục về an toàn giao thông dành cho học sinh, giúp các em học hỏi kiến thức giao thông thông qua trải nghiệm game tương tác.

## Tính năng

- 🎮 **Gameplay hấp dẫn**: Điều khiển nhân vật tham gia giao thông, vượt qua chướng ngại vật
- 📚 **Kiến thức đa dạng**: 5 chủ đề về giao thông (Quy tắc, Biển báo, An toàn, Độ tuổi, Ưu tiên)
- 🎁 **Phần thưởng blind box**: Nhận quà sau mỗi câu trả lời đúng
- 👤 **Chọn nhân vật**: 3 nhân vật khác nhau để lựa chọn
- 🎨 **Giao diện đẹp mắt**: Đồ họa sinh động, phù hợp với lứa tuổi học sinh

## Cách chơi

1. Chọn nhân vật yêu thích
2. Chướng ngại vật sẽ di chuyển tới
3. Trả lời câu hỏi về giao thông
4. Trả lời đúng: +10 điểm, nhận blind box
5. Trả lời sai: -10 điểm, mất 1 mạng
6. Vượt qua 5 chướng ngại vật để chiến thắng!

## Chủ đề câu hỏi

- 📋 **Quy tắc Giao thông**: Các quy tắc cơ bản khi tham gia giao thông
- 🚸 **Biển báo**: Nhận biết và hiểu ý nghĩa các biển báo
- 🛡️ **An toàn**: Kỹ năng tự bảo vệ khi tham gia giao thông
- 👶 **Độ tuổi**: Quy định về độ tuổi điều khiển phương tiện
- 🚑 **Ưu tiên**: Hiểu về quyền ưu tiên trong giao thông

## Cài đặt và chạy

### Chạy trực tiếp

1. Clone repository:

```bash
git clone https://github.com/vtc0509/chi_atgt.git
cd chi_atgt
```

2. Mở file `index.htm` bằng trình duyệt web

### Chạy với server local

```bash
# Sử dụng Python
python -m http.server 8000

# Hoặc Node.js
npx http-server
```

Sau đó mở trình duyệt và truy cập `http://localhost:8000`

## Cấu trúc dự án

```
atgt_chi/
├── index.htm           # File HTML chính
├── styles.css          # File CSS cho giao diện
├── game.js            # Logic game
├── images/            # Thư mục chứa hình ảnh đã xử lý
├── images_raw/        # Thư mục chứa hình ảnh gốc
└── README.md          # File hướng dẫn
```

## Công nghệ sử dụng

- HTML5
- CSS3 (Animations, Flexbox, Grid)
- JavaScript (Vanilla JS)

## Tác giả

Dự án được phát triển với mục đích giáo dục, giúp học sinh nâng cao ý thức về an toàn giao thông.

## License

MIT License - Tự do sử dụng cho mục đích giáo dục.
