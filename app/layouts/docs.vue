<script setup lang="ts">
</script>

<template>
  <div class="relative min-h-screen flex flex-col bg-[#f8f9fb] text-black dark:bg-[#090b12] dark:text-light">
    <div>
      <div class="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div class="docs-background absolute left-1/2 h-[420px] w-[820px] rounded-[200px] from-primary/6 via-primary/3 to-transparent bg-gradient-to-br blur-3xl -top-32 -translate-x-1/2 dark:from-light/10 dark:via-light/5 dark:to-transparent" />
      </div>
      <TheHeader title="Tuff Docs" class="z-30" />
      <div class="relative flex flex-1 justify-center px-4 pb-24 pt-24 lg:px-10 sm:px-6">
        <div class="max-w-7xl w-full flex gap-6 lg:gap-10">
          <aside class="hidden w-[240px] shrink-0 xl:block">
            <div class="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto border border-primary/10 rounded-3xl bg-white/80 p-4 shadow-[0_18px_46px_rgba(15,23,42,0.08)] backdrop-blur dark:border-light/10 dark:bg-[#11162a]/80 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <DocsSidebar />
            </div>
          </aside>
          <main class="flex-1">
            <div class="mx-auto max-w-3xl space-y-10">
              <slot />
            </div>
          </main>
          <aside class="hidden w-[220px] shrink-0 lg:block">
            <div class="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto border border-primary/10 rounded-3xl bg-white/80 p-5 shadow-[0_18px_46px_rgba(15,23,42,0.08)] backdrop-blur dark:border-light/10 dark:bg-[#11162a]/80 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <DocsOutline />
            </div>
          </aside>
        </div>
      </div>
    </div>
    <TuffFooter />
  </div>
</template>
