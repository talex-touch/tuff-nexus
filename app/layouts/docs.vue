<script setup lang="ts">
// Since DarkToggle is in app/components, it's auto-imported.
// We don't need to explicitly import it.
</script>

<template>
  <div class="flex flex-col h-screen bg-white dark:bg-primary">
    <div class="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-primary/75 backdrop-blur-md">
      <TheHeader title="Tuff Docs" />
    </div>
    <div class="flex-1 flex container mx-auto">
      <!-- Sidebar -->
      <aside class="hidden w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 p-4 lg:block lg:overflow-y-auto">
        <DocsSidebar />
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-4 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
