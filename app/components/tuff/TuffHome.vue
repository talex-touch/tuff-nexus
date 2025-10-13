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

const { t } = useI18n()

const aiResultKeys = ['figma', 'files', 'gmail', 'slack'] as const
const aiResultIcons = {
  figma: 'i-carbon-logo-figma',
  files: 'i-carbon-document',
  gmail: 'i-carbon-email',
  slack: 'i-carbon-logo-slack',
} satisfies Record<(typeof aiResultKeys)[number], string>

const aiHighlightKeys = ['context', 'silo', 'breathe'] as const

const capabilityKeys = ['notion', 'figma', 'github', 'vscode', 'calendar', 'spotify'] as const
const capabilityIcons = {
  notion: 'i-carbon-logo-notion',
  figma: 'i-carbon-logo-figma',
  github: 'i-carbon-logo-github',
  vscode: 'i-carbon-logo-vscode',
  calendar: 'i-carbon-calendar',
  spotify: 'i-carbon-logo-spotify',
} satisfies Record<(typeof capabilityKeys)[number], string>

const foundationKeys = ['core', 'sdk', 'community'] as const
const foundationIcons = {
  core: 'i-carbon-certificate-check',
  sdk: 'i-carbon-cube',
  community: 'i-carbon-collaborate',
} satisfies Record<(typeof foundationKeys)[number], string>

const proactiveKeys = ['developer', 'designer', 'zero'] as const
const proactiveIcons = {
  developer: 'i-carbon-code',
  designer: 'i-carbon-brush-freehand',
  zero: 'i-carbon-sail-boat',
} satisfies Record<(typeof proactiveKeys)[number], string>

const craftsmanshipKeys = ['system', 'clipboard', 'performance'] as const

const pioneerBenefitKeys = ['early', 'shape', 'community'] as const

const aiSpotlight = computed(() => ({
  eyebrow: t('landing.os.aiSpotlight.eyebrow'),
  headline: t('landing.os.aiSpotlight.headline'),
  subheadline: t('landing.os.aiSpotlight.subheadline'),
  demo: {
    summary: t('landing.os.aiSpotlight.summary'),
    queryLabel: t('landing.os.aiSpotlight.queryLabel'),
    queryText: t('landing.os.aiSpotlight.queryText'),
    results: aiResultKeys.map(key => ({
      icon: aiResultIcons[key],
      title: t(`landing.os.aiSpotlight.results.${key}.title`),
      meta: t(`landing.os.aiSpotlight.results.${key}.meta`),
    })),
  },
  highlights: aiHighlightKeys.map(key => ({
    title: t(`landing.os.aiSpotlight.highlights.${key}.title`),
    copy: t(`landing.os.aiSpotlight.highlights.${key}.copy`),
  })),
}))

const plugins = computed(() => ({
  eyebrow: t('landing.os.plugins.eyebrow'),
  headline: t('landing.os.plugins.headline'),
  subheadline: t('landing.os.plugins.subheadline'),
  extensions: capabilityKeys.map(key => ({
    id: key,
    icon: capabilityIcons[key],
    name: t(`landing.os.plugins.extensions.${key}.name`),
    description: t(`landing.os.plugins.extensions.${key}.description`),
  })),
}))

const extensibility = computed(() => ({
  eyebrow: t('landing.os.extensibility.eyebrow'),
  headline: t('landing.os.extensibility.headline'),
  subheadline: t('landing.os.extensibility.subheadline'),
}))

const openFoundation = computed(() => ({
  eyebrow: t('landing.os.openFoundation.eyebrow'),
  headline: t('landing.os.openFoundation.headline'),
  subheadline: t('landing.os.openFoundation.subheadline'),
  pillars: foundationKeys.map(key => ({
    icon: foundationIcons[key],
    title: t(`landing.os.openFoundation.pillars.${key}.title`),
    copy: t(`landing.os.openFoundation.pillars.${key}.copy`),
  })),
  footnote: t('landing.os.openFoundation.footnote'),
}))

const proactive = computed(() => ({
  eyebrow: t('landing.os.proactive.eyebrow'),
  headline: t('landing.os.proactive.headline'),
  subheadline: t('landing.os.proactive.subheadline'),
  shieldLabel: t('landing.os.proactive.shieldLabel'),
  scenarios: proactiveKeys.map(key => ({
    id: key,
    icon: proactiveIcons[key],
    tab: t(`landing.os.proactive.scenarios.${key}.tab`),
    title: t(`landing.os.proactive.scenarios.${key}.title`),
    copy: t(`landing.os.proactive.scenarios.${key}.copy`),
    action: t(`landing.os.proactive.scenarios.${key}.action`),
  })),
}))

const craftsmanship = computed(() => ({
  eyebrow: t('landing.os.craftsmanship.eyebrow'),
  headline: t('landing.os.craftsmanship.headline'),
  subheadline: t('landing.os.craftsmanship.subheadline'),
  clips: craftsmanshipKeys.map(key => ({
    id: key,
    tag: t(`landing.os.craftsmanship.clips.${key}.tag`),
    title: t(`landing.os.craftsmanship.clips.${key}.title`),
    copy: t(`landing.os.craftsmanship.clips.${key}.copy`),
  })),
}))

const pioneer = computed(() => ({
  eyebrow: t('landing.os.pioneer.eyebrow'),
  headline: t('landing.os.pioneer.headline'),
  subheadline: t('landing.os.pioneer.subheadline'),
  formTitle: t('landing.os.pioneer.formTitle'),
  cta: t('landing.os.pioneer.cta'),
  benefitsTitle: t('landing.os.pioneer.benefitsTitle'),
  benefits: pioneerBenefitKeys.map(key => ({
    title: t(`landing.os.pioneer.benefits.${key}.title`),
    copy: t(`landing.os.pioneer.benefits.${key}.copy`),
  })),
  privacy: t('landing.os.pioneer.privacy'),
}))

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
    <TuffLandingPlugins
      v-if="plugins"
      :plugins="plugins"
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
