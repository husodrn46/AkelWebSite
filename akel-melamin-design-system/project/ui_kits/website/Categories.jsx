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
