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
