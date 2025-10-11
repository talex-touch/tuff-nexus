<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { onClickOutside, useEventListener } from '@vueuse/core'

interface Props {
  githubUrl?: string
  showSearchButton?: boolean
  showDarkToggle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  githubUrl: 'https://github.com/talex-touch/tuff',
  showSearchButton: false,
  showDarkToggle: true,
})

const { locale } = useI18n()

const searchButtonLabel = computed(() => locale.value === 'zh' ? '搜索文档' : 'Search docs')
const searchButtonAriaLabel = computed(() => locale.value === 'zh' ? '打开文档搜索' : 'Open docs search')

const isSearchOpen = ref(false)
const searchButtonRef = ref<HTMLElement | null>(null)
const searchPanelRef = ref<HTMLElement | null>(null)

function toggleSearch() {
  if (!props.showSearchButton)
    return
  isSearchOpen.value = !isSearchOpen.value
}

function onSearchPanelClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  if (target?.closest('a'))
    isSearchOpen.value = false
}

watch(() => props.showSearchButton, (value) => {
  if (!value)
    isSearchOpen.value = false
})

watch(isSearchOpen, (open) => {
  if (!open)
    return
  nextTick(() => {
    const input = searchPanelRef.value?.querySelector('input')
    if (input instanceof HTMLInputElement)
      input.focus()
  })
})

onClickOutside([searchButtonRef, searchPanelRef], () => {
  isSearchOpen.value = false
})

useEventListener(window, 'keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape')
    isSearchOpen.value = false
})
</script>

<template>
  <div
    class="HeaderControls flex w-full flex-wrap items-center justify-end gap-2 rounded-full border border-primary/10 bg-white/80 px-3.5 py-2 text-sm text-primary/75 shadow-[0_10px_30px_rgba(24,24,32,0.1)] backdrop-blur-xl transition dark:border-light/10 dark:bg-primary/70 dark:text-light/80 dark:shadow-[0_16px_34px_rgba(0,0,0,0.45)]"
  >
    <div
      v-if="props.showSearchButton"
      class="relative w-full sm:w-auto"
    >
      <button
        ref="searchButtonRef"
        type="button"
        class="inline-flex w-full items-center justify-between gap-3 rounded-full border border-transparent bg-white/85 px-4 py-2 text-left font-medium text-primary/70 shadow-[0_8px_18px_rgba(18,18,24,0.06)] transition hover:border-primary/20 hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 dark:bg-primary/80 dark:text-light/75 dark:hover:bg-primary/70 dark:hover:text-light dark:focus-visible:ring-light/25"
        :aria-label="searchButtonAriaLabel"
        @click="toggleSearch"
      >
        <span class="flex items-center gap-2">
          <span class="i-carbon-search text-lg" />
          <span>{{ searchButtonLabel }}</span>
        </span>
        <kbd class="hidden rounded border border-primary/10 bg-primary/5 px-2 py-0.5 text-xs text-primary/60 sm:inline-flex dark:border-light/15 dark:bg-light/10 dark:text-light/60">
          /
        </kbd>
      </button>

      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0"
      >
        <div
          v-if="isSearchOpen"
          ref="searchPanelRef"
          class="absolute right-0 top-[calc(100%+0.75rem)] z-30 w-[min(380px,85vw)] rounded-3xl border border-primary/10 bg-white/95 p-4 shadow-[0_20px_40px_rgba(18,18,28,0.18)] backdrop-blur-2xl dark:border-light/15 dark:bg-primary/90 dark:shadow-[0_24px_48px_rgba(0,0,0,0.65)]"
          @click="onSearchPanelClick"
        >
          <Search />
        </div>
      </transition>
    </div>

    <div class="flex items-center gap-1.5 sm:ml-auto">
      <DarkToggle
        v-if="props.showDarkToggle"
        class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-lg text-primary/80 transition hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 dark:bg-light/10 dark:text-light/80 dark:hover:bg-light/15 dark:hover:text-light dark:focus-visible:ring-light/25"
      />
      <LanguageToggle />
    </div>

    <a
      :href="props.githubUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-light shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:bg-light/90 dark:text-primary dark:hover:bg-light"
    >
      <span class="i-carbon-logo-github text-lg" />
      <span>GitHub</span>
    </a>
  </div>
</template>

<style scoped>
.HeaderControls {
  backdrop-filter: blur(20px) saturate(160%);
}
</style>
