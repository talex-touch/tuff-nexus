<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <header class="border-b dark:border-gray-800">
      <div class="container mx-auto p-4">
        Header
      </div>
    </header>

    <div class="flex-1 flex">
      <!-- Sidebar -->
      <aside class="w-64 border-r dark:border-gray-800 p-4">
        <DocsSidebar />
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-4">
        <slot />
      </main>
    </div>
  </div>
</template>