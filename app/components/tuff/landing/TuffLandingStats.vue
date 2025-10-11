<script setup lang="ts">
import TuffShowcase from './showcase/TuffShowcase.vue'
import { ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

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
    class="min-h-screen flex flex-col overflow-hidden"
  >
    <header class="text-center text-neutral-900 space-y-5">
      <TuffStickyBar>
        {{ spotlight.eyebrow }}
      </TuffStickyBar>
      <h2 class="text-[clamp(2.2rem,1vw+2.4rem,3.4rem)] font-semibold leading-tight">
        {{ spotlight.headline }}
      </h2>
      <p class="mx-auto max-w-3xl text-base text-neutral-600 leading-relaxed sm:text-lg">
        {{ spotlight.subheadline }}
      </p>
    </header>

    <div class="flex flex-col items-center gap-12 text-center">
      <TuffLandingShowcaseTuffShowcaseContainer>
        <TuffShowcase />
      </TuffLandingShowcaseTuffShowcaseContainer>

    </div>
  </section>
</template>
