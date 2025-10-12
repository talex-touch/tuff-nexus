<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'
import ChromaGrid from '../ChromaGrid.vue'

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

interface ShowcaseProfile {
  image: string
  title: string
  subtitle: string
  handle: string
  borderColor: string
  gradient: string
  url: string
}

const props = defineProps<{
  capabilities: ExtensibilityContent
}>()

const sectionRef = ref<HTMLElement | null>(null)
const activeSet = ref(new Set<string>())
const capabilities = computed(() => props.capabilities)

const showcaseItems: ShowcaseProfile[] = [
  {
    image: 'https://i.pravatar.cc/300?img=1',
    title: 'Sarah Johnson',
    subtitle: 'Frontend Developer',
    handle: '@sarahjohnson',
    borderColor: '#3B82F6',
    gradient: 'linear-gradient(145deg, #3B82F6, #000)',
    url: 'https://github.com/sarahjohnson',
  },
  {
    image: 'https://i.pravatar.cc/300?img=2',
    title: 'Mike Chen',
    subtitle: 'Backend Engineer',
    handle: '@mikechen',
    borderColor: '#10B981',
    gradient: 'linear-gradient(180deg, #10B981, #000)',
    url: 'https://linkedin.com/in/mikechen',
  },
  {
    image: 'https://i.pravatar.cc/300?img=3',
    title: 'Priya Singh',
    subtitle: 'Product Strategist',
    handle: '@priyastrategy',
    borderColor: '#F97316',
    gradient: 'linear-gradient(145deg, #F97316, #111827)',
    url: 'https://dribbble.com/priyasingh',
  },
  {
    image: 'https://i.pravatar.cc/300?img=4',
    title: 'Lucas Meyer',
    subtitle: 'AI Researcher',
    handle: '@lucasmeyer',
    borderColor: '#8B5CF6',
    gradient: 'linear-gradient(160deg, #8B5CF6, #0F172A)',
    url: 'https://huggingface.co/lucasmeyer',
  },
  {
    image: 'https://i.pravatar.cc/300?img=5',
    title: 'Amelia Wright',
    subtitle: 'DevOps Lead',
    handle: '@ameliawright',
    borderColor: '#EC4899',
    gradient: 'linear-gradient(150deg, #EC4899, #111827)',
    url: 'https://twitter.com/ameliawright',
  },
  {
    image: 'https://i.pravatar.cc/300?img=6',
    title: 'Diego Ramos',
    subtitle: 'Cloud Architect',
    handle: '@diegoramos',
    borderColor: '#0EA5E9',
    gradient: 'linear-gradient(170deg, #0EA5E9, #020617)',
    url: 'https://linkedin.com/in/diegoramos',
  },
]

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
    class="min-h-screen flex flex-col justify-center overflow-hidden py-24 text-white"
  >
    <div class="mx-auto max-w-6xl w-full px-6 space-y-16">
      <TuffStickyBar>
        {{ capabilities.eyebrow }}
      </TuffStickyBar>

      <header
        class="text-center text-white"
      >
        <h2 class="my-0 text-[clamp(.7rem,1vw+1.4rem,1.2rem)] font-bold leading-tight">
          {{ capabilities.headline }}
        </h2>
        <p class="mx-auto my-0 max-w-3xl text-[clamp(.6rem,1vw+1.3rem,1.1rem)] font-semibold leading-relaxed op-70">
          {{ capabilities.subheadline }}
        </p>
      </header>

      <div class="flex flex-col items-center gap-10 rounded-3xl bg-black p-36 shadow-[0_12px_20px_rgba(8,10,35,0.32)]">
        <div
          data-reveal
          class="relative max-w-[640px] w-full"
        >
          <ChromaGrid
            :items="showcaseItems"
            :radius="300"
            :damping="0.45"
            :fade-out="0.6"
            ease="power3.out"
          />
          <div class="pointer-events-none absolute from-transparent via-white/12 to-transparent bg-gradient-to-r blur-[120px] -inset-10 -z-10" />
        </div>
      </div>

      <div
        v-if="false"
        class="grid gap-6 lg:grid-cols-3 md:grid-cols-2"
      >
        <article
          v-for="capability in cards"
          :key="capability.id"
          class="group h-full flex flex-col gap-6 border border-white/12 rounded-[28px] bg-white/[0.06] p-7 text-left text-white/70 shadow-[0_22px_70px_rgba(8,10,35,0.32)] transition-all duration-300 hover:border-white/20 hover:bg-white/[0.09] hover:-translate-y-1"
          :class="isActivated(capability.id)
            ? 'border-white/60 bg-white/12 text-white shadow-[0_30px_80px_rgba(15,23,42,0.55)] hover:border-white/70 hover:bg-white/15'
            : ''"
        >
          <div class="flex items-center gap-5">
            <span class="h-12 w-12 flex flex-shrink-0 items-center justify-center rounded-2xl bg-white/12 text-white shadow-[0_12px_30px_rgba(15,23,42,0.45)]">
              <span :class="capability.icon" class="text-xl" aria-hidden="true" />
            </span>
            <div class="space-y-1">
              <h3 class="text-lg text-white font-semibold">
                {{ capability.name }}
              </h3>
              <span class="inline-flex items-center gap-2 text-xs text-white/45 font-semibold tracking-[0.26em] uppercase">
                {{ isActivated(capability.id) ? capabilities.addedLabel : capabilities.addLabel }}
              </span>
            </div>
          </div>
          <p class="text-sm text-white/70 leading-relaxed">
            {{ capability.description }}
          </p>
          <button
            type="button"
            class="mt-auto inline-flex items-center justify-center gap-2 border border-white/15 rounded-full px-4 py-2 text-xs text-white/75 font-semibold tracking-[0.26em] uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            :class="isActivated(capability.id)
              ? 'bg-white text-neutral-900 shadow-[0_12px_30px_rgba(15,23,42,0.35)] focus-visible:ring-white/60'
              : 'hover:-translate-y-0.5 hover:border-white/25 hover:text-white'"
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
