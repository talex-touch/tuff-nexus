---
title: Getting started with the Tuff Launcher
description: Boot your bilingual docs workspace in minutes.
navigation:
  title: Get started
---

# Getting started

Tuff Launcher spins up a Nuxt-based documentation workspace that already understands English and Chinese, ships with matching light/dark themes, and includes opinionated defaults for navigation, search, and deployment. Use this guide to move from clone to published docs in under an hour.

## 1. Install dependencies

Tuff relies on **pnpm** for package management. After cloning the repository run:

```bash
pnpm install
pnpm dev
```

Tip: append `--open` to automatically open the local preview in your browser.

## 2. Shape your structure

All documentation content lives under `content/docs`. Each subdirectory becomes a navigation group in the left sidebar. Create new Markdown or MDC files and include front matter to manage ordering:

```md
---
title: Release cadence
navigation:
  order: 4
---
```

The provided UnoCSS tokens ensure headings, lists, and code samples stay balanced in both light and dark themes without extra styling.

## 3. Localize a page

The launcher fetches localized content automatically. Duplicate any Markdown file and append `.zh.md` to supply a Chinese version:

```text
content/docs/documents/start.md
content/docs/documents/start.zh.md
```

When readers switch the language toggle, Tuff resolves the matching file transparently. If the localized file is missing, the English original is shown as a graceful fallback.

## 4. Publish

Build a production bundle with:

```bash
pnpm generate
```

The generated `dist` folder can be deployed to Netlify, Vercel, Cloudflare Pages, or any static host. For server-side rendering or edge runtimes, run `pnpm build` followed by the adapter command defined in `package.json`.

---

Next steps:

- Adjust typography, spacing, or tokens in `uno.config.ts`.
- Extend translations inside `i18n.config.ts`.
- Wire CI/CD to run `pnpm generate` before deploying to your hosting provider.
