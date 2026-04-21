
/* ====== Header.jsx ====== */
// Header.jsx — sticky site header with bilingual switcher
function Header({ lang, setLang, currentPath, navigate }) {
  const nav = {
    tr: [
      { label: 'Ürünler', path: 'products' },
      { label: 'Katalog', path: 'catalog' },
      { label: 'Hakkımızda', path: 'about' },
      { label: 'İletişim', path: 'contact' },
    ],
    en: [
      { label: 'Products', path: 'products' },
      { label: 'Catalog', path: 'catalog' },
      { label: 'About', path: 'about' },
      { label: 'Contact', path: 'contact' },
    ],
  }[lang];

  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.querySelector('.kit-scroll') || window;
    const onScroll = () => {
      const y = el === window ? window.scrollY : el.scrollTop;
      setScrolled(y > 8);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__inner">
        <a
          className="site-header__brand"
          href="#"
          onClick={(e) => { e.preventDefault(); navigate('home'); }}
        >
          <img src="./img/akel-logo-cropped.png" alt="Akel Melamin" />
        </a>
        <nav className="site-header__nav">
          {nav.map((item) => (
            <a
              key={item.path}
              href="#"
              className={currentPath === item.path ? 'is-active' : ''}
              onClick={(e) => { e.preventDefault(); navigate(item.path); }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="site-header__actions">
          <LangSwitch lang={lang} setLang={setLang} />
          <button
            className="btn btn--primary btn--sm"
            onClick={() => navigate('catalog')}
          >
            {lang === 'tr' ? 'Katalog' : 'Catalog'}
            <i data-lucide="download"></i>
          </button>
        </div>
      </div>
    </header>
  );
}

function LangSwitch({ lang, setLang }) {
  return (
    <div className="lang-switch" role="group" aria-label="Language">
      <button
        className={lang === 'tr' ? 'is-on' : ''}
        onClick={() => setLang('tr')}
      >TR</button>
      <span className="lang-switch__sep">·</span>
      <button
        className={lang === 'en' ? 'is-on' : ''}
        onClick={() => setLang('en')}
      >EN</button>
    </div>
  );
}

window.Header = Header;
window.LangSwitch = LangSwitch;


/* ====== Hero.jsx ====== */
// Hero.jsx — manufacturing-first hero with real product photo
function Hero({ lang, navigate }) {
  const copy = {
    tr: {
      eyebrow: 'İkitelli OSB · İstanbul · [YEAR]',
      title: 'Sofra için üretim.',
      titleAccent: 'Her boyutta.',
      body: 'Melamin sofra eşyalarında Türkiye\'nin yerleşik üreticisiyiz. Perakende zincirleri ve ihracat distribütörleri için [XX]+ kalem, yıllık [XX] milyon parça kapasite.',
      primary: 'Kataloğu indir',
      secondary: 'Fabrikayı gör',
      caption: 'Gözde · Beyaz set · nested 6 boy',
    },
    en: {
      eyebrow: 'İkitelli OSB · Istanbul · Since [YEAR]',
      title: 'Tableware, made at scale.',
      titleAccent: 'Every size.',
      body: 'A Turkish manufacturer of melamine tableware for retail chains and export distributors. [XX]+ SKUs and [XX] million pieces a year from a single facility.',
      primary: 'Download catalog',
      secondary: 'See the factory',
      caption: 'Gözde · White set · 6 nested sizes',
    },
  }[lang];

  return (
    <section className="hero" data-anim="hero">
      <div className="hero__text">
        <span className="eyebrow">{copy.eyebrow}</span>
        <h1 className="hero__title">
          {copy.title}<br />
          <span className="hero__title-accent">{copy.titleAccent}</span>
        </h1>
        <p className="hero__body">{copy.body}</p>
        <div className="hero__cta">
          <button className="btn btn--primary" onClick={() => navigate('catalog')}>
            {copy.primary} <i data-lucide="arrow-right"></i>
          </button>
          <button className="btn btn--link" onClick={() => navigate('about')}>
            {copy.secondary} →
          </button>
        </div>
      </div>
      <div className="hero__visual" aria-hidden="true">
        <img
          className="hero__photo"
          data-anim="hero-photo"
          src="./img/gozde-white.jpg"
          alt=""
          loading="eager"
        />
        <div className="hero__visual-caption">
          <span className="meta">{copy.caption}</span>
        </div>
      </div>
    </section>
  );
}

// StatsRow — own strip below hero, count-up on enter viewport
function StatsRow({ lang }) {
  // Numeric targets used by the count-up animation (data-count-to).
  // Text suffixes are rendered separately so the counter only animates the digits.
  const stats = {
    tr: [
      { to: 300, suffix: '+', small: 'ürün kalemi' },
      { to: 23,  suffix: '',  small: 'ihracat ülkesi' },
      { to: 4,   suffix: 'M', small: 'yıllık parça' },
      { to: 26,  suffix: '',  small: 'yıllık deneyim' },
    ],
    en: [
      { to: 300, suffix: '+', small: 'SKUs' },
      { to: 23,  suffix: '',  small: 'export markets' },
      { to: 4,   suffix: 'M', small: 'pieces/year' },
      { to: 26,  suffix: '',  small: 'years of production' },
    ],
  }[lang];

  return (
    <section className="stats-strip" data-anim="stats-strip">
      <div className="stats-strip__inner">
        {stats.map((s, i) => (
          <div className="stats-strip__item" key={i}>
            <div className="stats-strip__big">
              <span className="stats-strip__num" data-count-to={s.to}>0</span>
              <span className="stats-strip__suffix">{s.suffix}</span>
            </div>
            <div className="stats-strip__small">{s.small}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

window.Hero = Hero;
window.StatsRow = StatsRow;


/* ====== Categories.jsx ====== */
// Categories.jsx — product families grid
function Categories({ lang, navigate }) {
  // Product families are the actual Akel lines. Round vs square is the
  // primary plate-shape split; the rest are category aggregations.
  const cats = {
    tr: [
      { key: 'gozde',  label: 'Gözde — yuvarlak',  count: '[XX] model', shape: 'round', photo: 'gozde-white' },
      { key: 'kavi',   label: 'Kavi — kare',       count: '[XX] model', shape: 'square', photo: 'kavi-white' },
      { key: 'bowls',  label: 'Kaseler',           count: '[XX] model', shape: 'bowls' },
      { key: 'trays',  label: 'Tepsiler',          count: '[XX] model', shape: 'trays' },
      { key: 'serve',  label: 'Servis ürünleri',   count: '[XX] model', shape: 'serve' },
      { key: 'kids',   label: 'Çocuk serisi',      count: '[XX] model', shape: 'kids' },
      { key: 'deco',   label: 'Dekoratif seri',    count: '[XX] model', shape: 'deco' },
    ],
    en: [
      { key: 'gozde',  label: 'Gözde — round',     count: '[XX] SKUs', shape: 'round', photo: 'gozde-white' },
      { key: 'kavi',   label: 'Kavi — square',     count: '[XX] SKUs', shape: 'square', photo: 'kavi-white' },
      { key: 'bowls',  label: 'Bowls',             count: '[XX] SKUs', shape: 'bowls' },
      { key: 'trays',  label: 'Serving trays',     count: '[XX] SKUs', shape: 'trays' },
      { key: 'serve',  label: 'Serving pieces',    count: '[XX] SKUs', shape: 'serve' },
      { key: 'kids',   label: 'Kids\' Plates',     count: '[XX] SKUs', shape: 'kids' },
      { key: 'deco',   label: 'Decorative range',  count: '[XX] SKUs', shape: 'deco' },
    ],
  }[lang];
  const t = lang === 'tr'
    ? { eyebrow: 'Kategoriler', heading: 'Yedi ürün ailesi. Tek fabrika.', cta: 'Tümünü gör' }
    : { eyebrow: 'Categories',  heading: 'Seven product families. One plant.', cta: 'View all' };

  return (
    <section className="section" data-anim="section">
      <div className="section__head">
        <div>
          <span className="eyebrow" data-anim="fade-up">{t.eyebrow}</span>
          <h2 className="section__title" data-anim="fade-up" data-anim-delay="60">{t.heading}</h2>
        </div>
        <button className="btn btn--link" onClick={() => navigate('products')} data-anim="fade-up" data-anim-delay="120">
          {t.cta} →
        </button>
      </div>
      <div className="cat-grid" data-anim-stagger>
        {cats.map((c, i) => (
          <button
            key={c.key}
            className={`cat-card cat-card--${c.key}`}
            onClick={() => navigate('products')}
            data-anim="stagger-item"
          >
            <div className="cat-card__ph" aria-hidden="true">
              {c.photo
                ? <img className="cat-card__photo" src={`./img/${c.photo}.jpg`} alt="" loading="lazy" />
                : <div className={`cat-shape cat-shape--${c.shape}`}></div>}
            </div>
            <div className="cat-card__foot">
              <span className="cat-card__label">{c.label}</span>
              <span className="cat-card__count">{c.count}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

window.Categories = Categories;


/* ====== Bands.jsx ====== */
// Bands.jsx — editorial dark band + catalog CTA band
function ProductionBand({ lang, navigate }) {
  const t = lang === 'tr'
    ? {
        eyebrow: 'Üretim',
        title: '[XX,XXX] m² fabrika. Tek lokasyon.',
        body: 'İkitelli OSB\'deki tesisimizde presleme, kalıplama, dekor ve kalite kontrol tek bir üretim akışında ilerliyor. Her ürün hattı parti bazında örneklenir.',
        items: [
          { k: 'Fabrika alanı',   v: '[XX,XXX] m²' },
          { k: 'Üretim hatları',  v: '[XX] hat' },
          { k: 'Günlük kapasite', v: '[XX,XXX] parça' },
          { k: 'Sertifikasyon',   v: '[CERT] · [CERT] · [CERT]' },
        ],
        cta: 'Fabrika hakkında',
      }
    : {
        eyebrow: 'Production',
        title: '[XX,XXX] m² plant. One facility.',
        body: 'Moulding, pressing, decoration and quality control run through a single production flow at our İkitelli OSB facility. Every batch is sampled before release.',
        items: [
          { k: 'Plant floor',       v: '[XX,XXX] m²' },
          { k: 'Production lines',  v: '[XX]' },
          { k: 'Daily capacity',    v: '[XX,XXX] pcs' },
          { k: 'Certifications',    v: '[CERT] · [CERT] · [CERT]' },
        ],
        cta: 'About the factory',
      };

  return (
    <section className="section section--band" data-anim="section">
      <div className="band">
        <div className="band__copy">
          <span className="eyebrow" data-anim="fade-up">{t.eyebrow}</span>
          <h2 className="band__title" data-anim="fade-up" data-anim-delay="60">{t.title}</h2>
          <p className="band__body" data-anim="fade-up" data-anim-delay="120">{t.body}</p>
          <button className="btn btn--ghost" onClick={() => navigate('about')} data-anim="fade-up" data-anim-delay="180">
            {t.cta} →
          </button>
        </div>
        <div className="band__facts" data-anim-stagger>
          {t.items.map((i, k) => (
            <div className="fact" key={k} data-anim="stagger-item">
              <span className="fact__k">{i.k}</span>
              <span className="fact__v">{i.v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CatalogBand({ lang, navigate }) {
  const t = lang === 'tr'
    ? {
        eyebrow: 'Katalog · [YYYY]',
        title: '[XX]+ kalem. Tek PDF.',
        body: 'Tüm ürün aileleri, ebatlar, koli bilgileri ve konteyner yükleme kapasiteleri tek dosyada. [XX] sayfa, [XX] MB.',
        primary: 'Kataloğu indir',
        note: 'PDF · [XX] MB · TR & EN',
      }
    : {
        eyebrow: 'Catalog · [YYYY]',
        title: '[XX]+ SKUs. One PDF.',
        body: 'Every product family, dimensions, carton details and container loading data in a single file. [XX] pages, [XX] MB.',
        primary: 'Download catalog',
        note: 'PDF · [XX] MB · TR & EN',
      };

  return (
    <section className="section" data-anim="section">
      <div className="catalog-band" data-anim="fade-up">
        <div>
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 className="catalog-band__title">{t.title}</h2>
          <p className="catalog-band__body">{t.body}</p>
        </div>
        <div className="catalog-band__right">
          <button className="btn btn--primary btn--lg magnetic" onClick={() => navigate('catalog')}>
            <i data-lucide="download"></i> {t.primary}
          </button>
          <span className="catalog-band__note meta">{t.note}</span>
        </div>
      </div>
    </section>
  );
}

window.ProductionBand = ProductionBand;
window.CatalogBand = CatalogBand;


/* ====== ProductGrid.jsx ====== */
// ProductGrid.jsx — category listing with real Gözde/Kavi lines + variant swatch
function ProductGrid({ lang, navigate, openProduct }) {
  const [active, setActive] = React.useState('all');
  // Per-product variant (white|black). Default white.
  const [variants, setVariants] = React.useState({});

  const filters = {
    tr: [
      { k: 'all', l: 'Tümü' },
      { k: 'gozde', l: 'Gözde' },
      { k: 'kavi', l: 'Kavi' },
      { k: 'bowls', l: 'Kaseler' },
      { k: 'trays', l: 'Tepsiler' },
      { k: 'kids', l: 'Çocuk' },
    ],
    en: [
      { k: 'all', l: 'All' },
      { k: 'gozde', l: 'Gözde' },
      { k: 'kavi', l: 'Kavi' },
      { k: 'bowls', l: 'Bowls' },
      { k: 'trays', l: 'Trays' },
      { k: 'kids', l: 'Kids' },
    ],
  }[lang];

  // Products. `photo` is a base name under /assets/products/<photo>-<variant>.jpg
  // when `variants: true`; otherwise the CSS shape fallback is drawn.
  const products = [
    { id: 'p01', cat: 'gozde',  tr: 'Gözde nested set — [XX] boy',  en: 'Gözde nested set — [XX] sizes',  spec: '[XX pcs] · [Ø XX–XX cm] · [40\'HC X,XXX]', photo: 'gozde', variants: true },
    { id: 'p02', cat: 'kavi',   tr: 'Kavi nested set — [XX] boy',   en: 'Kavi nested set — [XX] sizes',   spec: '[XX pcs] · [XX–XX cm kare] · [40\'HC X,XXX]', photo: 'kavi', variants: true },
    { id: 'p03', cat: 'gozde',  tr: 'Gözde servis tabağı',          en: 'Gözde service plate',            spec: '[Ø XX cm] · [XXX g] · [40\'HC X,XXX]', photo: 'gozde', variants: true },
    { id: 'p04', cat: 'kavi',   tr: 'Kavi servis tabağı',           en: 'Kavi service plate',             spec: '[XX × XX cm] · [XXX g] · [40\'HC X,XXX]', photo: 'kavi', variants: true },
    { id: 'p05', cat: 'bowls',  tr: '[Ürün adı 05]',                en: '[Product name 05]',              spec: '[Ø XX cm] · [XXX g] · [40\'HC X,XXX]' },
    { id: 'p06', cat: 'bowls',  tr: '[Ürün adı 06]',                en: '[Product name 06]',              spec: '[Ø XX cm] · [XXX g] · [40\'HC X,XXX]' },
    { id: 'p07', cat: 'trays',  tr: '[Ürün adı 07]',                en: '[Product name 07]',              spec: '[XX × XX cm] · [XXX g] · [40\'HC X,XXX]' },
    { id: 'p08', cat: 'kids',   tr: '[Ürün adı 08]',                en: '[Product name 08]',              spec: '[XX pcs] · [Ø XX cm] · [40\'HC X,XXX]' },
    { id: 'p09', cat: 'trays',  tr: '[Ürün adı 09]',                en: '[Product name 09]',              spec: '[Ø XX cm] · [XXX g] · [40\'HC X,XXX]' },
  ];
  const shown = active === 'all' ? products : products.filter(p => p.cat === active);

  const t = lang === 'tr'
    ? { title: 'Tüm ürünler', count: (n) => `${n} ürün` }
    : { title: 'All products', count: (n) => `${n} products` };

  const variantFor = (p) => variants[p.id] || 'white';
  const setVariantFor = (e, id, v) => {
    e.stopPropagation();
    setVariants(prev => ({ ...prev, [id]: v }));
  };

  return (
    <section className="section" data-anim="section">
      <div className="section__head">
        <div>
          <span className="eyebrow" data-anim="fade-up">{lang === 'tr' ? 'Katalog' : 'Catalog'}</span>
          <h2 className="section__title" data-anim="fade-up" data-anim-delay="60">{t.title}</h2>
        </div>
        <span className="meta">{t.count(shown.length)}</span>
      </div>

      <div className="filter-row" data-anim="fade-up">
        {filters.map(f => (
          <button
            key={f.k}
            className={`chip ${active === f.k ? 'is-on' : ''}`}
            onClick={() => setActive(f.k)}
          >{f.l}</button>
        ))}
      </div>

      <div className="product-grid" data-anim-stagger>
        {shown.map((p, i) => {
          const v = variantFor(p);
          const passedProduct = { ...p, _variant: v };
          return (
            <div
              key={p.id}
              className="product-card"
              data-anim="stagger-item"
              onClick={() => openProduct(passedProduct)}
              role="button"
              tabIndex="0"
            >
              <div className={`product-card__ph product-card__ph--${i % 4}`} aria-hidden="true">
                {p.photo
                  ? <img
                      className="product-card__photo"
                      src={`./img/${p.photo}-${v}.jpg`}
                      alt=""
                      loading="lazy"
                    />
                  : <div className={`plate plate--${p.cat}`}></div>}
              </div>
              <div className="product-card__body">
                <div className="product-card__meta">
                  <span className="product-card__eyebrow">{p.cat.toUpperCase()}</span>
                  {p.variants && (
                    <div className="product-card__variants" onClick={(e) => e.stopPropagation()}>
                      <button
                        className={`variant-dot variant-dot--white ${v === 'white' ? 'is-on' : ''}`}
                        aria-label="White"
                        onClick={(e) => setVariantFor(e, p.id, 'white')}
                      ></button>
                      <button
                        className={`variant-dot variant-dot--black ${v === 'black' ? 'is-on' : ''}`}
                        aria-label="Black"
                        onClick={(e) => setVariantFor(e, p.id, 'black')}
                      ></button>
                    </div>
                  )}
                </div>
                <span className="product-card__name">{p[lang]}</span>
                <span className="product-card__spec">{p.spec}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

window.ProductGrid = ProductGrid;


/* ====== ProductDetail.jsx ====== */
// ProductDetail.jsx — B2B-oriented single product view, real photos when available
function ProductDetail({ lang, product, onBack }) {
  const initialVariant = product._variant || 'white';
  const [variant, setVariant] = React.useState(initialVariant);
  React.useEffect(() => { setVariant(product._variant || 'white'); }, [product.id]);

  const t = lang === 'tr'
    ? {
        back: '← Ürünlere dön',
        request: 'Numune talep et',
        specs: 'Teknik özellikler',
        pack: 'Ambalaj ve lojistik',
        materials: 'Malzeme ve sertifikalar',
        matList: ['Melaminden üretilmiştir', '[CERT] sertifikalı', '[CERT] sertifikalı', 'Bulaşık makinesi uyumlu', '[−XX°C / +XXX°C]'],
        images: 'Stüdyo referans görseli',
        finish: 'Finiş',
      }
    : {
        back: '← Back to products',
        request: 'Request samples',
        specs: 'Technical specs',
        pack: 'Packaging & logistics',
        materials: 'Material & certifications',
        matList: ['Made from melamine', '[CERT] certified', '[CERT] certified', 'Dishwasher-safe', '[−XX°C to +XXX°C]'],
        images: 'Studio reference image',
        finish: 'Finish',
      };

  const rows = [
    [lang === 'tr' ? 'Boyutlar' : 'Dimensions', product.spec.split('·')[1]?.trim() || '[Spec]'],
    [lang === 'tr' ? 'Ağırlık' : 'Weight',     product.spec.split('·')[2]?.trim() || '[XXX g]'],
    [lang === 'tr' ? 'SKU' : 'SKU',            '[SKU-' + product.id.toUpperCase() + ']'],
    [lang === 'tr' ? 'Finiş' : 'Finish',       variant === 'white' ? (lang === 'tr' ? 'Beyaz' : 'White') : (lang === 'tr' ? 'Siyah' : 'Black')],
  ];
  const pack = [
    [lang === 'tr' ? 'Kolide adet' : 'Pieces per carton',       '[XX]'],
    [lang === 'tr' ? 'Koli boyutu' : 'Carton dimensions',       '[XX × XX × XX cm]'],
    [lang === 'tr' ? 'Koli brüt' : 'Carton gross',              '[X.X kg]'],
    [lang === 'tr' ? '40\' HC konteyner' : 'Pieces per 40\'HC', product.spec.split('40\'HC')[1]?.trim() || '[X,XXX]'],
    ['HS code', '[XXXX.XX.XX]'],
  ];

  const photoSrc = product.photo
    ? `./img/${product.photo}-${variant}.jpg`
    : null;

  const thumbs = product.photo
    ? [
        { k: 'white', src: `./img/${product.photo}-white.jpg` },
        { k: 'black', src: `./img/${product.photo}-black.jpg` },
      ]
    : [];

  return (
    <section className="section" data-anim="section">
      <button className="btn btn--link" onClick={onBack}>{t.back}</button>

      <div className="pd">
        <div className="pd__gallery" data-anim="fade-up">
          <div className="pd__hero" aria-hidden="true">
            {photoSrc
              ? <img className="pd__photo" src={photoSrc} alt="" />
              : <div className={`plate plate--${product.cat} plate--xl`}></div>}
            <span className="pd__caption meta">{t.images}</span>
          </div>
          {thumbs.length > 0 ? (
            <div className="pd__thumbs">
              {thumbs.map((th) => (
                <button
                  key={th.k}
                  className={`pd__thumb pd__thumb--photo ${variant === th.k ? 'is-on' : ''}`}
                  onClick={() => setVariant(th.k)}
                  aria-label={th.k}
                >
                  <img src={th.src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          ) : (
            <div className="pd__thumbs">
              {[0,1,2,3].map(i => (
                <div key={i} className={`pd__thumb pd__thumb--${i}`} aria-hidden="true"></div>
              ))}
            </div>
          )}
        </div>

        <div className="pd__info" data-anim="fade-up" data-anim-delay="80">
          <span className="eyebrow">{product.cat.toUpperCase()}</span>
          <h1 className="pd__title">{product[lang]}</h1>
          <p className="pd__spec lead">{product.spec}</p>

          {product.variants ? (
            <div className="pd__colors">
              <span className="meta">{t.finish}</span>
              <div className="pd__swatches">
                <button
                  className={`swatch swatch--btn ${variant === 'white' ? 'is-on' : ''}`}
                  style={{ background: '#F7F6F3' }}
                  aria-label="White"
                  onClick={() => setVariant('white')}
                />
                <button
                  className={`swatch swatch--btn ${variant === 'black' ? 'is-on' : ''}`}
                  style={{ background: '#111110' }}
                  aria-label="Black"
                  onClick={() => setVariant('black')}
                />
              </div>
            </div>
          ) : (
            <div className="pd__colors">
              <span className="meta">{lang === 'tr' ? 'Renkler' : 'Colors'}</span>
              <div className="pd__swatches">
                {['#F7F6F3','#2A2A28','#B8472A','#2C4A3E','#1A365D','#B8721F'].map(c => (
                  <span key={c} className="swatch" style={{ background: c, borderColor: c === '#F7F6F3' ? 'var(--border)' : c }}></span>
                ))}
              </div>
            </div>
          )}

          <div className="pd__cta">
            <button className="btn btn--primary btn--lg magnetic">{t.request} →</button>
          </div>

          <SpecBlock title={t.specs} rows={rows} />
          <SpecBlock title={t.pack} rows={pack} />
          <div className="pd__mat">
            <span className="meta">{t.materials}</span>
            <ul className="pd__matlist">
              {t.matList.map((m, i) => (
                <li key={i}><i data-lucide="check"></i> {m}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecBlock({ title, rows }) {
  return (
    <div className="spec-block">
      <span className="meta">{title}</span>
      <table className="spec-table">
        <tbody>
          {rows.map(([k, v], i) => (
            <tr key={i}><td className="k">{k}</td><td className="v">{v}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

window.ProductDetail = ProductDetail;
window.SpecBlock = SpecBlock;


/* ====== About.jsx ====== */
// About.jsx — factory / capacity / markets page
function About({ lang }) {
  const t = lang === 'tr'
    ? {
        eyebrow: 'Hakkımızda',
        title: '[YEAR]\'den beri İkitelli OSB\'de üretim.',
        lead: 'Akel Melamin, Türkiye\'nin yerleşik melamin sofra eşyası üreticilerinden biridir. [XX]\'in üzerinde ürün kalemini tek lokasyonda üretiyoruz ve [XX] ülkede distribütörlerle çalışıyoruz.',
        facts: [
          { k: 'Kuruluş',           v: '[YEAR]' },
          { k: 'Tesis alanı',        v: '[XX.XXX] m²' },
          { k: 'Üretim hatları',     v: '[XX] hat' },
          { k: 'Günlük kapasite',    v: '[XX.XXX] parça' },
          { k: 'Yıllık üretim',      v: '~[XX] milyon parça' },
          { k: 'İhracat ülkesi',     v: '[XX]' },
        ],
        marketsTitle: 'Hizmet verdiğimiz pazarlar',
        markets: [
          { r: '[Bölge 1]', c: ['[Ülke]', '[Ülke]', '[Ülke]', '[Ülke]'] },
          { r: '[Bölge 2]', c: ['[Ülke]', '[Ülke]', '[Ülke]', '[Ülke]'] },
          { r: '[Bölge 3]', c: ['[Ülke]', '[Ülke]', '[Ülke]', '[Ülke]'] },
          { r: '[Bölge 4]', c: ['[Ülke]', '[Ülke]', '[Ülke]'] },
        ],
        certTitle: 'Sertifikasyon',
        certBody: 'Tüm hammaddeler ve mamul ürünler gıda teması sertifikalarına sahiptir. Fabrika [ISO XXXX:XXXX] sertifikalıdır.',
      }
    : {
        eyebrow: 'About',
        title: 'Manufacturing in İkitelli OSB since [YEAR].',
        lead: 'Akel Melamin is an established Turkish manufacturer of melamine tableware. We produce [XX]+ SKUs in a single facility and work with distributors across [XX] countries.',
        facts: [
          { k: 'Founded',             v: '[YEAR]' },
          { k: 'Plant floor',         v: '[XX,XXX] m²' },
          { k: 'Production lines',    v: '[XX]' },
          { k: 'Daily capacity',      v: '[XX,XXX] pcs' },
          { k: 'Annual output',       v: '~[XX] million pcs' },
          { k: 'Export markets',      v: '[XX]' },
        ],
        marketsTitle: 'Markets we serve',
        markets: [
          { r: '[Region 1]', c: ['[Country]', '[Country]', '[Country]', '[Country]'] },
          { r: '[Region 2]', c: ['[Country]', '[Country]', '[Country]', '[Country]'] },
          { r: '[Region 3]', c: ['[Country]', '[Country]', '[Country]', '[Country]'] },
          { r: '[Region 4]', c: ['[Country]', '[Country]', '[Country]'] },
        ],
        certTitle: 'Certifications',
        certBody: 'All raw materials and finished products carry food-contact certifications. The plant is [ISO XXXX:XXXX] certified.',
      };

  return (
    <section className="section" data-anim="section">
      <div className="about__head">
        <span className="eyebrow" data-anim="fade-up">{t.eyebrow}</span>
        <h1 className="about__title" data-anim="fade-up" data-anim-delay="60">{t.title}</h1>
        <p className="about__lead lead" data-anim="fade-up" data-anim-delay="120">{t.lead}</p>
      </div>

      <div className="about__facts" data-anim-stagger>
        {t.facts.map((f, i) => (
          <div className="about__fact" key={i} data-anim="stagger-item">
            <span className="about__fact-v">{f.v}</span>
            <span className="about__fact-k">{f.k}</span>
          </div>
        ))}
      </div>

      <div className="about__markets">
        <h2 className="h2" data-anim="fade-up">{t.marketsTitle}</h2>
        <div className="about__market-grid" data-anim-stagger>
          {t.markets.map((m, i) => (
            <div key={i} className="market" data-anim="stagger-item">
              <span className="meta">{m.r}</span>
              <ul>{m.c.map((x, j) => <li key={j}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>

      <div className="about__cert" data-anim="fade-up">
        <div>
          <span className="eyebrow">{t.certTitle}</span>
          <p className="about__cert-body">{t.certBody}</p>
        </div>
        <div className="about__cert-grid" data-anim-stagger>
          {['[CERT]','[CERT]','[CERT]','[CERT]'].map((c, i) => (
            <div key={i} className="cert-chip" data-anim="stagger-item">{c}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.About = About;


/* ====== Contact.jsx ====== */
// Contact.jsx — export inquiry form
function Contact({ lang }) {
  const [submitted, setSubmitted] = React.useState(false);

  const t = lang === 'tr'
    ? {
        eyebrow: 'İhracat talebi',
        title: 'Distribütörlükleri değerlendiriyoruz.',
        lead: 'Aşağıdaki formu doldurun, ihracat ekibimiz iki iş günü içinde size döner. Numune talepleri karşılanır.',
        f: {
          name: 'Ad soyad', company: 'Şirket', email: 'E-posta', phone: 'Telefon',
          country: 'Ülke', volume: 'Tahmini yıllık hacim (adet)',
          incoterms: 'Incoterms', interest: 'İlgilenilen ürün grupları',
          msg: 'Mesaj', submit: 'Talep gönder',
        },
        cats: ['Yemek takımları', 'Tepsiler', 'Kaseler', 'Tabaklar', 'Çocuk', 'Dekoratif'],
        direct: 'Doğrudan iletişim', dir: [
          { i: 'mail', l: 'info@akelmelamin.com' },
          { i: 'phone', l: '+90 507 425 34 46' },
          { i: 'map-pin', l: 'İSTOÇ 10. Ada No:9/11, Bağcılar / İstanbul' },
          { i: 'instagram', l: '@akelmelamin' },
        ],
        sent: 'Talebiniz alındı.',
        sentBody: 'İhracat ekibimiz iki iş günü içinde size geri dönecek.',
      }
    : {
        eyebrow: 'Contact',
        title: 'Get in touch.',
        lead: 'Fill in the form below for distributor, export or sample requests. Our team replies within two business days.',
        f: {
          name: 'Full name', company: 'Company', email: 'Email', phone: 'Phone',
          country: 'Country', volume: 'Estimated annual volume (pcs)',
          incoterms: 'Incoterms', interest: 'Product families of interest',
          msg: 'Message', submit: 'Send inquiry',
        },
        cats: ['Square Series', 'International Series', 'Elegant Series', 'Eco Series', 'Trays', 'Kids\' Plates', 'Compartment Plates', 'Custom Logo Products'],
        direct: 'Direct contact', dir: [
          { i: 'mail', l: 'info@akelmelamin.com' },
          { i: 'phone', l: '+90 507 425 34 46' },
          { i: 'map-pin', l: 'İSTOÇ 10. Ada No:9/11, Bağcılar / Istanbul' },
          { i: 'instagram', l: '@akelmelamin' },
        ],
        sent: 'Your inquiry has been received.',
        sentBody: 'Our team will reply within two business days.',
      };

  // Replace with the real list of target export markets.
  const countries = ['[Country 1]','[Country 2]','[Country 3]','[Country 4]','[Country 5]','Türkiye','Other'];
  const incos = ['EXW [City]','FOB [Port]','FOB [Port]','CIF (port of entry)','DDP'];

  if (submitted) {
    return (
      <section className="section">
        <div className="sent">
          <i data-lucide="check-circle"></i>
          <h2 className="h2">{t.sent}</h2>
          <p className="lead">{t.sentBody}</p>
          <button className="btn btn--ghost" onClick={() => setSubmitted(false)}>
            {lang === 'tr' ? 'Yeni bir talep' : 'New inquiry'} →
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section" data-anim="section">
      <div className="contact">
        <div className="contact__intro" data-anim="fade-up">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1 className="contact__title">{t.title}</h1>
          <p className="lead">{t.lead}</p>

          <div className="contact__direct">
            <span className="meta">{t.direct}</span>
            <ul>
              {t.dir.map((d, i) => (
                <li key={i}><i data-lucide={d.i}></i> {d.l}</li>
              ))}
            </ul>
          </div>
        </div>

        <form className="contact__form" data-anim="fade-up" data-anim-delay="100" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <div className="grid-2">
            <Field label={t.f.name}><input className="input" required /></Field>
            <Field label={t.f.company}><input className="input" required /></Field>
            <Field label={t.f.email}><input className="input" type="email" required /></Field>
            <Field label={t.f.phone}><input className="input" /></Field>
            <Field label={t.f.country}>
              <select className="select" required>
                <option value="">—</option>
                {countries.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label={t.f.volume}>
              <input className="input" placeholder="e.g. 50,000" />
            </Field>
            <Field label={t.f.incoterms}>
              <select className="select">
                <option value="">—</option>
                {incos.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label={t.f.interest}>
              <div className="checks">
                {t.cats.map(c => (
                  <label key={c} className="check">
                    <input type="checkbox" /> <span>{c}</span>
                  </label>
                ))}
              </div>
            </Field>
          </div>
          <Field label={t.f.msg}>
            <textarea className="input" rows="4"></textarea>
          </Field>
          <button type="submit" className="btn btn--primary btn--lg magnetic">
            {t.f.submit} →
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span className="field__lbl">{label}</span>
      {children}
    </label>
  );
}

window.Contact = Contact;
window.Field = Field;


/* ====== CatalogPage.jsx ====== */
// CatalogPage.jsx — PDF download with soft email-gate
function CatalogPage({ lang }) {
  const [gated, setGated] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [downloaded, setDownloaded] = React.useState(false);

  const t = lang === 'tr'
    ? { eyebrow: 'Katalog · [YEAR]',
        title: '[XX]+ ürün. Tek PDF.',
        lead: 'Tüm kategoriler, ebatlar, koli bilgileri ve 40\' HC konteyner yükleme kapasiteleri. [XX] sayfa, [XX] MB.',
        gate: 'E-posta ile bildirim al (opsiyonel)',
        gateNote: 'E-postanı paylaşırsan yeni baskılarda seni haberdar ederiz. Zorunlu değil.',
        skip: 'Atla, sadece indir',
        submit: 'Kataloğu indir',
        downloaded: 'İndiriliyor...',
        what: 'Katalogda neler var',
        rows: [
          'Tüm ürün aileleri ve kodları',
          'Her ürün için ebat, ağırlık, renk seçenekleri',
          'Koli içeriği ve koli boyutları',
          '20\' DC ve 40\' HC konteyner yükleme kapasiteleri',
          'Gıda güvenliği ve sertifikasyon bilgileri',
        ],
      }
    : { eyebrow: 'Catalog · [YEAR]',
        title: '[XX]+ products. One PDF.',
        lead: 'Product series, dimensions, carton details and container loading data in one file. [XX] pages, [XX] MB.',
        gate: 'Email for new edition notifications (optional)',
        gateNote: 'If you share your email, we\'ll let you know when a new edition is available. Not required.',
        skip: 'Skip, just download',
        submit: 'Download catalog',
        downloaded: 'Downloading...',
        what: 'What\'s in the catalog',
        rows: [
          'All product families with SKU codes',
          'Dimensions, weights and color options for each item',
          'Carton contents and carton dimensions',
          'Loading capacities for 20\' DC and 40\' HC containers',
          'Food-safety and certification information',
        ],
      };

  function trigger() {
    setGated(false);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  }

  return (
    <section className="section" data-anim="section">
      <div className="catalog-page">
        <div className="catalog-page__hero" data-anim="fade-up">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1 className="catalog-page__title">{t.title}</h1>
          <p className="lead">{t.lead}</p>

          <div className="catalog-page__action">
            {gated ? (
              <form onSubmit={(e) => { e.preventDefault(); trigger(); }} className="catalog-gate">
                <label className="field">
                  <span className="field__lbl">{t.gate}</span>
                  <input
                    className="input"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="field__hint">{t.gateNote}</span>
                </label>
                <div className="catalog-gate__row">
                  <button type="submit" className="btn btn--primary btn--lg magnetic">
                    <i data-lucide="download"></i> {t.submit}
                  </button>
                  <button type="button" className="btn btn--link" onClick={trigger}>
                    {t.skip} →
                  </button>
                </div>
              </form>
            ) : (
              <div className="catalog-downloaded">
                <i data-lucide="check-circle"></i>
                <span>{downloaded ? t.downloaded : (lang === 'tr' ? 'İndirildi.' : 'Downloaded.')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="catalog-page__cover" data-anim="fade-up" data-anim-delay="120">
          <div className="catalog-cover">
            <div className="catalog-cover__band">
              <span className="catalog-cover__year">[YEAR]</span>
              <span className="catalog-cover__label">CATALOG · KATALOG</span>
            </div>
            <img className="catalog-cover__logo" src="./img/akel-logo-cropped.png" alt="" />
            <div className="catalog-cover__foot">
              <span className="meta">[XX] pp · EN · TR</span>
            </div>
          </div>
        </div>
      </div>

      <div className="catalog-contents" data-anim="fade-up">
        <span className="eyebrow">{t.what}</span>
        <ul data-anim-stagger>
          {t.rows.map((r, i) => (
            <li key={i} data-anim="stagger-item"><span className="catalog-contents__n">{String(i+1).padStart(2,'0')}</span> {r}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

window.CatalogPage = CatalogPage;


/* ====== Footer.jsx ====== */
// Footer.jsx
function Footer({ lang, navigate }) {
  const t = lang === 'tr'
    ? {
        tag: 'Melamin sofra eşyaları üretimi. [YEAR]\'den beri [CITY], Türkiye.',
        cols: [
          { h: 'Ürünler', links: [['Yemek takımları','products'],['Tepsiler','products'],['Kaseler','products'],['Tabaklar','products'],['Çocuk','products'],['Dekoratif','products']] },
          { h: 'Şirket',  links: [['Hakkımızda','about'],['Fabrika','about'],['İhracat','contact'],['Sertifikasyon','about']] },
          { h: 'Kaynaklar', links: [['Katalog PDF','catalog'],['İletişim','contact']] },
        ],
        legal: '© [YEAR] Akel Melamin. Tüm hakları saklıdır.',
      }
    : {
        tag: 'Akel Melamin. Melamine tableware made in Türkiye. Based in Istanbul since [YEAR].',
        cols: [
          { h: 'Products', links: [['Square Series','products'],['International Series','products'],['Elegant Series','products'],['Eco Series','products'],['Trays','products'],['Kids\' Plates','products'],['Compartment Plates','products'],['Custom Logo Products','products']] },
          { h: 'Company',  links: [['About','about'],['Manufacturing & Quality','about'],['Contact','contact'],['Certifications','about']] },
          { h: 'Resources', links: [['Catalog PDF','catalog'],['Contact','contact']] },
        ],
        legal: '© [YEAR] Akel Melamin. All rights reserved.',
      };

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <img src="./img/akel-logo-cropped.png" alt="Akel Melamin" />
          <p className="site-footer__tag">{t.tag}</p>
        </div>
        {t.cols.map((c, i) => (
          <div className="site-footer__col" key={i}>
            <span className="meta">{c.h}</span>
            <ul>
              {c.links.map(([label, path]) => (
                <li key={label}>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate(path); }}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="site-footer__bottom">
        <span className="meta">{t.legal}</span>
        <div className="site-footer__certs">
          <span className="cert-chip cert-chip--sm">[CERT]</span>
          <span className="cert-chip cert-chip--sm">[CERT]</span>
          <span className="cert-chip cert-chip--sm">[CERT]</span>
          <span className="cert-chip cert-chip--sm">[CERT]</span>
        </div>
      </div>
    </footer>
  );
}

window.Footer = Footer;


/* ====== App.jsx ====== */
function App() {
  const [lang, setLang] = React.useState(() => localStorage.getItem('akel-lang') || 'tr');
  const [path, setPath] = React.useState(() => localStorage.getItem('akel-path') || 'home');
  const [product, setProduct] = React.useState(null);
  React.useEffect(() => { localStorage.setItem('akel-lang', lang); document.documentElement.lang = lang; }, [lang]);
  React.useEffect(() => { localStorage.setItem('akel-path', path); }, [path]);
  const navigate = (p) => { setPath(p); setProduct(null); requestAnimationFrame(() => { const s = document.querySelector('.kit-scroll'); if (s) s.scrollTop = 0; }); };
  const openProduct = (p) => { setProduct(p); setPath('product'); requestAnimationFrame(() => { const s = document.querySelector('.kit-scroll'); if (s) s.scrollTop = 0; }); };
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
    if (window.__akelAnimations) window.__akelAnimations.init(document);
  }, [path, lang, product]);
  return (
    <div className="kit-scroll" data-screen-label={`Akel · ${path}`}>
      <Header lang={lang} setLang={setLang} currentPath={path} navigate={navigate} />
      {path === 'home' && <>
        <Hero lang={lang} navigate={navigate} />
        <StatsRow lang={lang} />
        <Categories lang={lang} navigate={navigate} />
        <ProductionBand lang={lang} navigate={navigate} />
        <CatalogBand lang={lang} navigate={navigate} />
      </>}
      {path === 'products' && <ProductGrid lang={lang} navigate={navigate} openProduct={openProduct} />}
      {path === 'product' && product && <ProductDetail lang={lang} product={product} onBack={() => setPath('products')} />}
      {path === 'about' && <About lang={lang} navigate={navigate} />}
      {path === 'contact' && <Contact lang={lang} />}
      {path === 'catalog' && <CatalogPage lang={lang} navigate={navigate} />}
      <Footer lang={lang} navigate={navigate} />
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
