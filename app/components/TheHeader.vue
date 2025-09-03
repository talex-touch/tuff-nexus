<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'Tuff',
  },
})
</script>

<template>
  <header
    class="container sticky top-0 z-10 mx-auto flex items-center justify-between p-4"
  >
    <!-- Left Side: Logo -->
    <div class="flex items-center space-x-3">
      <NuxtLink to="/" class="flex items-center space-x-2 no-underline">
        <img src="/logo.svg" alt="Tuff Logo" class="h-8 w-8 filter dark:invert">
        <span class="text-xl text-primary font-bold dark:text-light">{{ title }}</span>
      </NuxtLink>
      <span
        v-if="title === 'Tuff'"
        class="rounded-lg bg-gray-200 dark:bg-gray-800 px-3 py-1 text-sm text-orange-400 font-semibold"
      >BETA</span>
    </div>

    <!-- Right Side: Navigation -->
    <nav class="flex items-center text-sm space-x-4">
      <NuxtLink
        to="/"
        class="text-primary/80 no-underline transition-all duration-300 dark:text-light/80 hover:text-primary/100 hover:-translate-y-px dark:hover:text-light/100"
      >
        Home
      </NuxtLink>
      <NuxtLink
        to="/docs"
        class="text-primary/80 no-underline transition-all duration-300 dark:text-light/80 hover:text-primary/100 hover:-translate-y-px dark:hover:text-light/100"
      >
        Document
      </NuxtLink>
      <NuxtLink
        to="/api"
        class="text-primary/80 no-underline transition-all duration-300 dark:text-light/80 hover:text-primary/100 hover:-translate-y-px dark:hover:text-light/100"
      >
        API
      </NuxtLink>
      <NuxtLink
        to="/qa"
        class="text-primary/80 no-underline transition-all duration-300 dark:text-light/80 hover:text-primary/100 hover:-translate-y-px dark:hover:text-light/100"
      >
        Q & A
      </NuxtLink>
      <NuxtLink
        to="/about"
        class="text-primary/80 no-underline transition-all duration-300 dark:text-light/80 hover:text-primary/100 hover:-translate-y-px dark:hover:text-light/100"
      >
        About
      </NuxtLink>

      <div class="w-px h-5 bg-gray-200 dark:bg-gray-800" />

      <Search />
      <DarkToggle />
      <LanguageToggle />

      <a
        href="https://github.com/tuff-docs/tuff-nexus"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary/80 no-underline transition-all duration-300 dark:text-light/80 hover:text-primary/100 hover:-translate-y-px dark:hover:text-light/100"
      >
        <div class="i-carbon-logo-github text-2xl" />
      </a>
    </nav>
  </header>
</template>
