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
