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
</script>

<template>
  <section
    id="market"
    ref="sectionRef"
    class="TuffLandingPlugins min-h-screen flex flex-col justify-center overflow-hidden bg-black py-24 text-white"
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

      <div class="TuffLandingPlugins-Main">
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
      </div>
    </div>
  </section>
</template>
