<script setup lang="ts">
import {
  extensionHighlights,
  featureCards,
  heroHighlights,
  heroStats,
  testingHighlights,
} from '~/data/tuffHeroContent'

import TuffBanner from './TuffBanner.vue'
import TuffText from './TuffText.vue'

const { t } = useI18n()

useHead({
  htmlAttrs: {
    class: 'dark',
  },
  bodyAttrs: {
    class: 'bg-[#050505]',
  },
})
</script>

<template>
  <div class="flex min-h-screen flex-col gap-24 bg-[#050505] pb-24 text-light lg:gap-32">
    <section class="hero-section">
      <div class="hero-surface">
        <TuffBanner>
          <template #center>
            <div class="flex w-full max-w-5xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center lg:px-12">
              <div class="flex flex-1 flex-col gap-6 text-left">
                <span class="inline-flex w-max items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.28em] uppercase text-white/70">
                  {{ t('landing.hero.badge') }}
                </span>
                <div class="space-y-4">
                  <TuffText />
                  <p class="max-w-xl text-base text-white/70 sm:text-lg">
                    {{ t('landing.hero.description') }}
                  </p>
                </div>
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <NuxtLink
                    to="/docs"
                    class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-lg transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <span class="i-carbon-download text-base" />
                    {{ t('landing.hero.primaryCta') }}
                  </NuxtLink>
                  <NuxtLink
                    to="/docs"
                    class="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <span class="i-carbon-arrow-right text-base" />
                    {{ t('landing.hero.secondaryCta') }}
                  </NuxtLink>
                </div>
                <div class="grid gap-6 pt-4 text-left text-white/70 sm:grid-cols-3">
                  <div
                    v-for="stat in heroStats"
                    :key="stat.labelKey"
                  >
                    <p class="text-2xl font-semibold text-white">{{ t(stat.valueKey) }}</p>
                    <p class="text-xs uppercase tracking-[0.25em]">
                      {{ t(stat.labelKey) }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex w-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/10 p-6 text-left shadow-xl backdrop-blur-xl lg:max-w-xs">
                <p class="text-xs uppercase tracking-[0.4em] text-white/60">
                  {{ t('landing.hero.highlightLabel') }}
                </p>
                <div class="space-y-4">
                  <article
                    v-for="item in heroHighlights"
                    :key="item.titleKey"
                    class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
                  >
                    <span :class="[item.icon, 'text-lg text-white']" />
                    <div class="space-y-1 text-white/80">
                      <p class="text-sm font-semibold text-white">
                        {{ t(item.titleKey) }}
                      </p>
                      <p class="text-xs">
                        {{ t(item.descriptionKey) }}
                      </p>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </template>
        </TuffBanner>
      </div>
    </section>

    <section class="container mx-auto max-w-6xl space-y-12 px-6">
      <div class="space-y-5 text-center">
        <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.25em] uppercase text-white/70">
          {{ t('landing.features.badge') }}
        </span>
        <h2 class="text-3xl font-semibold text-white sm:text-4xl">
          {{ t('landing.features.title') }}
        </h2>
        <p class="mx-auto max-w-2xl text-base text-white/70 sm:text-lg">
          {{ t('landing.features.description') }}
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="feature in featureCards"
          :key="feature.titleKey"
          class="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0f] p-6 text-left shadow-xl transition hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl"
        >
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,98,255,0.12),_transparent_65%)] opacity-80" />
          <div class="relative space-y-4">
            <span :class="[feature.icon, 'inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl text-white']" />
            <h3 class="text-lg font-semibold text-white">
              {{ t(feature.titleKey) }}
            </h3>
            <p class="text-sm text-white/65">
              {{ t(feature.descriptionKey) }}
            </p>
          </div>
        </article>
      </div>
    </section>

    <section class="bg-[#060606] py-20">
      <div class="container mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div class="space-y-6 text-left">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.25em] uppercase text-white/70">
            {{ t('landing.extensions.badge') }}
          </span>
          <h2 class="text-3xl font-semibold text-white sm:text-4xl">
            {{ t('landing.extensions.title') }}
          </h2>
          <p class="text-base text-white/70">
            {{ t('landing.extensions.description') }}
          </p>
          <NuxtLink
            to="/marketplace"
            class="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-md transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <span class="i-carbon-catalog text-base" />
            {{ t('landing.extensions.cta') }}
          </NuxtLink>
        </div>

        <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0f] p-8 shadow-2xl">
          <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(120,160,255,0.18),_transparent_55%)] opacity-80" />
          <div class="grid gap-5 md:grid-cols-2">
            <article
              v-for="item in extensionHighlights"
              :key="item.titleKey"
              class="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
            >
              <h3 class="text-base font-semibold text-white">
                {{ t(item.titleKey) }}
              </h3>
              <p class="text-sm text-white/65">
                {{ t(item.descriptionKey) }}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="container mx-auto max-w-6xl space-y-12 px-6">
      <div class="grid gap-10 rounded-3xl border border-white/10 bg-[#07070b] p-10 shadow-2xl lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div class="space-y-4 text-left">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
            {{ t('landing.testing.badge') }}
          </span>
          <h2 class="text-3xl font-semibold text-white sm:text-4xl">
            {{ t('landing.testing.title') }}
          </h2>
          <p class="text-base text-white/70">
            {{ t('landing.testing.description') }}
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <article
            v-for="item in testingHighlights"
            :key="item.titleKey"
            class="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
          >
            <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              {{ t(item.tagKey) }}
            </span>
            <h3 class="text-lg font-semibold text-white">
              {{ t(item.titleKey) }}
            </h3>
            <p class="text-sm text-white/65">
              {{ t(item.descriptionKey) }}
            </p>
          </article>
        </div>
      </div>

      <div class="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-[#08080c] p-10 text-center shadow-2xl">
        <h3 class="text-2xl font-semibold text-white sm:text-3xl">
          {{ t('landing.finalCta.title') }}
        </h3>
        <p class="max-w-2xl text-base text-white/70">
          {{ t('landing.finalCta.description') }}
        </p>
        <div class="flex flex-col gap-3 sm:flex-row">
          <NuxtLink
            to="/docs"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-md transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <span class="i-carbon-play-filled text-base" />
            {{ t('landing.finalCta.primary') }}
          </NuxtLink>
          <NuxtLink
            to="/docs/about/team"
            class="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <span class="i-carbon-chat text-base" />
            {{ t('landing.finalCta.secondary') }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-section {
  display: flex;
  justify-content: center;
  padding: clamp(4rem, 12vh, 8rem) 0;
  background: radial-gradient(circle at top, rgba(18, 18, 26, 0.6), rgba(5, 5, 10, 0.2)) #050505;
}

.hero-surface {
  width: min(100%, 1200px);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(135deg, rgba(12, 12, 18, 0.95) 0%, rgba(5, 5, 10, 0.75) 100%);
  box-shadow: 0 48px 180px rgba(0, 0, 0, 0.55);
  overflow: hidden;
}

.hero-surface :deep(.tuff-banner) {
  width: 100%;
}

.hero-surface :deep(.tuff-banner-layer) {
  width: 100%;
}
</style>
