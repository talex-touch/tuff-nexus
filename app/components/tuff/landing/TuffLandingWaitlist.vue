<script setup lang="ts">
import { ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface WaitlistPerk {
  label: string
}

interface WaitlistConfig {
  eyebrow: string
  title: string
  copy: string
  perks: WaitlistPerk[]
  submitLabel: string
  placeholder: string
}

const props = defineProps<{
  waitlist: WaitlistConfig
}>()

const sectionRef = ref<HTMLElement | null>(null)

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 48,
    duration: 1,
  },
})
</script>

<template>
  <section
    id="waitlist"
    ref="sectionRef"
    class="px-6 pb-28 pt-12"
  >
    <div
      data-reveal
      class="mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-[#050713]/95 px-10 py-16 text-center shadow-[0_30px_120px_rgba(0,0,0,0.55)] sm:px-16"
    >
      <div class="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
          {{ waitlist.eyebrow }}
        </span>
        <h2 class="text-[clamp(2rem,1.2vw+2rem,2.8rem)] font-semibold text-white">
          {{ waitlist.title }}
        </h2>
        <p class="text-base text-white/70">
          {{ waitlist.copy }}
        </p>
        <form
          class="flex w-full max-w-md flex-col gap-3 sm:flex-row"
          action="/waitlist"
          method="post"
        >
          <input
            type="email"
            name="email"
            required
            autocomplete="email"
            :placeholder="waitlist.placeholder"
            class="w-full rounded-full border border-white/25 bg-transparent px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
          <button
            type="submit"
            class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-md transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:w-auto"
          >
            <span class="i-carbon-send text-base" />
            {{ waitlist.submitLabel }}
          </button>
        </form>
        <ul class="flex flex-col gap-2 text-sm text-white/60 sm:flex-row sm:items-center sm:gap-6">
          <li
            v-for="perk in waitlist.perks"
            :key="perk.label"
            class="flex items-center gap-2"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span>{{ perk.label }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
