import Link from 'next/link';
import { LOCALES } from '@/i18n/dictionaries';

const LABELS = { zh: '中文', en: 'EN' };

export default function LocaleSwitcher({ currentLocale, path = '' }) {
  return (
    <nav aria-label="Language" style={{ display: 'flex', gap: 12 }}>
      {LOCALES.map((loc) => (
        <Link
          key={loc}
          href={`/${loc}${path}`}
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 14,
            color: loc === currentLocale ? 'var(--text)' : 'var(--muted)',
            textDecoration: 'none',
          }}
        >
          {LABELS[loc]}
        </Link>
      ))}
    </nav>
  );
}
