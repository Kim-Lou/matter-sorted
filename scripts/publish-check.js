// 发布前自检：校验 content/notes 下每篇笔记是否符合 CONTENT_GUIDE.md 的契约
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const NOTES_DIR = path.join(process.cwd(), 'content', 'notes');
const VALID_LAYERS = ['感知层', '决策层', '执行层', '运营层'];
const REQUIRED_FIELDS = ['title', 'abstract', 'layer', 'date', 'cover'];

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
