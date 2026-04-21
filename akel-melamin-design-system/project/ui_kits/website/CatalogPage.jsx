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
