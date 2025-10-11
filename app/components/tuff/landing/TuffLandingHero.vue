<script setup lang="ts">
import { ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'
import TuffBanner from '../TuffBanner.vue'
import TuffLandingWebglBackground from './TuffLandingWebglBackground.vue'

interface HeroCta {
  label: string
  to: string
  icon: string
}

interface HeroConfig {
  title: string
  bullets: string[]
  primaryCta: HeroCta
  secondaryCta: HeroCta
}

const { hero } = defineProps<{
  hero: HeroConfig
}>()

const sectionRef = ref<HTMLElement | null>(null)

useGsapReveal(sectionRef, {
  from: {
    y: 56,
    opacity: 0,
    duration: 1.1,
  },
})
</script>

<template>
  <section
    ref="sectionRef"
    class="TuffHome-HeroSection relative min-h-screen overflow-hidden"
  >
    <div class="TuffHome-HeroSection-BannerCore absolute left-0 top-0 h-full w-full -z-10">
      <TuffBanner>
        <template #center>
          <div class="hero-content min-h-screen w-full flex flex-col items-center justify-center gap-8 px-8 py-20 text-center text-white/85">
            <div class="hero-wordmark" data-reveal aria-hidden="true">
              <span class="hero-wordmark-text" data-text="Tuff">Tuff</span>
            </div>

            <h1
              data-reveal
              class="max-w-3xl text-[clamp(1rem,1vw+1.5rem,1rem)] text-white font-semibold leading-tight"
            >
              {{ hero.title }}
            </h1>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <NuxtLink
                :to="hero.primaryCta.to"
                data-reveal
                class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm text-black font-semibold shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 hover:-translate-y-0.5"
              >
                Join waitlist
              </NuxtLink>

              <NuxtLink
                :to="hero.secondaryCta.to"
                data-reveal
                class="inline-flex items-center justify-center gap-2 border border-white/20 rounded-full px-6 py-3 text-sm text-white font-semibold transition hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 hover:-translate-y-0.5"
              >
                Developer docs
              </NuxtLink>
            </div>
          </div>
        </template>
      </TuffBanner>
    </div>
  </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');

.hero-wordmark {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.hero-wordmark-text {
  position: relative;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(4rem, 12vw, 9rem);
  font-weight: 700;
  letter-spacing: clamp(1rem, 1.6vw, 2.5rem);
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.45);
  color: rgba(255, 255, 255, 0.92);
  text-shadow:
    0 0 10px rgba(255, 255, 255, 0.28),
    0 0 25px rgba(255, 255, 255, 0.18),
    0 0 45px rgba(255, 255, 255, 0.12);
}

.hero-wordmark-text::before {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  z-index: -1;
  transform: scale(1, 1.4);
  filter: blur(18px) brightness(210%);
  background: linear-gradient(45deg, #021a73, #330501);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@media (max-width: 640px) {
  .hero-wordmark-text {
    letter-spacing: clamp(0.5rem, 3vw, 1rem);
  }
}
</style>
