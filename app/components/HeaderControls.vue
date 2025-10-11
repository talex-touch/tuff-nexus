<script setup lang="ts">
interface Props {
  githubUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  githubUrl: 'https://github.com/talex-touch/tuff',
})
</script>

<template>
  <div
    class="HeaderControls flex w-full flex-col gap-2 rounded-3xl border border-primary/10 bg-white/75 p-3 shadow-[0_12px_30px_rgba(24,24,32,0.08)] backdrop-blur-xl transition dark:border-light/10 dark:bg-primary/65 dark:shadow-[0_16px_32px_rgba(0,0,0,0.45)] sm:flex-row sm:items-center"
  >
    <Search class="w-full sm:min-w-[220px]" />

    <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
      <div class="flex items-center gap-1.5">
        <DarkToggle
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-white/80 text-lg text-primary/80 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 dark:bg-primary/70 dark:text-light/80 dark:hover:bg-primary/60 dark:focus-visible:ring-light/20"
        />
        <LanguageToggle
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-white/80 text-lg text-primary/80 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 dark:bg-primary/70 dark:text-light/80 dark:hover:bg-primary/60 dark:focus-visible:ring-light/20"
        />
      </div>

      <a
        :href="props.githubUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-light shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:bg-light/90 dark:text-primary dark:hover:bg-light"
      >
        <span class="i-carbon-logo-github text-lg" />
        <span>GitHub</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.HeaderControls {
  backdrop-filter: blur(20px) saturate(160%);
}
</style>
