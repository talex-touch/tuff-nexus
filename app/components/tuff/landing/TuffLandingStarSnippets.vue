<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface SnippetCategory {
  id: string
  title: string
  copy: string
  action: string
  icon: string
  accent: string
}

interface StarSnippetsContent {
  eyebrow: string
  headline: string
  subheadline: string
  categories: SnippetCategory[]
  footnote: string
}

const props = defineProps<{
  starSnippets: StarSnippetsContent
}>()

const sectionRef = ref<HTMLElement | null>(null)
const starSnippets = computed(() => props.starSnippets)
const categories = computed(() => starSnippets.value.categories ?? [])

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 32,
    duration: 0.98,
  },
})
</script>

<template>
  <section
    ref="sectionRef"
    class="relative isolate flex flex-col justify-center overflow-hidden py-24 text-white"
  >
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute left-[-240px] top-[20%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.2),_transparent_70%)] blur-3xl" />
      <div class="absolute right-[-200px] bottom-[-120px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(147,51,234,0.22),_transparent_70%)] blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-6xl w-full px-6 space-y-10">
      <TuffStickyBar>
        {{ starSnippets.eyebrow }}
      </TuffStickyBar>

      <header class="text-center space-y-5">
        <h2 class="my-0 text-[clamp(2rem,1vw+2.3rem,3rem)] font-semibold leading-tight">
          {{ starSnippets.headline }}
        </h2>
        <p class="mx-auto my-0 max-w-3xl text-[clamp(.68rem,1vw+1.2rem,1.08rem)] text-white/70 font-semibold leading-relaxed">
          {{ starSnippets.subheadline }}
        </p>
      </header>

      <div class="grid gap-6 md:grid-cols-3" data-reveal>
        <article
          v-for="category in categories"
          :key="category.id"
          class="group relative flex h-full flex-col justify-between gap-6 overflow-hidden border border-white/12 rounded-[28px] bg-white/5 p-8 text-left text-white shadow-[0_24px_90px_rgba(4,16,52,0.34)] transition duration-300 hover:border-white/25 hover:bg-white/9 hover:-translate-y-1"
        >
          <div class="pointer-events-none absolute inset-0 opacity-80 transition duration-300 group-hover:opacity-100" :class="category.accent" />
          <div class="relative space-y-5">
            <span class="inline-flex size-12 items-center justify-center rounded-2xl bg-white/15 text-white shadow-[0_20px_45px_rgba(4,16,52,0.38)]">
              <span :class="category.icon" class="text-xl" aria-hidden="true" />
            </span>
            <div class="space-y-2">
              <h3 class="text-xl font-semibold">
                {{ category.title }}
              </h3>
              <p class="text-sm text-white/70 leading-relaxed">
                {{ category.copy }}
              </p>
            </div>
          </div>
          <div class="relative">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm text-white font-semibold transition hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              {{ category.action }}
              <span class="i-carbon-arrow-up-right text-base" aria-hidden="true" />
            </button>
          </div>
        </article>
      </div>

      <footer
        class="relative overflow-hidden border border-white/10 rounded-[24px] bg-white/4 px-6 py-5 text-center text-sm text-white/70 shadow-[0_20px_70px_rgba(5,16,52,0.28)]"
      >
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_70%)] opacity-70" />
        <span class="relative">
          {{ starSnippets.footnote }}
        </span>
      </footer>
    </div>
  </section>
</template>
