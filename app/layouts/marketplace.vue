<template>
  <div class="bg-white dark:bg-dark text-black dark:text-light min-h-screen">
    <TheHeader title="Marketplace" />
    <main class="container mx-auto p-4 lg:p-8">
      <slot />
    </main>
  </div>
  <TuffFooter />
</template>