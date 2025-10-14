<script setup lang="ts">
import { ClerkLoaded, ClerkLoading, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nuxt/components'
import { computed } from 'vue'
import { appName } from '~/constants'

const route = useRoute()

const PUBLIC_ROUTE_PREFIXES = ['/sign-in', '/sign-up'] // allow unauthenticated access for Clerk UI routes
const isPublicRoute = computed(() =>
  PUBLIC_ROUTE_PREFIXES.some(prefix => route.path.startsWith(prefix)),
)

useHead({
  title: appName,
})
</script>

<template>
  <VitePwaManifest />
  <ClerkLoading>
    <div class="grid h-screen w-screen place-content-center text-sm text-gray-500">
      Checking your session…
    </div>
  </ClerkLoading>
  <ClerkLoaded>
    <SignedIn>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </SignedIn>
    <SignedOut>
      <template v-if="isPublicRoute">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </template>
      <template v-else>
        <RedirectToSignIn />
      </template>
    </SignedOut>
  </ClerkLoaded>
</template>

<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}

body {
  font-family:
    'PingFang SC', '-apple-system', 'Helvetica Neue', 'Segoe UI', 'Microsoft YaHei', 'Noto Sans SC', 'DM Sans',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html.dark {
  color-scheme: dark;
}

.cubic-transition,
.transition-cubic {
  transition: 0.25s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}

button {
  outline: none !important;
  border: none !important;
}
</style>
