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
        lead: 'Akel Melamin is an established Turkish manufacturer of melamine tableware. We produce [XX]+ SKUs from a single plant and work with distributors in [XX] countries.',
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
