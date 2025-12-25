import os
from pathlib import Path

from rembg import remove
from PIL import Image


"""
Script tách nền hàng loạt cho ảnh trong thư mục.

Cách dùng:
1. Cài thư viện:
   pip install rembg pillow

2. Chuẩn bị thư mục:
   - Đặt ảnh gốc (chưa tách nền) vào thư mục "images_raw" cùng cấp file này
     hoặc sửa lại biến INPUT_DIR bên dưới cho đúng.

3. Chạy script:
   python image_background_removal.py

4. Ảnh kết quả:
   - Sẽ được lưu vào thư mục "images_clean" dưới dạng PNG nền trong suốt.
   - Sau đó bạn có thể copy / đổi tên sang thư mục "images" đang dùng cho game
     (ví dụ: nhan_vat_1.png, obstacle_1.png, phu1.png, ...).
"""

INPUT_DIR = Path("images_raw")      # thư mục chứa ảnh gốc (chưa xóa phông)
OUTPUT_DIR = Path("images")         # thư mục lưu ảnh đã tách nền, dùng trực tiếp trong game


def process_image(input_path: Path, output_path: Path) -> None:
    """Tách nền một ảnh đơn và lưu ra PNG nền trong suốt."""
    with Image.open(input_path).convert("RGBA") as img:
        result = remove(img)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        result.save(output_path, "PNG")


def main() -> None:
    if not INPUT_DIR.exists():
        print(f"[WARN] Input folder does not exist: {INPUT_DIR.resolve()}")
        print("Create this folder and put original images in it, then run again.")
        return

    exts = {".jpg", ".jpeg", ".png", ".webp"}
    files = [f for f in INPUT_DIR.iterdir() if f.is_file() and f.suffix.lower() in exts]

    if not files:
        print(f"[INFO] No images found in {INPUT_DIR.resolve()}")
        return

    print(f"[INFO] Found {len(files)} images. Start background removal...")
    for file in files:
        out_name = file.stem + ".png"
        out_path = OUTPUT_DIR / out_name
        # Skip if output already exists (already processed)
        if out_path.exists():
            print(f"  - SKIP (exists): {out_name}")
            continue

        print(f"  - PROCESS: {file.name} -> {out_name}")
        try:
            process_image(file, out_path)
        except Exception as e:
            print(f"    ERROR while processing {file.name}: {e}")

    print("[DONE] Background removal finished. Output folder (used by game):", OUTPUT_DIR.resolve())


if __name__ == "__main__":
    main()


