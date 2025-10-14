<script setup lang="ts">
import { computed } from 'vue'

const { t } = useI18n()

const year = new Date().getFullYear()

const navLinks = computed(() => [
  { to: '/#market', label: t('nav.market') },
  { to: '/docs', label: t('nav.doc') },
  { to: '/#developer', label: t('nav.developer') },
  { to: '/#download', label: t('nav.download') },
  { to: '/#blog', label: t('nav.blog') },
  { to: '/pricing', label: t('nav.pricing') },
])

const socialLinks = computed(() => [
  {
    href: 'https://github.com/talex-touch/tuff',
    label: t('landing.footer.socials.github'),
    icon: 'i-carbon-logo-github',
  },
])
</script>

<template>
  <footer class="relative isolate overflow-hidden border-t border-white/10 bg-[#05060d] py-16 text-white">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute inset-x-0 top-[-40%] h-[420px] bg-[radial-gradient(circle_at_center,_rgba(79,70,229,0.28),_transparent_70%)] blur-3xl" />
      <div class="absolute bottom-[-45%] left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.22),_transparent_70%)] blur-3xl" />
    </div>

    <div class="relative mx-auto w-full max-w-6xl px-6">
      <div class="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <section class="space-y-6">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 text-2xl font-semibold tracking-tight text-white no-underline"
          >
            <span>Tuff</span>
            <span class="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              Beta
            </span>
          </NuxtLink>

          <p class="max-w-md text-sm text-white/70 leading-relaxed">
            {{ t('landing.footer.tagline') }}
          </p>

          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="/#download"
              class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <span class="i-carbon-download text-base" aria-hidden="true" />
              {{ t('landing.footer.primaryCta') }}
            </NuxtLink>

            <NuxtLink
              to="/docs"
              class="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <span class="i-carbon-book text-base" aria-hidden="true" />
              {{ t('landing.footer.secondaryCta') }}
            </NuxtLink>
          </div>
        </section>

        <nav aria-label="Footer navigation">
          <ul class="grid grid-cols-2 gap-3 text-sm text-white/70 sm:grid-cols-3">
            <li v-for="link in navLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white/70 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span>{{ link.label }}</span>
                <span class="i-carbon-arrow-right text-xs" aria-hidden="true" />
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <div class="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {{ year }} Tuff Labs. {{ t('landing.footer.rights') }}
        </p>
        <div class="flex items-center gap-4">
          <a
            v-for="social in socialLinks"
            :key="social.href"
            :href="social.href"
            :aria-label="social.label"
            target="_blank"
            rel="noopener"
            class="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <span :class="social.icon" class="text-base" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
