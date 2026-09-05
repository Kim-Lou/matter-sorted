import { getAllNotes } from '@/lib/notes';

export const dynamic = 'force-static';

export function GET() {
  const notes = getAllNotes('zh');
  const lines = [
    '# Sorted in Light / 光选之间',
    '',
    '> A personal research site about the principles and constraints of multimodal spectral fusion sorting.',
    '',
    'The default language is Chinese. Articles are organized into perception, decision, execution, and operations layers.',
    '',
    '## Articles',
    '',
    ...notes.flatMap((note) => [
      `- [${note.title}](/zh/notes/${note.slug}/): ${note.abstract} [${note.layer}${note.band ? `; ${note.band}` : ''}; ${note.date}]`,
    ]),
    '',
    '## Machine-readable resources',
    '',
    '- [Full Markdown corpus](/llms-full.txt)',
    '- [English site](/en/)',
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
