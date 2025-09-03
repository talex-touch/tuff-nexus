<script setup lang="ts">
const searchTerm = ref('')
const searchResults = ref([])

watch(searchTerm, async (newTerm) => {
  if (!newTerm) {
    searchResults.value = []
    return
  }
  // @ts-expect-error: `searchContent` is auto-imported
  const results = await searchContent(newTerm)
  searchResults.value = results.value
})
</script>

<template>
  <div class="relative">
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Search..."
      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
    />
    <ul v-if="searchResults.length" class="absolute mt-1 w-full bg-white border rounded-lg shadow-lg">
      <li v-for="result in searchResults" :key="result.id">
        <NuxtLink :to="result._path" class="block px-4 py-2 hover:bg-gray-100">
          {{ result.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>