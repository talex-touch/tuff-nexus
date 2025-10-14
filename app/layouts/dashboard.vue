<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-white to-slate-100 text-primary dark:from-primary dark:via-primary/95 dark:to-primary/85 dark:text-light">
    <TheHeader class="z-10 border-b border-transparent" />
    <main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-20 sm:px-8 lg:px-12">
      <slot />
    </main>
    <Footer />
  </div>
</template>
