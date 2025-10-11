<script setup lang="ts">
import { ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface EcosystemLink {
  label: string
  to: string
}

interface EcosystemItem {
  title: string
  copy: string
  icon: string
  badge: string
  link: EcosystemLink
}

const props = defineProps<{
  items: EcosystemItem[]
}>()

const sectionRef = ref<HTMLElement | null>(null)

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 44,
    duration: 0.95,
  },
})
</script>

<template>
  <section
    ref="sectionRef"
    class="px-6 py-16"
  >
    <div class="mx-auto max-w-6xl space-y-10">
      <header class="space-y-4">
        <span
          data-reveal
          class="inline-flex w-max items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60"
        >
          Docs · Kit
        </span>
        <h2
          data-reveal
          class="max-w-3xl text-[clamp(2rem,1.2vw+2rem,2.8rem)] font-semibold leading-tight text-white"
        >
          The documentation experience sets the tone—clean grids, luminous gradients, and confident typography.
        </h2>
        <p
          data-reveal
          class="max-w-3xl text-sm text-white/60"
        >
          We borrowed the rhythm from <code class="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/80">docs/.vitepress</code> so the landing page feels like a sibling, not a marketing one-off.
        </p>
      </header>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="item in items"
          :key="item.title"
          data-reveal
          class="group flex h-full flex-col justify-between gap-6 rounded-[28px] border border-white/10 bg-[#050711]/90 p-8 shadow-[0_24px_110px_rgba(0,0,0,0.5)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-[#080a18]"
        >
          <div class="space-y-5">
            <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">
              <span :class="item.icon" class="text-base" />
              {{ item.badge }}
            </span>
            <h3 class="text-xl font-semibold text-white">
              {{ item.title }}
            </h3>
            <p class="text-sm leading-relaxed text-white/65">
              {{ item.copy }}
            </p>
          </div>
          <NuxtLink
            :to="item.link.to"
            class="inline-flex w-max items-center gap-2 text-sm font-semibold text-white/70 transition group-hover:text-white"
          >
            <span>{{ item.link.label }}</span>
            <span class="i-carbon-arrow-right text-base" />
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>
