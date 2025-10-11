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
      <header class="space-y-5 text-center text-neutral-900">
        <span
          data-reveal
          class="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200/80 bg-neutral-100/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-neutral-500"
        >
          {{ openFoundation.eyebrow }}
        </span>
        <h2
          data-reveal
          class="text-[clamp(2.1rem,1vw+2.4rem,3.1rem)] font-semibold leading-tight"
        >
          {{ openFoundation.headline }}
        </h2>
        <p
          data-reveal
          class="mx-auto max-w-3xl text-base leading-relaxed text-neutral-600 sm:text-lg"
        >
          {{ openFoundation.subheadline }}
        </p>
      </header>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="pillar in openFoundation.pillars"
          :key="pillar.title"
          data-reveal
          class="flex h-full flex-col items-center gap-5 rounded-[28px] border border-neutral-200/80 bg-white/80 p-8 text-center text-neutral-600 shadow-[0_24px_80px_rgba(35,31,32,0.12)] transition hover:-translate-y-1 hover:border-neutral-300 hover:bg-white"
        >
          <span class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-[0_12px_30px_rgba(35,31,32,0.2)]">
            <span :class="pillar.icon" class="text-xl" aria-hidden="true" />
          </span>
          <div class="space-y-2">
            <h3 class="text-lg font-semibold text-neutral-900">
              {{ pillar.title }}
            </h3>
          </div>
          <p class="text-sm leading-relaxed text-neutral-600">
            {{ pillar.copy }}
          </p>
        </article>
      </div>

      <footer
        data-reveal
        class="rounded-[24px] border border-neutral-200/80 bg-white/70 px-6 py-5 text-sm text-neutral-600 text-center"
      >
        <span class="block">
          {{ openFoundation.footnote }}
        </span>
      </footer>
    </div>
  </section>
</template>
