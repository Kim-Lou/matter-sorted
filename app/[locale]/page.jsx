import Link from 'next/link';
import { getAllNotes } from '@/lib/notes';
import { getDictionary, LOCALES } from '@/i18n/dictionaries';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import LayerStack from '@/components/LayerStack';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export function generateMetadata({ params }) {
  const t = getDictionary(params.locale);
  return { title: t.siteTitle, description: t.heroDesc };
}

export default function Home({ params }) {
  const { locale } = params;
  const t = getDictionary(locale);
  const notes = getAllNotes(locale);

  return (
    <div>
      <div
        style={{
          height: 4,
          width: '100%',
          background:
            'linear-gradient(90deg, #3E7CA6 0%, #5B7A8C 25%, #8B7A6A 50%, #E8622C 100%)',
        }}
      />

      <header className="container" style={{ paddingTop: 56 }}>
        <div className="site-header">
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: 'var(--muted)' }}>
            {t.siteTitle}
          </span>
          <LocaleSwitcher currentLocale={locale} path="" />
        </div>

        <h1
          className="hero-title"
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 600,
            fontSize: 'clamp(28px, 5vw, 46px)',
            lineHeight: 1.15,
            margin: '0 0 24px 0',
            maxWidth: 620,
          }}
        >
          {t.heroTitle}
        </h1>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 16,
            lineHeight: 1.75,
            color: 'var(--muted)',
            maxWidth: 560,
          }}
        >
          {t.heroDesc}
        </p>
      </header>

      <section style={{ margin: '64px 0' }}>
        <div className="container" style={{ paddingBottom: 12 }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>
            {t.layerStackHeading}
          </span>
        </div>
        <LayerStack locale={locale} />
      </section>

      <section className="container" style={{ paddingBottom: 80 }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 22, margin: '0 0 20px 0' }}>
          {t.notesHeading}
        </h2>

        {notes.length === 0 && (
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: 'var(--muted)', fontSize: 14 }}>
            {t.emptyNotes}
          </p>
        )}

        {notes.map((n) => (
          <Link key={n.slug} href={`/${locale}/notes/${n.slug}/`} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ padding: '26px 0', borderBottom: '1px solid var(--border)' }}>
              <div className="note-item-head">
                <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 20, color: 'var(--text)', margin: 0 }}>
                  {n.title}
                </h3>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>
                  {n.date}
                </span>
              </div>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 8px 0', maxWidth: 640 }}>
                {n.abstract}
              </p>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: 'var(--warm)' }}>
                {n.layer} {n.band ? `· ${n.band}` : ''}
              </span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
