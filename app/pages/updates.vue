<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { releaseChannels, releaseEntries } from '~/data/updates'
import type { ReleaseChannelId, ReleaseEntryDefinition } from '~/data/updates'

definePageMeta({
  layout: 'home',
  pageTransition: {
    name: 'fade',
    mode: 'out-in',
  },
})

const { t, tm, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const channelIds = releaseChannels.map(channel => channel.id)

function isSameQuery(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
) {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length)
    return false
  return keysA.every(key => a[key] === b[key])
}

function resolveChannel(value: unknown): ReleaseChannelId {
  if (typeof value === 'string' && channelIds.includes(value as ReleaseChannelId))
    return value as ReleaseChannelId
  return 'release'
}

const selectedChannel = ref<ReleaseChannelId>(resolveChannel(route.query.channel))
const historyExpanded = ref(false)

watch(
  () => route.query.channel,
  (channel) => {
    selectedChannel.value = resolveChannel(channel)
  },
)

watch(selectedChannel, (channel) => {
  historyExpanded.value = false
  const nextQuery = channel === 'release' ? { ...route.query } : { ...route.query, channel }

  if (channel === 'release' && route.query.channel)
    delete nextQuery.channel

  if (!isSameQuery(nextQuery, route.query))
    router.replace({ query: nextQuery })
})

const channelOptions = computed(() =>
  releaseChannels.map(channel => ({
    id: channel.id,
    icon: channel.icon,
    badge: t(channel.badgeKey),
    label: t(channel.labelKey),
    description: t(channel.descriptionKey),
    meta: t(channel.metaKey),
  })),
)

const filteredEntries = computed(() => {
  return releaseEntries
    .filter(entry => entry.channel === selectedChannel.value)
    .slice()
    .sort((a, b) => new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime())
})

const latestEntry = computed<ReleaseEntryDefinition | null>(() => filteredEntries.value[0] ?? null)
const historyEntries = computed(() => filteredEntries.value.slice(1))

const hasHistory = computed(() => historyEntries.value.length > 0)

watch(historyExpanded, (expanded) => {
  const nextQuery = expanded
    ? { ...route.query, history: '1' }
    : { ...route.query }

  if (!expanded && nextQuery.history)
    delete nextQuery.history

  if (!isSameQuery(nextQuery, route.query))
    router.replace({ query: nextQuery })
})

watch(
  () => route.query.history,
  (historyValue) => {
    historyExpanded.value = historyValue === '1'
  },
)

const dateFormatter = computed(() => new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium' }))

function formatReleaseDate(dateString: string) {
  const parsed = new Date(dateString)
  if (Number.isNaN(parsed.getTime()))
    return t('updates.latest.releaseDateFallback')
  return dateFormatter.value.format(parsed)
}

function entrySummary(key: string) {
  return t(`updates.entries.${key}.summary`)
}

function entryHighlights(key: string) {
  const highlights = tm(`updates.entries.${key}.highlights`)
  return Array.isArray(highlights) ? (highlights as string[]) : []
}

function channelLabel(id: ReleaseChannelId) {
  const channel = channelOptions.value.find(option => option.id === id)
  return channel ? channel.label : id
}
</script>

<template>
  <section class="relative mx-auto flex min-h-screen w-full flex-col gap-12 px-24 py-24 lg:px-12 sm:px-6 sm:py-20">
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-6 text-center">
      <p class="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary/70 dark:border-light/20 dark:bg-light/15 dark:text-light/80">
        {{ t('updates.badge') }}
      </p>
      <h1 class="text-4xl font-semibold tracking-tight text-primary dark:text-light sm:text-5xl">
        {{ t('updates.title') }}
      </h1>
      <p class="mx-auto max-w-2xl text-base text-primary/70 dark:text-light/80">
        {{ t('updates.subtitle') }}
      </p>
    </div>

    <div class="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <p class="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60 dark:text-light/60">
        {{ t('updates.channelSelector.label') }}
      </p>
      <div class="grid gap-4 sm:grid-cols-2">
        <button
          v-for="option in channelOptions"
          :key="option.id"
          type="button"
          class="group flex flex-col gap-4 rounded-3xl border border-primary/15 bg-white/70 p-6 text-left shadow-[0_24px_80px_rgba(17,35,85,0.12)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_30px_110px_rgba(17,35,85,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 dark:border-light/20 dark:bg-primary/40 dark:text-light dark:shadow-[0_24px_80px_rgba(5,9,25,0.45)] dark:hover:shadow-[0_30px_120px_rgba(5,9,25,0.55)]"
          :class="selectedChannel === option.id ? 'border-primary/50 bg-primary/5 dark:border-light/60 dark:bg-light/10' : ''"
          @click="selectedChannel = option.id"
        >
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary/70 dark:border-light/20 dark:bg-light/15 dark:text-light/70">
              <span :class="option.icon" class="text-base" aria-hidden="true" />
              {{ option.badge }}
            </span>
            <span
              v-if="selectedChannel === option.id"
              class="i-carbon-checkbox-checked text-xl text-primary dark:text-light"
              aria-hidden="true"
            />
            <span
              v-else
              class="i-carbon-checkbox text-xl text-primary/40 dark:text-light/40"
              aria-hidden="true"
            />
          </div>
          <div class="space-y-2">
            <h2 class="text-xl font-semibold text-primary dark:text-light">
              {{ option.label }}
            </h2>
            <p class="text-sm text-primary/70 dark:text-light/70">
              {{ option.description }}
            </p>
          </div>
          <p class="text-xs font-medium uppercase tracking-[0.24em] text-primary/50 dark:text-light/60">
            {{ option.meta }}
          </p>
        </button>
      </div>
    </div>

    <div
      v-if="latestEntry"
      class="mx-auto grid w-full max-w-5xl gap-6 rounded-[36px] border border-primary/10 bg-white/80 p-10 shadow-[0_40px_130px_rgba(17,35,85,0.15)] lg:grid-cols-[1.15fr_0.85fr] dark:border-light/15 dark:bg-primary/40 dark:text-light/90 dark:shadow-[0_40px_120px_rgba(5,9,25,0.55)] sm:p-8"
    >
      <article class="flex flex-col gap-6">
        <header class="flex flex-col gap-2">
          <div class="flex items-center gap-3 text-sm text-primary/70 dark:text-light/70">
            <span class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary/70 dark:border-light/20 dark:bg-light/10 dark:text-light/70">
              {{ t('updates.latest.heading') }}
            </span>
            <span class="text-xs font-medium uppercase tracking-[0.24em] text-primary/50 dark:text-light/60">
              {{ channelLabel(latestEntry.channel) }}
            </span>
          </div>
          <h2 class="text-3xl font-semibold text-primary dark:text-light">
            {{ latestEntry.version }}
          </h2>
          <p class="text-sm font-medium uppercase tracking-[0.24em] text-primary/50 dark:text-light/60">
            {{ t('updates.latest.releaseDate', { date: formatReleaseDate(latestEntry.releasedAt) }) }}
          </p>
        </header>
        <p class="text-base text-primary/80 dark:text-light/80">
          {{ entrySummary(latestEntry.key) }}
        </p>
        <div class="space-y-3">
          <h3 class="text-sm font-semibold uppercase tracking-[0.3em] text-primary/50 dark:text-light/60">
            {{ t('updates.latest.highlightsHeading') }}
          </h3>
          <ul class="space-y-3">
            <li
              v-for="highlight in entryHighlights(latestEntry.key)"
              :key="highlight"
              class="flex items-start gap-3 rounded-2xl border border-primary/10 bg-primary/5 p-3 text-sm text-primary/80 dark:border-light/10 dark:bg-light/10 dark:text-light/80"
            >
              <span class="i-carbon-dot-mark text-base text-primary/60 dark:text-light/60" aria-hidden="true" />
              <span>{{ highlight }}</span>
            </li>
          </ul>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <NuxtLink
            :to="latestEntry.notesPath"
            class="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(12,32,98,0.35)] transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 dark:bg-light dark:text-primary dark:hover:bg-light/90"
          >
            <span class="i-carbon-document-view text-base" aria-hidden="true" />
            {{ t('updates.latest.notesCta') }}
          </NuxtLink>
          <a
            v-for="download in latestEntry.downloads"
            :key="download.id"
            :href="download.href"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 rounded-full border border-primary/20 px-5 py-2.5 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-light/25 dark:text-light dark:hover:border-light/60 dark:hover:bg-light/10"
          >
            <span class="i-carbon-download text-base" aria-hidden="true" />
            {{ t(download.labelKey) }}
          </a>
        </div>
      </article>

      <aside class="flex h-full flex-col justify-between gap-6 rounded-[28px] border border-primary/10 bg-primary/5 p-6 text-sm text-primary/70 dark:border-light/15 dark:bg-light/10 dark:text-light/70">
        <div class="space-y-4">
          <h3 class="text-base font-semibold text-primary dark:text-light">
            {{ t('updates.channelSummary.title') }}
          </h3>
          <p class="text-sm">
            {{ t('updates.channelSummary.description', { channel: channelLabel(selectedChannel) }) }}
          </p>
        </div>
        <div class="space-y-2 text-xs text-primary/60 dark:text-light/60">
          <p>{{ t('updates.channelSummary.refreshHint') }}</p>
          <p>{{ t('updates.channelSummary.feedback') }}</p>
        </div>
      </aside>
    </div>

    <div
      v-else
      class="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 rounded-[32px] border border-primary/15 bg-primary/5 px-8 py-16 text-center text-primary/70 dark:border-light/15 dark:bg-light/10 dark:text-light/70"
    >
      <span class="i-carbon-incomplete text-3xl" aria-hidden="true" />
      <p>{{ t('updates.empty') }}</p>
    </div>

    <div
      v-if="filteredEntries.length"
      class="mx-auto flex w-full max-w-5xl flex-col gap-4"
    >
      <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-xl font-semibold text-primary dark:text-light">
            {{ t('updates.table.title') }}
          </h3>
          <p class="text-sm text-primary/70 dark:text-light/70">
            {{ t('updates.table.description', { channel: channelLabel(selectedChannel) }) }}
          </p>
        </div>
        <button
          v-if="hasHistory"
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-light/25 dark:text-light dark:hover:border-light/60 dark:hover:bg-light/10"
          @click="historyExpanded = !historyExpanded"
        >
          <span :class="historyExpanded ? 'i-carbon-collapse-all' : 'i-carbon-expand-all'" class="text-base" aria-hidden="true" />
          {{ historyExpanded ? t('updates.table.hideLabel') : t('updates.table.toggleLabel') }}
        </button>
      </div>

      <transition name="fade">
        <div
          v-if="historyExpanded"
          class="overflow-hidden rounded-[28px] border border-primary/10 bg-white/70 shadow-[0_32px_110px_rgba(17,35,85,0.12)] dark:border-light/15 dark:bg-primary/40 dark:shadow-[0_32px_110px_rgba(5,9,25,0.45)]"
        >
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-primary/10 text-left text-sm text-primary/80 dark:divide-light/15 dark:text-light/80">
              <thead class="text-xs uppercase tracking-[0.28em] text-primary/50 dark:text-light/60">
                <tr>
                  <th scope="col" class="px-6 py-4">
                    {{ t('updates.table.columns.version') }}
                  </th>
                  <th scope="col" class="px-6 py-4">
                    {{ t('updates.table.columns.date') }}
                  </th>
                  <th scope="col" class="px-6 py-4">
                    {{ t('updates.table.columns.summary') }}
                  </th>
                  <th scope="col" class="px-6 py-4 text-right">
                    {{ t('updates.table.columns.actions') }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-primary/10 dark:divide-light/10">
                <tr
                  v-for="entry in filteredEntries"
                  :key="entry.version"
                  class="transition hover:bg-primary/5 dark:hover:bg-light/10"
                >
                  <td class="px-6 py-4 font-semibold text-primary dark:text-light">
                    {{ entry.version }}
                    <span
                      v-if="entry === latestEntry"
                      class="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary/70 dark:bg-light/10 dark:text-light/70"
                    >
                      {{ t('updates.table.latestBadge') }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-primary/70 dark:text-light/70">
                    {{ formatReleaseDate(entry.releasedAt) }}
                  </td>
                  <td class="px-6 py-4 text-sm text-primary/70 dark:text-light/70">
                    <ul class="list-disc space-y-1 pl-4">
                      <li
                        v-for="highlight in entryHighlights(entry.key).slice(0, 2)"
                        :key="highlight"
                      >
                        {{ highlight }}
                      </li>
                    </ul>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="inline-flex flex-col items-end gap-2">
                      <NuxtLink
                        :to="entry.notesPath"
                        class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-primary/70 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:text-light/70 dark:hover:text-light"
                      >
                        <span class="i-carbon-document-blank text-sm" aria-hidden="true" />
                        {{ t('updates.table.viewNotes') }}
                      </NuxtLink>
                      <a
                        v-for="download in entry.downloads"
                        :key="download.id"
                        :href="download.href"
                        target="_blank"
                        rel="noopener"
                        class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-primary/50 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:text-light/60 dark:hover:text-light"
                      >
                        <span class="i-carbon-launch text-sm" aria-hidden="true" />
                        {{ t(download.labelKey) }}
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>
