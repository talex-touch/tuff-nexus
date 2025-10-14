<script setup lang="ts">
import { computed } from 'vue'
import { ClerkLoaded, ClerkLoading } from '@clerk/nuxt/components'
import { appName } from '~/constants'

useHead({
  title: appName,
})

const route = useRoute()
const isProtectedRoute = computed(() => route.meta.requiresAuth === true)
</script>

<template>
  <VitePwaManifest />
  <ClerkLoading>
    <div
      v-if="isProtectedRoute"
      class="grid h-screen w-screen place-content-center text-sm text-gray-500"
    >
      Checking your session…
    </div>
    <div
      v-else
      class="pointer-events-none fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-xl bg-gray-900/85 px-4 py-3 text-sm text-white shadow-lg backdrop-blur-sm dark:bg-gray-100/90 dark:text-gray-900"
      role="status"
      aria-live="polite"
    >
      <span
        class="i-carbon-circle-dash animate-spin text-base"
        aria-hidden="true"
      />
      <span>Checking your session…</span>
    </div>
  </ClerkLoading>
  <ClerkLoaded>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ClerkLoaded>
</template>

<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}

body {
  font-family:
    'PingFang SC', '-apple-system', 'Helvetica Neue', 'Segoe UI', 'Microsoft YaHei', 'Noto Sans SC', 'DM Sans',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html.dark {
  color-scheme: dark;
}

.cubic-transition,
.transition-cubic {
  transition: 0.25s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}

button {
  outline: none !important;
  border: none !important;
}

* {
  box-sizing: border-box;
}
</style>
