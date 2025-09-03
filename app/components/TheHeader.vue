<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: 'Tuff',
  },
})

const scrolled = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 0
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    class="container sticky top-0 z-10 mx-auto flex items-center justify-between p-4"
    :class="{ 'header-scrolled': scrolled }"
  >
    <!-- Left Side: Logo -->
    <div class="flex items-center space-x-3">
      <NuxtLink to="/" class="flex items-center no-underline space-x-2">
        <span class="text-xl text-primary font-bold dark:text-light">{{ title.charAt(0).toUpperCase() + title.slice(1) }}</span>
      </NuxtLink>
      <span
        v-if="title === 'Tuff'"
        class="rounded-lg bg-gray-200 px-3 py-1 text-sm text-orange-400 font-semibold dark:bg-gray-800"
      >BETA</span>
    </div>

    <!-- Right Side: Navigation -->
    <nav class="flex items-center text-sm space-x-6">
      <NuxtLink
        to="/"
        class="text-primary/80 no-underline transition-all duration-300 dark:text-light/80 hover:text-primary/100 hover:-translate-y-px dark:hover:text-light/100 flex items-center space-x-1"
      >
        {{ ($t('home') as string).charAt(0).toUpperCase() + ($t('home') as string).slice(1) }}
      </NuxtLink>
      <NuxtLink
        to="/docs"
        class="text-primary/80 no-underline transition-all duration-300 dark:text-light/80 hover:text-primary/100 hover:-translate-y-px dark:hover:text-light/100 flex items-center space-x-1"
      >
        {{ ($t('document') as string).charAt(0).toUpperCase() + ($t('document') as string).slice(1) }}
      </NuxtLink>
      <NuxtLink
        to="/api"
        class="text-primary/80 no-underline transition-all duration-300 dark:text-light/80 hover:text-primary/100 hover:-translate-y-px dark:hover:text-light/100 flex items-center space-x-1"
      >
        {{ ($t('api') as string).charAt(0).toUpperCase() + ($t('api') as string).slice(1) }}
      </NuxtLink>
      <NuxtLink
        to="/marketplace"
        class="text-primary/80 no-underline transition-all duration-300 dark:text-light/80 hover:text-primary/100 hover:-translate-y-px dark:hover:text-light/100 flex items-center space-x-1"
      >
        {{ ($t('marketplace') as string).charAt(0).toUpperCase() + ($t('marketplace') as string).slice(1) }}
      </NuxtLink>
      <NuxtLink
        to="/qa"
        class="text-primary/80 no-underline transition-all duration-300 dark:text-light/80 hover:text-primary/100 hover:-translate-y-px dark:hover:text-light/100 flex items-center space-x-1"
      >
        {{ ($t('qa') as string).charAt(0).toUpperCase() + ($t('qa') as string).slice(1) }}
      </NuxtLink>
      <NuxtLink
        to="/about"
        class="text-primary/80 no-underline transition-all duration-300 dark:text-light/80 hover:text-primary/100 hover:-translate-y-px dark:hover:text-light/100 flex items-center space-x-1"
      >
        {{ ($t('about') as string).charAt(0).toUpperCase() + ($t('about') as string).slice(1) }}
      </NuxtLink>

      <div class="h-5 w-px bg-gray-200 dark:bg-gray-800" />

      <Search />
      <DarkToggle />
      <LanguageToggle />

      <a
        href="https://github.com/tuff-docs/tuff-nexus"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary/80 no-underline transition-all duration-300 dark:text-light/80 hover:text-primary/100 hover:-translate-y-px dark:hover:text-light/100"
      >
      </a>
    </nav>
  </header>
</template>

<style scoped>
.header-scrolled {
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  backdrop-filter: blur(8px); /* Blur effect */
  -webkit-backdrop-filter: blur(8px); /* Safari support */
}
</style>
