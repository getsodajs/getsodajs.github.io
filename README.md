# getsodajs.github.io

The website of [Soda](https://github.com/getsodajs/soda): the landing page and the documentation, at <https://getsodajs.github.io>.

The documentation is not written here. It is read from [`docs/`](https://github.com/getsodajs/soda/tree/main/docs) in the framework's repository, cloned into `soda/` before each build; the HTTP benchmark results come from the same place. The site is rebuilt on every push here, every night, and on demand from the Actions tab.

```bash
bun install
bun run dev        # clones or updates soda/, then serves http://localhost:4321
bun run build      # builds dist/ and checks every internal link
```

To see changes to the documentation before they are pushed, point the site at a local checkout of the framework:

```bash
SODA_DIR=../soda bun run dev
```

Astro and Starlight; the build also writes `llms.txt`, `llms-full.txt`, a markdown copy and an Open Graph image for each page.
