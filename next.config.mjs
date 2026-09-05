/** @type {import('next').NextConfig} */
const nextConfig = {
  // 全静态导出：产出纯 HTML/CSS/JS，可部署到任意 Linux 服务器（Nginx/Caddy）
  // 或继续用 Vercel（Vercel 同样支持直接托管静态导出结果）。
  output: 'export',
  trailingSlash: true, // 每个路由生成 /path/index.html，Nginx 按目录托管更省心
  images: {
    unoptimized: true, // 静态导出模式下必须关闭 Next 内置图片优化服务
  },
};

export default nextConfig;
