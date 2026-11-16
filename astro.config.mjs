import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import { unified } from '@astrojs/markdown-remark'
import { codeTheme, codeThemeLight } from './src/lib/code-theme.ts'
import { remarkDocs } from './src/lib/remark-docs.ts'
import { sidebar } from './src/lib/sidebar.ts'
import { sodaRoot } from './src/lib/soda.ts'

const base = ''

export default defineConfig({
  site: 'https://getsodajs.github.io',
  trailingSlash: 'always',
  vite: {
    resolve: { alias: { '@soda': sodaRoot } },
  },
  markdown: {
    processor: unified({ remarkPlugins: [remarkDocs({ base })] }),
  },
  integrations: [
    starlight({
      title: 'Soda',
      description: 'A class-based web framework for Bun: modules, dependency injection and decorators like Nest.',
      favicon: '/favicon.svg',
      head: [
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${base}/favicon-32.png` } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: `${base}/apple-touch-icon.png` } },
      ],
      routeMiddleware: './src/route-data.ts',
      logo: { src: './src/assets/brand.svg', alt: 'SodaJS', replacesTitle: true },
      expressiveCode: {
        themes: [structuredClone(codeTheme), structuredClone(codeThemeLight)],
        useStarlightUiThemeColors: true,
        styleOverrides: {
          borderRadius: '0.75rem',
          borderColor: 'var(--sl-color-gray-5)',
          codeBackground: 'var(--soda-code-bg)',
          codeFontFamily: 'var(--sl-font-mono)',
          codeFontSize: '0.875rem',
          codeLineHeight: '1.7',
          frames: {
            editorTabBarBackground: 'var(--soda-code-bg)',
            editorActiveTabBackground: 'var(--soda-code-bg)',
            terminalTitlebarBackground: 'var(--soda-code-bg)',
            terminalBackground: 'var(--soda-code-bg)',
            frameBoxShadowCssValue: 'none',
          },
        },
      },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/getsodajs/soda' }],
      disable404Route: true,
      customCss: ['./src/styles/theme.css'],
      sidebar,
    }),
  ],
})
