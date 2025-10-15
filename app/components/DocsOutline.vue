<script setup lang="ts">
import { useEventListener } from '@vueuse/core'

interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

const { t, locale } = useI18n()

const tocState = useState<TocLink[]>('docs-toc', () => [])
const docTitleState = useState<string>('docs-title', () => '')
const docLocaleState = useState<string>('docs-locale', () => locale.value)

const activeHash = ref('')

function setActiveHash(hash?: string | null) {
  if (!hash) {
    activeHash.value = ''
    return
  }
  activeHash.value = hash.replace(/^#/, '')
}

if (import.meta.client) {
  onMounted(() => {
    setActiveHash(window.location.hash)
  })
  useEventListener(window, 'hashchange', () => {
    setActiveHash(window.location.hash)
  })
}

function flattenLinks(links: TocLink[] | undefined, bucket: TocLink[] = []) {
  if (!Array.isArray(links))
    return bucket
  for (const link of links) {
    bucket.push(link)
    if (link.children?.length)
      flattenLinks(link.children, bucket)
  }
  return bucket
}

const outlineEntries = computed(() => {
  const links = flattenLinks(tocState.value)
  return links
    .filter(link => link.depth > 1)
    .map(link => ({
      ...link,
      indent: Math.min(2, Math.max(0, link.depth - 2)),
    }))
})

const hasOutline = computed(() => outlineEntries.value.length > 0)

const localeLabel = computed(() => (docLocaleState.value === 'zh' ? '中文' : docLocaleState.value?.toUpperCase?.() ?? 'EN'))
</script>

<template>
  <div class="flex flex-col gap-4 text-sm">
    <div class="space-y-1">
      <div class="text-xs text-black/40 tracking-[0.2em] uppercase dark:text-light/40">
        {{ t('docs.outlineLabel') }}
      </div>
      <div class="text-base text-black font-semibold leading-tight op-60 dark:text-light">
        {{ docTitleState || t('docs.defaultTitle') }}
      </div>
    </div>

    <div v-if="hasOutline" class="relative flex-1">
      <div class="absolute inset-y-2 left-2 w-px bg-dark/10 dark:bg-light/15" />
      <nav class="flex flex-col gap-1 pl-5">
        <NuxtLink
          v-for="entry in outlineEntries"
          :key="entry.id"
          :to="`#${entry.id}`"
          replace
          class="group relative flex items-center gap-2 rounded-xl px-2 py-2 text-sm leading-snug no-underline transition"
          :style="{ marginLeft: `${entry.indent * 12}px` }"
          :class="activeHash === entry.id
            ? 'bg-dark/10 text-black font-semibold dark:bg-light/10 dark:text-light'
            : 'text-black/70 hover:bg-dark/5 hover:text-black dark:text-light/70 dark:hover:bg-light/5 dark:hover:text-light'"
        >
          <span class="i-heroicons-bolt-solid text-[10px] text-black/30 transition dark:text-light/30 group-hover:text-black/50 dark:group-hover:text-light/60" />
          <span class="line-clamp-2">{{ entry.text }}</span>
        </NuxtLink>
      </nav>
    </div>
    <div v-else class="border border-primary/15 rounded-2xl border-dashed bg-white/40 px-4 py-6 text-xs text-black/50 dark:border-light/15 dark:bg-light/5 dark:text-light/50">
      {{ t('docs.noOutline') }}
    </div>
  </div>
</template>
