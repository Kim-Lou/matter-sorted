import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const NOTES_DIR = path.join(process.cwd(), 'content', 'notes');

function noteFilePath(slug, locale) {
  // 中文是默认版本：index.mdx
  // 英文（或其他语言）版本：index.en.mdx，不存在则回退到默认版本
  if (locale && locale !== 'zh') {
    const localized = path.join(NOTES_DIR, slug, `index.${locale}.mdx`);
    if (fs.existsSync(localized)) return { filePath: localized, isTranslated: true };
  }
  return { filePath: path.join(NOTES_DIR, slug, 'index.mdx'), isTranslated: locale === 'zh' || !locale };
}

export function getNoteSlugs() {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs.readdirSync(NOTES_DIR).filter((d) =>
    fs.statSync(path.join(NOTES_DIR, d)).isDirectory()
  );
}

export function getAllNotes(locale = 'zh') {
  const slugs = getNoteSlugs();
  const notes = slugs.map((slug) => {
    const { filePath } = noteFilePath(slug, locale);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    return { ...data, slug };
  });
  return notes.sort((a, b) => new Date(b.date) - new Date(a.date) || a.slug.localeCompare(b.slug));
}

export function getNoteBySlug(slug, locale = 'zh') {
  const { filePath, isTranslated } = noteFilePath(slug, locale);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return { slug, data, content, isTranslated, notePath: slug };
}
