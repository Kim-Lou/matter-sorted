# 架构与更新机制规范 / ARCHITECTURE.md

`DESIGN_GUIDE.md` 只管样式。本文档管三件事：技术栈选型、项目架构、内容如何从本地变成线上更新。

---

## 一、技术栈

| 层 | 选型 | 为什么 |
|---|---|---|
| 框架 | Next.js 15 (App Router) | 静态生成为主，agent友好（纯文本diff可读、SEO/爬取友好），你已有Next.js经验 |
| 内容格式 | Markdown + Frontmatter (`.mdx`) | 纯文本，Git友好，agent读写成本最低；MDX允许正文里嵌`<Video />`等组件 |
| MDX编译 | `next-mdx-remote` | 内容文件不放在`app/`路由目录里，构建时按需编译，内容和路由解耦 |
| Frontmatter解析 | `gray-matter` | 轻量，读取`---`元数据块 |
| 发布源 | GitHub | `Kim-Lou/matter-sorted` 是网站构建的唯一上游来源 |
| 部署 | GitHub驱动的静态构建 | `code` 更新后由托管平台拉取、构建并发布 |
| 版本控制 | Git / GitHub | `code` 做代码和构建版本迭代，`article` 只保存文章素材 |

**不选的方案及原因**（避免以后重新纠结）：
- 不用CMS（如Sanity/Contentful）：内容管理会脱离Git工作流，agent操作要多学一套API，违背"像GitHub那样"的初衷。
- 不用纯静态HTML手写：正文里嵌视频组件、层级色标注这些复用逻辑手写维护成本高。
- 视频不自建播放器/不存进仓库：见第四节。

---

## 二、项目架构（目录职责边界）

```
/app                  ← 路由与页面组件（样式相关，遵守 DESIGN_GUIDE.md）
  layout.js
  [locale]/page.jsx            首页：读取 content/notes 渲染列表
  [locale]/notes/[slug]/page.js 笔记详情页：编译对应 mdx
  llms.txt/route.js             给agent读取的内容索引
  llms-full.txt/route.js        给agent读取的完整语料
/components           ← 可复用UI组件（Video 等）
/lib
  notes.js            读取 content/notes 的公共函数
  theme.js            颜色等设计token（唯一真源，样式改这里）
/content/notes/<slug> ← 纯内容，agent的活动范围（遵守 CONTENT_GUIDE.md）
/scripts
  publish-check.js    发布前校验脚本
CONTENT_GUIDE.md       内容契约
DESIGN_GUIDE.md        样式规范
ARCHITECTURE.md         本文档
```

**核心边界**：`content/` 是唯一允许agent自由读写的目录。`app/`、`components/`、`lib/theme.js`
只能由你（或明确要求改样式/改架构时）修改。这条边界保证——不管agent更新多少次内容，
网站的样式和结构不会被意外改动。

---

## 三、更新机制（本地 → 线上）

### 数据流

```
本地：Kim 与 agent 讨论、推演并形成文章
   ↓ (按 WRITING_STANDARD.md 和 CONTENT_GUIDE.md 落盘)
本地：npm run check   ← 发布前自检，未通过则中止
   ↓
提交到 article 分支 → 审阅 → 同步文章目录到 code → push GitHub
   ↓ (托管平台监听 GitHub code 分支)
托管平台：拉取代码 → npm run build → 发布静态产物
   ↓
域名指向的线上站点在 1–2 分钟内更新完成
```

### 一次性配置（做一次，之后自动化）

1. GitHub仓库固定为 `https://github.com/Kim-Lou/matter-sorted.git`。
2. 托管平台连接该仓库并将生产分支设为 `code`。
3. Vercel Dashboard → Domains → 绑定你自己的域名；去域名服务商把DNS的CNAME指向Vercel提供的地址。
4. 完成后，**以后每次 push 到 `code`，网站自动更新**。

### 分支职责

| 分支 | 用途 | 可修改范围 |
|---|---|---|
| `code` | 唯一代码、构建和版本迭代分支 | `app/`、`components/`、`lib/`、`scripts/`、配置、相关文档，以及已审阅入站的 `content/notes/` |
| `article` | Kim 与 agent 讨论后形成的文章素材 | 只保留 `content/notes/` 下的文章目录和必要说明，不放网站代码 |

### 日常更新（agent执行）

```bash
npm run check                          # 校验通过再往下走
git add content/notes/<新文件夹>
git commit -m "add: <标题>"
git push origin article
# 审阅通过后，将对应文章目录同步到 code 并 push
```

无需手动登录服务器、无需FTP上传、无需重启任何服务。

---

## 四、视频的特殊处理

视频不进Git仓库（体积大、无法有效diff、会拖慢每次clone/checkout）。机制是：

1. 视频本体上传到外部托管（B站/YouTube unlisted/Cloudflare Stream 任选其一，前期建议B站，免费且国内访问快）。
2. 拿到embed链接，写入 `content/notes/<slug>/video.url`（纯文本一行）。
3. 正文用 `<Video url="./video.url" />` 引用，组件在构建时读取该文件内容作为iframe的`src`。

这样"内容仓库"里视频永远只是一个几十字节的文本文件，不影响仓库体积和构建速度。

---

## 五、扩展预留（现在不用做，但架构上留了口子）

- **多语言**：`content/notes/<slug>/index.mdx` 未来可扩展为 `index.zh.mdx` / `index.en.mdx`，`lib/notes.js` 按需改读取逻辑即可，不影响现有内容。
- **Agent索引**：`/llms.txt` 与 `/llms-full.txt` 已作为静态构建产物生成；新增文章会自动进入索引与全文语料。

---

## 六、职责速查表

| 我要做的事 | 该看哪份文档 | 该改哪个目录 |
|---|---|---|
| 发一篇新笔记 | `CONTENT_GUIDE.md` | `content/notes/` |
| 改配色/字体/布局 | `DESIGN_GUIDE.md` | `app/`, `components/`, `lib/theme.js` |
| 改部署方式/加新功能模块 | `ARCHITECTURE.md`（本文档） | 视具体情况 |
