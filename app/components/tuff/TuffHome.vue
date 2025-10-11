<script setup lang="ts">
import { computed } from 'vue'
import TuffLandingEcosystem from './landing/TuffLandingEcosystem.vue'
import TuffLandingExperience from './landing/TuffLandingExperience.vue'
import TuffLandingFeatures from './landing/TuffLandingFeatures.vue'
import TuffLandingHero from './landing/TuffLandingHero.vue'
import TuffLandingIntegrations from './landing/TuffLandingIntegrations.vue'
import TuffLandingStats from './landing/TuffLandingStats.vue'
import TuffLandingWaitlist from './landing/TuffLandingWaitlist.vue'

const hero = {
  title: 'Profoundly Powerful. Deceptively Simple.',
  bullets: [
    'Cinematic command surfaces with synchronized transitions on desktop, web, and mobile.',
    'Policy-aware rollout controls with signed extensions and regional manifests.',
    'Realtime collaboration that mirrors the intent of your FlowScript and docs playbooks.',
  ],
  primaryCta: { label: 'Join waitlist', to: '#waitlist', icon: 'i-carbon-play-filled' },
  secondaryCta: { label: 'Preview docs', to: '/docs', icon: 'i-carbon-book' },
}

const { locale, messages } = useI18n()

const landingOsContent = computed<Record<string, any>>(() => {
  const currentMessages = messages.value?.[locale.value] as Record<string, any> | undefined
  return currentMessages?.landing?.os ?? {}
})

const aiSpotlight = computed(() => landingOsContent.value.aiSpotlight)
const extensibility = computed(() => landingOsContent.value.extensibility)
const openFoundation = computed(() => landingOsContent.value.openFoundation)
const proactive = computed(() => landingOsContent.value.proactive)
const craftsmanship = computed(() => landingOsContent.value.craftsmanship)
const pioneer = computed(() => landingOsContent.value.pioneer)

useHead({
  htmlAttrs: { class: 'dark' },
  bodyAttrs: { class: 'text-light antialiased' },
})
</script>

<template>
  <div class="relative min-h-screen flex flex-col text-light">
    <TuffLandingHero :hero="hero" />
    <TuffLandingStats
      v-if="aiSpotlight"
      :spotlight="aiSpotlight"
    />
    <TuffLandingFeatures
      v-if="extensibility"
      :capabilities="extensibility"
    />
    <TuffLandingEcosystem
      v-if="openFoundation"
      :open-foundation="openFoundation"
    />
    <TuffLandingExperience
      v-if="proactive"
      :proactive="proactive"
    />
    <TuffLandingIntegrations
      v-if="craftsmanship"
      :craftsmanship="craftsmanship"
    />
    <TuffLandingWaitlist
      v-if="pioneer"
      :pioneer="pioneer"
    />
  </div>
</template>
