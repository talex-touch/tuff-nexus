<script setup lang="ts">
definePageMeta({
  layout: 'docs'
})
</script>

<template>
  <ContentDoc>
    <template #not-found>
      <div class="text-center p-8">
        <div class="text-4xl mb-4">
          <div class="i-carbon-warning inline-block" />
        </div>
        <div class="mb-4">Document not found</div>
        <div class="text-sm text-gray-600 mb-4">
          The requested document could not be found.
        </div>
        <div>
          <NuxtLink 
            to="/docs" 
            class="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
          >
            Back to Docs
          </NuxtLink>
        </div>
      </div>
    </template>
  </ContentDoc>
</template>