<script setup lang="ts">
import { nextTick, watch } from 'vue'
import { useEventListener, useThrottleFn } from '@vueuse/core'

interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

const { t } = useI18n()

const tocState = useState<TocLink[]>('docs-toc', () => [])
const docTitleState = useState<string>('docs-title', () => '')

const activeHash = ref('')
const headingElements = ref<Record<string, HTMLElement>>({})
const SCROLL_OFFSET = 120

function setActiveHash(hash?: string | null) {
  if (!hash) {
    activeHash.value = ''
    return
  }
  activeHash.value = hash.replace(/^#/, '')
}

function refreshHeadingElements() {
  if (!import.meta.client)
    return
  const nextMap: Record<string, HTMLElement> = {}
  for (const entry of outlineEntries.value) {
    const element = document.getElementById(entry.id)
    if (element instanceof HTMLElement)
      nextMap[entry.id] = element
  }
  headingElements.value = nextMap
}

const updateActiveFromScroll = useThrottleFn(() => {
  if (!import.meta.client)
    return
  if (!outlineEntries.value.length)
    return

  let current: TocLink | null = null
  for (const entry of outlineEntries.value) {
    const element = headingElements.value[entry.id] ?? document.getElementById(entry.id)
    if (!(element instanceof HTMLElement))
      continue

    const rect = element.getBoundingClientRect()
    if (rect.top - SCROLL_OFFSET <= 0)
      current = entry
    else if (!current)
      current = entry
  }

  if (current)
    activeHash.value = current.id
}, 100)

if (import.meta.client) {
  onMounted(() => {
    setActiveHash(window.location.hash)
    nextTick(() => {
      refreshHeadingElements()
      updateActiveFromScroll()
    })
  })
  useEventListener(window, 'hashchange', () => {
    setActiveHash(window.location.hash)
  })
  useEventListener(
    window,
    'scroll',
    () => {
      updateActiveFromScroll()
    },
    { passive: true },
  )
  useEventListener(window, 'resize', () => {
    refreshHeadingElements()
    updateActiveFromScroll()
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

watch(
  outlineEntries,
  () => {
    if (!import.meta.client)
      return
    nextTick(() => {
      refreshHeadingElements()
      updateActiveFromScroll()
    })
  },
  { immediate: true },
)
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
          :class="[
            activeHash === entry.id
              ? 'bg-primary/10 text-black font-semibold dark:bg-primary/20 dark:text-light'
              : 'text-black/70 hover:bg-dark/5 hover:text-black dark:text-light/70 dark:hover:bg-light/5 dark:hover:text-light',
          ]"
        >
          <span
            class="absolute left-[-14px] h-4 w-1 rounded-full bg-primary transition-all duration-200 ease-out group-hover:opacity-60"
            :class="activeHash === entry.id ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50'"
          />
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
