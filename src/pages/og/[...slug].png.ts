import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection } from 'astro:content'
import { renderCard, type Card } from '../../lib/og.ts'

const landing: Card = {
  lines: [[{ text: 'Modern ' }, { text: 'class-based', italic: true }], [{ text: 'web framework over Bun' }]],
  description: 'Controllers, modules, dependency injection and guards with standard decorators, compiled into Bun’s native router.',
  titleSize: 84,
}

export const getStaticPaths = (async () => [
  { params: { slug: 'index' }, props: { card: landing } },
  ...(await getCollection('docs')).map((entry) => ({
    params: { slug: entry.id },
    props: {
      card: {
        eyebrow: 'Documentation',
        lines: [[{ text: entry.data.title }]],
        description: entry.data.description,
      } satisfies Card,
    },
  })),
]) satisfies GetStaticPaths

export const GET: APIRoute<{ card: Card }> = async ({ props }) =>
  new Response(await renderCard(props.card), { headers: { 'content-type': 'image/png' } })
