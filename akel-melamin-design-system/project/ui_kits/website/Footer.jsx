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
