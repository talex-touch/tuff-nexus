<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface PricingFeature {
  id: string
  copy: string
}

interface PricingPlan {
  name: string
  price: string
  period: string
  features: PricingFeature[]
  footnote: string
}

interface PricingContent {
  eyebrow: string
  headline: string
  subheadline: string
  plan: PricingPlan
}

const props = defineProps<{
  pricing: PricingContent
}>()

const sectionRef = ref<HTMLElement | null>(null)
const pricing = computed(() => props.pricing)
const plan = computed(() => pricing.value.plan)
const features = computed(() => plan.value.features ?? [])

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 34,
    duration: 1,
  },
})
</script>

<template>
  <section
    id="pricing"
    ref="sectionRef"
    class="relative isolate flex flex-col justify-center overflow-hidden py-24 text-white"
  >
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute left-[-260px] top-[30%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.2),_transparent_70%)] blur-3xl" />
      <div class="absolute right-[-260px] bottom-[-140px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.18),_transparent_70%)] blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-4xl w-full px-6 space-y-10">
      <TuffStickyBar>
        {{ pricing.eyebrow }}
      </TuffStickyBar>

      <header class="text-center space-y-5">
        <h2 class="my-0 text-[clamp(2rem,1vw+2.3rem,3rem)] font-semibold leading-tight">
          {{ pricing.headline }}
        </h2>
        <p class="mx-auto my-0 max-w-3xl text-[clamp(.7rem,1vw+1.2rem,1.1rem)] text-white/70 font-semibold leading-relaxed">
          {{ pricing.subheadline }}
        </p>
      </header>

      <article
        data-reveal
        class="relative overflow-hidden border border-white/12 rounded-[32px] bg-white/6 px-10 py-12 text-white shadow-[0_28px_110px_rgba(8,16,48,0.38)]"
      >
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_70%)] opacity-80" />
        <div class="relative space-y-8">
          <header class="space-y-3 text-center">
            <h3 class="text-3xl font-semibold">
              {{ plan.name }}
            </h3>
            <p class="text-sm text-white/70 uppercase tracking-[0.28em] font-semibold">
              {{ plan.period }}
            </p>
            <p class="text-5xl font-semibold tracking-tight">
              {{ plan.price }}
            </p>
          </header>

          <ul class="space-y-3 text-left">
            <li
              v-for="feature in features"
              :key="feature.id"
              class="flex items-start gap-3 text-sm text-white/75 leading-relaxed"
            >
              <span class="mt-1 inline-flex size-2.5 flex-shrink-0 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.6)]" />
              <span>{{ feature.copy }}</span>
            </li>
          </ul>

          <footer class="text-center text-sm text-white/60">
            {{ plan.footnote }}
          </footer>
        </div>
      </article>
    </div>
  </section>
</template>
