<script setup lang="ts">
import { ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface CraftsmanshipClip {
  id: string
  tag: string
  title: string
  copy: string
}

interface CraftsmanshipContent {
  eyebrow: string
  headline: string
  subheadline: string
  clips: CraftsmanshipClip[]
}

const { craftsmanship } = defineProps<{
  craftsmanship: CraftsmanshipContent
}>()

const sectionRef = ref<HTMLElement | null>(null)

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 44,
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
          {{ craftsmanship.eyebrow }}
        </span>
        <h2
          data-reveal
          class="text-[clamp(2rem,1.1vw+2.25rem,3.1rem)] font-semibold leading-tight text-white"
        >
          {{ craftsmanship.headline }}
        </h2>
        <p
          data-reveal
          class="max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg"
        >
          {{ craftsmanship.subheadline }}
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-3">
        <article
          v-for="clip in craftsmanship.clips"
          :key="clip.id"
          data-reveal
          class="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#060818]/92 p-8 shadow-[0_30px_110px_rgba(0,0,0,0.55)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-[#080b1f]"
        >
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,142,255,0.12),_transparent_72%)]" />
          <div class="relative space-y-4">
            <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
              {{ clip.tag }}
            </span>
            <div class="space-y-1 text-white">
              <h3 class="text-xl font-semibold">
                {{ clip.title }}
              </h3>
            </div>
            <p class="text-sm text-white/65">
              {{ clip.copy }}
            </p>
            <div class="mt-5 h-24 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-white/10 via-white/5 to-transparent backdrop-blur">
              <div class="flex h-full items-center justify-center text-white/30 text-xs uppercase tracking-[0.4em]">
                Motion Preview
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
