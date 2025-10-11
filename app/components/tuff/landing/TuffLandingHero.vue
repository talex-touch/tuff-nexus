<script setup lang="ts">
import { ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'
import TuffBanner from '../TuffBanner.vue'

interface HeroCta {
  label: string
  to: string
  icon: string
}

interface HeroHighlight {
  value: string
  label: string
}

interface HeroConfig {
  badge: string
  title: string
  copy: string
  bullets: string[]
  primaryCta: HeroCta
  secondaryCta: HeroCta
  highlights: HeroHighlight[]
  bannerCopy: string
}

const props = defineProps<{
  hero: HeroConfig
}>()

const sectionRef = ref<HTMLElement | null>(null)

useGsapReveal(sectionRef, {
  from: {
    y: 56,
    opacity: 0,
    duration: 1.1,
  },
})
</script>

<template>
  <section
    ref="sectionRef"
    class="TuffHome-HeroSection relative overflow-hidden"
  >
    <div class="mx-auto max-w-6xl flex flex-col gap-14 lg:flex-row lg:items-center">
      <div class="relative flex flex-1 flex-col gap-8">
        <span
          data-reveal
          class="w-max inline-flex items-center gap-2 border border-white/15 rounded-full bg-white/10 px-5 py-1 text-[11px] text-white/70 font-semibold tracking-[0.32em] uppercase"
        >
          <span class="i-carbon-star-filled text-base" />
          {{ hero.badge }}
        </span>

        <div class="space-y-6">
          <h1
            data-reveal
            class="max-w-xl text-[clamp(2.75rem,4vw+1.75rem,4rem)] text-white font-semibold leading-tight"
          >
            {{ hero.title }}
          </h1>
          <p
            data-reveal
            class="max-w-xl text-base text-white/70 sm:text-lg"
          >
            {{ hero.copy }}
          </p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <NuxtLink
            :to="hero.primaryCta.to"
            data-reveal
            class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm text-black font-semibold shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 hover:-translate-y-0.5"
          >
            <span :class="hero.primaryCta.icon" class="text-base" />
            {{ hero.primaryCta.label }}
          </NuxtLink>

          <NuxtLink
            :to="hero.secondaryCta.to"
            data-reveal
            class="inline-flex items-center justify-center gap-2 border border-white/20 rounded-full px-6 py-3 text-sm text-white font-semibold transition hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 hover:-translate-y-0.5"
          >
            <span :class="hero.secondaryCta.icon" class="text-base" />
            {{ hero.secondaryCta.label }}
          </NuxtLink>
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          <div
            v-for="item in hero.highlights"
            :key="item.label"
            data-reveal
            class="border border-white/10 rounded-2xl bg-white/5 px-5 py-4 text-white shadow-[0_16px_45px_rgba(0,0,0,0.45)] backdrop-blur"
          >
            <p class="text-2xl text-white font-semibold">
              {{ item.value }}
            </p>
            <p class="mt-1 text-xs text-white/55 font-medium tracking-[0.26em] uppercase">
              {{ item.label }}
            </p>
          </div>
        </div>
      </div>

      <div class="relative flex flex-1 justify-center">
        <div class="pointer-events-none absolute right-20 h-36 w-36 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.16),_transparent)] blur-2xl -top-10" />

        <div
          data-reveal
          class="relative max-w-xl w-full flex flex-col gap-6 border border-white/10 rounded-[32px] bg-white/5 p-1 shadow-[0_32px_120px_rgba(0,0,0,0.55)] backdrop-blur-lg"
        >
          <div class="border border-white/10 rounded-[28px] bg-[#070914]/80 p-8">
            <TuffBanner>
              <template #center>
                <div class="w-full flex flex-col items-center gap-6 px-8 py-16 text-center text-white/80">
                  <span class="inline-flex items-center gap-2 border border-white/15 rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/65 font-semibold tracking-[0.32em] uppercase">
                    Motion Kernel
                  </span>
                  <p class="text-base">
                    {{ hero.bannerCopy }}
                  </p>
                  <span class="inline-flex items-center gap-2 border border-white/20 rounded-full bg-white/5 px-4 py-2 text-xs text-white/50 font-semibold tracking-[0.3em] uppercase">
                    Render fidelity · 4K ready
                  </span>
                </div>
              </template>
            </TuffBanner>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
