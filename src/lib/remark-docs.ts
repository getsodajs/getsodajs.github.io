import { isInDocs, rewriteLink } from './docs.ts'

interface Node {
  type: string
  depth?: number
  url?: string
  children?: Node[]
}

interface File {
  path?: string
  history?: string[]
}

function rewriteLinks(node: Node, from: string, base: string): void {
  if ((node.type === 'link' || node.type === 'definition') && node.url !== undefined) {
    node.url = rewriteLink(node.url, from, base)
  }

  for (const child of node.children ?? []) {
    rewriteLinks(child, from, base)
  }
}

export function remarkDocs({ base }: { base: string }) {
  const trimmed = base.replace(/\/+$/, '')

  return () => (tree: Node, file: File) => {
    const from = file.path ?? file.history?.[0]

    if (from === undefined || !isInDocs(from)) {
      return
    }

    const children = tree.children ?? []
    const title = children.findIndex((node) => node.type === 'heading' && node.depth === 1)

    if (title !== -1) {
      children.splice(title, 1)
    }

    rewriteLinks(tree, from, trimmed)
  }
}
