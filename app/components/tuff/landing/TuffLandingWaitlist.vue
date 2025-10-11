<script setup lang="ts">
import { ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface PioneerBenefit {
  title: string
  copy: string
}

interface PioneerContent {
  eyebrow: string
  headline: string
  subheadline: string
  formTitle: string
  cta: string
  benefitsTitle: string
  benefits: PioneerBenefit[]
  privacy: string
}

const { pioneer } = defineProps<{
  pioneer: PioneerContent
}>()

const sectionRef = ref<HTMLElement | null>(null)
const emailPlaceholder = 'tuff@tagzxia.com'

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
    id="waitlist"
    ref="sectionRef"
    class="relative px-6 pb-32 pt-20"
  >
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(86,112,255,0.22),_transparent_70%)]" />
    <div class="mx-auto max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-[#050712]/95 shadow-[0_40px_160px_rgba(0,0,0,0.6)]">
      <div class="grid gap-10 px-8 py-16 text-white md:grid-cols-[1.1fr_0.9fr] md:px-12 md:py-20">
        <div
          data-reveal
          class="space-y-6"
        >
          <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-white/70">
            {{ pioneer.eyebrow }}
          </span>
          <h2 class="space-y-3 text-[clamp(2.2rem,1.2vw+2.4rem,3.4rem)] font-semibold leading-tight">
            <span class="block">{{ pioneer.headline }}</span>
          </h2>
          <p class="max-w-2xl space-y-2 text-base leading-relaxed text-white/70 sm:text-lg">
            <span class="block">{{ pioneer.subheadline }}</span>
          </p>
          <form
            class="flex max-w-lg flex-col gap-3 rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur"
            action="/pioneer"
            method="post"
          >
            <label class="space-y-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
              <span>{{ pioneer.formTitle }}</span>
              <input
                type="email"
                name="email"
                required
                autocomplete="email"
                :placeholder="emailPlaceholder"
                class="mt-3 w-full rounded-full border border-white/25 bg-black/20 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
              >
            </label>
            <button
              type="submit"
              class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_16px_60px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <span class="i-carbon-rocket text-base" aria-hidden="true" />
              <span>{{ pioneer.cta }}</span>
            </button>
          </form>
          <p class="text-xs text-white/50">
            {{ pioneer.privacy }}
          </p>
        </div>

        <div
          data-reveal
          class="flex flex-col gap-6 rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur"
        >
          <h3 class="text-sm font-semibold uppercase tracking-[0.3em] text-white/65">
            {{ pioneer.benefitsTitle }}
          </h3>
          <ul class="space-y-5 text-white">
            <li
              v-for="benefit in pioneer.benefits"
              :key="benefit.title"
              class="rounded-[22px] border border-white/15 bg-black/20 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.35)]"
            >
              <h4 class="text-lg font-semibold text-white">
                {{ benefit.title }}
              </h4>
              <p class="mt-3 text-sm text-white/65">
                {{ benefit.copy }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
