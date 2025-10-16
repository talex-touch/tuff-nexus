<script setup lang="ts">
import type { PluginCategoryId } from '~/utils/plugin-categories'
import { computed, reactive, ref } from 'vue'
import { PLUGIN_CATEGORIES } from '~/utils/plugin-categories'

definePageMeta({
  layout: 'marketplace',
  pageTransition: {
    name: 'fade',
    mode: 'out-in',
  },
})

defineI18nRoute(false)

const { t, locale } = useI18n()

interface MarketplacePluginAuthor {
  name: string
  avatarColor?: string
}

type PluginChannel = 'SNAPSHOT' | 'BETA' | 'RELEASE'

interface MarketplacePluginVersion {
  id: string
  channel: PluginChannel
  version: string
  createdAt: string
  signature: string
  packageUrl: string
  packageSize?: number
  changelog?: string | null
  readmeMarkdown?: string | null
}

interface MarketplacePluginSummary {
  id: string
  slug: string
  name: string
  summary: string
  category: string
  installs: number
  isOfficial: boolean
  badges: string[]
  iconUrl?: string | null
  author?: MarketplacePluginAuthor | null
  latestVersion?: MarketplacePluginVersion | null
}

interface MarketplacePluginDetail extends MarketplacePluginSummary {
  readmeMarkdown?: string | null
  versions?: MarketplacePluginVersion[]
}

type FilterCategory = PluginCategoryId | 'all'

const filters = reactive({
  search: '',
  category: 'all' as FilterCategory,
})

const selectedSlug = ref<string | null>(null)
const selectedPlugin = ref<MarketplacePluginDetail | null>(null)
const detailPending = ref(false)
const detailError = ref<string | null>(null)

const {
  data: pluginsPayload,
  pending: pluginsPending,
} = await useAsyncData('market-plugins', () =>
  $fetch<{ plugins: MarketplacePluginSummary[] }>('/api/market/plugins'))

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

function matchesCategoryFilter(plugin: MarketplacePluginSummary) {
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

async function openPluginDetail(plugin: MarketplacePluginSummary) {
  selectedSlug.value = plugin.slug
  selectedPlugin.value = null
  detailPending.value = true
  detailError.value = null
  try {
    const response = await $fetch<{ plugin: MarketplacePluginDetail }>(`/api/market/plugins/${plugin.slug}`)
    selectedPlugin.value = response.plugin
  }
  catch (error: unknown) {
    detailError.value = error instanceof Error ? error.message : t('market.detail.error', 'Unable to load plugin details.')
  }
  finally {
    detailPending.value = false
  }
}

function closePluginDetail() {
  selectedSlug.value = null
  selectedPlugin.value = null
  detailError.value = null
}

function formatPackageSize(bytes?: number) {
  if (!bytes || Number.isNaN(bytes))
    return t('market.detail.sizeUnknown', 'Size unknown')
  if (bytes >= 1024 * 1024)
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  return `${(bytes / 1024).toFixed(1)} KB`
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
  <section class="relative mx-auto max-w-6xl w-full flex flex-col gap-8 px-24 py-20 lg:px-12 sm:px-6">
    <div class="border border-primary/10 rounded-3xl bg-white/80 p-8 shadow-lg shadow-primary/10 backdrop-blur space-y-6 dark:border-light/15 dark:bg-dark/30 dark:shadow-light/10">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label class="w-full flex items-center gap-3 border border-primary/20 rounded-2xl bg-white/90 px-4 py-3 text-sm text-black/70 shadow-sm transition dark:border-light/20 focus-within:border-primary/40 dark:bg-dark/40 dark:text-light/80 focus-within:ring-2 focus-within:ring-primary/15">
          <span class="i-carbon-search text-lg" aria-hidden="true" />
          <input
            v-model="filters.search"
            type="search"
            :placeholder="t('market.search.placeholder')"
            :aria-label="t('market.search.label')"
            class="w-full bg-transparent text-sm text-black outline-none dark:text-light"
          >
        </label>
        <p class="text-xs text-black/50 font-semibold tracking-[0.35em] uppercase dark:text-light/60">
          {{ resultSummary }}
        </p>
      </div>

      <div class="flex flex-wrap gap-3">
        <button
          v-for="category in categoryOptions"
          :key="category.id"
          type="button"
          class="inline-flex items-center gap-2 border rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.35em] uppercase transition focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 focus-visible:outline dark:focus-visible:outline-light"
          :class="filters.category === category.id
            ? 'border-primary bg-dark text-white shadow-primary/30 dark:border-light dark:bg-light dark:text-black'
            : 'border-primary/15 bg-white/70 text-black hover:border-primary/30 hover:bg-white/90 hover:text-black/80 dark:border-light/20 dark:bg-dark/40 dark:text-light/80 dark:hover:border-light/30 dark:hover:bg-dark/30'"
          @click="filters.category = category.id"
        >
          <span
            v-if="category.icon"
            class="text-base" :class="[category.icon]"
            aria-hidden="true"
          />
          <span>{{ category.label }}</span>
        </button>
      </div>
    </div>

    <div
      v-if="pluginsPending"
      class="flex items-center justify-center gap-3 border border-primary/20 rounded-3xl border-dashed bg-dark/5 px-6 py-12 text-sm text-black/70 dark:border-light/20 dark:bg-light/5 dark:text-light/70"
    >
      <span class="i-carbon-circle-dash animate-spin text-base" aria-hidden="true" />
      <span>{{ t('dashboard.sections.plugins.loading') }}</span>
    </div>

    <div v-else>
      <div
        v-if="!hasPlugins"
        class="border border-primary/10 rounded-3xl bg-white/80 px-6 py-12 text-center text-sm text-black/70 shadow-sm dark:border-light/15 dark:bg-dark/30 dark:text-light/80"
      >
        {{ t('market.results.none') }}
      </div>
      <div
        v-else-if="!hasResults"
        class="border border-primary/10 rounded-3xl bg-white/80 px-6 py-12 text-center text-sm text-black/70 shadow-sm dark:border-light/15 dark:bg-dark/30 dark:text-light/80"
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
          class="group h-full flex flex-col justify-between border border-primary/10 rounded-3xl bg-white/90 p-6 shadow-sm transition dark:border-light/15 dark:bg-dark/30 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 dark:hover:shadow-light/10"
        >
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="size-12 flex items-center justify-center overflow-hidden border border-primary/15 rounded-2xl bg-dark/10 text-black dark:border-light/20 dark:bg-light/10 dark:text-light">
                  <img
                    v-if="plugin.iconUrl"
                    :src="plugin.iconUrl"
                    :alt="`${plugin.name} icon`"
                    class="h-full w-full object-cover"
                  >
                  <span v-else class="text-2xl font-semibold">
                    {{ plugin.name.charAt(0) }}
                  </span>
                </span>
                <div>
                  <h3 class="text-lg text-black font-semibold dark:text-light">
                    {{ plugin.name }}
                  </h3>
                  <p class="text-[11px] text-black/50 font-semibold tracking-[0.35em] uppercase dark:text-light/60">
                    {{ resolveCategoryLabel(plugin.category) }}
                  </p>
                </div>
              </div>
              <span class="inline-flex items-center gap-1 border border-primary/20 rounded-full bg-dark/5 px-3 py-1 text-[10px] text-black/80 font-semibold tracking-[0.35em] uppercase dark:border-light/20 dark:bg-light/10 dark:text-light/80">
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

            <p class="line-clamp-3 text-sm text-black/70 leading-relaxed dark:text-light/80">
              {{ plugin.summary }}
            </p>

            <div class="flex flex-wrap gap-2 text-xs text-black/60 dark:text-light/70">
              <span class="inline-flex items-center gap-1 rounded-full bg-dark/10 px-2 py-1 dark:bg-light/10 dark:text-light/80">
                <span class="i-carbon-calendar text-sm" aria-hidden="true" />
                {{ t('dashboard.sections.plugins.updatedOn', { date: formatDate(plugin.latestVersion?.createdAt) }) }}
              </span>
              <span class="inline-flex items-center gap-1 rounded-full bg-dark/10 px-2 py-1 dark:bg-light/10 dark:text-light/80">
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
                class="inline-flex items-center gap-1 rounded-full bg-dark/10 px-2 py-1 dark:bg-light/10 dark:text-light/80"
              >
                <span class="i-carbon-skill-level text-sm" aria-hidden="true" />
                {{ plugin.latestVersion.channel }}
              </span>
              <span class="inline-flex items-center gap-1 rounded-full bg-dark/10 px-2 py-1 dark:bg-light/10 dark:text-light/80">
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
                class="inline-flex items-center gap-1 border border-primary/15 rounded-full px-2 py-0.5 text-[10px] text-black/60 tracking-[0.35em] uppercase dark:border-light/20 dark:text-light/70"
              >
                <span class="i-carbon-tag text-xs" aria-hidden="true" />
                {{ badge }}
              </span>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-1 border border-primary/20 rounded-full px-3 py-1 text-[11px] text-black font-semibold tracking-[0.35em] uppercase transition dark:border-light/20 hover:border-primary/40 hover:bg-dark/10 dark:text-light dark:hover:bg-light/10"
              @click="openPluginDetail(plugin)"
            >
              <span class="i-carbon-open-panel-top text-sm" aria-hidden="true" />
              {{ t('market.actions.viewDetails') }}
            </button>
          </div>
        </article>
      </div>
    </div>
    <div
      v-if="selectedSlug"
      class="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10"
      @click.self="closePluginDetail"
    >
      <div class="relative max-w-3xl w-full border border-primary/10 rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur dark:border-light/15 dark:bg-dark/90">
        <button
          type="button"
          class="absolute right-4 top-4 h-9 w-9 inline-flex items-center justify-center border border-primary/20 rounded-full bg-white text-black transition dark:border-light/20 hover:border-primary/40 dark:bg-dark/70 hover:bg-primary/10 dark:text-light"
          @click="closePluginDetail"
        >
          <span class="i-carbon-close text-lg" aria-hidden="true" />
        </button>
        <div v-if="detailPending" class="flex items-center justify-center gap-3 py-16 text-sm text-black/70 dark:text-light/70">
          <span class="i-carbon-circle-dash animate-spin text-base" aria-hidden="true" />
          <span>{{ t('market.detail.loading') }}</span>
        </div>
        <div v-else-if="detailError" class="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-200">
          {{ detailError }}
        </div>
        <div v-else-if="selectedPlugin" class="space-y-6">
          <header class="space-y-3">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="text-2xl text-black font-semibold dark:text-light">
                {{ selectedPlugin.name }}
              </h2>
              <span
                class="inline-flex items-center gap-1 border border-primary/20 rounded-full px-3 py-1 text-[11px] text-black font-semibold tracking-[0.35em] uppercase dark:border-light/20 dark:text-light"
              >
                <span class="i-carbon-tag text-sm" aria-hidden="true" />
                {{ resolveCategoryLabel(selectedPlugin.category) }}
              </span>
              <span
                v-if="selectedPlugin.isOfficial"
                class="inline-flex items-center gap-1 border border-primary/20 rounded-full px-3 py-1 text-[11px] text-black font-semibold tracking-[0.35em] uppercase dark:border-light/20 dark:text-light"
              >
                <span class="i-carbon-certificate text-sm" aria-hidden="true" />
                {{ t('market.badges.official') }}
              </span>
            </div>
            <p class="text-sm text-black/70 dark:text-light/80">
              {{ selectedPlugin.summary }}
            </p>
            <p
              v-if="selectedPlugin.author?.name"
              class="text-xs text-black/50 dark:text-light/60"
            >
              {{ t('market.detail.author', { name: selectedPlugin.author.name }) }}
            </p>
            <div class="flex flex-wrap gap-2 text-xs text-black/60 dark:text-light/60">
              <span class="inline-flex items-center gap-1 rounded-full bg-dark/10 px-2 py-1 dark:bg-light/10 dark:text-light/80">
                <span class="i-carbon-user-multiple text-sm" aria-hidden="true" />
                {{ t('dashboard.sections.plugins.stats.installs', { count: formatInstalls(selectedPlugin.installs) }) }}
              </span>
              <span v-if="selectedPlugin.latestVersion" class="inline-flex items-center gap-1 rounded-full bg-dark/10 px-2 py-1 dark:bg-light/10 dark:text-light/80">
                <span class="i-carbon-cube text-sm" aria-hidden="true" />
                v{{ selectedPlugin.latestVersion.version }}
              </span>
              <span v-if="selectedPlugin.latestVersion" class="inline-flex items-center gap-1 rounded-full bg-dark/10 px-2 py-1 dark:bg-light/10 dark:text-light/80">
                <span class="i-carbon-time text-sm" aria-hidden="true" />
                {{ formatDate(selectedPlugin.latestVersion.createdAt) }}
              </span>
            </div>
            <div
              v-if="selectedPlugin.badges?.length"
              class="flex flex-wrap gap-2"
            >
              <span
                v-for="badge in selectedPlugin.badges"
                :key="badge"
                class="inline-flex items-center gap-1 border border-primary/15 rounded-full px-2 py-0.5 text-[10px] text-black/60 tracking-[0.35em] uppercase dark:border-light/20 dark:text-light/70"
              >
                <span class="i-carbon-tag text-xs" aria-hidden="true" />
                {{ badge }}
              </span>
            </div>
          </header>

          <section>
            <h3 class="text-sm text-black/70 font-semibold tracking-wide uppercase dark:text-light/70">
              {{ t('market.detail.readme') }}
            </h3>
            <div v-if="selectedPlugin.readmeMarkdown" class="mt-3 max-w-none prose prose-sm dark:prose-invert">
              <ContentRendererMarkdown :value="selectedPlugin.readmeMarkdown" />
            </div>
            <p v-else class="mt-3 text-sm text-black/60 dark:text-light/60">
              {{ t('market.detail.noReadme') }}
            </p>
          </section>

          <section>
            <h3 class="text-sm text-black/70 font-semibold tracking-wide uppercase dark:text-light/70">
              {{ t('market.detail.versions') }}
            </h3>
            <div
              v-if="selectedPlugin.versions?.length"
              class="mt-3 space-y-3"
            >
              <article
                v-for="version in selectedPlugin.versions"
                :key="version.id"
                class="border border-primary/10 rounded-2xl bg-white/80 p-4 text-sm text-black/70 dark:border-light/20 dark:bg-dark/70 dark:text-light/80"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-2 text-black font-semibold dark:text-light">
                    <span>v{{ version.version }}</span>
                    <span class="rounded-full bg-dark/10 px-2 py-0.5 text-[11px] text-black tracking-wide uppercase dark:bg-light/10 dark:text-light">
                      {{ version.channel }}
                    </span>
                  </div>
                  <span class="text-xs text-black/50 dark:text-light/60">
                    {{ formatDate(version.createdAt) }} · {{ formatPackageSize(version.packageSize) }}
                  </span>
                </div>
                <p v-if="version.changelog" class="mt-2 text-sm text-black/70 leading-relaxed dark:text-light/70">
                  {{ version.changelog }}
                </p>
                <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <a
                    :href="version.packageUrl"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-1 border border-primary/20 rounded-full px-3 py-1 text-xs text-black font-semibold tracking-wide uppercase transition dark:border-light/20 hover:border-primary/30 hover:bg-dark/10 dark:text-light dark:hover:bg-light/10"
                  >
                    <span class="i-carbon-download text-sm" aria-hidden="true" />
                    {{ t('market.detail.download') }}
                  </a>
                  <span class="inline-flex items-center gap-1 rounded-full bg-dark/10 px-2 py-0.5 text-[11px] text-black/60 dark:bg-light/10 dark:text-light/70">
                    <span class="i-carbon-hash text-xs" aria-hidden="true" />
                    {{ version.signature.slice(0, 12) }}…
                  </span>
                </div>
              </article>
            </div>
            <p v-else class="mt-3 text-sm text-black/60 dark:text-light/60">
              {{ t('market.detail.noVersions') }}
            </p>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>
