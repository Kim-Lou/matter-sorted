# 内容发布契约（给你自己，也给负责发布的 agent 读）

## 一篇笔记 = 一个文件夹

```
content/notes/<yyyy-mm-slug>/
  index.mdx      必需，正文 + frontmatter
  cover.jpg      必需，封面图
  fig-01.png     可选，正文引用的图，编号递增
  fig-02.png
  video.url      可选，一行纯文本，视频外链（B站/YouTube/Cloudflare Stream 的播放页或 embed 链接）
```

文件夹命名：`年-月-英文短slug`，例如 `2026-09-data-pipeline`。

## index.mdx 的 frontmatter（全部必填，除非标注可选）

```yaml
---
title: "产线级优化为什么先是数据流问题"
abstract: "两三句话，相当于论文摘要，说清楚这篇的核心论点"
layer: "运营层"          # 必须是以下四者之一：感知层 / 决策层 / 执行层 / 运营层
band: "8-14 μm"          # 可选，技术标注（波长/频段/其他量化标签），没有就留空字符串
date: "2026-09-05"        # ISO 格式
cover: "./cover.jpg"
video: "./video.url"      # 可选，没有视频就删掉这一行，不要留空字符串
---
```

## 正文规则

- 图片用相对路径引用：`![说明文字](./fig-01.png)`
- 每张引用的图必须能在同文件夹里找到对应文件，找不到就是发布错误
- 视频不嵌代码，交给 `<Video />` 组件（已在 layout 里全局可用），写法：`<Video url="./video.url" />`
- 正文不需要重复 frontmatter 里已有的标题和摘要

## 发布前必须跑

```
npm run check
```

这一步会校验：frontmatter 字段是否齐全、`layer` 取值是否合法、正文里引用的图片是否存在。
校验不通过就不要 push——`npm run build` 会自动先跑这个检查，失败会直接中断构建。

## 图片路径是怎么"生效"的（了解即可，不用手动处理）

正文里依然只用相对路径引用图片（`./fig-01.png`），构建时 `scripts/sync-media.js`
会自动把 `content/notes/<slug>/` 下的图片同步到 `public/notes/<slug>/`，
并把正文里的路径改写成真实可访问的URL。这一步全自动，写作时不用关心。

## 多语言（可选）

默认语言是中文，就是 `index.mdx`。如果要提供英文版，新增同目录下的 `index.en.mdx`，
frontmatter字段结构完全一致，`layer`取值仍用中文（层级本身是分类标签，不翻译）。
没有英文版时，英文页会自动回退显示中文原文并提示"暂无翻译"。

## 发布流程（本地准备好之后）

```
git add content/notes/<新文件夹>
git commit -m "add: <标题>"
git push
```

文章先 push 到 `article` 分支，经审阅合并到 `main`。网站以 GitHub 仓库
`https://github.com/Kim-Lou/MatterSorted.git` 的 `main` 分支为发布源；合并后由托管平台
自动构建并结构化展示，不需要CMS或手动上传文件。

构建还会自动生成 `/llms.txt`（文章索引）和 `/llms-full.txt`（完整Markdown语料），
因此新增文章无需额外维护一份给agent使用的副本。
