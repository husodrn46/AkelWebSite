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
