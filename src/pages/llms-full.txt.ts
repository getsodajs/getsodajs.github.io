import type { APIRoute } from 'astro'
import { markdownOf, orderedDocs, site, summary } from '../lib/llms.ts'

export const GET: APIRoute = async () => {
  const pages = (await orderedDocs()).flatMap(({ entries }) =>
    entries.map((entry) => `${markdownOf(entry)}\n\nSource: ${site}/${entry.id}/`),
  )

  return new Response(`${[summary, ...pages].join('\n\n---\n\n')}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
