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
      title: 'Tableware, made to scale.',
      titleAccent: 'Every size.',
      body: 'A Turkish manufacturer of melamine tableware for retail chains and export distributors. [XX]+ SKUs. [XX] million pieces a year from a single plant.',
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
