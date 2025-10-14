<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface CommunityChannel {
  id: string
  title: string
  description: string
  meta: string
  cta: string
  href: string
  icon: string
}

interface CommunitySpotlight {
  id: string
  title: string
  copy: string
  icon: string
}

interface CommunityContent {
  eyebrow: string
  headline: string
  subheadline: string
  channels: CommunityChannel[]
  spotlights: CommunitySpotlight[]
}

const props = defineProps<{
  community: CommunityContent
}>()

const sectionRef = ref<HTMLElement | null>(null)
const community = computed(() => props.community)
const channels = computed(() => community.value.channels ?? [])
const spotlights = computed(() => community.value.spotlights ?? [])

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 30,
    duration: 0.95,
  },
})
</script>

<template>
  <section
    id="blog"
    ref="sectionRef"
    class="relative isolate min-h-screen flex flex-col justify-center overflow-hidden bg-black py-24 text-white"
  >
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute left-[-260px] top-1/2 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(192,132,252,0.22),_transparent_68%)] blur-3xl -translate-y-1/2" />
      <div class="absolute right-[-200px] top-[15%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.18),_transparent_70%)] blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-6xl w-full px-6 space-y-10">
      <TuffStickyBar>
        {{ community.eyebrow }}
      </TuffStickyBar>

      <header class="text-center space-y-5">
        <h2 class="my-0 text-[clamp(2.1rem,1vw+2.4rem,3.1rem)] font-semibold leading-tight">
          {{ community.headline }}
        </h2>
        <p class="mx-auto my-0 max-w-3xl text-[clamp(.7rem,1vw+1.2rem,1.1rem)] text-white/70 font-semibold leading-relaxed">
          {{ community.subheadline }}
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-3" data-reveal>
        <article
          v-for="channel in channels"
          :key="channel.id"
          class="group relative h-full flex flex-col justify-between gap-6 overflow-hidden border border-white/12 rounded-[28px] bg-white/5 p-8 text-left text-white shadow-[0_24px_90px_rgba(6,18,52,0.38)] transition duration-300 hover:border-white/25 hover:bg-white/9 hover:-translate-y-1"
        >
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_70%)] opacity-70 transition duration-300 group-hover:opacity-100" />
          <div class="relative space-y-4">
            <span class="size-12 inline-flex items-center justify-center rounded-2xl bg-white/15 text-white shadow-[0_18px_40px_rgba(4,16,52,0.36)]">
              <span :class="channel.icon" class="text-xl" aria-hidden="true" />
            </span>
            <div class="space-y-2">
              <h3 class="text-xl font-semibold">
                {{ channel.title }}
              </h3>
              <p class="text-sm text-white/60 font-semibold tracking-[0.3em] uppercase">
                {{ channel.meta }}
              </p>
              <p class="text-sm text-white/70 leading-relaxed">
                {{ channel.description }}
              </p>
            </div>
          </div>
          <div class="relative">
            <NuxtLink
              :to="channel.href"
              class="inline-flex items-center gap-2 text-sm text-white font-semibold transition hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              {{ channel.cta }}
              <span class="i-carbon-arrow-up-right text-base" aria-hidden="true" />
            </NuxtLink>
          </div>
        </article>
      </div>

      <div class="grid gap-4 md:grid-cols-2" data-reveal>
        <article
          v-for="spotlight in spotlights"
          :key="spotlight.id"
          class="relative overflow-hidden border border-white/10 rounded-[26px] bg-white/4 px-7 py-6 text-left text-white shadow-[0_20px_70px_rgba(5,16,52,0.32)]"
        >
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_70%)] opacity-70" />
          <div class="relative flex items-start gap-4">
            <span class="size-10 inline-flex flex-shrink-0 items-center justify-center rounded-2xl bg-white/12 text-white shadow-[0_16px_36px_rgba(5,16,52,0.32)]">
              <span :class="spotlight.icon" class="text-lg" aria-hidden="true" />
            </span>
            <div class="space-y-1.5">
              <h3 class="text-lg font-semibold leading-tight">
                {{ spotlight.title }}
              </h3>
              <p class="text-sm text-white/70 leading-relaxed">
                {{ spotlight.copy }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
