import { existsSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { Glob } from 'bun'

const dist = join(import.meta.dir, '../dist')
const base = '/'
const site = 'https://getsodajs.github.io'

const pages = new Map<string, string>()

for (const file of new Glob('**/*.html').scanSync(dist)) {
  pages.set(file, readFileSync(join(dist, file), 'utf8'))
}

const texts = new Map<string, string>()

for (const file of new Glob('**/*.{md,txt}').scanSync(dist)) {
  texts.set(file, readFileSync(join(dist, file), 'utf8'))
}

const ids = new Map<string, Set<string>>()

function idsOf(file: string): Set<string> {
  const known = ids.get(file)

  if (known !== undefined) {
    return known
  }

  const found = new Set([...(pages.get(file) ?? '').matchAll(/\sid="([^"]+)"/g)].map((match) => match[1] ?? ''))

  ids.set(file, found)

  return found
}

function target(path: string): string | undefined {
  const local = decodeURI(path.slice(base.length)).replace(/\/$/, '')
  const candidates = local === '' ? ['index.html'] : [join(local, 'index.html'), `${local}.html`, local]

  return candidates.find((candidate) => existsSync(join(dist, candidate)) && statSync(join(dist, candidate)).isFile())
}

function check(link: string, from: string): string | undefined {
  const url = new URL(link, `${site}${base}${from}`)

  if (url.origin !== site) {
    return undefined
  }

  if (!url.pathname.startsWith(base)) {
    return 'outside the base path'
  }

  const file = target(url.pathname)

  if (file === undefined) {
    return 'no such page'
  }

  const hash = decodeURIComponent(url.hash.slice(1))

  const page = file.endsWith('.md') ? `${file.slice(0, -'.md'.length)}/index.html` : file

  if (hash !== '' && page.endsWith('.html') && !idsOf(page).has(hash)) {
    return `no #${hash} on ${page}`
  }

  return undefined
}

const attribute = /\s(?:href|src)="([^"]+)"|\scontent="(https:\/\/getsodajs\.github\.io\/[^"]+\.png)"/g
const problems: string[] = []
let count = 0

for (const [file, html] of pages) {
  const from = file.endsWith('index.html') ? file.slice(0, -'index.html'.length) : file

  for (const [, href, image] of html.matchAll(attribute)) {
    const link = href ?? image ?? ''

    const problem = /^(?:mailto|data|javascript):/.test(link) ? undefined : check(link.replaceAll('&amp;', '&'), from)

    count++

    if (problem !== undefined) {
      problems.push(`${relative(dist, join(dist, file))}: ${link} (${problem})`)
    }
  }
}

const markdownLink = /\]\((https?:\/\/[^)\s]+)\)/g

for (const [file, text] of texts) {
  for (const [, link = ''] of text.matchAll(markdownLink)) {
    const problem = check(link, '')

    count++

    if (problem !== undefined) {
      problems.push(`${file}: ${link} (${problem})`)
    }
  }
}

if (problems.length > 0) {
  console.error(`${problems.length} broken links:\n${[...new Set(problems)].join('\n')}`)
  process.exit(1)
}

console.log(`${count} links in ${pages.size} pages and ${texts.size} text files, none broken`)
