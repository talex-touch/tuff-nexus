<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface CapabilityItem {
  id: string
  icon: string
  name: string
  description: string
}

interface ExtensibilityContent {
  eyebrow: string
  headline: string
  subheadline: string
  addLabel: string
  addedLabel: string
  capabilities: CapabilityItem[]
}

const props = defineProps<{
  capabilities: ExtensibilityContent
}>()

const sectionRef = ref<HTMLElement | null>(null)
const activeSet = ref(new Set<string>())
const capabilities = computed(() => props.capabilities)

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 42,
    duration: 1.05,
  },
})

const cards = computed(() => capabilities.value.capabilities ?? [])

function toggleCapability(id: string) {
  const updated = new Set(activeSet.value)
  if (updated.has(id))
    updated.delete(id)
  else
    updated.add(id)
  activeSet.value = updated
}

function isActivated(id: string) {
  return activeSet.value.has(id)
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
          {{ capabilities.eyebrow }}
        </span>
        <h2
          data-reveal
          class="text-[clamp(2rem,1.1vw+2.25rem,3.2rem)] font-semibold leading-tight text-white"
        >
          {{ capabilities.headline }}
        </h2>
        <p
          data-reveal
          class="max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg"
        >
          {{ capabilities.subheadline }}
        </p>
      </header>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="capability in cards"
          :key="capability.id"
          data-reveal
          class="group flex h-full flex-col justify-between gap-6 rounded-[28px] border border-white/10 bg-[#050712]/92 p-8 shadow-[0_26px_100px_rgba(0,0,0,0.5)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-[#080a18]"
        >
          <div class="space-y-4">
            <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
              <span :class="capability.icon" class="text-2xl" aria-hidden="true" />
            </span>
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-white">
                {{ capability.name }}
              </h3>
            </div>
            <p class="text-sm text-white/60">
              {{ capability.description }}
            </p>
          </div>
          <button
            type="button"
            class="inline-flex w-max items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] transition focus-visible:outline-none focus-visible:ring-2"
            :class="isActivated(capability.id)
              ? 'border-white/30 bg-white/10 text-white focus-visible:ring-white/50'
              : 'border-white/15 bg-transparent text-white/70 hover:border-white/25 hover:bg-white/8 focus-visible:ring-white/30'"
            @click="toggleCapability(capability.id)"
          >
            <span v-if="!isActivated(capability.id)">{{ capabilities.addLabel }}</span>
            <span v-else>{{ capabilities.addedLabel }}</span>
          </button>
        </article>
      </div>
    </div>
  </section>
</template>
