<script setup lang="ts">
import { ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface ExperienceItem {
  badge: string
  title: string
  copy: string
  points: string[]
  accent: string
}

const props = defineProps<{
  experiences: ExperienceItem[]
}>()

const sectionRef = ref<HTMLElement | null>(null)

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 60,
    duration: 1.05,
  },
})
</script>

<template>
  <section
    ref="sectionRef"
    class="px-6 py-16"
  >
    <div class="mx-auto max-w-6xl space-y-12">
      <header class="max-w-3xl space-y-4">
        <span
          data-reveal
          class="inline-flex w-max items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60"
        >
          Flow Design
        </span>
        <h2
          data-reveal
          class="text-[clamp(2rem,1.5vw+2rem,3rem)] font-semibold leading-tight text-white"
        >
          Build cinematic flows without sacrificing runtime control.
        </h2>
      </header>

      <div class="grid gap-6 lg:grid-cols-2">
        <article
          v-for="experience in experiences"
          :key="experience.title"
          data-reveal
          class="flex h-full flex-col gap-6 overflow-hidden rounded-[32px] border border-white/10 bg-[#060714]/90 p-10 shadow-[0_30px_120px_rgba(0,0,0,0.55)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-[#080a18]"
        >
          <div class="space-y-5">
            <span class="inline-flex w-max items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60">
              {{ experience.badge }}
            </span>
            <h3 class="text-3xl font-semibold text-white">
              {{ experience.title }}
            </h3>
            <p class="text-sm text-white/65">
              {{ experience.copy }}
            </p>
            <ul class="space-y-3 text-sm text-white/60">
              <li
                v-for="point in experience.points"
                :key="point"
                class="flex items-start gap-3"
              >
                <span class="i-carbon-connection-signal text-base text-white/40" />
                <span>{{ point }}</span>
              </li>
            </ul>
          </div>
          <div class="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/8 via-white/4 to-transparent px-6 py-5 text-sm text-white/70">
            <span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
              <span class="i-carbon-skill-level text-base" />
              {{ experience.accent }}
            </span>
            <p class="mt-4 text-sm leading-relaxed text-white/65">
              Each scene ships with presets, transitions, and handoff recipes that mirror the tone and contrast guidelines from the docs theme.
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
