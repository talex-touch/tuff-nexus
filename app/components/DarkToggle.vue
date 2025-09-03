<script setup lang="ts">
const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#222222' : '#ffffff',
  }],
})

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    class="!outline-none text-primary/80 dark:text-light/80"
    @click="toggleDark"
  >
    <div class="i-carbon-sun dark:i-carbon-moon text-2xl" />
  </button>
</template>
