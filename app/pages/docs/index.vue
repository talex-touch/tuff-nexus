<script setup lang="ts">
definePageMeta({
  redirect: '/docs/documents/start',
})

const { t } = useI18n()
</script>

<template>
  <div class="flex items-center justify-center py-24">
    <div class="inline-flex items-center gap-3 rounded-full border border-primary/10 bg-white/80 px-5 py-2 text-sm text-gray-600 shadow-sm dark:border-light/10 dark:bg-primary/70 dark:text-gray-200">
      <span class="i-carbon-circle-dash text-base" />
      {{ t('docs.redirecting') }}
    </div>
  </div>
</template>
