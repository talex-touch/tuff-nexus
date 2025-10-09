<script setup lang="ts">
definePageMeta({
  layout: 'docs'
})

import { computed } from 'vue'

const route = useRoute()
const { locale, t } = useI18n()

const docPath = computed(() => {
  const rawPath = route.path.endsWith('/') && route.path.length > 1
    ? route.path.slice(0, -1)
    : route.path
  return rawPath || '/docs'
})

const localizedPath = computed(() => {
  if (locale.value === 'en')
    return docPath.value
  return `${docPath.value}.${locale.value}`
})

const { data: doc, status } = await useAsyncData(
  () => `doc:${docPath.value}:${locale.value}`,
  async () => {
    const localizedDoc = await queryCollection('docs').path(localizedPath.value).first()
    if (localizedDoc)
      return localizedDoc

    return await queryCollection('docs').path(docPath.value).first()
  },
  { watch: [docPath, locale] },
)
</script>

<template>
  <div class="relative">
    <div
      v-if="status === 'pending'"
      class="flex items-center justify-center rounded-3xl border border-primary/10 bg-white/70 px-6 py-20 text-sm text-gray-500 dark:border-light/10 dark:bg-primary/70 dark:text-gray-300"
    >
      <span class="i-carbon-circle-dash text-lg" />
      <span class="ml-3">{{ t('docs.loading') }}</span>
    </div>

    <div
      v-else-if="doc"
      class="docs-surface rounded-3xl border border-primary/5 bg-white/80 px-8 py-10 shadow-sm dark:border-light/10 dark:bg-primary/70"
    >
      <ContentRenderer
        :value="doc"
        class="docs-prose prose prose-neutral max-w-none dark:prose-invert"
      />
    </div>

    <div
      v-else
      class="space-y-4 rounded-3xl border border-primary/10 bg-white/80 p-10 text-center shadow-sm dark:border-light/10 dark:bg-primary/70"
    >
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-3xl text-primary dark:bg-light/10 dark:text-light">
        <span class="i-carbon-warning" />
      </div>
      <div class="text-lg font-semibold text-primary dark:text-light">
        {{ t('docs.notFoundTitle') }}
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-300">
        {{ t('docs.notFoundDescription') }}
      </p>
      <NuxtLink
        to="/docs"
        class="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-light transition hover:bg-black dark:bg-light dark:text-primary dark:hover:bg-light/90"
      >
        <span class="i-carbon-arrow-left text-base" />
        {{ t('docs.backHome') }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
:deep(.docs-prose h1) {
  font-size: 2.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

:deep(.docs-prose h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}

:deep(.docs-prose p),
:deep(.docs-prose ul),
:deep(.docs-prose ol) {
  line-height: 1.75;
}

:deep(.docs-prose code) {
  border-radius: 0.4rem;
  padding: 0.2rem 0.4rem;
  background-color: rgba(18, 18, 18, 0.06);
}

:deep(.dark .docs-prose code) {
  background-color: rgba(250, 250, 250, 0.08);
}
</style>
