<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const { title, initialHidden } = defineProps({
  title: {
    type: String,
    default: 'Tuff',
  },
  initialHidden: {
    type: Boolean,
    default: false,
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
    data-role="main-header"
    :data-initial-hidden="initialHidden"
    :data-state="initialHidden ? 'hidden' : 'visible'"
    :data-scroll-state="scrolled ? 'scrolled' : 'top'"
    class="header-root sticky top-0 z-10 w-full border-b border-transparent bg-transparent transition duration-300 dark:bg-transparent"
    :class="{
      'border-primary/10 bg-white/80 backdrop-blur-md shadow-sm dark:border-light/15 dark:bg-primary/75': scrolled,
    }"
  >
    <div class="container mx-auto flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:flex-nowrap">
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold tracking-tight text-primary no-underline dark:text-light">
        <span class="text-lg sm:text-xl">{{ title.charAt(0).toUpperCase() + title.slice(1) }}</span>
        <span
          v-if="title === 'Tuff'"
          class="rounded-full border border-primary/10 px-2.5 py-0.5 text-xs uppercase tracking-wide text-primary/70 dark:border-light/20 dark:text-light/70"
        >
          BETA
        </span>
      </NuxtLink>

      <nav class="flex flex-1 flex-wrap items-center justify-end gap-4 text-sm">
        <div class="flex flex-wrap items-center gap-2">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-full px-3 py-1 text-primary/70 no-underline transition-all duration-200 hover:bg-primary/5 hover:text-primary dark:text-light/70 dark:hover:bg-light/10 dark:hover:text-light"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <div class="hidden h-5 w-px bg-primary/10 dark:bg-light/20 sm:block" />

        <div class="flex items-center gap-3 rounded-full border border-primary/10 bg-white/70 px-3 py-1.5 text-primary/70 shadow-sm backdrop-blur-md dark:border-light/15 dark:bg-primary/65 dark:text-light/70">
          <Search />
          <div class="hidden items-center gap-2 sm:flex">
            <DarkToggle />
            <LanguageToggle />
          </div>
          <a
            href="https://github.com/tuff-docs/tuff-nexus"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm text-primary/70 no-underline transition hover:bg-primary/5 hover:text-primary dark:text-light/70 dark:hover:bg-light/10 dark:hover:text-light"
          >
            <span class="i-carbon-logo-github text-base" />
            <span class="hidden sm:inline">GitHub</span>
          </a>
        </div>

        <div class="flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-2 py-1 text-xs font-semibold text-primary/80 shadow-sm dark:border-light/15 dark:bg-light/10 dark:text-light/80">
          <button
            type="button"
            class="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-light transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:hover:bg-black"
          >
            Sign in
          </button>
          <span class="h-3 w-px bg-primary/15 dark:bg-light/20" />
          <button
            type="button"
            class="rounded-full px-3 py-1 text-xs font-semibold text-primary/80 transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-light/80 dark:hover:bg-light/10 dark:focus-visible:ring-light/30"
          >
            Sign out
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header-root {
  transition-property: opacity, transform, background-color, border-color, box-shadow, backdrop-filter;
}

/* 初始隐藏时改为 fixed，避免占据页面高度，搭配 GSAP 动画显示 */
.header-root[data-state='hidden'] {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  opacity: 0;
  transform: translateY(-100%);
  pointer-events: none;
  border-color: transparent;
  box-shadow: none;
}

.header-root[data-state='visible'] {
  position: sticky;
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.header-root[data-state='visible'] {
  position: sticky;
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
</style>
