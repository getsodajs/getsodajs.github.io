import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection, type CollectionEntry } from 'astro:content'
import { markdownOf } from '../lib/llms.ts'

export const getStaticPaths = (async () =>
  (await getCollection('docs')).map((entry) => ({ params: { slug: entry.id }, props: { entry } }))) satisfies GetStaticPaths

export const GET: APIRoute<{ entry: CollectionEntry<'docs'> }> = ({ props }) =>
  new Response(`${markdownOf(props.entry)}\n`, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  })
