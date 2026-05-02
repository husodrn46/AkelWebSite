from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent
SOURCE_DIR = Path("D:/AkelWebSite") / "\u0130MAJ FOTO\u011eRAFLAR"
THUMB_DIR = ROOT / "source-thumbs"
OUT_JS = ROOT / "source-images.js"
MAX_SIZE = (900, 900)


def safe_stem(path: Path) -> str:
    stem = re.sub(r"[^A-Za-z0-9._-]+", "-", path.stem).strip("-")
    digest = hashlib.sha1(str(path).encode("utf-8")).hexdigest()[:8]
    return f"{stem or 'image'}-{digest}"


def make_thumb(src: Path) -> tuple[str, int, int]:
    THUMB_DIR.mkdir(parents=True, exist_ok=True)
    out_name = safe_stem(src) + ".webp"
    out_path = THUMB_DIR / out_name

    with Image.open(src) as image:
      image = ImageOps.exif_transpose(image)
      image.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
      if image.mode not in ("RGB", "RGBA"):
          image = image.convert("RGB")
      image.save(out_path, "WEBP", quality=76, method=6)
      width, height = image.size

    return out_name, width, height


def main() -> int:
    if not SOURCE_DIR.exists():
        raise SystemExit(f"Source folder not found: {SOURCE_DIR}")

    images = []
    for src in sorted(SOURCE_DIR.iterdir(), key=lambda p: p.name.lower()):
        if not src.is_file() or src.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
            continue

        thumb_name, width, height = make_thumb(src)
        images.append(
            {
                "name": src.name,
                "stem": src.stem,
                "extension": src.suffix.lower(),
                "sizeBytes": src.stat().st_size,
                "sourcePath": str(src),
                "thumb": f"./source-thumbs/{thumb_name}",
                "thumbWidth": width,
                "thumbHeight": height,
            }
        )

    payload = {
        "sourceDir": str(SOURCE_DIR),
        "count": len(images),
        "images": images,
    }
    OUT_JS.write_text(
        "window.SOURCE_IMAGES = "
        + json.dumps(payload, ensure_ascii=True, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(f"{len(images)} source images synced -> {OUT_JS}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
