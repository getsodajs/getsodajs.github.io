import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { sodaRoot } from './soda.ts'

export interface Group {
  label: string
  items: string[]
}

const layout: Group[] = [
  { label: 'Getting started', items: ['docs/getting-started'] },
  {
    label: 'Essentials',
    items: ['docs/controllers', 'docs/validation', 'docs/providers-and-modules', 'docs/request-pipeline'],
  },
  {
    label: 'Features',
    items: [
      'docs/configuration',
      'docs/authentication',
      'docs/websockets',
      'docs/rate-limiting',
      'docs/openapi',
      'docs/logging',
    ],
  },
  { label: 'Shipping', items: ['docs/testing', 'docs/production'] },
  { label: 'Recipes', items: ['docs/recipes/database', 'docs/recipes/file-uploads'] },
  { label: 'From Nest', items: ['docs/from-nest'] },
]

const exists = (id: string) => existsSync(resolve(sodaRoot, `${id}.md`))

function readmeOrder(): string[] {
  const readme = readFileSync(resolve(sodaRoot, 'docs/README.md'), 'utf8')
  const ids = [...readme.matchAll(/\]\(\.\/([^)#\s]+)\.md(?:#[^)]*)?\)/g)].map((match) => `docs/${match[1]}`)

  return [...new Set(ids)].filter(exists)
}

function place(groups: Group[], id: string, after: string | undefined): Group[] {
  const found = after === undefined ? -1 : groups.findIndex((group) => group.items.includes(after))
  const target = found === -1 ? 0 : found

  return groups.map((group, index) => {
    if (index !== target) {
      return group
    }

    const position = after === undefined ? 0 : group.items.indexOf(after) + 1

    return { ...group, items: [...group.items.slice(0, position), id, ...group.items.slice(position)] }
  })
}

function arrange(): Group[] {
  const order = readmeOrder()
  const known = layout.map((group) => ({ ...group, items: group.items.filter(exists) }))
  const listed = (groups: Group[], id: string) => groups.some((group) => group.items.includes(id))

  return order
    .reduce((groups, id, index) => (listed(groups, id) ? groups : place(groups, id, order[index - 1])), known)
    .filter((group) => group.items.length > 0)
}

export const groups = arrange()

export const sidebar = groups.map((group) => (group.items.length === 1 ? group.items[0] : { label: group.label, items: group.items }))
