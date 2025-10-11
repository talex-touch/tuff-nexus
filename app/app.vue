<script setup lang="ts">
import { appName } from '~/constants'

useHead({
  title: appName,
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
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
</style>
