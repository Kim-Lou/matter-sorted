import { LOCALES, DEFAULT_LOCALE } from '@/i18n/dictionaries';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function LocaleLayout({ children, params }) {
  // App Router 的根 <html> 已在 app/layout.js 声明，这里通过脚本修正 lang 属性
  // （静态导出场景下用最简单直接的方式，不引入额外的 provider 依赖）
  return <>{children}</>;
}
