#!/usr/bin/env python3
"""
Akel Melamin dev server — static files with SPA fallback.

Python's http.server 404s on /ui_kits/website/urunler because that path
doesn't exist on disk. This wrapper catches 404s under the site prefix
and serves the root index.html so client-side routing can take over —
same behaviour wrangler.toml (not_found_handling = single-page-
application) gives us on Cloudflare.

Run:
    python3 scripts/dev-server.py
"""
from __future__ import annotations

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os
import sys

ROOT = Path(__file__).resolve().parent.parent
SITE_DIR = ROOT / "akel-melamin-design-system" / "project"
SITE_PREFIX = "/ui_kits/website"
INDEX_HTML = SITE_DIR / "ui_kits" / "website" / "index.html"
PORT = int(os.environ.get("PORT", "4600"))


class SPAHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:
        # Default resolution (relative to serve directory).
        resolved = super().translate_path(path)
        on_disk = Path(resolved)
        if on_disk.exists():
            return resolved
        # Only rewrite requests inside the site prefix — leave asset 404s alone.
        stripped = path.split("?", 1)[0].split("#", 1)[0]
        if stripped.startswith(SITE_PREFIX):
            # If the missing target looks like a static asset (has a file
            # extension), return as-is so the browser gets a real 404 —
            # otherwise fall back to the SPA entry point.
            name = stripped.rsplit("/", 1)[-1]
            if "." in name:
                return resolved
            return str(INDEX_HTML)
        return resolved


def main() -> int:
    if not INDEX_HTML.exists():
        print(f"HATA: index.html bulunamadı: {INDEX_HTML}", file=sys.stderr)
        return 1
    os.chdir(SITE_DIR)
    with ThreadingHTTPServer(("0.0.0.0", PORT), SPAHandler) as httpd:
        print(f"Dev server → http://localhost:{PORT}{SITE_PREFIX}/")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
    return 0


if __name__ == "__main__":
    sys.exit(main())
