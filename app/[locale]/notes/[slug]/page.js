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

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const { data } = getNoteBySlug(slug, locale);
  return { title: `${data.title} | Matter Sorted`, description: data.abstract,
    openGraph: { type: 'article', title: data.title, description: data.abstract,
      publishedTime: data.date, modifiedTime: data.updated } };
}

export default async function NotePage({ params }) {
  const { locale, slug } = await params;
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
    <main className="article-container">
      <div className="article-nav">
        <Link
          href={`/${locale}/`}
        >
          {t.backToList}
        </Link>
        <LocaleSwitcher currentLocale={locale} path={`/notes/${slug}`} />
      </div>

      {!isTranslated && (
        <p className="translation-notice">
          {t.translationMissing}
        </p>
      )}

      <h1 className="article-title">
        {data.title}
      </h1>
      <div className="article-meta">
        <time dateTime={data.date}>{data.date}</time>
        {data.updated !== data.date && <span>{locale === 'en' ? 'Updated' : '更新'} <time dateTime={data.updated}>{data.updated}</time></span>}
        <span>v{data.revision}</span>
        <span style={{ color: `var(--layer-${data.layer})` }}>
          {data.layer} {data.band ? `· ${data.band}` : ''}
        </span>
      </div>

      <p className="article-intro">{data.abstract}</p>

      {resolvedCover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="article-cover" src={resolvedCover} alt="" />
      )}

      <div className="article-body">
        {mdxContent}
      </div>
    </main>
  );
}
