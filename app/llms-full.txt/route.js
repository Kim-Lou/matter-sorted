import { getNoteBySlug, getNoteSlugs } from '@/lib/notes';

export const dynamic = 'force-static';

export function GET() {
  const sections = getNoteSlugs().map((slug) => {
    const { data, content } = getNoteBySlug(slug, 'zh');
    return [
      `# ${data.title}`,
      '',
      `- URL: /zh/notes/${slug}/`,
      `- Date: ${data.date}`,
      `- Layer: ${data.layer}`,
      ...(data.band ? [`- Band: ${data.band}`] : []),
      `- Abstract: ${data.abstract}`,
      '',
      content.trim(),
    ].join('\n');
  });

  const body = [
    '# Sorted in Light / 光选之间 — Full corpus',
    '',
    'This file contains the canonical Chinese text of every published article.',
    '',
    sections.join('\n\n---\n\n'),
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
