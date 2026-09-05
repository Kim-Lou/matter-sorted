import './globals.css';

export const metadata = {
  title: '光选之间 · Kim',
  description: '多光谱融合分选的原理笔记',
};

// 根 layout 只负责最外层壳（html/head/字体），语言相关的内容交给 app/[locale]/layout.js
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
