<script setup lang="ts">
import { ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface SpotlightResult {
  icon: string
  title: string
  meta: string
}

interface SpotlightHighlight {
  title: string
  copy: string
}

interface AiSpotlightContent {
  eyebrow: string
  headline: string
  subheadline: string
  demo: {
    queryLabel: string
    queryText: string
    summary: string
    results: SpotlightResult[]
  }
  highlights: SpotlightHighlight[]
}

const { spotlight } = defineProps<{
  spotlight: AiSpotlightContent
}>()

const sectionRef = ref<HTMLElement | null>(null)

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
    ref="sectionRef"
    class="px-6 py-24"
  >
    <div
      data-reveal
      class="mx-auto max-w-6xl rounded-[36px] border border-white/10 bg-gradient-to-br from-white/6 via-white/4 to-transparent p-[1px] shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
    >
      <div class="rounded-[35px] bg-[#050613]/95 p-10 sm:p-14 lg:p-16">
        <header class="space-y-6 text-white">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
            {{ spotlight.eyebrow }}
          </span>
          <h2 class="text-[clamp(2rem,1.2vw+2.25rem,3.25rem)] font-semibold leading-tight text-white">
            {{ spotlight.headline }}
          </h2>
          <p class="max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg">
            {{ spotlight.subheadline }}
          </p>
        </header>

        <div class="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div class="space-y-6 text-sm text-white/65">
            <p class="text-white/70">
              {{ spotlight.demo.summary }}
            </p>
            <div class="grid gap-4 sm:grid-cols-2">
              <div
                v-for="highlight in spotlight.highlights"
                :key="highlight.title"
                class="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
              >
                <h3 class="mt-2 text-base font-semibold text-white/85">
                  {{ highlight.title }}
                </h3>
                <p class="mt-3 text-sm text-white/60">
                  {{ highlight.copy }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#070921]/95 shadow-[0_30px_110px_rgba(0,0,0,0.55)]"
          >
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,98,255,0.18),_transparent_70%)]" />
            <div class="relative flex flex-col gap-6 p-8">
              <div class="rounded-2xl border border-white/15 bg-white/5 p-4 text-xs text-white/65">
                <p class="uppercase tracking-[0.32em] text-white/50">
                  {{ spotlight.demo.queryLabel }}
                </p>
                <p class="mt-2 text-base text-white">
                  {{ spotlight.demo.queryText }}
                </p>
              </div>
              <ul class="space-y-4">
                <li
                  v-for="result in spotlight.demo.results"
                  :key="result.title"
                  class="group flex items-start gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
                >
                  <span
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70"
                  >
                    <span :class="result.icon" class="text-xl" aria-hidden="true" />
                  </span>
                  <div class="space-y-1">
                    <p class="text-sm font-semibold text-white/85">
                      {{ result.title }}
                    </p>
                    <p class="text-xs text-white/45">
                      {{ result.meta }}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
