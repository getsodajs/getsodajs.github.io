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

export const codeThemeLight: ThemeRegistration = {
  name: 'soda-light',
  type: 'light',
  colors: {
    'editor.background': '#00000000',
    'editor.foreground': '#1f1f1f',
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#9a9a9a' } },
    {
      scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.operator.new'],
      settings: { foreground: '#6b6b6b' },
    },
    { scope: ['string', 'constant.numeric', 'constant.language'], settings: { foreground: '#4a4a4a' } },
    { scope: ['entity.name.type', 'support.type', 'entity.other.inherited-class'], settings: { foreground: '#000000' } },
    { scope: ['punctuation', 'meta.brace', 'keyword.operator'], settings: { foreground: '#8f8f8f' } },
    {
      scope: [
        'punctuation.decorator',
        'meta.decorator entity.name.function',
        'meta.decorator variable.other.readwrite',
        'meta.decorator support.function',
      ],
      settings: { foreground: '#3c7d00' },
    },
  ],
}
