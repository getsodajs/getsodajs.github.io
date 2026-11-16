import { defineRouteMiddleware } from '@astrojs/starlight/route-data'

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute

  if (!route.id.startsWith('docs')) {
    return
  }

  const image = new URL(`${import.meta.env.BASE_URL}og/${route.id}.png`, context.site).href

  route.head.push(
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: `${route.entry.data.title} — Soda documentation` } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
  )
})
