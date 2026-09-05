import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getNoteBySlug, getNoteSlugs } from '@/lib/notes';
import { getDictionary, LOCALES } from '@/i18n/dictionaries';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import Video from '@/components/Video';

export function generateStaticParams() {
  const slugs = getNoteSlugs();
  return LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export default async function NotePage({ params }) {
  const { locale, slug } = params;
  const t = getDictionary(locale);
  const { data, content, isTranslated } = getNoteBySlug(slug, locale);

  // 素材在 content/notes/<slug>/ 里用相对路径写（如 ./fig-01.png），
  // 构建时统一改写成 /notes/<slug>/... 的可访问 URL（对应 scripts/sync-media.js 的拷贝目标）
  const resolvedContent = content.replace(/\]\(\.\//g, `](/notes/${slug}/`);
  const resolvedCover = data.cover ? data.cover.replace('./', `/notes/${slug}/`) : null;

  const { content: mdxContent } = await compileMDX({
    source: resolvedContent,
    components: {
      Video: (props) => <Video {...props} notePath={slug} />,
    },
  });

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div className="site-header">
        <Link
          href={`/${locale}/`}
          style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}
        >
          ← {t.backToList}
        </Link>
        <LocaleSwitcher currentLocale={locale} path={`/notes/${slug}`} />
      </div>

      {!isTranslated && (
        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 13,
            color: 'var(--cool)',
            border: '1px solid var(--border)',
            padding: '8px 12px',
            marginBottom: 24,
          }}
        >
          {t.translationMissing}
        </p>
      )}

      <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 'clamp(26px, 4vw, 36px)', lineHeight: 1.2, margin: '0 0 12px 0' }}>
        {data.title}
      </h1>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>{data.date}</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: 'var(--warm)' }}>
          {data.layer} {data.band ? `· ${data.band}` : ''}
        </span>
      </div>

      {resolvedCover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolvedCover} alt="" style={{ width: '100%', display: 'block', marginBottom: 32, border: '1px solid var(--border)' }} />
      )}

      <div
        style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 16,
          lineHeight: 1.85,
          color: 'var(--text)',
        }}
      >
        {mdxContent}
      </div>
    </div>
  );
}
