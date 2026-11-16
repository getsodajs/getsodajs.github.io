import { getCollection, type CollectionEntry } from 'astro:content'
import { repository, rewriteMarkdown, sourceOf } from './links.ts'
import { groups } from './sidebar.ts'

export const site = 'https://getsodajs.github.io'

export const summary = [
  '# Soda',
  '',
  "> Soda (SodaJS, npm package @getsoda/core) is a class-based web framework for Bun: modules, dependency injection, controllers, guards, interceptors and exception filters written with standard TC39 decorators, compiled into Bun's native router. Requires Bun 1.4 or later.",
  '',
  '- Create a project: `bun create soda my-app`. Add to an existing one: `bun add @getsoda/core`.',
  '- Standard decorators: no `experimentalDecorators`, no `emitDecoratorMetadata`, no `reflect-metadata`.',
  "- Dependencies come from `inject()`. A route lists its arguments in its decorator: `@Get(':id', [param('id', int)])`.",
  '- Validation with any Standard Schema library (zod, valibot, arktype); OpenAPI is generated from the same schemas.',
  '- Entry points: `@getsoda/core`, `@getsoda/core/jwt`, `@getsoda/core/throttler`, `@getsoda/core/openapi`, `@getsoda/core/testing`.',
  '- Soda is 0.x: the API may change between minor versions.',
].join('\n')

export async function orderedDocs(): Promise<{ label: string; entries: CollectionEntry<'docs'>[] }[]> {
  const docs = await getCollection('docs')
  const byId = new Map(docs.map((entry) => [entry.id, entry]))

  return groups.map((group) => ({
    label: group.label,
    entries: group.items.map((id) => {
      const entry = byId.get(id)

      if (entry === undefined) {
        throw new Error(`The sidebar lists ${id}, which is not in docs/`)
      }

      return entry
    }),
  }))
}

export const markdownOf = (entry: CollectionEntry<'docs'>) =>
  rewriteMarkdown(entry.body ?? '', sourceOf(entry.id), site, 'md').trim()

export const links = {
  source: repository,
  benchmark: `${repository}/tree/main/bench/http`,
}
