# Akel Melamin — marketing site

B2B pazarlama sitesi. Statik React uygulaması, **Cloudflare Pages** üzerinde yayında.

- **Ürün kaynağı:** `akel-urunler.xlsx` (Excel) → `dist/data/products.json`
- **Site kaynağı:** `akel-melamin-design-system/project/ui_kits/website/index.html`
- **Çıktı:** `dist/` (build ile üretilir, git'e commit'lenmez)
- **Hosting:** Cloudflare Pages, GitHub'dan otomatik deploy

---

## İlk kez açanlar

```bash
npm install                 # esbuild kur
npm run build               # dist/ üret
```

## Geliştirme (local)

```bash
npm run dev                 # python http.server 4600'te kaynağı serve eder (Babel standalone ile JSX çalıştırır)
# → http://localhost:4600/ui_kits/website/
```

## Ürünleri güncelleme

1. `akel-urunler.xlsx`'i aç, ürün satırlarını düzenle.
2. Güncellemek için:

```bash
npm run update              # Excel → products.json, sonra build
```

Veya adım adım:

```bash
npm run data                # sadece Excel → JSON
npm run build               # sadece build
```

## Deploy

Her `git push origin main`, Cloudflare Pages otomatik build alır:
- Build komutu:  `npm install && npm run build`
- Çıktı dizini:  `dist`

---

## Dizinler

```
test-akel/
├── akel-melamin-design-system/      ← tasarım bundle + site kaynağı
│   └── project/ui_kits/website/     ← index.html, styles.css, img/, data/…
├── scripts/
│   ├── build.mjs                    ← esbuild prod bundle
│   └── excel-to-products.py         ← Excel → JSON dönüştürücü
├── akel-urunler.xlsx                ← ürün verisi
├── dist/                            ← build çıktısı (git-ignore)
├── package.json
└── .gitignore
```

---

## Cloudflare Pages ayarları

Pages projesi oluştururken:

| Alan | Değer |
|---|---|
| Framework preset | **None** |
| Build command | `npm install && npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node version | `20` veya `22` (`NODE_VERSION=22` env) |

---

## İletişim

- **Web:** akelmelamin.com
- **E-posta:** info@akelmelamin.com
- **Adres:** İSTOÇ 10.Ada No:9/11, Bağcılar/İstanbul
