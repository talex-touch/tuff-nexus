<script setup lang="ts">
import { SignedIn, SignedOut, UserButton } from '@clerk/nuxt/components'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useLandingRevealState } from '~/composables/useLandingRevealState'

const route = useRoute()

const scrolled = ref(false)
const { t, locale } = useI18n()

function handleScroll() {
  scrolled.value = window.scrollY > 0
}

const links = computed(() => [
  { to: '/market', label: t('nav.market') },
  { to: '/docs', label: t('nav.doc') },
  // { to: '/#developer', label: t('nav.developer') },
  { to: '/updates', label: t('nav.download') },
  // { to: '/#blog', label: t('nav.blog') },
  { to: '/pricing', label: t('nav.pricing') },
])

const langTag = computed(() => (locale.value === 'zh' ? 'zh-CN' : 'en-US'))

const signInRoute = computed(() => ({
  path: '/sign-in',
  query: {
    lang: langTag.value,
  },
}))

const afterSignOutUrl = computed(() => `/sign-in?lang=${langTag.value}`)

const currentPath = computed(() => route.path || '/')
const normalizedPath = computed(() => {
  const path = currentPath.value
  const code = locale.value
  if (!code)
    return path
  const prefix = `/${code}`
  if (path === prefix || path === `${prefix}/`)
    return '/'
  if (path.startsWith(`${prefix}/`))
    return path.slice(prefix.length) || '/'
  return path
})

const isDocs = computed(() => normalizedPath.value.startsWith('/docs'))
const isHome = computed(() => normalizedPath.value === '/')

function isActiveLink(link: { to: string }) {
  const path = normalizedPath.value
  if (link.to === '/')
    return path === '/'
  return path === link.to || path.startsWith(`${link.to}/`)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const { headerVisible, sequenceStarted, setHeaderVisibility } = useLandingRevealState()

if (!isHome.value) {
  setHeaderVisibility(true)
}
else if (!sequenceStarted.value) {
  setHeaderVisibility(false)
}

watchEffect(() => {
  if (!isHome.value) {
    setHeaderVisibility(true)
  }
})

const landingHeaderClass = computed(() => ({
  'landing-header': true,
  'landing-header--visible': headerVisible.value,
}))

const headerRevealStyle = computed(() => {
  if (!isHome.value)
    return { '--header-delay': '0s' }
  return undefined
})
</script>

<template>
  <header
    class="TuffHeader"
    data-role="main-header"
    :class="landingHeaderClass"
    :style="headerRevealStyle"
  >
    <div
      class="TuffHeader-Main mx-auto flex flex-wrap items-center justify-between gap-4 border-1 border-transparent border-solid px-4 py-2 sm:flex-nowrap"
      :class="{
        'border-primary/10 bg-white/50 shadow-sm dark:border-light/10 dark:bg-primary/50': scrolled,
      }"
    >
      <NuxtLink
        to="/"
        class="flex items-center gap-1 text-primary font-semibold tracking-tight no-underline dark:text-light"
      >
        <span class="text-lg sm:text-xl">Tuff</span>
        <span
          class="beta-tag text-md uppercase"
        >
          BETA
        </span>
      </NuxtLink>

      <nav class="flex flex-1 items-center justify-between gap-4 overflow-hidden text-sm sm:gap-5">
        <div class="ml-auto flex items-center gap-2 sm:gap-3">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-full px-3 py-1 text-primary/65 font-medium no-underline transition-colors duration-200 hover:bg-primary/5 dark:text-light/70 hover:text-primary dark:hover:bg-light/10 dark:hover:text-light"
            :class="isActiveLink(link) ? 'bg-primary/5 text-primary dark:bg-light/15 dark:text-light' : ''"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <HeaderControls
          :show-search-button="isDocs"
          :show-dark-toggle="!isHome"
        />

        <div class="flex items-center gap-2 sm:gap-3">
          <SignedOut>
            <NuxtLink
              :to="signInRoute"
              class="border border-primary/20 rounded-full bg-transparent px-3 py-1 text-sm text-primary font-medium transition dark:border-light/15 hover:border-primary/40 hover:bg-primary/5 dark:text-light dark:hover:bg-light/10"
            >
              {{ t('nav.login') }}
            </NuxtLink>
          </SignedOut>
          <SignedIn>
            <NuxtLink
              to="/dashboard"
              class="border border-primary/20 rounded-full bg-primary px-3 py-1 text-sm text-white font-semibold shadow-primary/30 shadow-sm transition dark:border-transparent dark:bg-light hover:bg-primary/90 dark:text-primary dark:shadow-light/40 dark:hover:bg-light/90"
            >
              {{ t('nav.dashboard') }}
            </NuxtLink>
          </SignedIn>
          <SignedIn>
            <div class="flex items-center border border-primary/10 rounded-full bg-primary/5 px-3 py-1 shadow-sm dark:border-light/15 dark:bg-light/10">
              <UserButton
                :after-sign-out-url="afterSignOutUrl"
                :appearance="{
                  elements: {
                    avatarBox: 'ring-2 ring-primary/20 rounded-full',
                  },
                }"
              />
            </div>
          </SignedIn>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.TuffHeader {
  position: fixed;

  top: 0;
  left: 0;

  width: 100%;
  height: 64px;
}

.TuffHeader-Main {
  position: absolute;

  top: 1rem;
  left: 50%;

  width: 100%;
  max-width: 1200px;

  border-radius: 24px;
  transform: translateX(-50%);

  isolation: isolate;
  overflow: hidden;
  backdrop-filter: var(--header-backdrop-filter, blur(18px) saturate(180%)) !important;
  -webkit-backdrop-filter: var(--header-backdrop-filter, blur(18px) saturate(180%)) !important;
}

.beta-tag {
  font-weight: 700;
  background-color: rgb(15, 15, 15);
  color: rgb(242, 156, 57) !important;
  margin: 0px 0.5rem;
  padding: 4px 8px;
  border-radius: 12px;
}

.landing-header {
  opacity: 0;
  filter: blur(18px);
  transform: translate3d(0, -48px, 0);
  pointer-events: none;
  transition:
    opacity 1.15s cubic-bezier(0.22, 0.61, 0.36, 1),
    filter 1.25s cubic-bezier(0.22, 0.61, 0.36, 1),
    transform 1.15s cubic-bezier(0.22, 0.61, 0.36, 1);
  transition-delay: var(--header-delay, 0.2s);
}

.landing-header--visible {
  opacity: 1;
  filter: none;
  transform: translate3d(0, 0, 0);
  pointer-events: auto;
}
</style>
