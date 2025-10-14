<script setup lang="ts">
import TuffLandingAggregation from './landing/TuffLandingAggregation.vue'
import TuffLandingAiOverview from './landing/TuffLandingAiOverview.vue'
import TuffLandingBuiltForYou from './landing/TuffLandingBuiltForYou.vue'
import TuffLandingCommunity from './landing/TuffLandingCommunity.vue'
import TuffLandingEcosystem from './landing/TuffLandingEcosystem.vue'
import TuffLandingExperience from './landing/TuffLandingExperience.vue'
import TuffLandingFaq from './landing/TuffLandingFaq.vue'
import TuffLandingFeatures from './landing/TuffLandingFeatures.vue'
import TuffLandingFooter from './landing/TuffLandingFooter.vue'
import TuffLandingHero from './landing/TuffLandingHero.vue'
import TuffLandingIntegrations from './landing/TuffLandingIntegrations.vue'
import TuffLandingPlugins from './landing/TuffLandingPlugins.vue'
import TuffLandingPricing from './landing/TuffLandingPricing.vue'
import TuffLandingStarSnippets from './landing/TuffLandingStarSnippets.vue'
import TuffLandingStats from './landing/TuffLandingStats.vue'
import TuffLandingWaitlist from './landing/TuffLandingWaitlist.vue'

const showStarSnippets = false
const showAggregation = false
const showPricing = false

useHead({
  htmlAttrs: { class: 'dark' },
  bodyAttrs: { class: 'text-light antialiased' },
})
</script>

<template>
  <div class="relative min-h-screen flex flex-col text-light">
    <TuffLandingHero />
    <TuffLandingStats />
    <TuffLandingPlugins />
    <TuffLandingAiOverview />
    <TuffLandingBuiltForYou />
    <TuffLandingStarSnippets v-if="showStarSnippets" />
    <TuffLandingAggregation v-if="showAggregation" />
    <TuffLandingFeatures />
    <TuffLandingEcosystem />
    <TuffLandingExperience />
    <TuffLandingIntegrations />
    <TuffLandingCommunity />
    <TuffLandingPricing v-if="showPricing" />
    <TuffLandingFaq />
    <TuffLandingWaitlist />
    <TuffLandingFooter />
  </div>
</template>
