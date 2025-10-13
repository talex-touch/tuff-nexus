<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface FaqItem {
  id: string
  question: string
  answer: string
}

interface FaqContent {
  eyebrow: string
  headline: string
  items: FaqItem[]
}

const props = defineProps<{
  faq: FaqContent
}>()

const sectionRef = ref<HTMLElement | null>(null)
const faq = computed(() => props.faq)
const items = computed(() => faq.value.items ?? [])

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 28,
    duration: 0.9,
  },
})
</script>

<template>
  <section
    ref="sectionRef"
    class="relative isolate flex flex-col justify-center overflow-hidden py-24 text-white"
  >
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute left-[-220px] top-[30%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.16),_transparent_70%)] blur-3xl" />
      <div class="absolute right-[-240px] bottom-[-120px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.18),_transparent_70%)] blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-5xl w-full px-6 space-y-10">
      <TuffStickyBar>
        {{ faq.eyebrow }}
      </TuffStickyBar>

      <header class="text-center space-y-4">
        <h2 class="my-0 text-[clamp(2rem,1vw+2.3rem,3rem)] font-semibold leading-tight">
          {{ faq.headline }}
        </h2>
      </header>

      <div class="space-y-4" data-reveal>
        <details
          v-for="item in items"
          :key="item.id"
          class="group overflow-hidden border border-white/10 rounded-[24px] bg-white/4 px-6 py-5 text-left text-white shadow-[0_20px_70px_rgba(6,16,48,0.32)] transition"
        >
          <summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold leading-tight">
            <span>{{ item.question }}</span>
            <span class="i-carbon-add text-xl transition group-open:rotate-45" aria-hidden="true" />
          </summary>
          <p class="mt-3 text-sm text-white/70 leading-relaxed">
            {{ item.answer }}
          </p>
        </details>
      </div>
    </div>
  </section>
</template>
