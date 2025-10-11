<script setup lang="ts">
import { computed } from 'vue'

const { locale, setLocale, t } = useI18n()

const nextLocale = computed(() => (locale.value === 'zh' ? 'en' : 'zh'))
const iconClass = computed(() => (locale.value === 'zh' ? 'i-twemoji-flag-china' : 'i-twemoji-flag-united-kingdom'))
const ariaLabel = computed(() =>
  t(nextLocale.value === 'zh' ? 'ui.languageToggle.switchToZh' : 'ui.languageToggle.switchToEn'),
)
const tooltipLabel = computed(() =>
  t(nextLocale.value === 'zh' ? 'ui.languageToggle.zhLabel' : 'ui.languageToggle.enLabel'),
)

function toggleLocale() {
  setLocale(nextLocale.value)
}
</script>

<template>
  <button
    type="button"
    class="LanguageToggle inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 bg-white/80 text-primary/80 shadow-[0_8px_20px_rgba(15,23,42,0.08)] backdrop-blur-md transition-colors duration-200 hover:border-primary/20 hover:bg-white dark:border-light/20 dark:bg-white/10 dark:text-light/80 dark:shadow-[0_12px_28px_rgba(0,0,0,0.35)] dark:hover:border-light/30 dark:hover:bg-white/15"
    :aria-label="ariaLabel"
    :title="tooltipLabel"
    :aria-pressed="locale === 'zh'"
    @click="toggleLocale"
  >
    <span class="sr-only">{{ ariaLabel }}</span>
    <span :class="iconClass" class="text-xl" aria-hidden="true" />
  </button>
</template>
