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
      <header class="space-y-5 text-center text-neutral-900">
        <span
          data-reveal
          class="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200/80 bg-neutral-100/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-neutral-500"
        >
          {{ craftsmanship.eyebrow }}
        </span>
        <h2
          data-reveal
          class="text-[clamp(2.1rem,1vw+2.4rem,3.1rem)] font-semibold leading-tight"
        >
          {{ craftsmanship.headline }}
        </h2>
        <p
          data-reveal
          class="mx-auto max-w-3xl text-base leading-relaxed text-neutral-600 sm:text-lg"
        >
          {{ craftsmanship.subheadline }}
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-3">
        <article
          v-for="clip in craftsmanship.clips"
          :key="clip.id"
          data-reveal
          class="relative overflow-hidden rounded-[28px] border border-neutral-200/80 bg-white/80 p-8 text-center text-neutral-600 shadow-[0_24px_80px_rgba(35,31,32,0.12)] transition hover:-translate-y-1 hover:border-neutral-300 hover:bg-white"
        >
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_rgba(245,243,239,0)_70%)]" />
          <div class="relative space-y-4">
            <span class="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-neutral-100/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
              {{ clip.tag }}
            </span>
            <div class="space-y-1 text-neutral-900">
              <h3 class="text-xl font-semibold">
                {{ clip.title }}
              </h3>
            </div>
            <p class="text-sm leading-relaxed text-neutral-600">
              {{ clip.copy }}
            </p>
            <div class="mt-5 h-24 overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-100/70">
              <div class="flex h-full items-center justify-center text-neutral-400 text-xs uppercase tracking-[0.4em]">
                Motion Preview
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
