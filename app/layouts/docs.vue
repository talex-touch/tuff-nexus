<script setup lang="ts">
// Since DarkToggle is in app/components, it's auto-imported.
// We don't need to explicitly import it.
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gradient-to-br from-white via-white to-gray-50 text-primary dark:from-primary dark:via-primary dark:to-primary/85 dark:text-light">
    <div class="sticky top-0 z-20 border-b border-primary/10 bg-white/70 backdrop-blur-md dark:border-light/10 dark:bg-primary/70">
      <TheHeader title="Tuff Docs" />
    </div>
    <div class="flex flex-1 justify-center px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div class="flex w-full max-w-7xl gap-8">
        <aside class="hidden w-64 shrink-0 lg:block">
          <div class="sticky top-28 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl border border-primary/10 bg-white/70 p-5 shadow-sm dark:border-light/10 dark:bg-primary/70">
            <DocsSidebar />
          </div>
        </aside>
        <main class="flex-1">
          <div class="mx-auto max-w-3xl space-y-10">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
