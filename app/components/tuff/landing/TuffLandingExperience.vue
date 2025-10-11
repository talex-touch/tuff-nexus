<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface LocalizedCopy {
  en: string
  zh: string
}

interface ProactiveScenario {
  id: string
  icon: string
  tab: LocalizedCopy
  title: LocalizedCopy
  copy: LocalizedCopy
  action: LocalizedCopy
}

interface ProactiveContent {
  eyebrow: string
  headline: LocalizedCopy
  subheadline: LocalizedCopy
  shieldLabel: LocalizedCopy
  scenarios: ProactiveScenario[]
}

const { proactive } = defineProps<{
  proactive: ProactiveContent
}>()

const sectionRef = ref<HTMLElement | null>(null)
const activeScenarioId = ref(proactive.scenarios?.[0]?.id || '')

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 50,
    duration: 1.1,
  },
})

const activeScenario = computed(() =>
  proactive.scenarios?.find(item => item.id === activeScenarioId.value) ?? proactive.scenarios?.[0],
)

function selectScenario(id: string) {
  activeScenarioId.value = id
}
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
          {{ proactive.eyebrow }}
        </span>
        <h2
          data-reveal
          class="text-[clamp(2.2rem,1vw+2.4rem,3.3rem)] font-semibold leading-tight"
        >
          {{ proactive.headline }}
        </h2>
        <p
          data-reveal
          class="mx-auto max-w-3xl text-base leading-relaxed text-neutral-600 sm:text-lg"
        >
          {{ proactive.subheadline }}
        </p>
      </header>

      <div
        data-reveal
        class="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-3 rounded-full border border-neutral-200/80 bg-white/80 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500"
      >
        <span class="inline-flex items-center gap-2 text-neutral-700">
          <span class="i-carbon-shield text-base" />
          {{ proactive.shieldLabel }}
        </span>
      </div>

      <div class="flex flex-col items-center gap-8">
        <nav
          data-reveal
          class="flex flex-wrap justify-center gap-4"
        >
          <button
            v-for="scenario in proactive.scenarios"
            :key="scenario.id"
            type="button"
            class="flex w-44 flex-col items-center gap-3 rounded-[24px] border px-5 py-5 text-center transition focus-visible:outline-none focus-visible:ring-2"
            :class="scenario.id === activeScenarioId
              ? 'border-neutral-900 bg-neutral-900 text-white shadow-[0_20px_50px_rgba(35,31,32,0.18)] focus-visible:ring-neutral-600'
              : 'border-neutral-200/80 bg-white/80 text-neutral-600 hover:-translate-y-1 hover:border-neutral-300 hover:bg-white focus-visible:ring-neutral-300'"
            @click="selectScenario(scenario.id)"
          >
            <span class="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-300 bg-white text-neutral-700">
              <span :class="scenario.icon" class="text-lg" aria-hidden="true" />
            </span>
            <span class="text-sm font-semibold">
              {{ scenario.tab }}
            </span>
          </button>
        </nav>

        <article
          v-if="activeScenario"
          data-reveal
          key="scenario-panel"
          class="w-full max-w-3xl overflow-hidden rounded-[36px] border border-neutral-200/80 bg-white/90 px-10 py-12 text-center text-neutral-700 shadow-[0_28px_90px_rgba(35,31,32,0.12)]"
        >
          <div class="space-y-5">
            <h3 class="text-2xl font-semibold text-neutral-900">
              {{ activeScenario.title }}
            </h3>
            <p class="text-sm leading-relaxed text-neutral-600 sm:text-base">
              {{ activeScenario.copy }}
            </p>
          </div>

          <div class="mt-10 flex justify-center">
            <span class="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-600">
              <span class="i-carbon-connection-signal text-base" />
              {{ activeScenario.action }}
            </span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
