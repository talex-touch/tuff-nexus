<script setup lang="ts">
import { ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'
import TuffShowcase from './showcase/TuffShowcase.vue'

interface SpotlightResult {
  icon: string
  title: string
  meta: string
}

interface SpotlightHighlight {
  title: string
  copy: string
}

interface AiSpotlightContent {
  eyebrow: string
  headline: string
  subheadline: string
  demo: {
    queryLabel: string
    queryText: string
    summary: string
    results: SpotlightResult[]
  }
  highlights: SpotlightHighlight[]
}

const { spotlight } = defineProps<{
  spotlight: AiSpotlightContent
}>()

const sectionRef = ref<HTMLElement | null>(null)

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 48,
    duration: 1.05,
  },
})
</script>

<template>
  <section
    ref="sectionRef"
    class="min-h-screen flex flex-col gap-12 overflow-hidden py-24"
  >
    <TuffStickyBar>
      {{ spotlight.eyebrow }}
    </TuffStickyBar>

    <header class="text-center text-neutral-900 text-white">
      <h2 class="my-0 text-[clamp(.7rem,1vw+1.4rem,1.2rem)] font-bold leading-tight">
        {{ spotlight.headline }}
      </h2>
      <p class="mx-auto my-0 max-w-3xl text-[clamp(.6rem,1vw+1.3rem,1.1rem)] font-semibold leading-relaxed op-70">
        {{ spotlight.subheadline }}
        <span class="mt-3 block text-sm text-neutral-500 font-medium tracking-wide dark:text-neutral-300/80">
          {{ spotlight.demo.summary }}
        </span>
      </p>
    </header>

    <div class="flex flex-col items-center gap-12 text-center">
      <TuffLandingShowcaseTuffShowcaseContainer>
        <TuffVortexBackground>
          <TuffShowcase />
        </TuffVortexBackground>
      </TuffLandingShowcaseTuffShowcaseContainer>

      <p>
        <span class="block text-sm text-neutral-500/80 font-medium tracking-wide dark:text-neutral-300/70">
          {{ spotlight.highlights[0]?.copy ?? 'Precision insights orchestrated for your next launch.' }}
        </span>
      </p>
    </div>
  </section>
</template>
