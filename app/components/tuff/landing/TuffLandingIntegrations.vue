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
    class="relative isolate min-h-screen flex flex-col justify-center overflow-hidden bg-black py-24 text-white"
  >
    <div class="pointer-events-none absolute inset-x-0 top-[-35%] h-[520px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(78,62,255,0.27),_transparent_68%)] blur-3xl" />
    <div class="pointer-events-none absolute bottom-[-40%] right-[15%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(8,138,255,0.24),_transparent_70%)] blur-3xl" />

    <div class="relative mx-auto max-w-6xl w-full px-6">
      <TuffStickyBar>
        {{ craftsmanship.eyebrow }}
      </TuffStickyBar>

      <header class="py-6 text-center text-white space-y-5">
        <h2
          data-reveal
          class="my-0 text-[clamp(2.1rem,1vw+2.4rem,3.1rem)] font-semibold leading-tight"
        >
          {{ craftsmanship.headline }}
        </h2>
        <p
          data-reveal
          class="mx-auto my-0 max-w-3xl text-[clamp(.6rem,1vw+1.3rem,1.1rem)] text-white/70 font-semibold leading-relaxed"
        >
          {{ craftsmanship.subheadline }}
        </p>
      </header>

      <div class="grid mt-12 gap-6 lg:grid-cols-3">
        <article
          v-for="clip in craftsmanship.clips"
          :key="clip.id"
          data-reveal
          class="group relative overflow-hidden border border-white/10 rounded-[28px] bg-white/5 p-8 text-left text-white/70 shadow-[0_32px_120px_rgba(9,17,51,0.4)] transition duration-500 hover:border-white/25 hover:bg-white/10 hover:-translate-y-1"
        >
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(108,182,255,0.22),_transparent_70%)] opacity-80" />
          <div class="relative space-y-4">
            <span class="inline-flex items-center gap-2 border border-white/15 rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/60 font-semibold tracking-[0.3em] uppercase">
              {{ clip.tag }}
            </span>
            <div class="text-white space-y-1">
              <h3 class="text-xl text-white font-semibold">
                {{ clip.title }}
              </h3>
            </div>
            <p class="text-sm text-white/70 leading-relaxed">
              {{ clip.copy }}
            </p>
            <div class="mt-5 h-24 overflow-hidden border border-white/15 rounded-3xl bg-white/10">
              <div class="h-full flex items-center justify-center text-xs text-white/40 tracking-[0.4em] uppercase">
                Motion Preview
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
