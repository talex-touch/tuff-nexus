<script setup lang="ts">
import { SignUp } from '@clerk/nuxt/components'

definePageMeta({
  layout: false,
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-white px-4 py-16 dark:bg-gray-900">
    <div class="max-w-md w-full">
      <SignUp
        :appearance="{ elements: { rootBox: 'shadow-lg rounded-2xl bg-white dark:bg-gray-800' } }"
        path="/sign-up"
        routing="path"
        sign-in-url="/sign-in"
      />
    </div>
  </div>
</template>
