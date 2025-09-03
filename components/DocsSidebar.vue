<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
</script>

<template>
  <nav>
    <ul>
      <li v-for="item in navigation" :key="item._path">
        <NuxtLink :to="item._path">{{ item.title }}</NuxtLink>
        <ul v-if="item.children">
          <li v-for="child in item.children" :key="child._path">
            <NuxtLink :to="child._path" class="pl-4">{{ child.title }}</NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>