<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface AiOverviewHero {
  title: string
  copy: string
  primaryCta: string
  secondaryCta: string
  bullets: string[]
}

interface AiOverviewHighlight {
  icon: string
  title: string
  copy: string
}

interface AiOverviewContent {
  eyebrow: string
  headline: string
  subheadline: string
  hero: AiOverviewHero
  highlights: AiOverviewHighlight[]
}

const props = defineProps<{
  aiOverview: AiOverviewContent
}>()

const sectionRef = ref<HTMLElement | null>(null)
const aiOverview = computed(() => props.aiOverview)
const hero = computed(() => aiOverview.value.hero)
const highlights = computed(() => aiOverview.value.highlights ?? [])

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 36,
    duration: 1.1,
  },
})
</script>

<template>
  <section
    ref="sectionRef"
    class="relative isolate min-h-screen flex flex-col justify-center overflow-hidden py-24 text-white"
  >
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute left-[-320px] top-1/4 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.18),_transparent_65%)] blur-3xl" />
      <div class="absolute right-[-280px] top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.22),_transparent_68%)] blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-6xl w-full px-6 space-y-10">
      <TuffStickyBar>
        {{ aiOverview.eyebrow }}
      </TuffStickyBar>

      <header class="text-center space-y-5">
        <h2 class="my-0 text-[clamp(2.1rem,1vw+2.4rem,3.1rem)] font-semibold leading-tight">
          {{ aiOverview.headline }}
        </h2>
        <p class="mx-auto my-0 max-w-3xl text-[clamp(.7rem,1vw+1.2rem,1.15rem)] text-white/70 font-semibold leading-relaxed">
          {{ aiOverview.subheadline }}
        </p>
      </header>

      <div class="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.15fr)]">
        <article
          data-reveal
          class="relative overflow-hidden border border-white/10 rounded-[32px] bg-white/5 p-10 text-left text-white shadow-[0_32px_120px_rgba(12,20,56,0.45)]"
        >
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.16),_transparent_70%)] opacity-90" />
          <div class="relative space-y-6">
            <h3 class="my-0 text-[clamp(1.5rem,0.8vw+1.6rem,2.4rem)] font-semibold leading-tight">
              {{ hero.title }}
            </h3>
            <p class="text-base text-white/70 leading-relaxed">
              {{ hero.copy }}
            </p>
            <ul class="space-y-3 text-sm text-white/70 leading-relaxed">
              <li
                v-for="(bullet, index) in hero.bullets"
                :key="index"
                class="flex items-start gap-3"
              >
                <span class="mt-1 inline-flex size-2.5 flex-shrink-0 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(190,242,100,0.6)]" />
                <span>{{ bullet }}</span>
              </li>
            </ul>
            <div class="flex flex-wrap gap-4 pt-2">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm text-neutral-900 font-semibold tracking-[0.14em] uppercase transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {{ hero.primaryCta }}
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 border border-white/20 rounded-full px-6 py-3 text-sm text-white font-semibold tracking-[0.14em] uppercase transition hover:-translate-y-0.5 hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                {{ hero.secondaryCta }}
              </button>
            </div>
          </div>
        </article>

        <div class="grid gap-6" data-reveal>
          <article
            v-for="highlight in highlights"
            :key="highlight.title"
            class="group relative overflow-hidden border border-white/10 rounded-[28px] bg-white/4 p-6 text-left text-white shadow-[0_24px_80px_rgba(7,15,45,0.42)] transition duration-300 hover:border-white/25 hover:bg-white/8 hover:-translate-y-1"
          >
            <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_70%)] opacity-60 transition duration-300 group-hover:opacity-90" />
            <div class="relative space-y-4">
              <span class="inline-flex size-11 items-center justify-center rounded-2xl bg-white/10 text-white shadow-[0_18px_40px_rgba(2,16,54,0.38)]">
                <span :class="highlight.icon" class="text-xl" aria-hidden="true" />
              </span>
              <div class="space-y-2">
                <h3 class="text-lg font-semibold leading-tight">
                  {{ highlight.title }}
                </h3>
                <p class="text-sm text-white/70 leading-relaxed">
                  {{ highlight.copy }}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
