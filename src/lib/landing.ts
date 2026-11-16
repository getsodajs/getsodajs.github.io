import controllers from '@soda/docs/controllers.md?raw'
import gettingStarted from '@soda/docs/getting-started.md?raw'
import providers from '@soda/docs/providers-and-modules.md?raw'
import validation from '@soda/docs/validation.md?raw'
import results from '@soda/bench/http/RESULTS.md?raw'

const sources: Record<string, string> = {
  'docs/controllers.md': controllers,
  'docs/getting-started.md': gettingStarted,
  'docs/providers-and-modules.md': providers,
  'docs/validation.md': validation,
  'bench/http/RESULTS.md': results,
}

function read(path: string): string {
  const source = sources[path]

  if (source === undefined) {
    throw new Error(`${path} is not a landing source`)
  }

  return source
}

export interface Sample {
  file: string
  code: string
}

export function codeSample(doc: string, file: string): Sample {
  const blocks = read(doc).matchAll(/^```ts\n([\s\S]*?)^```$/gm)
  const marker = `// ${file}\n`

  for (const [, code] of blocks) {
    if (code?.startsWith(marker)) {
      return { file, code: code.slice(marker.length).trimEnd() }
    }
  }

  throw new Error(`${doc} has no ts block starting with "${marker.trim()}"`)
}

export interface Result {
  name: string
  scenarios: number[]
  average: number
  share: string
}

export interface Bench {
  setup: string[]
  scenarios: string[]
  results: Result[]
}

const cells = (row: string) =>
  row
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim())

const number = (cell: string) => Number(cell.replace(/<sub>.*<\/sub>/, '').replaceAll(',', '').trim())

export function bench(path: string): Bench {
  const lines = read(path).split('\n')
  const rows = lines.filter((line) => line.startsWith('|'))
  const [header, , ...body] = rows
  const setup = lines.filter((line) => line.trim() !== '' && !line.startsWith('|') && !line.startsWith('#'))

  if (header === undefined || body.length === 0) {
    throw new Error(`${path} has no results table`)
  }

  const scenarios = cells(header)
    .slice(1, -2)
    .map((cell) => cell.replace(/\s*\(req\/s\)$/, ''))

  const results = body.map((row) => {
    const values = cells(row)
    const [name = ''] = values

    return {
      name,
      scenarios: values.slice(1, -2).map(number),
      average: number(values.at(-2) ?? ''),
      share: values.at(-1) ?? '',
    }
  })

  if (results.some((result) => result.scenarios.some(Number.isNaN) || Number.isNaN(result.average))) {
    throw new Error(`${path} has a results table that cannot be read`)
  }

  return { setup, scenarios, results }
}

export interface Part {
  code: boolean
  text: string
}

export const inline = (text: string): Part[] =>
  text
    .split('`')
    .map((part, index) => ({ code: index % 2 === 1, text: part }))
    .filter((part) => part.text !== '')

export function snippet(doc: string, heading: string | undefined, lang: string, index = 0): string {
  const source = read(doc)
  const start = heading === undefined ? 0 : source.indexOf(`\n## ${heading}\n`)

  if (start === -1) {
    throw new Error(`${doc} has no "## ${heading}" section`)
  }

  const rest = source.slice(start + 1)
  const body = rest.indexOf('\n') + 1
  const end = rest.slice(body).search(/^## /m)
  const section = end === -1 ? rest : rest.slice(0, body + end)
  const blocks = [...section.matchAll(/^```(\w*)\n([\s\S]*?)^```$/gm)].filter((match) => match[1] === lang)
  const code = blocks[index]?.[2]

  if (code === undefined) {
    throw new Error(`${doc} has no ${lang || 'plain'} block ${index} in ${heading ?? 'its introduction'}`)
  }

  return code.trimEnd()
}

