<script setup lang="ts">
definePageMeta({
  layout: 'docs',
})

const route = useRoute()
const { locale, t } = useI18n()

const SUPPORTED_LOCALES = ['en', 'zh']

function stripLocalePrefix(path: string) {
  if (!path)
    return '/'
  for (const code of SUPPORTED_LOCALES) {
    const exact = `/${code}`
    if (path === exact || path === `${exact}/`)
      return '/'
    const prefixed = `${exact}/`
    if (path.startsWith(prefixed))
      return path.slice(exact.length) || '/'
  }
  return path
}

const docPath = computed(() => {
  const rawPath = route.path.endsWith('/') && route.path.length > 1
    ? route.path.slice(0, -1)
    : route.path
  const normalized = stripLocalePrefix(rawPath)
  return normalized || '/docs'
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

const outlineState = useState<any[]>('docs-toc', () => [])
const docTitleState = useState<string>('docs-title', () => '')
const docLocaleState = useState<string>('docs-locale', () => locale.value)

watchEffect(() => {
  if (doc.value) {
    outlineState.value = doc.value.body?.toc?.links ?? []
    docTitleState.value = doc.value.title ?? doc.value.head?.title ?? ''
    docLocaleState.value = locale.value
  }
  else {
    outlineState.value = []
    docTitleState.value = ''
    docLocaleState.value = locale.value
  }
})

onBeforeUnmount(() => {
  outlineState.value = []
  docTitleState.value = ''
})
</script>

<template>
  <div class="relative">
    <div
      v-if="status === 'pending'"
      class="flex items-center justify-center px-6 py-20 text-sm text-gray-500 dark:bg-dark/70 dark:text-gray-300"
    >
      <span class="i-carbon-circle-dash text-lg" />
      <span class="ml-3">{{ t('docs.loading') }}</span>
    </div>

    <div
      v-else-if="doc"
      class="docs-surface px-8 py-10"
    >
      <ContentRenderer
        :value="doc"
        class="docs-prose max-w-none prose prose-neutral dark:prose-invert"
      />
    </div>

    <div
      v-else
      class="p-10 text-center space-y-4"
    >
      <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-dark/5 text-3xl text-black dark:bg-light/10 dark:text-light">
        <span class="i-carbon-warning" />
      </div>
      <div class="text-lg text-black font-semibold dark:text-light">
        {{ t('docs.notFoundTitle') }}
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-300">
        {{ t('docs.notFoundDescription') }}
      </p>
      <NuxtLink
        to="/docs"
        class="inline-flex items-center justify-center gap-2 rounded-full bg-dark px-5 py-2 text-sm text-light font-medium no-underline transition dark:bg-light hover:bg-black dark:text-black dark:hover:bg-light/90"
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
