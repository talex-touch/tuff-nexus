<script setup lang="ts">
const { data: navigationTree, pending, error } = await useAsyncData(
  'docs-navigation',
  () => queryCollectionNavigation('docs'),
)
const items = computed(() => navigationTree.value ?? [])
const route = useRoute()

function isLinkActive(path: string) {
  if (!path)
    return false

  return route.path === path || route.path.startsWith(`${path}/`)
}

function itemTitle(title?: string, path?: string) {
  if (title)
    return title

  if (!path)
    return 'Untitled'

  return path.split('/').filter(Boolean).pop()?.replace(/[-_]/g, ' ')?.replace(/\b\w/g, c => c.toUpperCase()) ?? 'Untitled'
}

function linkTarget(item: any) {
  if (!item?.path)
    return null

  if (item.page === false && Array.isArray(item.children) && item.children.length > 0)
    return item.children[0].path

  return item.path
}
</script>

<template>
  <nav class="space-y-2">
    <template v-if="pending">
      <div v-for="index in 6" :key="index" class="h-8 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800" />
    </template>
    <template v-else-if="error">
      <div class="rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-500 dark:border-gray-800 dark:bg-primary/80 dark:text-gray-300">
        导航加载失败，请稍后再试。
      </div>
    </template>
    <template v-else>
      <div v-for="item in items" :key="item.path ?? item.title" class="space-y-1">
        <template v-if="linkTarget(item)">
          <NuxtLink
            :to="linkTarget(item)!"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="isLinkActive(linkTarget(item) || item.path || '')
              ? 'bg-gray-200 dark:bg-gray-800 text-primary dark:text-light'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
          >
            {{ itemTitle(item.title, item.path ?? linkTarget(item) ?? undefined) }}
          </NuxtLink>
        </template>
        <div
          v-else
          class="px-3 py-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
        >
          {{ itemTitle(item.title, item.path ?? linkTarget(item) ?? undefined) }}
        </div>
        <ul v-if="item.children" class="pl-4 space-y-1">
          <li v-for="child in item.children" :key="child.path ?? child.title">
            <NuxtLink
              v-if="linkTarget(child)"
              :to="linkTarget(child)!"
              class="flex items-center px-3 py-2 text-sm rounded-md transition-colors"
              :class="isLinkActive(linkTarget(child) || child.path || '')
                ? 'bg-gray-200 dark:bg-gray-800 text-primary dark:text-light'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'"
            >
              {{ itemTitle(child.title, child.path ?? linkTarget(child) ?? undefined) }}
            </NuxtLink>
            <!-- Note: This is still not fully recursive. A recursive component would be better for deeper levels. -->
            <ul v-if="child.children" class="pl-4 space-y-1 mt-1">
              <li v-for="grandchild in child.children" :key="grandchild.path ?? grandchild.title">
                <NuxtLink
                  v-if="linkTarget(grandchild)"
                  :to="linkTarget(grandchild)!"
                  class="flex items-center px-3 py-2 text-xs rounded-md transition-colors"
                  :class="isLinkActive(linkTarget(grandchild) || grandchild.path || '')
                    ? 'bg-gray-200 dark:bg-gray-800 text-primary dark:text-light'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-500'"
                >
                  {{ itemTitle(grandchild.title, grandchild.path ?? linkTarget(grandchild) ?? undefined) }}
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </template>
  </nav>
</template>
