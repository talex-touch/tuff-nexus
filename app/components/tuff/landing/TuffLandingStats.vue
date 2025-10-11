<script setup lang="ts">
import { ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface StatItem {
  value: string
  label: string
  copy: string
}

const props = defineProps<{
  stats: StatItem[]
}>()

const sectionRef = ref<HTMLElement | null>(null)

useGsapReveal(sectionRef, {
  from: {
    y: 32,
    opacity: 0,
    duration: 0.9,
  },
})
</script>

<template>
  <section
    ref="sectionRef"
    class="px-6 pb-12"
  >
    <div class="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
      <article
        v-for="item in stats"
        :key="item.label"
        data-reveal
        class="rounded-[28px] border border-white/10 bg-[#050611]/90 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur"
      >
        <p class="text-[2.4rem] font-semibold leading-none text-white">
          {{ item.value }}
        </p>
        <p class="mt-2 text-xs font-medium uppercase tracking-[0.3em] text-white/50">
          {{ item.label }}
        </p>
        <p class="mt-4 text-sm text-white/60">
          {{ item.copy }}
        </p>
      </article>
    </div>
  </section>
</template>
