<script setup lang="ts">
definePageMeta({
  layout: 'home',
})

const online = useOnline()

const features = [
  {
    title: 'Composable Documentation',
    description: 'Author once in Markdown, surface everywhere with Nuxt Content, Vue components, and a powerful plugin system.',
    icon: 'i-carbon-cube',
  },
  {
    title: 'Multi-language Ready',
    description: 'Ship the same docs in multiple languages with automatic locale routing and translation fallbacks.',
    icon: 'i-carbon-language',
  },
  {
    title: 'Live Search & Navigation',
    description: 'Delight users with instant search, nested navigation, and contextual callouts that stay in sync.',
    icon: 'i-carbon-search',
  },
  {
    title: 'Deploy Anywhere',
    description: 'Export a static bundle or host as an edge application. Integrates with Cloudflare Pages, Netlify, or your own CI/CD.',
    icon: 'i-carbon-cloud',
  },
]

const workflow = [
  {
    title: '1. Write',
    description: 'Create Markdown or MDX content inside `docs/` or `app/content/` with front matter for metadata.',
    description: 'Create Markdown or MDX content inside `docs/` or `content/` with front matter for metadata.',
  },
  {
    title: '2. Preview',
    description: 'Hot reload documentation changes instantly during local development with Nuxt dev tools.',
  },
  {
    title: '3. Publish',
    description: 'Push to Git and let your pipeline build, test, and ship production-ready docs automatically.',
  },
]

const faqs = [
  {
    question: 'Can I migrate my existing docs?',
    answer: 'Yes. Drop your Markdown files into `docs/docs` and they are rendered automatically alongside new content.',
  },
  {
    question: 'Does Tuff support custom themes?',
    answer: 'Use Tailwind-compatible utility classes, extend UnoCSS tokens, or plug in your design system components.',
  },
  {
    question: 'Is there a plugin ecosystem?',
    answer: 'Tuff offers a marketplace-ready plugin architecture, with examples for search, storage, and automation.',
  },
]
</script>

<template>
  <div class="w-full text-left">
    <div
      v-if="online === false"
      class="mx-auto max-w-5xl rounded-xl border border-amber-300 bg-amber-100 px-4 py-3 text-sm text-amber-900 shadow-sm"
    >
      You are viewing an offline preview. Interactive features such as live search will resume once you reconnect.
    </div>

    <section class="container mx-auto flex flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center lg:py-24">
      <div class="flex-1 space-y-6">
        <span class="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          Built with Nuxt 3
        </span>
        <h1 class="text-3xl font-semibold text-primary dark:text-light sm:text-5xl">
          The fastest way to publish living documentation for your product.
        </h1>
        <p class="max-w-2xl text-base text-gray-600 dark:text-gray-300 sm:text-lg">
          Tuff gives software teams an opinionated workflow to author, localize, and ship product documentation. Focus on content—Tuff handles navigation, search, and deployment.
        </p>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <NuxtLink
            to="/docs/documents/start"
            class="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-base font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary/90"
          >
            Explore the docs
          </NuxtLink>
          <NuxtLink
            to="/marketplace"
            class="inline-flex items-center justify-center rounded-lg border border-primary/20 px-5 py-3 text-base font-semibold text-primary transition hover:border-primary hover:text-primary/90 dark:border-gray-700 dark:text-light dark:hover:border-light/60"
          >
            View plugins
          </NuxtLink>
        </div>
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center gap-2">
            <div class="i-carbon-checkmark-filled text-primary" />
            <span>Instant previews</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="i-carbon-checkmark-filled text-primary" />
            <span>Automatic sitemap</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="i-carbon-checkmark-filled text-primary" />
            <span>Zero-config search</span>
          </div>
        </div>
      </div>

      <div class="flex-1">
        <div class="relative mx-auto max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-primary/20 dark:border-gray-700 dark:bg-primary/40">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/30 dark:from-primary/40 dark:to-primary/20" />
          <div class="relative space-y-4 px-6 py-8">
            <div class="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary/70 dark:text-light/70">
              <div class="h-1 w-1 rounded-full bg-primary" />
              Sample workflow
              <div class="h-1 w-1 rounded-full bg-primary" />
            </div>
            <div class="rounded-xl border border-primary/20 bg-white/80 p-4 shadow-sm dark:border-light/20 dark:bg-primary/80">
              <p class="text-sm font-semibold text-primary dark:text-light">Docs pipeline</p>
              <ul class="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-200">
                <li class="flex items-center gap-2">
                  <div class="i-carbon-edit text-primary" />
                  Write content in Markdown or MDX.
                </li>
                <li class="flex items-center gap-2">
                  <div class="i-carbon-tree-view-alt text-primary" />
                  Organize topics with front matter navigation.
                </li>
                <li class="flex items-center gap-2">
                  <div class="i-carbon-rocket text-primary" />
                  Deploy to the edge in seconds.
                </li>
              </ul>
            </div>
            <div class="rounded-xl border border-primary/20 bg-white/80 p-4 shadow-sm dark:border-light/20 dark:bg-primary/80">
              <p class="text-sm font-semibold text-primary dark:text-light">Integrations</p>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-200">
                Works with GitHub Actions, Cloudflare Pages, Netlify, and custom CI/CD pipelines out of the box.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-16 dark:bg-primary/70">
      <div class="container mx-auto space-y-12 px-6">
        <div class="space-y-4 text-center">
          <h2 class="text-2xl font-semibold text-primary dark:text-light sm:text-3xl">Everything you need for product-grade docs</h2>
          <p class="mx-auto max-w-3xl text-base text-gray-600 dark:text-gray-200">
            Tuff balances editorial flexibility with a structured DX. Pair Markdown content with Vue components, embed demos,
            and publish to any platform without leaving your workflow.
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-primary/60"
          >
            <div :class="[feature.icon, 'mb-4 h-10 w-10 rounded-full bg-primary/10 p-2.5 text-primary dark:bg-light/10 dark:text-light']" />
            <h3 class="text-lg font-semibold text-primary dark:text-light">
              {{ feature.title }}
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-200">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="container mx-auto space-y-10 px-6 py-16">
      <div class="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div class="space-y-6">
          <h2 class="text-2xl font-semibold text-primary dark:text-light sm:text-3xl">Opinionated workflow, flexible output</h2>
          <p class="text-base text-gray-600 dark:text-gray-200">
            Tuff embraces a documentation-as-code philosophy. Lint, test, and version your docs along with the rest of your product so everything ships together.
          </p>
          <div class="space-y-4">
            <div
              v-for="step in workflow"
              :key="step.title"
              class="rounded-xl border border-gray-200 p-5 shadow-sm dark:border-gray-700 dark:bg-primary/60"
            >
              <p class="text-sm font-semibold uppercase tracking-wide text-primary dark:text-light/80">
                {{ step.title }}
              </p>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-200">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
        <div class="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-8 dark:border-light/30 dark:bg-primary/70">
          <h3 class="text-lg font-semibold text-primary dark:text-light">Need to extend the platform?</h3>
          <p class="mt-3 text-sm text-gray-600 dark:text-gray-200">
            Build custom widgets, analytics hooks, or editorial workflows with the plugin API. Head to the marketplace to discover community-built extensions or publish your own.
          </p>
          <NuxtLink
            to="/marketplace"
            class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80 dark:text-light dark:hover:text-light/80"
          >
            Browse the marketplace
            <span class="i-carbon-arrow-right inline-flex h-4 w-4" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="bg-gray-900 py-16 text-light">
      <div class="container mx-auto space-y-12 px-6">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-3 max-w-2xl">
            <h2 class="text-2xl font-semibold sm:text-3xl">What teams ask before adopting Tuff</h2>
            <p class="text-sm text-light/80">
              We’ve built Tuff to replace brittle documentation sites with a modern, automated pipeline. Here are quick answers to the questions we hear most.
            </p>
          </div>
          <NuxtLink
            to="/docs/documents/start"
            class="inline-flex items-center justify-center rounded-lg border border-light/40 px-5 py-3 text-sm font-semibold transition hover:bg-light hover:text-primary"
          >
            Read implementation guide
          </NuxtLink>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div
            v-for="faq in faqs"
            :key="faq.question"
            class="rounded-2xl border border-light/20 bg-light/5 p-6 text-left"
          >
            <p class="text-sm font-semibold uppercase tracking-wide text-light/70">
              {{ faq.question }}
            </p>
            <p class="mt-3 text-sm text-light/80">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="container mx-auto px-6 py-20">
      <div class="rounded-3xl border border-primary/10 bg-primary/5 p-10 text-center shadow-sm dark:border-light/10 dark:bg-primary/60">
        <h2 class="text-2xl font-semibold text-primary dark:text-light sm:text-3xl">
          Launch your product documentation with confidence.
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-base text-gray-600 dark:text-gray-200">
          Clone the repository, import your content, and deploy to the platform that fits your stack. Tuff keeps your docs fast, discoverable, and always up to date.
        </p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <NuxtLink
            to="/docs"
            class="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary/90"
          >
            Get started
          </NuxtLink>
          <a
            href="https://github.com/tuff-docs/tuff-nexus"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center rounded-lg border border-primary/20 px-6 py-3 text-base font-semibold text-primary transition hover:border-primary hover:text-primary/90 dark:border-light/20 dark:text-light dark:hover:border-light/40"
          >
            Star on GitHub
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
