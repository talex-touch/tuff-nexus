<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'
import AppleCard from '../carousel/apple/AppleCard.vue'
import AppleCardCarousel from '../carousel/apple/AppleCardCarousel.vue'
import AppleCarouselItem from '../carousel/apple/AppleCarouselItem.vue'
import PluginCardCalendar from './plugins/cards/PluginCardCalendar.vue'
import PluginCardFigma from './plugins/cards/PluginCardFigma.vue'
import PluginCardGithub from './plugins/cards/PluginCardGithub.vue'
import PluginCardNotion from './plugins/cards/PluginCardNotion.vue'
import PluginCardSpotify from './plugins/cards/PluginCardSpotify.vue'
import PluginCardTranslate from './plugins/cards/PluginCardTranslate.vue'
import PluginCardVSCode from './plugins/cards/PluginCardVSCode.vue'

interface ExtensionItem {
  id: string
  icon: string
  name: string
  description: string
}

interface PluginsContent {
  eyebrow: string
  headline: string
  subheadline: string
  extensions: ExtensionItem[]
}

const props = defineProps<{
  plugins: PluginsContent
}>()

const sectionRef = ref<HTMLElement | null>(null)
const activeSet = ref(new Set<string>())
const plugins = computed(() => props.plugins)

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 42,
    duration: 1.05,
  },
})

const components = [PluginCardNotion, PluginCardFigma, PluginCardGithub, PluginCardVSCode, PluginCardCalendar, PluginCardSpotify, PluginCardTranslate]

const cards = computed(() => (plugins.value.extensions ?? []).map((item, index) => ({
  id: item.id,
  src: '',
  icon: item.icon,
  category: item.name,
  title: item.description,
  component: index < 5 ? components[index] : components[5],
})))

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

const data = [
  {
    category: 'Artificial Intelligence',
    title: 'You can do more with AI.',
    src: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    category: 'Productivity',
    title: 'Enhance your productivity.',
    src: 'https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // content: <DummyContent />,
  },
  {
    category: 'Product',
    title: 'Launching the new Apple Vision Pro.',
    src: 'https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // content: <DummyContent />,
  },

  {
    category: 'Product',
    title: 'Maps for your iPhone 15 Pro Max.',
    src: 'https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    category: 'iOS',
    title: 'Photography just got better.',
    src: 'https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    category: 'Hiring',
    title: 'Hiring for a Staff Software Engineer',
    src: 'https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
]
</script>

<template>
  <section
    ref="sectionRef"
    class="min-h-screen flex flex-col justify-center overflow-hidden py-24 text-white"
  >
    <div class="mx-auto max-w-6xl w-full px-6 space-y-4">
      <TuffStickyBar>
        {{ plugins.eyebrow }}
      </TuffStickyBar>

      <header
        class="text-center text-white"
      >
        <h2 class="my-0 text-[clamp(.7rem,1vw+1.4rem,1.2rem)] font-bold leading-tight">
          {{ plugins.headline }}
        </h2>
        <p class="mx-auto my-0 max-w-3xl text-[clamp(.6rem,1vw+1.3rem,1.1rem)] font-semibold leading-relaxed op-70">
          {{ plugins.subheadline }}
        </p>
      </header>

      <div>
        <AppleCardCarousel>
          <AppleCarouselItem
            v-for="(card, index) in cards"
            :key="index"
            :index="index"
          >
            <AppleCard
              :card="card"
              :index="index"
              :layout="true"
            >
              <div
                :key="`dummy-content${index}`"
                class="mb-4 rounded-3xl bg-[#F5F5F7] p-8 dark:bg-neutral-800 md:p-14"
              >
                <p
                  class="mx-auto max-w-3xl text-base text-neutral-600 font-sans md:text-2xl dark:text-neutral-400"
                >
                  <span class="text-neutral-700 font-bold dark:text-neutral-200">
                    The first rule of Apple club is that you boast about Apple club.
                  </span>
                  Keep a journal, quickly jot down a grocery list, and take amazing class notes. Want to
                  convert those notes to text? No problem. Langotiya jeetu ka mara hua yaar is ready to
                  capture every thought.
                </p>
                <img
                  src="https://assets.aceternity.com/macbook.png"
                  alt="Macbook mockup from Aceternity UI"
                  height="500"
                  width="500"
                  class="mx-auto size-full object-contain md:size-1/2"
                >
              </div>
            </AppleCard>
          </AppleCarouselItem>
        </AppleCardCarousel>
        <article
          v-for="capability in cards"
          v-if="false"
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
                1
                <!-- {{ isActivated(capability.id) ? capabilities.addedLabel : capabilities.addLabel }} -->
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
            <!-- <span v-if="!isActivated(capability.id)">{{ capabilities.addLabel }}</span> -->
            <!-- <span v-else>{{ capabilities.addedLabel }}</span> -->
          </button>
        </article>
      </div>
    </div>
  </section>
</template>
