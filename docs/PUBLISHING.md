# 持续发布与文章身份

状态：本地实现；GitHub构建结果以 Actions 为准；正式托管尚未指定。

## 内容来源

仓库：https://github.com/Kim-Lou/matter-sorted.git 。文字和图片提交 Git，视频上传B站，文章目录只保存 `video.url` 嵌入链接。不要把视频本体提交到仓库。

每篇文章拥有独立目录、图片命名空间和永久 ID。`id` 必须等于目录名；文章标题可以改，ID 和目录名不改。新文章建新目录，不能复用既有 ID。中文与英文属于同一篇文章，不建立第二个 ID。

首次发布填写 `date`、`updated` 和 `revision: 1`。修改正文、图示或论据时保留 `date`，更新 `updated`，递增 `revision`。Git commit 保留逐次修改和回滚记录。已有英文版须同步版本元数据与内容，或暂时撤下译文以使用中文回退。

发布检查验证 ID、目录格式、日期、修订号及译文元数据和引用素材。修订号是否相对历史正确递增仍需审阅 Git diff，检查脚本不代替编辑审阅。

## 分支与发布

`code` 是唯一代码、构建和版本迭代分支；`article` 是文章素材分支，不放网站代码。文章先在 `article` 上形成独立内容目录，经审阅后把对应 `content/notes/<slug>/` 同步到 `code` 并提交。代码变更只在 `code` 上迭代，不再额外维护多个环境分支。

GitHub Actions 只对 `code` 的 push 和面向 `code` 的 pull request 执行 npm ci 和 npm run build，并保存带提交 SHA 的 out 构建产物。`article` 分支不跑网站构建，因为它不包含代码依赖。失败不会产生新的成功构建产物。

当前工作流只校验与构建，不会自动部署到公网。接入 Vercel 时选择此仓库与 `code` 生产分支；自建托管则在构建成功后部署 out。配置完成后，`code` 更新自动触发重建发布，生效时间由构建、托管与缓存决定，不是秒级直接读取 GitHub。

`/articles.json` 提供 id、slug、日期、修订号与独立文章 URL；`/llms.txt` 为目录，`/llms-full.txt` 为全文语料。它们和网页均由同一份内容在构建时生成。全文中的图片路径包含文章 slug，避免同名 fig-01.png 串图。

## 本地验证

执行 `npm run sync:articles` 从 GitHub `article` 分支同步文章素材，再执行 `npm run check`。`npm run dev` 会尝试自动同步 `article` 分支；如果网络不可用或本地 `content/notes` 有未提交改动，会保留当前本地内容继续启动。需要明确覆盖本地内容时运行 `npm run sync:articles -- --force`。

开发服务器运行时，以 `NEXT_DIST_DIR=.next-build npm run build` 使用独立缓存，防止生产构建覆盖开发缓存。图文通过检查后可在本地文章 URL 预览。
