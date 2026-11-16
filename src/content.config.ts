import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import type { Loader } from 'astro/loaders'
import { i18nLoader } from '@astrojs/starlight/loaders'
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema'
import { pathToFileURL } from 'node:url'
import { docId, metaOf } from './lib/docs.ts'
import { sodaRoot } from './lib/soda.ts'

const files = glob({ base: pathToFileURL(`${sodaRoot}/docs/`), pattern: '**/*.md', generateId: ({ entry }) => docId(entry.split('\\').join('/')) })

const loader: Loader = {
  name: 'soda-docs',
  load: (context) =>
    files.load({
      ...context,
      parseData: (entry) =>
        context.parseData({
          ...entry,
          data: { ...(entry.filePath ? metaOf(entry.filePath) : { title: entry.id }), ...entry.data },
        }),
    }),
}

export const collections = {
  docs: defineCollection({ loader, schema: docsSchema() }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
}
