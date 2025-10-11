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
      <header class="space-y-6 text-white">
        <span
          data-reveal
          class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-white/70"
        >
          {{ proactive.eyebrow }}
        </span>
        <h2
          data-reveal
          class="text-[clamp(2rem,1.2vw+2.25rem,3.3rem)] font-semibold leading-tight text-white"
        >
          {{ proactive.headline }}
        </h2>
        <p
          data-reveal
          class="max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg"
        >
          {{ proactive.subheadline }}
        </p>
      </header>

      <div
        data-reveal
        class="flex flex-wrap items-center gap-4 rounded-[24px] border border-white/15 bg-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/70"
      >
        <span class="inline-flex items-center gap-2 text-white">
          <span class="i-carbon-shield text-base" />
          {{ proactive.shieldLabel }}
        </span>
      </div>

      <div class="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <nav
          data-reveal
          class="flex flex-col gap-3 rounded-[28px] border border-white/10 bg-[#040713]/90 p-6 shadow-[0_24px_110px_rgba(0,0,0,0.5)] lg:w-72"
        >
          <button
            v-for="scenario in proactive.scenarios"
            :key="scenario.id"
            type="button"
            class="flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2"
            :class="scenario.id === activeScenarioId
              ? 'bg-white/15 border border-white/25 text-white focus-visible:ring-white/40'
              : 'bg-transparent border border-white/10 text-white/70 hover:border-white/20 hover:bg-white/10 focus-visible:ring-white/30'"
            @click="selectScenario(scenario.id)"
          >
            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/70">
              <span :class="scenario.icon" class="text-xl" aria-hidden="true" />
            </span>
            <div class="space-y-1 text-sm">
              <span class="block font-semibold text-white">
                {{ scenario.tab }}
              </span>
            </div>
          </button>
        </nav>

        <article
          v-if="activeScenario"
          data-reveal
          key="scenario-panel"
          class="flex-1 overflow-hidden rounded-[32px] border border-white/10 bg-[#050817]/95 p-10 shadow-[0_32px_120px_rgba(0,0,0,0.55)]"
        >
          <div class="space-y-5 text-white">
            <h3 class="text-2xl font-semibold">
              {{ activeScenario.title }}
            </h3>
            <p class="text-sm leading-relaxed text-white/65">
              {{ activeScenario.copy }}
            </p>
          </div>

          <div class="mt-8 space-y-3 rounded-[24px] border border-white/10 bg-white/5 px-6 py-5 text-sm text-white/70">
            <span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
              <span class="i-carbon-connection-signal text-base" />
              {{ activeScenario.action }}
            </span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
