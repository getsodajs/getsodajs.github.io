import { posix } from 'node:path'

export const repository = 'https://github.com/getsodajs/soda'

export type Format = 'html' | 'md'

export function docId(entry: string): string {
  const path = entry.replace(/\.md$/i, '')
  const parts = path.split('/').filter((part) => part.toLowerCase() !== 'readme')

  return ['docs', ...parts].join('/')
}

export function sourceOf(id: string): string {
  const path = id.replace(/^docs\/?/, '')

  return path === '' ? 'README.md' : `${path}.md`
}

const external = /^(?:[a-z][a-z\d+.-]*:|\/\/|#|\/)/i

export function resolveLink(url: string, from: string, base: string, format: Format = 'html'): string {
  if (external.test(url)) {
    return url
  }

  const hashAt = url.indexOf('#')
  const path = hashAt === -1 ? url : url.slice(0, hashAt)
  const hash = hashAt === -1 ? '' : url.slice(hashAt)

  if (path === '') {
    return url
  }

  const target = posix.normalize(posix.join('docs', posix.dirname(from), decodeURI(path)))

  if (target.startsWith('docs/') && /\.md$/i.test(target)) {
    const id = docId(target.slice('docs/'.length))

    return format === 'md' ? `${base}/${id}.md${hash}` : `${base}/${id}/${hash}`
  }

  return `${repository}/tree/main/${target}${hash}`
}

const fence = /^\s*(```|~~~)/
const inlineLink = /(\]\()([^)\s]+)(\))/g

export function rewriteMarkdown(markdown: string, from: string, base: string, format: Format): string {
  let inFence = false
  const lines: string[] = []

  for (const line of markdown.split('\n')) {
    if (fence.test(line)) {
      inFence = !inFence
    }

    lines.push(inFence ? line : line.replaceAll(inlineLink, (_, open, url, close) => `${open}${resolveLink(url, from, base, format)}${close}`))
  }

  return lines.join('\n')
}
