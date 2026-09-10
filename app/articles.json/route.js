import { getAllNotes } from '@/lib/notes';

export const dynamic = 'force-static';

export function GET() {
  return Response.json({ schemaVersion: 1, articles: getAllNotes('zh').map((n) => ({
    id: n.id, slug: n.slug, title: n.title, abstract: n.abstract, layer: n.layer,
    published: n.date, updated: n.updated, revision: n.revision,
    url: `/zh/notes/${n.slug}/`, cover: `/notes/${n.slug}/${n.cover.replace(/^\.\//, '')}`,
  })) });
}
