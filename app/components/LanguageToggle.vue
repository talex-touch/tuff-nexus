<script setup lang="ts">
import { computed } from 'vue'

const { locale, setLocale, t } = useI18n()
const route = useRoute()
const router = useRouter()

const nextLocale = computed(() => (locale.value === 'zh' ? 'en' : 'zh'))
const iconClass = computed(() => (locale.value === 'zh' ? 'i-twemoji-flag-china' : 'i-twemoji-flag-united-kingdom'))
const ariaLabel = computed(() =>
  t(nextLocale.value === 'zh' ? 'ui.languageToggle.switchToZh' : 'ui.languageToggle.switchToEn'),
)
const tooltipLabel = computed(() =>
  t(nextLocale.value === 'zh' ? 'ui.languageToggle.zhLabel' : 'ui.languageToggle.enLabel'),
)
const nextLocaleTag = computed(() => (nextLocale.value === 'zh' ? 'zh-CN' : 'en-US'))

async function toggleLocale() {
  const targetLocale = nextLocale.value
  const targetTag = nextLocaleTag.value
  const rawPath = route.path || '/'
  const normalizedPath = rawPath.replace(/^\/(en|zh)(?=\/|$)/i, '') || '/'

  await setLocale(targetLocale)

  const query = { ...route.query, lang: targetTag }
  await router.replace({
    path: normalizedPath,
    query,
    hash: route.hash,
  })
}
</script>

<template>
  <button
    type="button"
    class="LanguageToggle h-9 w-9 inline-flex items-center justify-center rounded-full border-none bg-white/80 text-black/80 transition-colors duration-200 dark:bg-white/10 hover:bg-white dark:text-light/80 dark:hover:bg-white/15"
    :aria-label="ariaLabel"
    :title="tooltipLabel"
    :aria-pressed="locale === 'zh'"
    @click="toggleLocale"
  >
    <span class="sr-only">{{ ariaLabel }}</span>
    <span :class="iconClass" class="text-xl" aria-hidden="true" />
  </button>
</template>
