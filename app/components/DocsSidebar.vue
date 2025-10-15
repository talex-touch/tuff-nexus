<script setup lang="ts">
const { data: navigationTree, pending, error } = await useAsyncData(
  'docs-navigation',
  () => queryCollectionNavigation('docs'),
)
const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const SUPPORTED_LOCALES = ['en', 'zh']

const docLabels = computed<Record<string, string>>(() => ({
  '/docs/documents/start': t('docsNav.start'),
  '/docs/documents/start.zh': t('docsNav.start'),
}))

function stripLocalePrefix(path: string | null | undefined) {
  if (!path)
    return '/'
  for (const code of SUPPORTED_LOCALES) {
    const exact = `/${code}`
    if (path === exact)
      return '/'
    const prefixed = `${exact}/`
    if (path.startsWith(prefixed))
      return path.slice(exact.length) || '/'
  }
  return path
}

function normalizeContentPath(path: string | null | undefined) {
  if (!path)
    return null
  const fullPath = path.startsWith('/') ? path : `/${path}`
  return stripLocalePrefix(fullPath).replace(/\.(en|zh)$/, '')
}

const items = computed(() => navigationTree.value ?? [])

const sections = computed(() => {
  if (!items.value.length)
    return []
  const [first] = items.value
  if (first?.path === '/docs' && Array.isArray(first.children))
    return first.children
  return items.value
})

const expandedSections = ref<Record<string, boolean>>({})
const normalizedRoutePath = computed(() => stripLocalePrefix(route.path))

function isLinkActive(path: string) {
  const normalizedTarget = normalizeContentPath(path)
  if (!normalizedTarget)
    return false

  if (normalizedRoutePath.value === normalizedTarget)
    return true
  return normalizedRoutePath.value.startsWith(`${normalizedTarget}/`)
}

function itemTitle(title?: string, path?: string) {
  if (path) {
    const label = docLabels.value[path]
    if (label)
      return label
  }

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

function linkTarget(item: any) {
  if (!item?.path)
    return null

  if (item.page === false && Array.isArray(item.children) && item.children.length > 0)
    return normalizeContentPath(item.children[0].path)

  return normalizeContentPath(item.path)
}

function sectionKey(item: any) {
  return normalizeContentPath(item.path) ?? item.title ?? JSON.stringify(item)
}

function sectionContainsActive(item: any): boolean {
  const target = linkTarget(item)
  if (target && isLinkActive(target))
    return true
  if (Array.isArray(item.children))
    return item.children.some(child => sectionContainsActive(child))
  return false
}

function toggleSection(item: any) {
  const key = sectionKey(item)
  expandedSections.value = {
    ...expandedSections.value,
    [key]: !expandedSections.value[key],
  }
}

function isSectionExpanded(item: any) {
  const key = sectionKey(item)
  return expandedSections.value[key] ?? sectionContainsActive(item)
}

watch(
  () => [sections.value, normalizedRoutePath.value, locale.value],
  () => {
    const next: Record<string, boolean> = {}
    for (const section of sections.value) {
      const key = sectionKey(section)
      const shouldOpen = sectionContainsActive(section)
      if (shouldOpen)
        next[key] = true
      else if (expandedSections.value[key])
        next[key] = true
    }
    expandedSections.value = next
  },
  { immediate: true },
)
</script>

<template>
  <nav class="flex flex-col gap-3">
    <template v-if="pending">
      <div v-for="index in 6" :key="index" class="h-8 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800" />
    </template>
    <template v-else-if="error">
      <div class="border border-gray-200 rounded-md bg-white p-3 text-sm text-gray-500 dark:border-gray-800 dark:bg-dark/80 dark:text-gray-300">
        {{ t('docsSidebar.error') }}
      </div>
    </template>
    <template v-else>
      <div
        v-for="section in sections"
        :key="sectionKey(section)"
        class="overflow-hidden border border-primary/5 rounded-2xl bg-white/60 shadow-sm backdrop-blur transition dark:border-light/10 dark:bg-dark/70"
      >
        <button
          v-if="section.children && section.children.length"
          type="button"
          class="group w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm text-black/80 font-semibold transition hover:bg-dark/5 dark:text-light/80 dark:hover:bg-light/10"
          @click="toggleSection(section)"
        >
          <span class="flex-1 truncate">{{ itemTitle(section.title, section.path ?? undefined) }}</span>
          <span
            class="i-heroicons-chevron-down-20-solid text-base transition-transform duration-200"
            :class="isSectionExpanded(section) ? 'rotate-180 text-black dark:text-light' : 'text-black/40 dark:text-light/40'"
          />
        </button>
        <NuxtLink
          v-else-if="linkTarget(section)"
          :to="localePath(linkTarget(section)!)"
          class="flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold transition hover:bg-dark/5 dark:hover:bg-light/10"
          :class="isLinkActive(linkTarget(section) || section.path || '')
            ? 'text-black dark:text-light'
            : 'text-black/70 dark:text-light/70'"
        >
          <span class="truncate">
            {{ itemTitle(section.title, section.path ?? linkTarget(section) ?? undefined) }}
          </span>
          <span
            class="i-heroicons-arrow-up-right-20-solid text-base"
            :class="isLinkActive(linkTarget(section) || section.path || '') ? 'text-black dark:text-light' : 'text-black/40 dark:text-light/40'"
          />
        </NuxtLink>
        <transition
          enter-active-class="overflow-hidden transition-[max-height,opacity] duration-200 ease-out"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-[480px] opacity-100"
          leave-active-class="overflow-hidden transition-[max-height,opacity] duration-150 ease-in"
          leave-from-class="max-h-[480px] opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <ul
            v-if="section.children && section.children.length && isSectionExpanded(section)"
            class="flex flex-col gap-1 border-t border-primary/5 bg-white/80 px-3 py-3 dark:border-light/10 dark:bg-dark/60"
          >
            <li
              v-for="child in section.children"
              :key="child.path ?? child.title"
            >
              <NuxtLink
                v-if="linkTarget(child)"
                :to="localePath(linkTarget(child)!)"
                class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition"
                :class="isLinkActive(linkTarget(child) || child.path || '')
                  ? 'bg-dark/5 text-black font-semibold dark:bg-light/10 dark:text-light'
                  : 'text-black/70 hover:bg-dark/5 dark:text-light/70 dark:hover:bg-light/10'"
              >
                <span class="i-heroicons-minus-small-20-solid text-base opacity-40" />
                <span class="truncate">{{ itemTitle(child.title, child.path ?? linkTarget(child) ?? undefined) }}</span>
              </NuxtLink>
            </li>
          </ul>
        </transition>
      </div>
    </template>
  </nav>
</template>
