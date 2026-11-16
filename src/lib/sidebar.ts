export interface Group {
  label: string
  items: string[]
}

export const groups: Group[] = [
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

export const sidebar = groups.map((group) => (group.items.length === 1 ? group.items[0] : { label: group.label, items: group.items }))
