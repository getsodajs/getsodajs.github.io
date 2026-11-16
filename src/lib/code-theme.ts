import type { ThemeRegistration } from 'shiki'

const lime = '#78fc04'

export const codeTheme: ThemeRegistration = {
  name: 'soda',
  type: 'dark',
  colors: {
    'editor.background': '#00000000',
    'editor.foreground': '#d6d6d6',
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#5a5a5a' } },
    {
      scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.operator.new'],
      settings: { foreground: '#8c8c8c' },
    },
    { scope: ['string', 'constant.numeric', 'constant.language'], settings: { foreground: '#b8b8b8' } },
    { scope: ['entity.name.type', 'support.type', 'entity.other.inherited-class'], settings: { foreground: '#ffffff' } },
    { scope: ['punctuation', 'meta.brace', 'keyword.operator'], settings: { foreground: '#6f6f6f' } },
    {
      scope: [
        'punctuation.decorator',
        'meta.decorator entity.name.function',
        'meta.decorator variable.other.readwrite',
        'meta.decorator support.function',
      ],
      settings: { foreground: lime },
    },
  ],
}

