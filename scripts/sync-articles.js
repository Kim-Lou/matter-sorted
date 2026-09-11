import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const optional = args.has('--optional');
const remote = process.env.ARTICLE_REMOTE || 'origin';
const branch = process.env.ARTICLE_BRANCH || 'article';
const root = process.cwd();
const target = path.join(root, 'content', 'notes');

function run(command, commandArgs, options = {}) {
  return execFileSync(command, commandArgs, {
    cwd: root,
    stdio: options.stdio || 'pipe',
    encoding: options.encoding || 'utf8',
  });
}

function finishOptional(message) {
  if (optional) {
    console.warn(`! ${message}`);
    console.warn('! 继续使用当前本地 content/notes。');
    process.exit(0);
  }
  throw new Error(message);
}

try {
  const status = run('git', ['status', '--porcelain', '--', 'content/notes']).trim();
  if (status && !force) {
    finishOptional('content/notes 有未提交改动；为避免覆盖，已跳过 GitHub article 同步。需要覆盖时运行 npm run sync:articles -- --force。');
  }

  run('git', ['fetch', remote, `${branch}:refs/remotes/${remote}/${branch}`], { stdio: 'inherit' });

  const worktree = fs.mkdtempSync(path.join(os.tmpdir(), 'matter-sorted-article-'));
  try {
    run('git', ['worktree', 'add', '--detach', worktree, `${remote}/${branch}`], { stdio: 'inherit' });

    const source = path.join(worktree, 'content', 'notes');
    if (!fs.existsSync(source)) {
      finishOptional(`${remote}/${branch} 中没有 content/notes 目录。`);
    }

    fs.rmSync(target, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.cpSync(source, target, { recursive: true });

    const count = fs.readdirSync(target).filter((name) => fs.statSync(path.join(target, name)).isDirectory()).length;
    console.log(`✓ 已从 ${remote}/${branch} 同步 ${count} 篇文章到 content/notes。`);
  } finally {
    try {
      run('git', ['worktree', 'remove', '--force', worktree], { stdio: 'ignore' });
    } catch {
      fs.rmSync(worktree, { recursive: true, force: true });
    }
  }
} catch (error) {
  if (optional) {
    console.warn(`! GitHub article 同步失败：${error.message}`);
    console.warn('! 继续使用当前本地 content/notes。');
    process.exit(0);
  }
  console.error(`✗ GitHub article 同步失败：${error.message}`);
  process.exit(1);
}
