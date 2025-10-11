<script setup lang="ts">
import { computed } from 'vue'

const { locale, setLocale } = useI18n()

const iconClass = computed(() => locale.value === 'zh' ? 'i-circle-flags-cn' : 'i-circle-flags-gb')
const nextLocale = computed(() => (locale.value === 'zh' ? 'en' : 'zh'))
const ariaLabel = computed(() => locale.value === 'zh' ? 'Switch language to English' : '切换语言到中文')

function toggleLocale() {
  setLocale(nextLocale.value)
}
</script>

<template>
  <button
    type="button"
    class="LanguageToggle inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-xl text-primary/80 transition hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:bg-light/10 dark:text-light/80 dark:hover:bg-light/15 dark:hover:text-light dark:focus-visible:ring-light/25"
    :aria-label="ariaLabel"
    :title="locale === 'zh' ? 'English' : '中文'"
    :aria-pressed="locale === 'zh'"
    @click="toggleLocale"
  >
    <span :class="iconClass" />
  </button>
</template>
