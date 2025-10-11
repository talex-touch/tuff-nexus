<script setup lang="ts">
import { ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface LocalizedCopy {
  en: string
  zh: string
}

interface FoundationPillar {
  icon: string
  title: LocalizedCopy
  copy: LocalizedCopy
}

interface OpenFoundationContent {
  eyebrow: string
  headline: LocalizedCopy
  subheadline: LocalizedCopy
  pillars: FoundationPillar[]
  footnote: LocalizedCopy
}

const { openFoundation } = defineProps<{
  openFoundation: OpenFoundationContent
}>()

const sectionRef = ref<HTMLElement | null>(null)

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 36,
    duration: 1,
  },
})
</script>

<template>
  <section
    ref="sectionRef"
    class="px-6 py-24"
  >
    <div class="mx-auto max-w-6xl space-y-12">
      <header class="space-y-6 text-white">
        <span
          data-reveal
          class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-white/70"
        >
          {{ openFoundation.eyebrow }}
        </span>
        <h2
          data-reveal
          class="text-[clamp(2rem,1.1vw+2.25rem,3.1rem)] font-semibold leading-tight text-white"
        >
          {{ openFoundation.headline }}
        </h2>
        <p
          data-reveal
          class="max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg"
        >
          {{ openFoundation.subheadline }}
        </p>
      </header>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="pillar in openFoundation.pillars"
          :key="pillar.title"
          data-reveal
          class="flex h-full flex-col gap-5 rounded-[28px] border border-white/10 bg-[#04050f]/92 p-8 shadow-[0_28px_110px_rgba(0,0,0,0.5)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-[#060719]"
        >
          <span class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white/80">
            <span :class="pillar.icon" class="text-2xl" aria-hidden="true" />
          </span>
          <div class="space-y-2">
            <h3 class="text-lg font-semibold text-white/90">
              {{ pillar.title }}
            </h3>
          </div>
          <p class="text-sm text-white/60">
            {{ pillar.copy }}
          </p>
        </article>
      </div>

      <footer
        data-reveal
        class="rounded-[24px] border border-white/10 bg-white/5 px-6 py-5 text-sm text-white/65"
      >
        <span class="block text-white/70">
          {{ openFoundation.footnote }}
        </span>
      </footer>
    </div>
  </section>
</template>
