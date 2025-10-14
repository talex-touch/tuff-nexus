<script setup lang="ts">
import { computed } from 'vue'
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
import TuffLandingPricing from './landing/TuffLandingPricing.vue'
import TuffLandingStarSnippets from './landing/TuffLandingStarSnippets.vue'
import TuffLandingStats from './landing/TuffLandingStats.vue'
import TuffLandingWaitlist from './landing/TuffLandingWaitlist.vue'

const hero = {
  title: 'Profoundly Powerful. Deceptively Simple.',
  bullets: [
    'Cinematic command surfaces with synchronized transitions on desktop, web, and mobile.',
    'Policy-aware rollout controls with signed extensions and regional manifests.',
    'Realtime collaboration that mirrors the intent of your FlowScript and docs playbooks.',
  ],
  primaryCta: { label: 'Join waitlist', to: '#download', icon: 'i-carbon-play-filled' },
  secondaryCta: { label: 'Preview docs', to: '/docs', icon: 'i-carbon-book' },
}

const { t } = useI18n()

const showStarSnippets = false
const showAggregation = false
const showPricing = true

const aiResultKeys = ['figma', 'files', 'gmail', 'slack'] as const
const aiResultIcons = {
  figma: 'i-carbon-logo-figma',
  files: 'i-carbon-document',
  gmail: 'i-carbon-email',
  slack: 'i-carbon-logo-slack',
} satisfies Record<(typeof aiResultKeys)[number], string>

const aiHighlightKeys = ['context', 'silo', 'breathe'] as const
const aiOverviewBulletKeys = ['understand', 'instant', 'privacy'] as const
const aiOverviewHighlightKeys = ['orchestrate', 'copilot', 'memory'] as const
const aiOverviewHighlightIcons = {
  orchestrate: 'i-carbon-flow-modeler',
  copilot: 'i-carbon-machine-learning-model',
  memory: 'i-carbon-reminder',
} satisfies Record<(typeof aiOverviewHighlightKeys)[number], string>

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

const builtForYouPersonaKeys = ['makers', 'developers', 'operators'] as const
const builtForYouPersonaIcons = {
  makers: 'i-carbon-pen',
  developers: 'i-carbon-code',
  operators: 'i-carbon-chart-combo',
} satisfies Record<(typeof builtForYouPersonaKeys)[number], string>
const builtForYouPersonaAccents = {
  makers: 'bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_70%)]',
  developers: 'bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_70%)]',
  operators: 'bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.2),_transparent_70%)]',
} satisfies Record<(typeof builtForYouPersonaKeys)[number], string>
const builtForYouStatKeys = ['latency', 'adoption', 'satisfaction'] as const
const builtForYouStatIcons = {
  latency: 'i-carbon-flash-filled',
  adoption: 'i-carbon-user-multiple',
  satisfaction: 'i-carbon-face-satisfied',
} satisfies Record<(typeof builtForYouStatKeys)[number], string>

const proactiveKeys = ['developer', 'designer', 'zero'] as const
const proactiveIcons = {
  developer: 'i-carbon-code',
  designer: 'i-carbon-brush-freehand',
  zero: 'i-carbon-sail-boat',
} satisfies Record<(typeof proactiveKeys)[number], string>

const craftsmanshipKeys = ['system', 'clipboard', 'performance'] as const

const pioneerBenefitKeys = ['early', 'shape', 'community'] as const

const starSnippetCategoryKeys = ['meetings', 'support', 'builders'] as const
const starSnippetCategoryIcons = {
  meetings: 'i-carbon-calendar-schedule',
  support: 'i-carbon-chat',
  builders: 'i-carbon-rocket',
} satisfies Record<(typeof starSnippetCategoryKeys)[number], string>
const starSnippetCategoryAccents = {
  meetings: 'bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_70%)]',
  support: 'bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_70%)]',
  builders: 'bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_70%)]',
} satisfies Record<(typeof starSnippetCategoryKeys)[number], string>

const aggregationPanelKeys = ['overview', 'timelines', 'alerts'] as const
const aggregationPanelIcons = {
  overview: 'i-carbon-dashboard',
  timelines: 'i-carbon-time',
  alerts: 'i-carbon-notification',
} satisfies Record<(typeof aggregationPanelKeys)[number], string>

const communityChannelKeys = ['slack', 'github', 'events'] as const
const communityChannelIcons = {
  slack: 'i-carbon-logo-slack',
  github: 'i-carbon-logo-github',
  events: 'i-carbon-calendar-heat-map',
} satisfies Record<(typeof communityChannelKeys)[number], string>
const communitySpotlightKeys = ['learning', 'newsletter'] as const
const communitySpotlightIcons = {
  learning: 'i-carbon-book',
  newsletter: 'i-carbon-email',
} satisfies Record<(typeof communitySpotlightKeys)[number], string>

const pricingFeatureKeys = ['unlimited', 'support', 'roadmap'] as const

const faqItemKeys = ['access', 'privacy', 'build', 'migration', 'pricing'] as const

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

const aiOverview = computed(() => ({
  eyebrow: t('landing.os.aiOverview.eyebrow'),
  headline: t('landing.os.aiOverview.headline'),
  subheadline: t('landing.os.aiOverview.subheadline'),
  hero: {
    title: t('landing.os.aiOverview.hero.title'),
    copy: t('landing.os.aiOverview.hero.copy'),
    primaryCta: t('landing.os.aiOverview.hero.primaryCta'),
    secondaryCta: t('landing.os.aiOverview.hero.secondaryCta'),
    bullets: aiOverviewBulletKeys.map(key => t(`landing.os.aiOverview.hero.bullets.${key}`)),
  },
  highlights: aiOverviewHighlightKeys.map(key => ({
    icon: aiOverviewHighlightIcons[key],
    title: t(`landing.os.aiOverview.highlights.${key}.title`),
    copy: t(`landing.os.aiOverview.highlights.${key}.copy`),
  })),
}))

const builtForYou = computed(() => ({
  eyebrow: t('landing.os.builtForYou.eyebrow'),
  headline: t('landing.os.builtForYou.headline'),
  subheadline: t('landing.os.builtForYou.subheadline'),
  personas: builtForYouPersonaKeys.map(key => ({
    id: key,
    icon: builtForYouPersonaIcons[key],
    accent: builtForYouPersonaAccents[key],
    title: t(`landing.os.builtForYou.personas.${key}.title`),
    copy: t(`landing.os.builtForYou.personas.${key}.copy`),
    quote: t(`landing.os.builtForYou.personas.${key}.quote`),
    name: t(`landing.os.builtForYou.personas.${key}.name`),
    role: t(`landing.os.builtForYou.personas.${key}.role`),
  })),
  stats: builtForYouStatKeys.map(key => ({
    id: key,
    icon: builtForYouStatIcons[key],
    label: t(`landing.os.builtForYou.stats.${key}.label`),
    value: t(`landing.os.builtForYou.stats.${key}.value`),
  })),
}))

const starSnippets = computed(() => ({
  eyebrow: t('landing.os.starSnippets.eyebrow'),
  headline: t('landing.os.starSnippets.headline'),
  subheadline: t('landing.os.starSnippets.subheadline'),
  categories: starSnippetCategoryKeys.map(key => ({
    id: key,
    icon: starSnippetCategoryIcons[key],
    accent: starSnippetCategoryAccents[key],
    title: t(`landing.os.starSnippets.categories.${key}.title`),
    copy: t(`landing.os.starSnippets.categories.${key}.copy`),
    action: t(`landing.os.starSnippets.categories.${key}.action`),
  })),
  footnote: t('landing.os.starSnippets.footnote'),
}))

const aggregation = computed(() => ({
  eyebrow: t('landing.os.aggregation.eyebrow'),
  headline: t('landing.os.aggregation.headline'),
  subheadline: t('landing.os.aggregation.subheadline'),
  panels: aggregationPanelKeys.map(key => ({
    id: key,
    icon: aggregationPanelIcons[key],
    title: t(`landing.os.aggregation.panels.${key}.title`),
    copy: t(`landing.os.aggregation.panels.${key}.copy`),
  })),
  footnote: t('landing.os.aggregation.footnote'),
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

const community = computed(() => ({
  eyebrow: t('landing.os.community.eyebrow'),
  headline: t('landing.os.community.headline'),
  subheadline: t('landing.os.community.subheadline'),
  channels: communityChannelKeys.map(key => ({
    id: key,
    icon: communityChannelIcons[key],
    title: t(`landing.os.community.channels.${key}.title`),
    meta: t(`landing.os.community.channels.${key}.meta`),
    description: t(`landing.os.community.channels.${key}.description`),
    cta: t(`landing.os.community.channels.${key}.cta`),
    href: t(`landing.os.community.channels.${key}.href`),
  })),
  spotlights: communitySpotlightKeys.map(key => ({
    id: key,
    icon: communitySpotlightIcons[key],
    title: t(`landing.os.community.spotlights.${key}.title`),
    copy: t(`landing.os.community.spotlights.${key}.copy`),
  })),
}))

const pricing = computed(() => ({
  eyebrow: t('landing.os.pricing.eyebrow'),
  headline: t('landing.os.pricing.headline'),
  subheadline: t('landing.os.pricing.subheadline'),
  plan: {
    name: t('landing.os.pricing.plan.name'),
    price: t('landing.os.pricing.plan.price'),
    period: t('landing.os.pricing.plan.period'),
    features: pricingFeatureKeys.map(key => ({
      id: key,
      copy: t(`landing.os.pricing.plan.features.${key}`),
    })),
    footnote: t('landing.os.pricing.plan.footnote'),
  },
}))

const faq = computed(() => ({
  eyebrow: t('landing.os.faq.eyebrow'),
  headline: t('landing.os.faq.headline'),
  items: faqItemKeys.map(key => ({
    id: key,
    question: t(`landing.os.faq.items.${key}.question`),
    answer: t(`landing.os.faq.items.${key}.answer`),
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
    <TuffLandingAiOverview
      v-if="aiOverview"
      :ai-overview="aiOverview"
    />
    <TuffLandingBuiltForYou
      v-if="builtForYou"
      :built-for-you="builtForYou"
    />
    <TuffLandingStarSnippets
      v-if="showStarSnippets"
      :star-snippets="starSnippets"
    />
    <TuffLandingAggregation
      v-if="showAggregation"
      :aggregation="aggregation"
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
    <TuffLandingCommunity
      v-if="community"
      :community="community"
    />
    <TuffLandingPricing
      v-if="showPricing"
      :pricing="pricing"
    />
    <TuffLandingFaq
      v-if="faq"
      :faq="faq"
    />
    <TuffLandingWaitlist
      v-if="pioneer"
      :pioneer="pioneer"
    />
    <TuffLandingFooter />
  </div>
</template>
