<script setup lang="ts">
definePageMeta({
  layout: 'docs',
})

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const SUPPORTED_LOCALES = ['en', 'zh']
const GITHUB_EDIT_BASE_URL = 'https://github.com/talex-touch/tuff-nexus/edit/main'

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

function normalizeContentPath(path: string | null | undefined) {
  if (!path)
    return null
  const prefixed = path.startsWith('/') ? path : `/${path}`
  return stripLocalePrefix(prefixed).replace(/\.(en|zh)$/, '')
}

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

const { data: navigationTree } = await useAsyncData(
  'docs:navigation',
  () => queryCollectionNavigation('docs'),
)

const outlineState = useState<any[]>('docs-toc', () => [])
const docTitleState = useState<string>('docs-title', () => '')
const docLocaleState = useState<string>('docs-locale', () => locale.value)

function resolveDocLocale(target: any) {
  const path = typeof target?._path === 'string' ? target._path : null
  if (!path)
    return 'en'
  if (path.endsWith('.zh'))
    return 'zh'
  if (path.endsWith('.en'))
    return 'en'
  return 'en'
}

const normalizedDocPath = computed(() => normalizeContentPath(doc.value?._path ?? docPath.value))

function itemTitle(title?: string, path?: string) {
  if (title)
    return title
  if (!path)
    return 'Untitled'

  return path
    .split('/')
    .filter(Boolean)
    .pop()
    ?.replace(/\.(en|zh)$/, '')
    ?.replace(/[-_]/g, ' ')
    ?.replace(/\b\w/g, c => c.toUpperCase()) ?? 'Untitled'
}

function collectSectionPages(node: any): any[] {
  if (!node)
    return []
  const queue = Array.isArray(node) ? node : [node]
  const result: any[] = []
  for (const current of queue) {
    if (!current)
      continue
    const currentPath = normalizeContentPath(current.path)
    if (currentPath && current.page !== false)
      result.push(current)
    if (Array.isArray(current.children) && current.children.length > 0)
      result.push(...collectSectionPages(current.children))
  }
  return result
}

const navigationSections = computed(() => {
  const items = navigationTree.value ?? []
  if (!items.length)
    return []
  const [first] = items
  if (first?.path === '/docs' && Array.isArray(first.children))
    return first.children
  return items
})

const docPager = computed(() => {
  const sections = navigationSections.value
  const currentPath = normalizedDocPath.value

  if (!sections.length || !currentPath)
    return { prev: null, next: null, sectionTitle: null }

  for (const section of sections) {
    const pages = collectSectionPages(section)
    const index = pages.findIndex(page => normalizeContentPath(page.path) === currentPath)
    if (index === -1)
      continue

    const prev = index > 0 ? pages[index - 1] : null
    const next = index < pages.length - 1 ? pages[index + 1] : null

    return {
      prev,
      next,
      sectionTitle: itemTitle(section.title, section.path),
    }
  }

  return { prev: null, next: null, sectionTitle: null }
})

const githubEditUrl = computed(() => {
  const file = doc.value?._file
  if (!file)
    return null
  const segments = [
    GITHUB_EDIT_BASE_URL,
    'content',
  ]
  if (file.path) {
    const normalized = file.path.startsWith('/') ? file.path.slice(1) : file.path
    segments.push(normalized)
  }
  else if (doc.value?._path) {
    const normalized = doc.value._path.replace(/^\//, '')
    segments.push(`${normalized}${file.extension ? '' : '.md'}`)
  }

  let url = segments.join('/')
  if (file.extension && !url.endsWith(`.${file.extension}`))
    url = `${url}.${file.extension}`

  return url
})

const lastUpdatedDate = computed(() => {
  const source = doc.value
  if (!source)
    return null

  const candidates = [
    source.updatedAt,
    source.modifiedAt,
    source._file?.mtime,
    source._file?.createdAt,
    source._file?.updatedAt,
  ]

  for (const candidate of candidates) {
    if (!candidate)
      continue
    const value = new Date(candidate)
    if (!Number.isNaN(value.getTime()))
      return value
  }

  return null
})

const formattedLastUpdated = computed(() => {
  if (!lastUpdatedDate.value)
    return null
  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(lastUpdatedDate.value)
})

const pagerPrevPath = computed(() => {
  const entry = docPager.value.prev
  return entry ? normalizeContentPath(entry.path) : null
})

const pagerNextPath = computed(() => {
  const entry = docPager.value.next
  return entry ? normalizeContentPath(entry.path) : null
})

const pagerPrevTitle = computed(() => {
  const entry = docPager.value.prev
  return entry ? itemTitle(entry.title, entry.path) : null
})

const pagerNextTitle = computed(() => {
  const entry = docPager.value.next
  return entry ? itemTitle(entry.title, entry.path) : null
})

watchEffect(() => {
  if (doc.value) {
    outlineState.value = doc.value.body?.toc?.links ?? []
    docTitleState.value = doc.value.title ?? doc.value.head?.title ?? ''
    docLocaleState.value = resolveDocLocale(doc.value)
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
      class="docs-surface px-8 py-10 space-y-10"
    >
      <ContentRenderer
        :value="doc"
        class="docs-prose max-w-none prose prose-neutral dark:prose-invert"
      />
      <div
        v-if="githubEditUrl || formattedLastUpdated"
        class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dark/10 bg-white/80 px-5 py-4 text-sm text-black/70 dark:border-light/10 dark:bg-white/5 dark:text-light/70"
      >
        <div v-if="formattedLastUpdated" class="flex items-center gap-2">
          <span class="i-carbon-time text-base" />
          <span>
            {{ t('docs.lastUpdatedLabel') }}
            <strong class="font-semibold text-black dark:text-light">{{ formattedLastUpdated }}</strong>
          </span>
        </div>
        <NuxtLink
          v-if="githubEditUrl"
          :href="githubEditUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-full border border-primary/40 px-3 py-2 text-sm font-medium text-primary no-underline transition hover:border-primary hover:bg-primary/10 dark:border-primary/60 dark:text-primary-200 dark:hover:border-primary-200 dark:hover:bg-primary/15"
        >
          <span class="i-carbon-logo-github text-base" />
          {{ t('docs.editOnGitHub') }}
        </NuxtLink>
      </div>

      <div v-if="pagerPrevPath || pagerNextPath" class="space-y-4">
        <div v-if="docPager.sectionTitle" class="text-xs uppercase tracking-[0.2em] text-black/40 dark:text-light/40">
          {{ docPager.sectionTitle }}
        </div>
        <div class="grid gap-4 lg:grid-cols-2">
          <NuxtLink
            v-if="pagerPrevPath"
            :to="localePath(pagerPrevPath)"
            class="group flex flex-col gap-2 rounded-2xl border border-dark/10 px-5 py-4 no-underline transition hover:border-dark/20 hover:bg-dark/5 dark:border-light/10 dark:hover:border-light/20 dark:hover:bg-light/5"
          >
            <span class="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-black/40 group-hover:text-primary dark:text-light/40 dark:group-hover:text-primary-200">
              <span class="i-carbon-arrow-left text-base" />
              {{ t('docs.previousChapter') }}
            </span>
            <span class="text-base font-semibold text-black transition group-hover:text-primary dark:text-light dark:group-hover:text-primary-200">
              {{ pagerPrevTitle }}
            </span>
          </NuxtLink>
          <NuxtLink
            v-if="pagerNextPath"
            :to="localePath(pagerNextPath)"
            class="group flex flex-col gap-2 rounded-2xl border border-dark/10 px-5 py-4 no-underline transition hover:border-primary/30 hover:bg-primary/5 dark:border-light/10 dark:hover:border-primary/40 dark:hover:bg-primary/10"
          >
            <span class="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-black/40 group-hover:text-primary dark:text-light/40 dark:group-hover:text-primary-200">
              {{ t('docs.nextChapter') }}
              <span class="i-carbon-arrow-right text-base" />
            </span>
            <span class="text-base font-semibold text-black transition group-hover:text-primary dark:text-light dark:group-hover:text-primary-200">
              {{ pagerNextTitle }}
            </span>
          </NuxtLink>
        </div>
      </div>
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
