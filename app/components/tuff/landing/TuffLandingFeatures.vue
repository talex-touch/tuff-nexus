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
      <header class="space-y-5 text-center text-neutral-900">
        <span
          data-reveal
          class="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200/80 bg-neutral-100/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-neutral-500"
        >
          {{ capabilities.eyebrow }}
        </span>
        <h2
          data-reveal
          class="text-[clamp(2.1rem,1vw+2.3rem,3.2rem)] font-semibold leading-tight"
        >
          {{ capabilities.headline }}
        </h2>
        <p
          data-reveal
          class="mx-auto max-w-3xl text-base leading-relaxed text-neutral-600 sm:text-lg"
        >
          {{ capabilities.subheadline }}
        </p>
      </header>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="capability in cards"
          :key="capability.id"
          data-reveal
          class="group flex h-full flex-col items-center justify-between gap-6 rounded-[28px] border border-neutral-200/80 bg-white/80 p-8 text-center text-neutral-600 shadow-[0_22px_70px_rgba(35,31,32,0.12)] transition hover:-translate-y-1 hover:border-neutral-300 hover:bg-white"
        >
          <div class="space-y-4">
            <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-[0_12px_30px_rgba(35,31,32,0.22)]">
              <span :class="capability.icon" class="text-xl" aria-hidden="true" />
            </span>
            <div class="space-y-1">
              <h3 class="text-lg font-semibold text-neutral-900">
                {{ capability.name }}
              </h3>
            </div>
            <p class="text-sm leading-relaxed text-neutral-600">
              {{ capability.description }}
            </p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-neutral-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
            :class="isActivated(capability.id)
              ? 'bg-neutral-900 text-white shadow-[0_12px_30px_rgba(35,31,32,0.18)] focus-visible:ring-neutral-500'
              : 'hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-white'"
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
