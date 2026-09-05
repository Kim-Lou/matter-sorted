// content/notes/<slug>/*.{png,jpg,jpeg,webp,gif} → public/notes/<slug>/*
// 这样正文里用相对路径 ./fig-01.png 写图片引用，构建时能落地成真实可访问的静态资源，
// 而 content/ 目录本身依然保持"纯内容"，不需要作者关心 public/ 的存在。
import fs from 'node:fs';
import path from 'node:path';

const NOTES_DIR = path.join(process.cwd(), 'content', 'notes');
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'notes');
const MEDIA_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

if (!fs.existsSync(NOTES_DIR)) process.exit(0);

const slugs = fs.readdirSync(NOTES_DIR).filter((d) => fs.statSync(path.join(NOTES_DIR, d)).isDirectory());

for (const slug of slugs) {
  const srcDir = path.join(NOTES_DIR, slug);
  const destDir = path.join(PUBLIC_DIR, slug);
  fs.mkdirSync(destDir, { recursive: true });

  for (const file of fs.readdirSync(srcDir)) {
    if (MEDIA_EXT.has(path.extname(file).toLowerCase())) {
      fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    }
  }
}

console.log(`✓ 已同步 ${slugs.length} 篇笔记的媒体文件到 public/notes/`);
