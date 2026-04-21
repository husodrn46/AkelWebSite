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
        matList: ['Made from melamine', '[CERT] certified', '[CERT] certified', 'Dishwasher safe', '[−XX°C to +XXX°C]'],
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
