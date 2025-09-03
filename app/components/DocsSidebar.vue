<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation(queryContent()))
const route = useRoute()

function isLinkActive(path: string) {
  return route.path === path
}
</script>

<template>
  <nav class="space-y-2">
    <div v-for="item in navigation" :key="item._path" class="space-y-1">
      <NuxtLink
        :to="item._path"
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
        :class="isLinkActive(item._path)
          ? 'bg-gray-200 dark:bg-gray-800 text-primary dark:text-light'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
      >
        {{ item.title }}
      </NuxtLink>
      <ul v-if="item.children" class="pl-4 space-y-1">
        <li v-for="child in item.children" :key="child._path">
          <NuxtLink
            :to="child._path"
            class="flex items-center px-3 py-2 text-sm rounded-md transition-colors"
            :class="isLinkActive(child._path)
              ? 'bg-gray-200 dark:bg-gray-800 text-primary dark:text-light'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'"
          >
            {{ child.title }}
          </NuxtLink>
          <!-- Note: This is still not fully recursive. A recursive component would be better for deeper levels. -->
          <ul v-if="child.children" class="pl-4 space-y-1 mt-1">
            <li v-for="grandchild in child.children" :key="grandchild._path">
              <NuxtLink
                :to="grandchild._path"
                class="flex items-center px-3 py-2 text-xs rounded-md transition-colors"
                :class="isLinkActive(grandchild._path)
                  ? 'bg-gray-200 dark:bg-gray-800 text-primary dark:text-light'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-500'"
              >
                {{ grandchild.title }}
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>