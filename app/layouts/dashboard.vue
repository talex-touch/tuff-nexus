<template>
  <div class="min-h-screen from-white via-white to-slate-100 bg-gradient-to-br text-primary dark:from-primary dark:via-primary/95 dark:to-primary/85 dark:text-light">
    <TheHeader class="z-10 border-b border-transparent" />
    <main class="mx-auto max-w-6xl w-full flex flex-1 flex-col gap-8 px-4 py-20 lg:px-12 sm:px-8">
      <slot />
    </main>
    <Footer />
  </div>
</template>
