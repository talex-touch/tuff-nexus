<script setup lang="ts">
import { ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface FeatureLink {
  label: string
  to: string
}

interface FeatureItem {
  badge: string
  title: string
  copy: string
  bullets: string[]
  link: FeatureLink
}

const props = defineProps<{
  features: FeatureItem[]
}>()

const sectionRef = ref<HTMLElement | null>(null)

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 50,
    duration: 1,
  },
})
</script>

<template>
  <section
    ref="sectionRef"
    class="px-6 py-16"
  >
    <div class="mx-auto flex max-w-6xl flex-col gap-10">
      <header class="space-y-4">
        <span
          data-reveal
          class="inline-flex w-max items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60"
        >
          <span class="i-carbon-thunderstorm text-base" />
          Sense + Action
        </span>
        <h2
          data-reveal
          class="max-w-3xl text-[clamp(2rem,1.8vw+1.8rem,3rem)] font-semibold leading-tight text-white"
        >
          Modular surfaces that feel like a flagship app, powered by the Tuff automation kernel.
        </h2>
      </header>

      <div class="grid gap-6 lg:grid-cols-2">
        <article
          v-for="feature in features"
          :key="feature.title"
          data-reveal
          class="group flex h-full flex-col justify-between gap-6 overflow-hidden rounded-[30px] border border-white/10 bg-[#050712]/90 p-9 shadow-[0_26px_120px_rgba(0,0,0,0.55)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-[#080a18]"
        >
          <div class="space-y-5">
            <span class="inline-flex w-max items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60">
              {{ feature.badge }}
            </span>
            <h3 class="text-2xl font-semibold text-white">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-white/65">
              {{ feature.copy }}
            </p>
            <ul class="space-y-2 text-sm text-white/55">
              <li
                v-for="bullet in feature.bullets"
                :key="bullet"
                class="flex items-start gap-3"
              >
                <span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/30" />
                <span>{{ bullet }}</span>
              </li>
            </ul>
          </div>
          <NuxtLink
            :to="feature.link.to"
            class="inline-flex w-max items-center gap-2 text-sm font-semibold text-white/70 transition group-hover:text-white"
          >
            <span>{{ feature.link.label }}</span>
            <span class="i-carbon-arrow-right text-base" />
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>
