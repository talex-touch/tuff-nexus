<script setup lang="ts">
import { computed, reactive } from 'vue'
import { PLUGIN_CATEGORIES } from '~/utils/plugin-categories'
import type { PluginCategoryId } from '~/utils/plugin-categories'

definePageMeta({
  layout: 'home',
  pageTransition: {
    name: 'fade',
    mode: 'out-in',
  },
})

defineI18nRoute(false)

const { t, locale } = useI18n()

interface DashboardPluginAuthor {
  name: string
  avatarColor?: string
}

type PluginChannel = 'SNAPSHOT' | 'BETA' | 'RELEASE'

interface DashboardPluginVersion {
  id: string
  channel: PluginChannel
  version: string
  iconUrl: string
  createdAt: string
  signature: string
  readmeMarkdown?: string | null
}

interface DashboardPlugin {
  id: string
  name: string
  summary: string
  category: string
  installs: number
  isOfficial: boolean
  badges: string[]
  author?: DashboardPluginAuthor | null
  latestVersion?: DashboardPluginVersion | null
}

type FilterCategory = PluginCategoryId | 'all'

const filters = reactive({
  search: '',
  category: 'all' as FilterCategory,
})

const {
  data: pluginsPayload,
  pending: pluginsPending,
} = await useAsyncData('market-plugins', () =>
  $fetch<{ plugins: DashboardPlugin[] }>('/api/market/plugins'),
)

const localeTag = computed(() => (locale.value === 'zh' ? 'zh-CN' : 'en-US'))

const numberFormatter = computed(() => new Intl.NumberFormat(localeTag.value))
const dateFormatter = computed(() => new Intl.DateTimeFormat(localeTag.value, { dateStyle: 'medium' }))

const categoryOptions = computed(() => [
  {
    id: 'all' as const,
    icon: 'i-carbon-view-all',
    label: t('market.filters.all'),
  },
  ...PLUGIN_CATEGORIES.map(category => ({
    ...category,
    label: t(category.i18nKey),
  })),
])

const categoryLabels = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {}
  for (const option of categoryOptions.value) {
    if (option.id === 'all')
      continue
    map[option.id] = option.label
    map[option.id.toLowerCase()] = option.label
    map[option.label] = option.label
    map[option.label.toLowerCase()] = option.label
  }
  return map
})

const allPlugins = computed(() => (pluginsPayload.value?.plugins ?? []).filter(plugin => plugin.latestVersion))

const totalPlugins = computed(() => allPlugins.value.length)

const normalizedSearch = computed(() => filters.search.trim().toLowerCase())

function resolveCategoryLabel(category: string) {
  const exact = categoryLabels.value[category]
  if (exact)
    return exact
  const lower = categoryLabels.value[category.toLowerCase()]
  if (lower)
    return lower
  return category
}

function matchesCategoryFilter(plugin: DashboardPlugin) {
  if (filters.category === 'all')
    return true

  const target = filters.category
  if (plugin.category === target)
    return true

  const pluginLower = plugin.category.toLowerCase()
  if (pluginLower === target)
    return true

  const desiredLabel = categoryLabels.value[target]
  if (!desiredLabel)
    return true

  const pluginLabel = resolveCategoryLabel(plugin.category)
  return pluginLabel === desiredLabel || pluginLabel.toLowerCase() === desiredLabel.toLowerCase()
}

const filteredPlugins = computed(() => {
  const query = normalizedSearch.value

  return allPlugins.value.filter((plugin) => {
    if (!matchesCategoryFilter(plugin))
      return false

    if (!query.length)
      return true

    const categoryLabel = resolveCategoryLabel(plugin.category)
    const haystack = [
      plugin.name,
      plugin.summary,
      plugin.latestVersion?.version ?? '',
      plugin.latestVersion?.channel ?? '',
      plugin.author?.name ?? '',
      categoryLabel,
      plugin.badges.join(' '),
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(query)
  })
})

const hasResults = computed(() => filteredPlugins.value.length > 0)
const hasPlugins = computed(() => totalPlugins.value > 0)

const resultSummary = computed(() => {
  const total = totalPlugins.value
  const count = filteredPlugins.value.length

  if (!total)
    return t('market.results.none')

  if (count === total)
    return t('market.results.count', { count })

  return t('market.results.filtered', { count, total })
})

function formatInstalls(count: number) {
  return numberFormatter.value.format(count)
}

function formatDate(value?: string) {
  if (!value)
    return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime()))
    return value
  return dateFormatter.value.format(parsed)
}

const pageTitle = computed(() => `${t('nav.market')} · Tuff Nexus`)
const pageDescription = computed(() => t('market.hero.subtitle'))

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: pageDescription,
  ogDescription: pageDescription,
})
</script>

<template>
  <section class="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-24 py-20 lg:px-12 sm:px-6">
    <header class="space-y-4 text-center">
      <p class="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary/70 dark:border-light/20 dark:bg-light/10 dark:text-light/80">
        <span class="i-carbon-store text-sm" aria-hidden="true" />
        {{ t('market.hero.badge') }}
      </p>
      <h1 class="text-3xl font-semibold text-primary sm:text-4xl dark:text-light">
        {{ t('market.hero.title') }}
      </h1>
      <p class="mx-auto max-w-2xl text-base text-primary/70 dark:text-light/80">
        {{ t('market.hero.subtitle') }}
      </p>
    </header>

    <div class="space-y-6 rounded-3xl border border-primary/10 bg-white/80 p-8 shadow-lg shadow-primary/10 backdrop-blur dark:border-light/15 dark:bg-primary/30 dark:shadow-light/10">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label class="flex w-full items-center gap-3 rounded-2xl border border-primary/20 bg-white/90 px-4 py-3 text-sm text-primary/70 shadow-sm transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15 dark:border-light/20 dark:bg-primary/40 dark:text-light/80">
          <span class="i-carbon-search text-lg" aria-hidden="true" />
          <input
            v-model="filters.search"
            type="search"
            :placeholder="t('market.search.placeholder')"
            :aria-label="t('market.search.label')"
            class="w-full bg-transparent text-sm text-primary outline-none dark:text-light"
          >
        </label>
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-primary/50 dark:text-light/60">
          {{ resultSummary }}
        </p>
      </div>

      <div class="flex flex-wrap gap-3">
        <button
          v-for="category in categoryOptions"
          :key="category.id"
          type="button"
          class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:focus-visible:outline-light"
          :class="filters.category === category.id
            ? 'border-primary bg-primary text-white shadow-primary/30 dark:border-light dark:bg-light dark:text-primary'
            : 'border-primary/15 bg-white/70 text-primary hover:border-primary/30 hover:bg-white/90 hover:text-primary/80 dark:border-light/20 dark:bg-primary/40 dark:text-light/80 dark:hover:border-light/30 dark:hover:bg-primary/30'"
          @click="filters.category = category.id"
        >
          <span
            v-if="category.icon"
            :class="[category.icon, 'text-base']"
            aria-hidden="true"
          />
          <span>{{ category.label }}</span>
        </button>
      </div>
    </div>

    <div
      v-if="pluginsPending"
      class="flex items-center justify-center gap-3 rounded-3xl border border-dashed border-primary/20 bg-primary/5 px-6 py-12 text-sm text-primary/70 dark:border-light/20 dark:bg-light/5 dark:text-light/70"
    >
      <span class="i-carbon-circle-dash animate-spin text-base" aria-hidden="true" />
      <span>{{ t('dashboard.sections.plugins.loading') }}</span>
    </div>

    <div v-else>
      <div
        v-if="!hasPlugins"
        class="rounded-3xl border border-primary/10 bg-white/80 px-6 py-12 text-center text-sm text-primary/70 shadow-sm dark:border-light/15 dark:bg-primary/30 dark:text-light/80"
      >
        {{ t('market.results.none') }}
      </div>
      <div
        v-else-if="!hasResults"
        class="rounded-3xl border border-primary/10 bg-white/80 px-6 py-12 text-center text-sm text-primary/70 shadow-sm dark:border-light/15 dark:bg-primary/30 dark:text-light/80"
      >
        {{ t('market.results.empty') }}
      </div>
      <div
        v-else
        class="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        <article
          v-for="plugin in filteredPlugins"
          :key="plugin.id"
          class="group flex h-full flex-col justify-between rounded-3xl border border-primary/10 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 dark:border-light/15 dark:bg-primary/30 dark:hover:shadow-light/10"
        >
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="flex size-12 items-center justify-center overflow-hidden rounded-2xl border border-primary/15 bg-primary/10 text-primary dark:border-light/20 dark:bg-light/10 dark:text-light">
                  <img
                    v-if="plugin.latestVersion?.iconUrl"
                    :src="plugin.latestVersion.iconUrl"
                    :alt="`${plugin.name} icon`"
                    class="h-full w-full object-cover"
                  >
                  <span v-else class="text-2xl font-semibold">
                    {{ plugin.name.charAt(0) }}
                  </span>
                </span>
                <div>
                  <h3 class="text-lg font-semibold text-primary dark:text-light">
                    {{ plugin.name }}
                  </h3>
                  <p class="text-[11px] font-semibold uppercase tracking-[0.35em] text-primary/50 dark:text-light/60">
                    {{ resolveCategoryLabel(plugin.category) }}
                  </p>
                </div>
              </div>
              <span class="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary/80 dark:border-light/20 dark:bg-light/10 dark:text-light/80">
                <span class="i-carbon-badge text-sm" aria-hidden="true" />
                <template v-if="plugin.isOfficial">
                  {{ t('market.badges.official') }}
                </template>
                <template v-else-if="plugin.author">
                  {{ plugin.author.name }}
                </template>
                <template v-else>
                  {{ t('market.badges.community', 'Community') }}
                </template>
              </span>
            </div>

            <p class="line-clamp-3 text-sm leading-relaxed text-primary/70 dark:text-light/80">
              {{ plugin.summary }}
            </p>

            <div class="flex flex-wrap gap-2 text-xs text-primary/60 dark:text-light/70">
              <span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 dark:bg-light/10 dark:text-light/80">
                <span class="i-carbon-calendar text-sm" aria-hidden="true" />
                {{ t('dashboard.sections.plugins.updatedOn', { date: formatDate(plugin.latestVersion?.createdAt) }) }}
              </span>
              <span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 dark:bg-light/10 dark:text-light/80">
                <span class="i-carbon-version text-sm" aria-hidden="true" />
                <template v-if="plugin.latestVersion">
                  v{{ plugin.latestVersion.version }}
                </template>
                <template v-else>
                  —
                </template>
              </span>
              <span
                v-if="plugin.latestVersion"
                class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 dark:bg-light/10 dark:text-light/80"
              >
                <span class="i-carbon-skill-level text-sm" aria-hidden="true" />
                {{ plugin.latestVersion.channel }}
              </span>
              <span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 dark:bg-light/10 dark:text-light/80">
                <span class="i-carbon-user-multiple text-sm" aria-hidden="true" />
                {{ t('dashboard.sections.plugins.stats.installs', { count: formatInstalls(plugin.installs) }) }}
              </span>
            </div>

            <div
              v-if="plugin.badges.length"
              class="flex flex-wrap gap-2"
            >
              <span
                v-for="badge in plugin.badges"
                :key="badge"
                class="inline-flex items-center gap-1 rounded-full border border-primary/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.35em] text-primary/60 dark:border-light/20 dark:text-light/70"
              >
                <span class="i-carbon-tag text-xs" aria-hidden="true" />
                {{ badge }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
