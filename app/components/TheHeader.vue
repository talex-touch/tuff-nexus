<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: 'Tuff',
  },
})

const scrolled = ref(false)
const { t } = useI18n()

function handleScroll() {
  scrolled.value = window.scrollY > 0
}

const links = computed(() => [
  { to: '/', label: t('nav.home') },
  { to: '/docs', label: t('nav.docs') },
  { to: '/api', label: t('nav.api') },
  { to: '/marketplace', label: t('nav.marketplace') },
  { to: '/qa', label: t('nav.qa') },
  { to: '/about', label: t('nav.about') },
])

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    class="sticky top-0 z-10 w-full border-b border-transparent bg-white/70 backdrop-blur-md transition duration-300 dark:bg-primary/70"
    :class="{ 'border-primary/10 shadow-sm dark:border-light/15': scrolled }"
  >
    <div class="container mx-auto flex items-center justify-between px-5 py-4">
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold tracking-tight text-primary no-underline dark:text-light">
        <span class="text-lg sm:text-xl">{{ title.charAt(0).toUpperCase() + title.slice(1) }}</span>
        <span
          v-if="title === 'Tuff'"
          class="rounded-full border border-primary/10 px-2.5 py-0.5 text-xs uppercase tracking-wide text-primary/70 dark:border-light/20 dark:text-light/70"
        >
          BETA
        </span>
      </NuxtLink>

      <nav class="flex items-center gap-4 text-sm">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="rounded-full px-3 py-1 text-primary/70 no-underline transition-all duration-200 hover:bg-primary/5 hover:text-primary dark:text-light/70 dark:hover:bg-light/10 dark:hover:text-light"
        >
          {{ link.label }}
        </NuxtLink>

        <div class="hidden h-4 w-px bg-gray-200 dark:bg-gray-700 sm:block" />

        <div class="flex items-center gap-3 text-lg text-primary/70 dark:text-light/70">
          <Search />
          <DarkToggle />
          <LanguageToggle />
          <a
            href="https://github.com/tuff-docs/tuff-nexus"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm text-primary/70 no-underline transition hover:bg-primary/5 hover:text-primary dark:hover:bg-light/10 dark:hover:text-light"
          >
            <span class="i-carbon-logo-github text-base" />
            <span class="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </nav>
    </div>
  </header>
</template>
