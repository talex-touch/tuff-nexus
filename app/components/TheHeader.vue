<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

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
    class="TuffHeader"
  >
    <div
      class="TuffHeader-Main mx-auto flex flex-wrap items-center justify-between gap-4 border-1 border-transparent border-solid px-4 py-2 sm:flex-nowrap"
      :class="{
        'border-primary/10 bg-white/80 shadow-sm dark:border-light/10 dark:bg-primary/90': scrolled,
      }"
    >
      <NuxtLink
        to="/"
        class="flex items-center gap-1 text-primary font-semibold tracking-tight no-underline dark:text-light"
      >
        <span class="text-lg sm:text-xl">Tuff</span>
        <span
          class="beta-tag text-md uppercase"
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
            class="rounded-full px-3 py-1 text-primary/70 no-underline transition-all duration-200 hover:bg-primary/5 dark:text-light/70 hover:text-primary dark:hover:bg-light/10 dark:hover:text-light"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <HeaderControls class="w-full lg:max-w-[420px] sm:min-w-[320px] sm:flex-1" />

        <div
          class="flex items-center gap-2 border border-primary/10 rounded-full bg-primary/5 px-2 py-1 text-xs text-primary/80 font-semibold shadow-sm dark:border-light/15 dark:bg-light/10 dark:text-light/80"
        >
          <button
            type="button"
            class="rounded-full bg-primary px-3 py-1 text-xs text-light font-semibold transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:hover:bg-black"
          >
            Sign in
          </button>
          <span class="h-3 w-px bg-primary/15 dark:bg-light/20" />
          <button
            type="button"
            class="rounded-full px-3 py-1 text-xs text-primary/80 font-semibold transition hover:bg-primary/10 dark:text-light/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:hover:bg-light/10 dark:focus-visible:ring-light/30"
          >
            Sign out
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.TuffHeader {
  z-index: 10;
  position: sticky;

  top: 0;
  left: 0;

  width: 100%;
  height: 64px;
}

.TuffHeader-Main {
  position: absolute;

  top: 1rem;
  left: 50%;

  width: 100%;
  max-width: 1200px;

  border-radius: 24px;
  transform: translateX(-50%);
  backdrop-filter: blur(18px) saturate(180%);
}

.beta-tag {
  font-weight: 700;
  background-color: rgb(25, 25, 25);
  color: rgb(242, 156, 57) !important;
  margin: 0px 0.5rem;
  padding: 4px 8px;
  border-radius: 12px;
}
</style>
