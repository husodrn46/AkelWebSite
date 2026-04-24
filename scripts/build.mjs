// scripts/build.mjs
// Akel Melamin — production build
//
// 1) Reads the dev file:  akel-melamin-design-system/project/ui_kits/website/index.html
// 2) Extracts the inline <script type="text/babel">...</script> JSX block
// 3) Compiles it to plain JS with esbuild (JSX → JS, minified, production)
// 4) Emits dist/ with:
//      - index.html (swap Babel CDN → React production UMD + hashed app bundle)
//      - app.<hash>.js (compiled bundle)
//      - all static assets (img/, data/, catalog/, preview/, slides/)
//      - robots.txt, sitemap.xml, _headers, _redirects
// 5) dist/ is what Cloudflare Pages publishes.

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const SRC_WEBSITE = path.join(ROOT, "akel-melamin-design-system/project/ui_kits/website");
const SRC_PROJECT = path.join(ROOT, "akel-melamin-design-system/project");
const DIST = path.join(ROOT, "dist");

// Cloudflare-friendly cache headers per path pattern
const HEADERS = `# Cloudflare Pages _headers — long cache for assets, short for HTML
/*
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff

/img/*
  Cache-Control: public, max-age=31536000, immutable

/catalog/*
  Cache-Control: public, max-age=2592000

/data/*
  Cache-Control: public, max-age=60, must-revalidate

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/
  Cache-Control: public, max-age=300, must-revalidate
`;

const REDIRECTS = `# Cloudflare Pages _redirects
# Any legacy UI-kit deep link forwards to root
/ui_kits/website/*  /:splat  301
/akel-melamin-design-system/*  /  301
`;

async function rmrf(p) {
  await fs.rm(p, { recursive: true, force: true });
}

async function copyDir(src, dst) {
  await fs.mkdir(dst, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) await copyDir(s, d);
    else if (e.isFile()) await fs.copyFile(s, d);
  }
}

function extractInlineJSX(html) {
  // Matches: <script type="text/babel" ...> ... </script>   (the LAST one)
  const re = /<script[^>]*type=["']text\/babel["'][^>]*>([\s\S]*?)<\/script>/gi;
  let last = null, m;
  while ((m = re.exec(html)) !== null) last = m;
  if (!last) throw new Error("No <script type='text/babel'> block found in index.html");
  return { code: last[1], matchStart: last.index, matchEnd: last.index + last[0].length };
}

function rewriteHtml(html, jsxSpan, appFile) {
  // Replace the inline Babel script with a production script tag.
  // Also swap React dev builds → production UMD builds.
  // Also drop the Babel standalone script (no longer needed).
  const before = html.slice(0, jsxSpan.matchStart);
  const after = html.slice(jsxSpan.matchEnd);

  let out = before + `<script src="./${appFile}" defer></script>` + after;

  // Swap React dev UMDs → prod UMDs
  out = out
    .replace(
      /https:\/\/unpkg\.com\/react@18\.3\.1\/umd\/react\.development\.js/g,
      "https://unpkg.com/react@18.3.1/umd/react.production.min.js"
    )
    .replace(
      /https:\/\/unpkg\.com\/react-dom@18\.3\.1\/umd\/react-dom\.development\.js/g,
      "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"
    )
    // Drop integrity attrs since production UMD has different hash
    .replace(/\s*integrity="sha384-[^"]+"\s*crossorigin="anonymous"/g, "")
    // Remove Babel standalone script entirely
    .replace(/<script[^>]*@babel\/standalone[^>]*><\/script>\s*/g, "");

  return out;
}

async function main() {
  console.log("▸ clean  dist/");
  await rmrf(DIST);
  await fs.mkdir(DIST, { recursive: true });

  console.log("▸ copy   static assets  (img, data, catalog, preview, slides, assets)");
  const staticDirs = ["img", "data", "catalog"];
  for (const d of staticDirs) {
    const src = path.join(SRC_WEBSITE, d);
    try {
      await fs.access(src);
      await copyDir(src, path.join(DIST, d));
      console.log(`    · ${d}/`);
    } catch {
      // skip missing
    }
  }
  // Non-website assets (preview cards, slides, shared assets)
  const projectDirs = [
    { src: "preview",  dst: "preview"  },
    { src: "slides",   dst: "slides"   },
    { src: "assets",   dst: "assets"   },
  ];
  for (const { src, dst } of projectDirs) {
    const s = path.join(SRC_PROJECT, src);
    try {
      await fs.access(s);
      await copyDir(s, path.join(DIST, dst));
      console.log(`    · ${dst}/  (project)`);
    } catch {}
  }

  // Loose CSS files referenced from previews
  try {
    await fs.copyFile(
      path.join(SRC_PROJECT, "colors_and_type.css"),
      path.join(DIST, "colors_and_type.css")
    );
    console.log(`    · colors_and_type.css`);
  } catch {}

  // Root SEO files
  for (const f of ["robots.txt", "sitemap.xml"]) {
    try {
      await fs.copyFile(path.join(SRC_WEBSITE, f), path.join(DIST, f));
      console.log(`    · ${f}`);
    } catch {}
  }

  console.log("▸ read   index.html");
  const htmlPath = path.join(SRC_WEBSITE, "index.html");
  const html = await fs.readFile(htmlPath, "utf-8");

  console.log("▸ extract  inline JSX block");
  const span = extractInlineJSX(html);
  const jsxTmp = path.join(DIST, "_app.jsx");
  await fs.writeFile(jsxTmp, span.code, "utf-8");
  console.log(`    · ${span.code.length.toLocaleString()} chars`);

  console.log("▸ bundle   esbuild → app.js  (jsx → js, minified)");
  const tmpOut = path.join(DIST, "app.js");
  await build({
    entryPoints: [jsxTmp],
    bundle: false,           // single file, no imports to resolve
    outfile: tmpOut,
    loader: { ".jsx": "jsx" },
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    target: ["es2020"],
    minify: true,
    legalComments: "none",
    logLevel: "info",
  });
  await fs.rm(jsxTmp);

  // Content-hash the bundle so cache-busting is automatic on every deploy.
  const bundleBuf = await fs.readFile(tmpOut);
  const hash = crypto.createHash("sha256").update(bundleBuf).digest("hex").slice(0, 10);
  const appFile = `app.${hash}.js`;
  await fs.rename(tmpOut, path.join(DIST, appFile));

  console.log("▸ write    dist/index.html");
  const newHtml = rewriteHtml(html, span, appFile);
  await fs.writeFile(path.join(DIST, "index.html"), newHtml, "utf-8");

  console.log("▸ write    _headers, _redirects");
  await fs.writeFile(path.join(DIST, "_headers"),   HEADERS);
  await fs.writeFile(path.join(DIST, "_redirects"), REDIRECTS);

  console.log("▸ done     →  dist/");
  const stat = await fs.stat(path.join(DIST, appFile));
  console.log(`   ${appFile}    ${(stat.size/1024).toFixed(1)} KB (minified)`);
  const h = await fs.stat(path.join(DIST, "index.html"));
  console.log(`   index.html ${(h.size/1024).toFixed(1)} KB`);
}

main().catch((e) => { console.error(e); process.exit(1); });
