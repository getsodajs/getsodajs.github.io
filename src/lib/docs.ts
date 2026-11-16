import { readFileSync } from 'node:fs'
import { relative, resolve, sep } from 'node:path'
import { docId, repository, resolveLink } from './links.ts'
import { sodaRoot } from './soda.ts'

export { docId }
export const repoRoot = sodaRoot
export const docsRoot = resolve(repoRoot, 'docs')

const toPosix = (path: string) => path.split(sep).join('/')

export function isInDocs(file: string): boolean {
  return !relative(docsRoot, file).startsWith('..')
}

const fence = /^\s*(```|~~~)/

export function firstHeading(markdown: string): string | undefined {
  let inFence = false

  for (const line of markdown.split('\n')) {
    if (fence.test(line)) {
      inFence = !inFence
      continue
    }

    const match = inFence ? null : /^#\s+(.+?)\s*#*\s*$/.exec(line)

    if (match?.[1]) {
      return match[1]
    }
  }

  return undefined
}

const notProse = /^(?:#|\||[-*+] |\d+\. |>|<|!\[)/

const plain = (text: string) =>
  text
    .replaceAll(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replaceAll(/[`*_]/g, '')
    .replaceAll(/\s+/g, ' ')
    .trim()

function clip(text: string, max: number): string {
  const ended = text.replace(/:$/, '.')

  if (ended.length <= max) {
    return ended
  }

  const cut = ended.slice(0, max)
  const sentence = cut.lastIndexOf('. ')

  if (sentence > max / 2) {
    return cut.slice(0, sentence + 1)
  }

  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '')}…`
}

export function firstParagraph(markdown: string): string | undefined {
  let inFence = false
  const lines: string[] = []

  for (const line of markdown.split('\n')) {
    if (fence.test(line)) {
      inFence = !inFence
      continue
    }

    const text = line.trim()
    const prose = !inFence && text !== '' && !notProse.test(text)

    if (prose) {
      lines.push(text)
      continue
    }

    if (lines.length > 0) {
      break
    }
  }

  return lines.length > 0 ? clip(plain(lines.join(' ')), 160) : undefined
}

export function metaOf(file: string): { title: string; description?: string; editUrl: string } {
  const markdown = readFileSync(file, 'utf8')
  const title = firstHeading(markdown)

  if (title === undefined) {
    throw new Error(`${toPosix(relative(repoRoot, file))} has no "# Title" line`)
  }

  return {
    title,
    description: firstParagraph(markdown),
    editUrl: `${repository}/edit/main/${toPosix(relative(repoRoot, file))}`,
  }
}

export function titleOf(file: string): string {
  const title = firstHeading(readFileSync(file, 'utf8'))

  if (title === undefined) {
    throw new Error(`${toPosix(relative(repoRoot, file))} has no "# Title" line`)
  }

  return title
}

export function rewriteLink(url: string, from: string, base: string): string {
  return resolveLink(url, toPosix(relative(docsRoot, from)), base)
}
