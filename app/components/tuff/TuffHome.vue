<script setup lang="ts">
// 视觉横幅组件
import TuffBanner from './TuffBanner.vue'
import TuffText from './TuffText.vue'

import { useTuffHeroAnimation } from '~/composables/useTuffHeroAnimation'
import {
  extensionHighlights,
  featureCards,
  heroHighlights,
  testingHighlights,
} from '~/data/tuffHeroContent'

// 初始化滚动动画，返回英雄区的 ref。
// 如果希望调整触发阈值，可传入 { headerAppearThreshold, paddingRevealThreshold }。
const { heroSection } = useTuffHeroAnimation()
</script>

<template>
  <div class="flex flex-col gap-24 pb-24 lg:gap-32">
    <!-- WebGL 英雄区：默认全屏，滚动时缩回到内容尺寸 -->
    <section
      ref="heroSection"
      data-state="expanded"
      class="hero-section relative w-full overflow-hidden rounded-3xl border border-primary/15 bg-black shadow-2xl dark:border-light/10"
    >
      <div class="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
      <div class="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom,_rgba(12,35,255,0.28),_transparent_55%)]" />
      <TuffBanner>
        <template #center>
          <div class="flex w-full max-w-6xl flex-col gap-12 px-6 text-light self-center lg:flex-row lg:items-center lg:px-12">
            <div class="flex flex-1 flex-col gap-6 text-left">
              <!-- 顶部徽章与文案，滚动时依次浮现 -->
              <span
                data-hero-reveal
                class="inline-flex w-max items-center gap-2 rounded-full border border-light/25 bg-light/10 px-4 py-1 text-xs font-semibold tracking-[0.28em] uppercase"
              >
                Beta Preview
              </span>
              <div data-hero-reveal class="space-y-4">
                <TuffText />
                <p class="max-w-xl text-base text-light/80 sm:text-lg">
                  A strong adaptation more platform all-tool program that elevates your desktop into a responsive, intelligent control center.
                </p>
              </div>
              <!-- CTA 按钮区域 -->
              <div data-hero-reveal class="flex flex-col gap-3 sm:flex-row sm:items-center">
                <NuxtLink
                  to="/docs"
                  class="inline-flex items-center justify-center gap-2 rounded-full bg-light px-6 py-3 text-sm font-semibold text-primary shadow-lg transition hover:-translate-y-0.5 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light/70 dark:hover:bg-white"
                >
                  <span class="i-carbon-download text-base" />
                  Download Beta
                </NuxtLink>
                <NuxtLink
                  to="/docs"
                  class="inline-flex items-center justify-center gap-2 rounded-full border border-light/20 px-6 py-3 text-sm font-semibold text-light transition hover:bg-light/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light/40"
                >
                  <span class="i-carbon-arrow-right text-base" />
                  Explore Docs
                </NuxtLink>
              </div>
              <div class="grid gap-6 pt-4 text-left text-light/70 sm:grid-cols-3">
                <div data-hero-reveal>
                  <p class="text-2xl font-semibold text-light">2M+</p>
                  <p class="text-xs uppercase tracking-[0.25em]">Commands automated</p>
                </div>
                <div data-hero-reveal>
                  <p class="text-2xl font-semibold text-light">48 ms</p>
                  <p class="text-xs uppercase tracking-[0.25em]">Average response</p>
                </div>
                <div data-hero-reveal>
                  <p class="text-2xl font-semibold text-light">120+</p>
                  <p class="text-xs uppercase tracking-[0.25em]">Workspace layouts</p>
                </div>
              </div>
            </div>

            <!-- 亮点列表面板 -->
            <div
              data-hero-reveal
              class="flex w-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/10 p-6 text-left shadow-xl backdrop-blur-xl lg:max-w-xs"
            >
              <p class="text-xs uppercase tracking-[0.4em] text-light/60">
                Platform Highlights
              </p>
              <div class="space-y-4">
                <article
                  v-for="item in heroHighlights"
                  :key="item.title"
                  data-hero-highlight
                  class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
                >
                  <span :class="[item.icon, 'text-lg text-light']" />
                  <div class="space-y-1 text-light/80">
                    <p class="text-sm font-semibold text-light">{{ item.title }}</p>
                    <p class="text-xs">
                      {{ item.description }}
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </template>
      </TuffBanner>
    </section>

    <section class="container mx-auto max-w-6xl space-y-12 px-6">
      <div class="space-y-5 text-center">
        <div class="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary/80 dark:border-light/15 dark:bg-light/10 dark:text-light/70">
          Why Choose Tuff
        </div>
        <h2 class="text-3xl font-semibold text-primary dark:text-light sm:text-4xl">
          More than imagination.
        </h2>
        <p class="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-200">
          Depend on smart orchestration, responsive visuals, and tooling that scales with your ambitions.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="feature in featureCards"
          :key="feature.title"
          class="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-white via-white to-gray-50 p-6 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-light/10 dark:from-primary/60 dark:via-primary/55 dark:to-primary/45"
        >
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(12,35,255,0.08),_transparent_60%)] opacity-80 dark:bg-[radial-gradient(circle_at_top,_rgba(250,250,250,0.08),_transparent_60%)]" />
          <div class="relative space-y-4">
            <span :class="[feature.icon, 'inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl text-primary dark:bg-light/10 dark:text-light']" />
            <h3 class="text-lg font-semibold text-primary dark:text-light">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-200">
              {{ feature.description }}
            </p>
          </div>
        </article>
      </div>
    </section>

    <section class="bg-gray-50 py-20 dark:bg-primary/80">
      <div class="container mx-auto max-w-6xl grid gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div class="space-y-6 text-left">
          <span class="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-[0.25em] uppercase text-primary/70 dark:border-light/15 dark:bg-light/10 dark:text-light/70">
            Extensible Platform
          </span>
          <h2 class="text-3xl font-semibold text-primary dark:text-light sm:text-4xl">
            Scale from lightweight plugins to full workspace extensions.
          </h2>
          <p class="text-base text-gray-600 dark:text-gray-200">
            Polyglot tooling to grow from helpers to deep integrations. Every capability is designed for composability, performance, and effortless deployment across Tuff environments.
          </p>
          <NuxtLink
            to="/marketplace"
            class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-light shadow-md transition hover:-translate-y-0.5 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:bg-light dark:text-primary dark:hover:bg-light/90"
          >
            <span class="i-carbon-catalog text-base" />
            Explore Marketplace
          </NuxtLink>
        </div>

        <div class="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-bl from-white via-white to-gray-100 p-8 shadow-xl dark:border-light/10 dark:from-primary/60 dark:via-primary/55 dark:to-primary/45">
          <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(12,35,255,0.18),_transparent_55%)] opacity-80 dark:bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.15),_transparent_55%)]" />
          <div class="grid gap-5 md:grid-cols-2">
            <article
              v-for="item in extensionHighlights"
              :key="item.title"
              class="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-white/80 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-light/15 dark:bg-primary/70"
            >
              <h3 class="text-base font-semibold text-primary dark:text-light">
                {{ item.title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-200">
                {{ item.description }}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="container mx-auto max-w-6xl space-y-12 px-6">
      <div class="grid gap-10 rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/5 via-white to-white p-10 shadow-xl dark:border-light/10 dark:from-primary/60 dark:via-primary/55 dark:to-primary/45 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div class="space-y-4 text-left">
          <span class="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary/70 dark:border-light/15 dark:bg-light/10 dark:text-light/70">
            Pioneer Testing
          </span>
          <h2 class="text-3xl font-semibold text-primary dark:text-light sm:text-4xl">
            Join the early access community shaping Tuff.
          </h2>
          <p class="text-base text-gray-600 dark:text-gray-200">
            Validate new integrations, stress-test automation, and keep every release stable with the Pioneer Testing Program.
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <article
            v-for="item in testingHighlights"
            :key="item.title"
            class="flex flex-col gap-4 rounded-3xl border border-primary/10 bg-white/80 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-light/10 dark:bg-primary/70"
          >
            <span class="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary/70 dark:border-light/10 dark:bg-light/10 dark:text-light/60">
              {{ item.tag }}
            </span>
            <h3 class="text-lg font-semibold text-primary dark:text-light">
              {{ item.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-200">
              {{ item.description }}
            </p>
          </article>
        </div>
      </div>

      <div class="flex flex-col items-center gap-4 rounded-3xl border border-primary/10 bg-white/90 p-10 text-center shadow-lg dark:border-light/10 dark:bg-primary/70">
        <h3 class="text-2xl font-semibold text-primary dark:text-light sm:text-3xl">
          Ready to explore the Tuff ecosystem?
        </h3>
        <p class="max-w-2xl text-base text-gray-600 dark:text-gray-200">
          Build immersive desktop experiences with a platform that amplifies creators, operators, and teams who ship fast.
        </p>
        <div class="flex flex-col gap-3 sm:flex-row">
          <NuxtLink
            to="/docs"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-light shadow-md transition hover:-translate-y-0.5 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:bg-light dark:text-primary dark:hover:bg-light/90"
          >
            <span class="i-carbon-play-filled text-base" />
            Browse Documentation
          </NuxtLink>
          <NuxtLink
            to="/docs/about/team"
            class="inline-flex items-center justify-center gap-2 rounded-full border border-primary/15 px-6 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 dark:border-light/15 dark:text-light dark:hover:border-light/30 dark:hover:text-light"
          >
            <span class="i-carbon-chat text-base" />
            Talk with the team
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-section {
  position: relative;
  transition: height 0.4s ease;
}

.hero-section[data-state='expanded'],
.hero-section[data-state='animating'] {
  display: flex;
  align-items: center;
}

.hero-section[data-state='expanded'],
.hero-section[data-state='animating'] {
  height: 100vh;
}

.hero-section[data-state='measuring'],
.hero-section[data-state='compact'] {
  height: auto;
  display: block;
}

.hero-section[data-state='expanded'] :deep(.tuff-banner),
.hero-section[data-state='animating'] :deep(.tuff-banner) {
  height: 100%;
  min-height: 100%;
}

.hero-section[data-state='expanded'] :deep(.tuff-banner-layer),
.hero-section[data-state='animating'] :deep(.tuff-banner-layer) {
  min-height: 100%;
}

.hero-section[data-state='expanded'] [data-hero-reveal],
.hero-section[data-state='expanded'] [data-hero-highlight] {
  opacity: 0;
  transform: translateY(36px);
}

.hero-section[data-state='expanded'] [data-hero-highlight] {
  transform: translateY(24px);
}
</style>
