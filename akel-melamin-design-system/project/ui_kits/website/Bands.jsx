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
        title: '[XX,XXX] m² plant. One location.',
        body: 'Moulding, pressing, decoration, and QC all flow through a single line in our İkitelli OSB plant. Every batch is sampled before release.',
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
        body: 'Every product family, dimensions, carton info, and container loading in a single file. [XX] pages, [XX] MB.',
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
