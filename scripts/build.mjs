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
const SITE_ORIGIN = "https://akelmelamin.com";

const ROUTE_PATHS = {
  tr: {
    home: "/",
    products: "/urunler",
    references: "/referanslar",
    about: "/hakkimizda",
    contact: "/iletisim",
    catalog: "/katalog",
  },
  en: {
    home: "/en",
    products: "/en/products",
    references: "/en/references",
    about: "/en/about",
    contact: "/en/contact",
    catalog: "/en/catalog",
  },
};

const CATEGORY_SLUGS = {
  tr: {
    kare: "kare-seri",
    "kare-siyah": "kare-seri-siyah",
    international: "international-seri",
    masaustu: "masaustu-aksesuarlari",
    acikbufe: "acik-bufe-servis",
    elegant: "elegant-seri",
    kids: "cocuk-tabaklari",
    bolmeli: "bolmeli-tabaklar",
    tepsiler: "tepsiler",
    eco: "eco-seri",
    diplomat: "diplomat-kayik-seri",
    gunluk: "gunluk-desenli-seri",
  },
  en: {
    kare: "square-series",
    "kare-siyah": "square-series-black",
    international: "international-series",
    masaustu: "tabletop-accessories",
    acikbufe: "buffet-serving",
    elegant: "elegant-series",
    kids: "kids-plates",
    bolmeli: "compartment-plates",
    tepsiler: "trays",
    eco: "eco-series",
    diplomat: "diplomat-oval-serving-range",
    gunluk: "everyday-pattern-series",
  },
};

const STATIC_ROUTE_META = {
  home: {
    tr: {
      title: "Akel Melamin — Her Sofrada Kaliteye Yer Açın",
      description: "Akel Melamin, otel, restoran, kafe ve ev kullanımı için 12 ürün serisi sunan Türk melamin sofra eşyası üreticisidir.",
    },
    en: {
      title: "Akel Melamin — Melamine Tableware Manufacturer",
      description: "Akel Melamin manufactures food-contact-safe melamine tableware for hotels, restaurants, cafés and retail buyers across 12 product series.",
    },
  },
  products: {
    tr: {
      title: "Akel Melamin Ürünleri — 12 Melamin Ürün Serisi",
      description: "Kare Seri, Elegant, International, Eco, tepsiler, çocuk tabakları ve profesyonel servis ürünleri dahil Akel Melamin ürün kataloğunu inceleyin.",
    },
    en: {
      title: "Akel Melamin Products — 12 Melamine Product Series",
      description: "Browse Akel Melamin product series including Square, Elegant, International, Eco, trays, kids' plates and professional serving products.",
    },
  },
  catalog: {
    tr: {
      title: "Akel Melamin 2026 Katalog — PDF İndir",
      description: "Akel Melamin 2026 ürün kataloğunu PDF olarak indirin. 12 ürün serisi, ürün kodları, ölçüler ve kullanım bilgileri.",
    },
    en: {
      title: "Akel Melamin 2026 Catalog — Download PDF",
      description: "Download the Akel Melamin 2026 product catalog with 12 product series, SKU codes, dimensions and usage details.",
    },
  },
  references: {
    tr: {
      title: "Akel Melamin Referansları",
      description: "Akel Melamin ürünlerini tercih eden kurumsal projeler, işletmeler ve referans markalar.",
    },
    en: {
      title: "Akel Melamin References",
      description: "Corporate projects, venues and reference brands using Akel Melamin tableware products.",
    },
  },
  about: {
    tr: {
      title: "Akel Melamin Hakkında — Üretim ve Kalite",
      description: "2014 yılında kurulan Akel Melamin'in üretim tecrübesi, kalite yaklaşımı, kullanım alanları ve sertifikaları.",
    },
    en: {
      title: "About Akel Melamin — Manufacturing and Quality",
      description: "Learn about Akel Melamin's manufacturing background, quality approach, usage areas and certifications.",
    },
  },
  contact: {
    tr: {
      title: "Akel Melamin İletişim — Teklif ve Numune Talepleri",
      description: "Bayi, ihracat, özel logolu üretim, katalog, numune ve teklif talepleri için Akel Melamin ile iletişime geçin.",
    },
    en: {
      title: "Contact Akel Melamin — Quote and Sample Requests",
      description: "Contact Akel Melamin for distributor, export, custom-logo production, catalog, sample and quote requests.",
    },
  },
};

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

function absoluteUrl(urlPath) {
  const normalized = urlPath === "/" ? "/" : urlPath.replace(/\/+$/, "");
  return SITE_ORIGIN + normalized;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeJson(data) {
  return JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
}

function productSlug(p) {
  return p.foto_dosya_adi || String(p.sku || "").toLowerCase();
}

function productImage(p) {
  const base = p.sade_foto_dosya_adi || p.foto_dosya_adi;
  return base ? `${SITE_ORIGIN}/img/${base}.webp` : `${SITE_ORIGIN}/img/akel-hero-1.jpg`;
}

function categoryPath(key, lang) {
  const slug = CATEGORY_SLUGS[lang][key];
  return slug ? `${ROUTE_PATHS[lang].products}/${slug}` : ROUTE_PATHS[lang].products;
}

function productPath(p, lang) {
  return `${ROUTE_PATHS[lang].products}/${productSlug(p)}`;
}

function breadcrumbLd(items) {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": absoluteUrl(item.path),
    })),
  };
}

function baseStructuredData(page) {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE_ORIGIN}/#organization`,
      "name": "Akel Melamin",
      "legalName": "Akel Melamin Plastik San.Tic.Ltd.Şti.",
      "url": `${SITE_ORIGIN}/`,
      "logo": `${SITE_ORIGIN}/img/akel-logo-cropped.png`,
      "foundingDate": "2014",
      "sameAs": ["https://instagram.com/akelmelamin"],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+90-507-425-34-46",
          "contactType": "sales",
          "areaServed": "TR",
          "availableLanguage": ["tr", "en"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      "url": `${SITE_ORIGIN}/`,
      "name": "Akel Melamin",
      "publisher": { "@id": `${SITE_ORIGIN}/#organization` },
      "inLanguage": ["tr", "en"],
    },
    {
      "@type": page.type || "WebPage",
      "@id": `${absoluteUrl(page.path)}#webpage`,
      "url": absoluteUrl(page.path),
      "name": page.title,
      "description": page.description,
      "isPartOf": { "@id": `${SITE_ORIGIN}/#website` },
      "publisher": { "@id": `${SITE_ORIGIN}/#organization` },
      "inLanguage": page.lang,
    },
  ];
  if (page.breadcrumb) graph.push(breadcrumbLd(page.breadcrumb));
  if (page.extraLd) graph.push(...page.extraLd);
  return { "@context": "https://schema.org", "@graph": graph };
}

function applySeo(html, page) {
  const canonical = absoluteUrl(page.path);
  const alternateTags = [
    `<link rel="alternate" hreflang="tr" href="${escapeHtml(absoluteUrl(page.alternates.tr))}">`,
    `<link rel="alternate" hreflang="en" href="${escapeHtml(absoluteUrl(page.alternates.en))}">`,
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(absoluteUrl(page.alternates.tr))}">`,
  ].join("\n");
  const ogLocale = page.lang === "tr" ? "tr_TR" : "en_US";
  const ogAlternate = page.lang === "tr" ? "en_US" : "tr_TR";

  return html
    .replace(/<html lang="[^"]*"/, `<html lang="${page.lang}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(page.description)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${escapeHtml(canonical)}">`)
    .replace(/<link rel="alternate" hreflang="tr" href="[^"]*">\n<link rel="alternate" hreflang="en" href="[^"]*">\n<link rel="alternate" hreflang="x-default" href="[^"]*">/, alternateTags)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(page.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeHtml(page.description)}">`)
    .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${escapeHtml(page.image)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${escapeHtml(canonical)}">`)
    .replace(/<meta property="og:locale" content="[^"]*">/, `<meta property="og:locale" content="${ogLocale}">`)
    .replace(/<meta property="og:locale:alternate" content="[^"]*">/, `<meta property="og:locale:alternate" content="${ogAlternate}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeHtml(page.title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapeHtml(page.description)}">`)
    .replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${escapeHtml(page.image)}">`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${safeJson(baseStructuredData(page))}\n</script>`);
}

async function writeHtmlRoute(routePath, html) {
  const clean = routePath.replace(/^\/+|\/+$/g, "");
  const outFile = clean ? path.join(DIST, clean, "index.html") : path.join(DIST, "index.html");
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, html, "utf-8");
}

function buildPages(catalog) {
  const activeProducts = catalog.products.filter((p) => (p.aktif || "evet") !== "hayir");
  const usedCategoryKeys = new Set(activeProducts.map((p) => p.kategori));
  const categories = catalog.categories.filter((c) => usedCategoryKeys.has(c.key) && CATEGORY_SLUGS.tr[c.key] && CATEGORY_SLUGS.en[c.key]);
  const pages = [];

  for (const route of Object.keys(STATIC_ROUTE_META)) {
    for (const lang of ["tr", "en"]) {
      const pathName = ROUTE_PATHS[lang][route];
      pages.push({
        kind: route,
        lang,
        path: pathName,
        alternates: { tr: ROUTE_PATHS.tr[route], en: ROUTE_PATHS.en[route] },
        title: STATIC_ROUTE_META[route][lang].title,
        description: STATIC_ROUTE_META[route][lang].description,
        image: `${SITE_ORIGIN}/img/akel-hero-1.jpg`,
        type: route === "products" ? "CollectionPage" : "WebPage",
        priority: route === "home" ? "1.0" : route === "products" ? "0.9" : "0.7",
        breadcrumb: route === "home" ? null : [
          { name: lang === "tr" ? "Anasayfa" : "Home", path: ROUTE_PATHS[lang].home },
          { name: STATIC_ROUTE_META[route][lang].title.split(" — ")[0], path: pathName },
        ],
      });
    }
  }

  for (const c of categories) {
    for (const lang of ["tr", "en"]) {
      const label = c[lang];
      const pathName = categoryPath(c.key, lang);
      const title = lang === "tr"
        ? `${label} | Akel Melamin Ürünleri`
        : `${label} | Akel Melamin Products`;
      const description = lang === "tr"
        ? `${label} kategorisindeki Akel Melamin ürünlerini, ürün kodlarını, ölçüleri ve koli bilgilerini inceleyin.`
        : `Browse Akel Melamin ${label} products with SKU codes, dimensions and carton details.`;
      pages.push({
        kind: "category",
        lang,
        path: pathName,
        alternates: { tr: categoryPath(c.key, "tr"), en: categoryPath(c.key, "en") },
        title,
        description,
        image: `${SITE_ORIGIN}/img/lifestyle-${c.key}.webp`,
        type: "CollectionPage",
        priority: "0.75",
        breadcrumb: [
          { name: lang === "tr" ? "Anasayfa" : "Home", path: ROUTE_PATHS[lang].home },
          { name: lang === "tr" ? "Ürünler" : "Products", path: ROUTE_PATHS[lang].products },
          { name: label, path: pathName },
        ],
      });
    }
  }

  for (const p of activeProducts) {
    for (const lang of ["tr", "en"]) {
      const productName = lang === "tr" ? p.ad_tr : (p.ad_en || p.ad_tr);
      const category = catalog.categories.find((c) => c.key === p.kategori);
      const categoryLabel = category ? category[lang] : p.kategori;
      const pathName = productPath(p, lang);
      const description = (lang === "tr" ? p.aciklama_tr : p.aciklama_en) ||
        (lang === "tr"
          ? `${productName} için ölçü, SKU ve koli bilgilerini inceleyin.`
          : `Review dimensions, SKU and carton details for ${productName}.`);
      pages.push({
        kind: "product",
        lang,
        path: pathName,
        alternates: { tr: productPath(p, "tr"), en: productPath(p, "en") },
        title: `${productName}${p.sku ? ` ${p.sku}` : ""} | Akel Melamin`,
        description,
        image: productImage(p),
        type: "ItemPage",
        priority: "0.6",
        breadcrumb: [
          { name: lang === "tr" ? "Anasayfa" : "Home", path: ROUTE_PATHS[lang].home },
          { name: lang === "tr" ? "Ürünler" : "Products", path: ROUTE_PATHS[lang].products },
          { name: categoryLabel, path: categoryPath(p.kategori, lang) },
          { name: productName, path: pathName },
        ],
        extraLd: [
          {
            "@type": "Product",
            "@id": `${absoluteUrl(pathName)}#product`,
            "name": productName,
            "sku": String(p.sku || ""),
            "brand": { "@type": "Brand", "name": "Akel Melamin" },
            "category": categoryLabel,
            "description": description,
            "image": [productImage(p)],
            "url": absoluteUrl(pathName),
            "material": "Melamine",
            "additionalProperty": [
              p.boyut ? { "@type": "PropertyValue", "name": lang === "tr" ? "Boyut" : "Size", "value": p.boyut } : null,
              p.koli_adet ? { "@type": "PropertyValue", "name": lang === "tr" ? "Koli adedi" : "Carton quantity", "value": String(p.koli_adet) } : null,
              p.ozel_logolu_uygun ? { "@type": "PropertyValue", "name": lang === "tr" ? "Özel logolu uygunluk" : "Custom-logo suitability", "value": p.ozel_logolu_uygun } : null,
            ].filter(Boolean),
          },
        ],
      });
    }
  }

  return pages;
}

function sitemapXml(pages) {
  const entries = pages.map((page) => {
    const alternates = [
      `<xhtml:link rel="alternate" hreflang="tr" href="${escapeHtml(absoluteUrl(page.alternates.tr))}" />`,
      `<xhtml:link rel="alternate" hreflang="en" href="${escapeHtml(absoluteUrl(page.alternates.en))}" />`,
      `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeHtml(absoluteUrl(page.alternates.tr))}" />`,
    ].join("\n    ");
    return `  <url>
    <loc>${escapeHtml(absoluteUrl(page.path))}</loc>
    ${alternates}
    <priority>${page.priority}</priority>
  </url>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;
}

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

  // Root SEO files. sitemap.xml is generated below from the actual routes.
  for (const f of ["robots.txt"]) {
    try {
      await fs.copyFile(path.join(SRC_WEBSITE, f), path.join(DIST, f));
      console.log(`    · ${f}`);
    } catch {}
  }

  console.log("▸ read   index.html");
  const htmlPath = path.join(SRC_WEBSITE, "index.html");
  const html = await fs.readFile(htmlPath, "utf-8");
  const catalog = JSON.parse(await fs.readFile(path.join(SRC_WEBSITE, "data/products.json"), "utf-8"));

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

  console.log("▸ write    route HTML + sitemap");
  const newHtml = rewriteHtml(html, span, appFile);
  const pages = buildPages(catalog);
  for (const page of pages) {
    await writeHtmlRoute(page.path, applySeo(newHtml, page));
  }
  await fs.writeFile(path.join(DIST, "sitemap.xml"), sitemapXml(pages), "utf-8");
  console.log(`    · ${pages.length.toLocaleString()} route pages`);
  console.log("    · sitemap.xml");

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
