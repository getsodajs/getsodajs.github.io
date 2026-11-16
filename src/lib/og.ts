import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import brand from '../../public/brand.svg?raw'
import favicon from '../../public/favicon.svg?raw'

const require = createRequire(import.meta.url)
const font = (file: string) => readFileSync(require.resolve(`@fontsource/inter/files/${file}`))

const fonts = [
  { name: 'Inter', data: font('inter-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Inter', data: font('inter-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
  { name: 'Inter', data: font('inter-latin-700-normal.woff'), weight: 700 as const, style: 'normal' as const },
  { name: 'Inter', data: font('inter-latin-700-italic.woff'), weight: 700 as const, style: 'italic' as const },
]

export const ogSize = { width: 1200, height: 630 }

const lime = '#78fc04'
const dataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`

interface Node {
  type: string
  props: Record<string, unknown> & { style?: Record<string, unknown>; children?: unknown }
}

const el = (type: string, style: Record<string, unknown>, children?: unknown, props: Record<string, unknown> = {}): Node => ({
  type,
  props: { ...props, style, children },
})

export interface Span {
  text: string
  italic?: boolean
}

export interface Card {
  eyebrow?: string
  lines: Span[][]
  description?: string
  titleSize?: number
}

const clip = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, text.lastIndexOf(' ', max)).replace(/[,;:]$/, '')}…`

function card({ eyebrow, lines, description, titleSize = 76 }: Card): Node {
  const title = el(
    'div',
    { display: 'flex', flexDirection: 'column', fontSize: titleSize, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em' },
    lines.map((line) =>
      el(
        'div',
        { display: 'flex', flexWrap: 'wrap' },
        line.map((span) => el('span', { fontStyle: span.italic ? 'italic' : 'normal', whiteSpace: 'pre' }, span.text)),
      ),
    ),
  )

  const layer = { position: 'absolute', top: 0, left: 0, width: 1200, height: 630 }

  return el('div', { position: 'relative', display: 'flex', width: 1200, height: 630, background: '#000', color: '#fff', fontFamily: 'Inter' }, [
    el('div', {
      ...layer,
      backgroundImage: 'linear-gradient(to right, #1f1f1f 1px, transparent 1px), linear-gradient(to bottom, #1f1f1f 1px, transparent 1px)',
      backgroundSize: '48px 48px',
    }),
    el('div', {
      ...layer,
      backgroundImage: 'radial-gradient(circle at 82% 22%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.55) 30%, #000 62%)',
    }),
    el(
      'div',
      {
        ...layer,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        padding: 72,
      },
      [
        el('img', { width: 133, height: 72 }, undefined, { src: dataUri(brand), width: 133, height: 72 }),
        el('div', { display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000 }, [
          ...(eyebrow ? [el('div', { color: lime, fontSize: 28, fontWeight: 600 }, eyebrow)] : []),
          title,
          ...(description ? [el('div', { color: '#9a9a9a', fontSize: 30, lineHeight: 1.4 }, clip(description, 130))] : []),
        ]),
        el('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 26 }, [
          el(
            'div',
            {
              display: 'flex',
              padding: '12px 20px',
              border: '1px solid #272727',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.05)',
            },
            'bun create soda',
          ),
          el('div', { color: '#8a8a8a' }, 'sodajs.dev'),
        ]),
      ],
    ),
  ])
}

export async function renderCard(input: Card): Promise<Uint8Array<ArrayBuffer>> {
  const svg = await satori(card(input) as Parameters<typeof satori>[0], { ...ogSize, fonts })

  return new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: ogSize.width } }).render().asPng())
}

export const renderIcon = (size: number): Uint8Array<ArrayBuffer> =>
  new Uint8Array(new Resvg(favicon, { fitTo: { mode: 'width', value: size } }).render().asPng())
