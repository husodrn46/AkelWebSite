#!/usr/bin/env python3
"""
Extract product order from the 2026 catalog PDF and write scripts/catalog-order.json.

We rely on pdftotext's layout-preserving output plus a small amount of PDF-specific
disambiguation for:
1. Square Series Black pages where the printed codes omit the trailing "-S".
2. A few duplicated SKU values in the Excel data (for example 136 and 508).
"""
from __future__ import annotations

import datetime as dt
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PDF_PATH = ROOT / "akel-melamin-design-system" / "project" / "ui_kits" / "website" / "catalog" / "akel-2026.pdf"
PRODUCTS_JSON = ROOT / "akel-melamin-design-system" / "project" / "ui_kits" / "website" / "data" / "products.json"
OUT_PATH = ROOT / "scripts" / "catalog-order.json"

# Printed page ranges from the catalog TOC.
SECTION_RANGES = [
    ("kare", 6, 7),
    ("kare-siyah", 8, 9),
    ("international", 10, 15),
    ("masaustu", 16, 19),
    ("acikbufe", 20, 25),
    ("elegant", 26, 32),
    ("kids", 33, 33),
    ("bolmeli", 34, 35),
    ("tepsiler", 36, 41),
    ("eco", 42, 43),
    ("diplomat", 44, 44),
    ("gunluk", 45, 49),
    ("logolu", 50, 56),
]

TOKEN_RE = re.compile(r"[A-Z0-9]+(?:-[A-Z0-9]+)?")
STOP_WORDS = (
    "ÜRÜN ÖLÇÜSÜ",
    "PRODUCT SIZES",
    "KOLİ İÇİ ADET",
    "CARTON QTN",
    "KOLİ ÖLÇÜSÜ",
    "CARTON SIZE",
)


def section_for_page(page_number: int) -> str | None:
    for key, start, end in SECTION_RANGES:
        if start <= page_number <= end:
            return key
    return None


def load_products() -> list[dict]:
    if not PRODUCTS_JSON.exists():
        print(f"HATA: products.json bulunamadi: {PRODUCTS_JSON}")
        sys.exit(1)
    data = json.loads(PRODUCTS_JSON.read_text(encoding="utf-8"))
    return data["products"]


def extract_pages() -> list[str]:
    if not PDF_PATH.exists():
        print(f"HATA: katalog PDF bulunamadi: {PDF_PATH}")
        sys.exit(1)
    try:
        result = subprocess.run(
            ["pdftotext", "-layout", str(PDF_PATH), "-"],
            capture_output=True,
            text=True,
            check=True,
        )
    except FileNotFoundError:
        print("HATA: pdftotext bulunamadi. macOS icin: brew install poppler")
        sys.exit(1)
    except subprocess.CalledProcessError as exc:
        sys.stderr.write(exc.stderr or "")
        print("HATA: pdftotext katalogu parse edemedi.")
        sys.exit(1)
    return result.stdout.split("\f")


def normalized_barcode(product: dict) -> str | None:
    value = product.get("barkod")
    if not value:
        return None
    digits = re.sub(r"\D", "", str(value))
    return digits or None


def build_token_index(products: list[dict]) -> tuple[dict[str, list[dict]], dict[str, dict]]:
    by_token: dict[str, list[dict]] = {}
    by_photo: dict[str, dict] = {}

    for product in products:
        token = str(product["sku"]).upper()
        by_token.setdefault(token, []).append(product)
        by_photo[product["foto_dosya_adi"]] = product

    # Square Series Black is printed in the catalog without the "-S" suffix.
    for product in products:
        sku = str(product["sku"]).upper()
        if product.get("kategori") == "kare-siyah" and sku.endswith("-S"):
            alias = dict(product)
            alias["_alias"] = True
            by_token.setdefault(sku[:-2], []).append(alias)

    return by_token, by_photo


def resolve_by_barcode(candidates: list[dict], line: str) -> dict | None:
    line_digits = re.sub(r"\D", "", line)
    if not line_digits:
        return None

    hits = []
    for candidate in candidates:
        barcode = normalized_barcode(candidate)
        if barcode and barcode in line_digits:
            hits.append(candidate)

    if len(hits) == 1:
        return hits[0]
    return None


def choose_product(
    token: str,
    page_number: int,
    line: str,
    by_token: dict[str, list[dict]],
    by_photo: dict[str, dict],
) -> dict | None:
    section = section_for_page(page_number)
    candidates = by_token.get(token, [])
    if not candidates:
        return None

    if section == "kare-siyah":
        black = [candidate for candidate in candidates if candidate.get("kategori") == "kare-siyah"]
        if black:
            return black[0]

    if len(candidates) == 1:
        return candidates[0]

    exact = [candidate for candidate in candidates if not candidate.get("_alias")]

    barcode_hit = resolve_by_barcode(exact, line)
    if barcode_hit:
        return barcode_hit

    # Same SKU reused in two unrelated product families.
    if token == "508":
        if section == "kare":
            return by_photo["kare-508"]
        if section == "masaustu":
            return by_photo["masaustu-508"]

    # Same SKU reused with different barcodes and on different page ranges.
    if token == "136":
        if 20 <= page_number <= 25:
            return by_photo["elegant-136"]
        if 36 <= page_number <= 41:
            return by_photo["tepsiler-136"]

    if len(exact) == 1:
        return exact[0]

    return exact[0] if exact else candidates[0]


def build_order(products: list[dict], pages: list[str]) -> tuple[list[dict], list[dict]]:
    by_token, by_photo = build_token_index(products)
    ordered_hits: list[dict] = []
    seen_products: set[str] = set()

    def add_hit(page_number: int, line: str) -> bool:
        matched = False
        for token in TOKEN_RE.findall(line):
            product = choose_product(token, page_number, line, by_token, by_photo)
            if not product:
                continue
            matched = True
            product_key = product["foto_dosya_adi"]
            if product_key in seen_products:
                continue
            seen_products.add(product_key)
            ordered_hits.append(
                {
                    "page": page_number,
                    "section": section_for_page(page_number),
                    "token": token,
                    "sku": str(product["sku"]).upper(),
                    "product_key": product_key,
                }
            )
        return matched

    for page_number, page in enumerate(pages, start=1):
        lines = page.splitlines()
        for index, line in enumerate(lines):
            if "KOD CODE" not in line.upper():
                continue
            for next_index in range(index + 1, min(index + 5, len(lines))):
                candidate_line = lines[next_index].strip().upper()
                if not candidate_line:
                    continue
                if any(word in candidate_line for word in STOP_WORDS):
                    break
                if add_hit(page_number, candidate_line):
                    break

    # Some catalog pages print a single product as a standalone line without a
    # preceding "KOD CODE" header in the extracted text (for example 227).
    for page_number, page in enumerate(pages, start=1):
        for raw_line in page.splitlines():
            line = raw_line.strip().upper()
            if not line or "KOD CODE" in line:
                continue
            tokens = TOKEN_RE.findall(line)
            if not tokens:
                continue
            for token in tokens:
                product = choose_product(token, page_number, line, by_token, by_photo)
                if not product:
                    continue
                product_key = product["foto_dosya_adi"]
                if product_key in seen_products:
                    continue

                name_words = [
                    word
                    for word in re.findall(r"[A-Za-zÇĞİÖŞÜçğıöşü']+", product["ad_tr"])
                    if len(word) >= 4
                ]
                if name_words and not any(word.upper() in line for word in name_words):
                    continue

                seen_products.add(product_key)
                ordered_hits.append(
                    {
                        "page": page_number,
                        "section": section_for_page(page_number),
                        "token": token,
                        "sku": str(product["sku"]).upper(),
                        "product_key": product_key,
                    }
                )

    missing_products = [
        {
            "sku": str(product["sku"]).upper(),
            "product_key": product["foto_dosya_adi"],
        }
        for product in products
        if product["foto_dosya_adi"] not in seen_products
    ]
    return ordered_hits, missing_products


def write_catalog_order(ordered_hits: list[dict], missing_products: list[dict]) -> None:
    product_rank = {
        hit["product_key"]: rank
        for rank, hit in enumerate(ordered_hits, start=1)
    }

    sku_rank: dict[str, int] = {}
    for rank, hit in enumerate(ordered_hits, start=1):
        sku_rank.setdefault(hit["sku"], rank)

    payload = {
        "generated_at": dt.datetime.now().isoformat(timespec="seconds"),
        "source_pdf": str(PDF_PATH.relative_to(ROOT)),
        "product_rank": product_rank,
        "sku_rank": sku_rank,
        "missing_products": missing_products,
    }
    OUT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"✓ catalog-order.json yazildi -> {OUT_PATH}")
    print(f"  product_rank: {len(product_rank)}")
    print(f"  sku_rank:     {len(sku_rank)}")
    print(f"  missing:      {len(missing_products)}")
    if missing_products:
        preview = ", ".join(f"{item['sku']} ({item['product_key']})" for item in missing_products[:8])
        print(f"  sonda kalacaklar: {preview}")


def main() -> int:
    products = load_products()
    pages = extract_pages()
    ordered_hits, missing_products = build_order(products, pages)
    write_catalog_order(ordered_hits, missing_products)
    return 0


if __name__ == "__main__":
    sys.exit(main())
