# Linux 服务器部署指南 / DEPLOY.md

> 发布源：GitHub仓库 `https://github.com/Kim-Lou/sorted-in-light.git` 的 `main` 分支。
> `code` 和 `article` 是协作分支，只有合并到 `main` 的内容才进入生产发布。

网站是纯静态导出（`next.config.mjs`里`output: 'export'`），构建产物是一堆HTML/CSS/JS/图片，
不需要Node进程常驻，也不依赖Vercel——可以直接丢给任何一台跑Nginx的Linux服务器。

---

## 一、本地构建

```bash
npm install
npm run build
```

产物在 `out/` 目录，这就是要上传到服务器的全部内容。

## 二、上传到服务器

```bash
rsync -avz --delete out/ user@your-server:/var/www/research-site/
```

## 三、Nginx 配置示例

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/research-site;
    index index.html;

    # 默认语言重定向：访问根路径时跳到中文首页
    location = / {
        return 302 /zh/;
    }

    location / {
        try_files $uri $uri/ $uri.html =404;
    }
}
```

配好后 `nginx -t && systemctl reload nginx` 即可。HTTPS建议直接用`certbot`签发免费证书。

## 四、和GitHub Actions配合（可选，做到push自动部署到Linux服务器）

如果不用Vercel而是自建服务器，可以用GitHub Actions替代Vercel的webhook机制：

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm install
      - run: npm run build
      - name: Upload via rsync
        uses: burnett01/rsync-deployments@7.0.1
        with:
          switches: -avz --delete
          path: out/
          remote_path: /var/www/research-site/
          remote_host: ${{ secrets.SSH_HOST }}
          remote_user: ${{ secrets.SSH_USER }}
          remote_key: ${{ secrets.SSH_PRIVATE_KEY }}
```

这样`git push`之后，GitHub Actions自动构建并同步到你自己的Linux服务器，效果和Vercel的自动部署一致，
只是把"谁来跑构建、谁来存放静态文件"换成了你自己的机器。

## 五、Vercel与自建二选一，还是两者都要？

架构上两者互不冲突——`out/`产物是通用的，Vercel和自建Nginx都能吃。
建议：**先用Vercel跑起来验证内容和流程**（零配置、零运维），
等未来有自建需求（比如需要在本地跑一些商业化的付费墙/登录逻辑，静态导出做不到时）
再迁移到自建服务器+ Node常驻模式（去掉`output: 'export'`，改用`next start`）。
