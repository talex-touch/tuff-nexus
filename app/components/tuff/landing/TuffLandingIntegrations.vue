<script setup lang="ts">
import { ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface IntegrationItem {
  icon: string
  label: string
  copy: string
}

const props = defineProps<{
  integrations: IntegrationItem[]
}>()

const sectionRef = ref<HTMLElement | null>(null)

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 50,
    duration: 0.9,
  },
})
</script>

<template>
  <section
    ref="sectionRef"
    class="px-6 py-16"
  >
    <div class="mx-auto flex max-w-6xl flex-col gap-10 overflow-hidden rounded-[34px] border border-white/10 bg-[#050713]/90 p-10 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
      <header class="space-y-3">
        <span
          data-reveal
          class="inline-flex w-max items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60"
        >
          Global integrations
        </span>
        <h2
          data-reveal
          class="max-w-3xl text-[clamp(2rem,1.2vw+2rem,2.8rem)] font-semibold leading-tight text-white"
        >
          Connect to teams, regions, and runtimes without patchwork scripting.
        </h2>
        <p
          data-reveal
          class="max-w-3xl text-sm text-white/60"
        >
          From editor sandboxes to compliance-ready deployments across
          <span class="inline-flex items-center gap-2 text-white">
            <span class="i-twemoji-flag-china text-base" />
            CN
          </span>,
          <span class="inline-flex items-center gap-2 text-white">
            <span class="i-twemoji-flag-european-union text-base" />
            EU
          </span>,
          <span class="inline-flex items-center gap-2 text-white">
            <span class="i-twemoji-flag-united-states text-base" />
            US
          </span>
          regions, Tuff keeps parity with a single manifest.
        </p>
      </header>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="integration in integrations"
          :key="integration.label"
          data-reveal
          class="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/5 p-6 text-white transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/10"
        >
          <span :class="integration.icon" class="text-2xl text-white/75" />
          <h3 class="text-base font-semibold">
            {{ integration.label }}
          </h3>
          <p class="text-sm text-white/65">
            {{ integration.copy }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
