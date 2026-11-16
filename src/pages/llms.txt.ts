import type { APIRoute } from 'astro'
import { links, orderedDocs, site, summary } from '../lib/llms.ts'

export const GET: APIRoute = async () => {
  const sections = (await orderedDocs()).map(({ label, entries }) =>
    [
      `## ${label}`,
      '',
      ...entries.map((entry) => `- [${entry.data.title}](${site}/${entry.id}.md): ${entry.data.description ?? ''}`.trimEnd()),
    ].join('\n'),
  )

  const optional = [
    '## Optional',
    '',
    `- [All documentation in one file](${site}/llms-full.txt)`,
    `- [HTTP benchmark](${links.benchmark}): Soda, Hono and Nest over HTTP`,
    `- [Source code](${links.source})`,
  ].join('\n')

  return new Response(`${[summary, ...sections, optional].join('\n\n')}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
