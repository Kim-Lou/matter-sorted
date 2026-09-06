import Link from 'next/link';
import { getAllNotes } from '@/lib/notes';
import { getDictionary, LOCALES } from '@/i18n/dictionaries';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export function generateStaticParams() { return LOCALES.map((locale) => ({ locale })); }
export async function generateMetadata({ params }) { const { locale } = await params; const t = getDictionary(locale); return { title: t.siteTitle, description: t.heroDesc }; }

export default async function Home({ params }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const notes = getAllNotes(locale);
  return (
    <div className="site-shell">
      <header className="topbar">
        <Link className="brand" href={`/${locale}/`}><span className="brand-mark" aria-hidden="true" /><span>{t.siteTitle}</span></Link>
        <div className="topbar-nav"><a href="#notes">{t.layerStackHeading}</a><a href="#notes">{t.notesHeading}</a><LocaleSwitcher currentLocale={locale} path="" /></div>
      </header>
      <main className="editorial-container">
        <section className="list-intro"><h1>{t.layerStackHeading}</h1><p>{t.heroDesc}</p></section>
        <section id="notes" className="content-list-section">
          {notes.length === 0 && <p className="empty-notes">{t.emptyNotes}</p>}
          <div className="notes-list">{notes.map((note) => (
            <article className="note-row" key={note.slug}>
              <time dateTime={note.date}>{note.date}</time>
              <div className="note-row-content">
                <p className="note-taxonomy" style={{ color: `var(--layer-${note.layer})` }}>{note.layer}{note.band ? ` · ${note.band}` : ''}</p>
                <h3><Link href={`/${locale}/notes/${note.slug}/`}>{note.title}</Link></h3>
                <p className="note-abstract">{note.abstract}</p>
                <Link className="read-link" href={`/${locale}/notes/${note.slug}/`}>{locale === 'en' ? 'Read article' : '阅读全文'}</Link>
              </div>
            </article>
          ))}</div>
        </section>
      </main>
      <footer className="site-footer"><p>Sorted in Light · 光选之间</p><p>{locale === 'en' ? 'A personal research archive.' : '个人研究档案。'}</p></footer>
    </div>
  );
}
