<script setup lang="ts">
import { SignIn } from '@clerk/nuxt/components';

definePageMeta({
  layout: false,
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-white px-4 py-16 dark:bg-gray-900">
    <div class="w-full max-w-md">
      <SignIn
        :appearance="{ elements: { rootBox: 'shadow-lg rounded-2xl bg-white dark:bg-gray-800' } }"
        path="/sign-in"
        routing="path"
        sign-up-url="/sign-up"
      />
    </div>
  </div>
</template>
