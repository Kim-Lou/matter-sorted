// 发布前自检：校验 content/notes 下每篇笔记是否符合 CONTENT_GUIDE.md 的契约
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const NOTES_DIR = path.join(process.cwd(), 'content', 'notes');
const VALID_LAYERS = ['感知层', '决策层', '执行层', '运营层'];
const REQUIRED_FIELDS = ['id', 'title', 'abstract', 'layer', 'date', 'updated', 'revision', 'cover'];
const ids = new Set();
const validDate = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;

let hasError = false;

function fail(where, msg) {
  hasError = true;
  console.error(`✗ [${where}] ${msg}`);
}

if (!fs.existsSync(NOTES_DIR)) {
  console.error(`找不到内容目录：${NOTES_DIR}`);
  process.exit(1);
}

const noteDirs = fs.readdirSync(NOTES_DIR).filter((d) =>
  fs.statSync(path.join(NOTES_DIR, d)).isDirectory()
);

for (const dir of noteDirs) {
  const notePath = path.join(NOTES_DIR, dir);
  const indexPath = path.join(notePath, 'index.mdx');

  if (!fs.existsSync(indexPath)) {
    fail(dir, '缺少 index.mdx');
    continue;
  }

  const raw = fs.readFileSync(indexPath, 'utf-8');
  const { data, content } = matter(raw);

  if (!/^\d{4}-(0[1-9]|1[0-2])-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(dir)) fail(dir, '目录须为 yyyy-mm-slug');
  if (data.id !== dir) fail(dir, 'id 必须等于稳定目录名，不随标题修订改变');
  if (ids.has(data.id)) fail(dir, '重复文章 id');
  ids.add(data.id);
  if (!validDate(data.date) || !validDate(data.updated)) fail(dir, 'date/updated 必须为有效的带引号 ISO 日期');
  if (validDate(data.date) && validDate(data.updated) && data.updated < data.date) fail(dir, 'updated 不能早于 date');
  if (!Number.isInteger(data.revision) || data.revision < 1) fail(dir, 'revision 必须为正整数');
  if ('slug' in data) fail(dir, '不允许 frontmatter 覆盖路由 slug');

  for (const file of fs.readdirSync(notePath).filter((f) => /^index\..+\.mdx$/.test(f))) {
    if (file !== 'index.en.mdx') { fail(dir, `不支持的译文文件 ${file}`); continue; }
    const translated = matter(fs.readFileSync(path.join(notePath, file), 'utf8'));
    for (const field of ['id', 'date', 'updated', 'revision', 'layer']) {
      if (translated.data[field] !== data[field]) fail(dir, `${file}: ${field} 必须与原文一致，修订时同步译文`);
    }
    for (const field of REQUIRED_FIELDS) if (!translated.data[field]) fail(dir, `${file}: 缺少 ${field}`);
    const refs = [...translated.content.matchAll(/!\[[^\]]*\]\(\.\/([^)]+)\)/g)].map((m) => m[1]);
    for (const ref of [translated.data.cover, translated.data.video, ...refs].filter(Boolean)) {
      if (!fs.existsSync(path.join(notePath, String(ref).replace(/^\.\//, '')))) fail(dir, `${file}: 素材不存在 ${ref}`);
    }
  }

  for (const field of REQUIRED_FIELDS) {
    if (!data[field] || String(data[field]).trim() === '') {
      fail(dir, `frontmatter 缺少必填字段: ${field}`);
    }
  }

  if (data.layer && !VALID_LAYERS.includes(data.layer)) {
    fail(dir, `layer 取值非法: "${data.layer}"，必须是 ${VALID_LAYERS.join(' / ')} 之一`);
  }

  if (data.cover) {
    const coverPath = path.join(notePath, data.cover.replace('./', ''));
    if (!fs.existsSync(coverPath)) {
      fail(dir, `cover 指向的文件不存在: ${data.cover}`);
    }
  }

  if (data.video) {
    const videoUrlPath = path.join(notePath, data.video.replace('./', ''));
    if (!fs.existsSync(videoUrlPath)) {
      fail(dir, `video 指向的文件不存在: ${data.video}`);
    }
  }

  // 校验正文里引用的图片都存在
  const imageRefs = [...content.matchAll(/!\[[^\]]*\]\(\.\/([^)]+)\)/g)].map((m) => m[1]);
  for (const img of imageRefs) {
    const imgPath = path.join(notePath, img);
    if (!fs.existsSync(imgPath)) {
      fail(dir, `正文引用的图片不存在: ${img}`);
    }
  }
}

if (hasError) {
  console.error(`\n发布检查未通过，共发现问题，已阻止构建。`);
  process.exit(1);
} else {
  console.log(`✓ 所有笔记（共 ${noteDirs.length} 篇）通过发布检查。`);
}
