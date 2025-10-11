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
    <div class="mx-auto max-w-6xl overflow-hidden rounded-[40px] border border-neutral-200/80 bg-white/80 shadow-[0_36px_110px_rgba(35,31,32,0.12)] backdrop-blur-sm">
      <div class="grid gap-12 px-8 py-16 text-neutral-800 md:grid-cols-[1.05fr_0.95fr] md:px-12 md:py-20">
        <div
          data-reveal
          class="space-y-6 text-center"
        >
          <span class="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-neutral-100/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-neutral-500">
            {{ pioneer.eyebrow }}
          </span>
          <h2 class="space-y-3 text-[clamp(2.3rem,1.2vw+2.4rem,3.4rem)] font-semibold leading-tight text-neutral-900">
            <span class="block">{{ pioneer.headline }}</span>
          </h2>
          <p class="mx-auto max-w-2xl space-y-2 text-base leading-relaxed text-neutral-600 sm:text-lg">
            <span class="block">{{ pioneer.subheadline }}</span>
          </p>
          <form
            class="mx-auto flex w-full max-w-lg flex-col gap-3 rounded-[28px] border border-neutral-200/80 bg-white/80 p-5 text-left backdrop-blur-sm"
            action="/pioneer"
            method="post"
          >
            <label class="space-y-2 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
              <span>{{ pioneer.formTitle }}</span>
              <input
                type="email"
                name="email"
                required
                autocomplete="email"
                :placeholder="emailPlaceholder"
                class="mt-3 w-full rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
            </label>
            <button
              type="submit"
              class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(35,31,32,0.18)] transition hover:-translate-y-0.5 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
            >
              <span class="i-carbon-rocket text-base" aria-hidden="true" />
              <span>{{ pioneer.cta }}</span>
            </button>
          </form>
          <p class="text-xs text-neutral-500">
            {{ pioneer.privacy }}
          </p>
        </div>

        <div
          data-reveal
          class="flex flex-col gap-6 rounded-[30px] border border-neutral-200/80 bg-white/80 p-8 text-center backdrop-blur-sm"
        >
          <h3 class="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
            {{ pioneer.benefitsTitle }}
          </h3>
          <ul class="space-y-5 text-neutral-700">
            <li
              v-for="benefit in pioneer.benefits"
              :key="benefit.title"
              class="rounded-[22px] border border-neutral-200/80 bg-neutral-50/80 p-5 shadow-[0_18px_60px_rgba(35,31,32,0.1)]"
            >
              <h4 class="text-lg font-semibold text-neutral-900">
                {{ benefit.title }}
              </h4>
              <p class="mt-3 text-sm leading-relaxed text-neutral-600">
                {{ benefit.copy }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
