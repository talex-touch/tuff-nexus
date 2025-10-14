<script setup lang="ts">
import { computed } from 'vue'
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nuxt/components'

definePageMeta({
  layout: 'dashboard',
  pageTransition: {
    name: 'fade',
    mode: 'out-in',
  },
})

const { t } = useI18n()
const route = useRoute()
const redirectUrl = computed(() => route.fullPath)

const { user, isLoaded } = useUser()

const fallbackName = computed(() => t('dashboard.header.defaultName'))

const greetingName = computed(() => {
  if (!isLoaded.value || !user.value)
    return fallbackName.value
  return user.value.firstName || user.value.fullName || fallbackName.value
})

const greetingLine = computed(() => t('dashboard.header.greeting', { name: greetingName.value }))

const overviewItems = computed(() => [
  {
    icon: 'i-carbon-rocket',
    text: t('dashboard.sections.overview.items.betaAccess'),
  },
  {
    icon: 'i-carbon-notification',
    text: t('dashboard.sections.overview.items.releaseNotify'),
  },
  {
    icon: 'i-carbon-chart-combo',
    text: t('dashboard.sections.overview.items.insights'),
  },
])

const nextStepItems = computed(() => [
  {
    icon: 'i-carbon-link',
    text: t('dashboard.sections.nextSteps.items.connectWorkspace'),
  },
  {
    icon: 'i-carbon-calendar',
    text: t('dashboard.sections.nextSteps.items.scheduleOnboarding'),
  },
  {
    icon: 'i-carbon-user-multiple',
    text: t('dashboard.sections.nextSteps.items.inviteTeammates'),
  },
])

const shortcutLinks = computed(() => [
  {
    to: '/docs/getting-started',
    label: t('dashboard.sections.shortcuts.links.gettingStarted'),
  },
  {
    to: '/marketplace',
    label: t('dashboard.sections.shortcuts.links.marketplace'),
  },
  {
    to: '/developers',
    label: t('dashboard.sections.shortcuts.links.developers'),
  },
])
</script>

<template>
  <SignedIn>
    <section class="space-y-8">
      <header class="rounded-3xl border border-primary/10 bg-white/80 p-10 shadow-lg backdrop-blur-sm dark:border-light/10 dark:bg-primary/70">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm uppercase tracking-widest text-primary/70 dark:text-light/80">
              {{ t('dashboard.header.badge') }}
            </p>
            <h1 class="mt-2 text-3xl font-semibold tracking-tight text-primary dark:text-light">
              {{ greetingLine }}
            </h1>
            <p class="mt-3 max-w-2xl text-base text-primary/70 dark:text-light/80">
              {{ t('dashboard.header.intro') }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/docs"
              class="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition hover:border-primary/40 hover:bg-primary/10 dark:border-light/20 dark:bg-light/10 dark:text-light"
            >
              {{ t('dashboard.header.docsCta') }}
            </NuxtLink>
            <NuxtLink
              to="/marketplace"
              class="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90 dark:bg-light dark:text-primary dark:shadow-light/40 dark:hover:bg-light/90"
            >
              {{ t('dashboard.header.marketplaceCta') }}
            </NuxtLink>
          </div>
        </div>
      </header>

      <div class="grid gap-6 lg:grid-cols-3">
        <article class="rounded-3xl border border-primary/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-light/10 dark:bg-primary/60">
          <h2 class="text-lg font-semibold text-primary dark:text-light">
            {{ t('dashboard.sections.overview.title') }}
          </h2>
          <ul class="mt-4 space-y-3 text-sm text-primary/70 dark:text-light/80">
            <li
              v-for="item in overviewItems"
              :key="item.icon"
              class="flex items-center gap-2"
            >
              <span
                :class="[item.icon, 'text-lg text-primary dark:text-light']"
              />
              {{ item.text }}
            </li>
          </ul>
        </article>

        <article class="rounded-3xl border border-primary/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-light/10 dark:bg-primary/60">
          <h2 class="text-lg font-semibold text-primary dark:text-light">
            {{ t('dashboard.sections.nextSteps.title') }}
          </h2>
          <ul class="mt-4 space-y-3 text-sm text-primary/70 dark:text-light/80">
            <li
              v-for="item in nextStepItems"
              :key="item.icon"
              class="flex items-center gap-2"
            >
              <span
                :class="[item.icon, 'text-lg text-primary dark:text-light']"
              />
              {{ item.text }}
            </li>
          </ul>
        </article>

        <article class="rounded-3xl border border-primary/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-light/10 dark:bg-primary/60">
          <h2 class="text-lg font-semibold text-primary dark:text-light">
            {{ t('dashboard.sections.shortcuts.title') }}
          </h2>
          <div class="mt-4 grid grid-cols-1 gap-3 text-sm">
            <NuxtLink
              v-for="shortcut in shortcutLinks"
              :key="shortcut.to"
              :to="shortcut.to"
              class="flex items-center justify-between rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 font-medium text-primary transition hover:border-primary/30 hover:bg-primary/10 dark:border-light/15 dark:bg-light/10 dark:text-light"
            >
              {{ shortcut.label }}
              <span class="i-carbon-arrow-right text-base" />
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </SignedIn>
  <SignedOut>
    <RedirectToSignIn :redirect-url="redirectUrl" />
  </SignedOut>
</template>
