<script setup lang="ts">
import TuffLandingEcosystem from './landing/TuffLandingEcosystem.vue'
import TuffLandingExperience from './landing/TuffLandingExperience.vue'
import TuffLandingFeatures from './landing/TuffLandingFeatures.vue'
import TuffLandingHero from './landing/TuffLandingHero.vue'
import TuffLandingIntegrations from './landing/TuffLandingIntegrations.vue'
import TuffLandingStats from './landing/TuffLandingStats.vue'
import TuffLandingWaitlist from './landing/TuffLandingWaitlist.vue'

const hero = {
  badge: 'Tuff Launcher',
  title: 'Launch, orchestrate, and share your entire workspace flow.',
  copy: 'Tuff brings the luminous aesthetic from the docs experience into product surfaces. Command palettes, live presence, and automation boards stay in lockstep across every device.',
  bullets: [
    'Cinematic command surfaces with synchronized transitions on desktop, web, and mobile.',
    'Policy-aware rollout controls with signed extensions and regional manifests.',
    'Realtime collaboration that mirrors the intent of your FlowScript and docs playbooks.',
  ],
  primaryCta: { label: 'Join waitlist', to: '#waitlist', icon: 'i-carbon-play-filled' },
  secondaryCta: { label: 'Preview docs', to: '/docs', icon: 'i-carbon-book' },
  highlights: [
    { value: '0.29s', label: 'Command cold start' },
    { value: '140+', label: 'Signed extensions' },
    { value: '12 regions', label: 'Launch coverage' },
  ],
  bannerCopy:
    'Compose flows with responsive motion surfaces that translate perfectly from 4K showreels to mobile check-ins—no distortion, no guesswork.',
}

const stats = [
  {
    value: '2.3k+',
    label: 'Studio teams',
    copy: 'Teams orchestrating reviews, launches, and rituals inside shared Tuff spaces every day.',
  },
  {
    value: '28 ms',
    label: 'Average sync',
    copy: 'State diff streaming keeps input, presence, and GSAP motion cues in near real time.',
  },
  {
    value: '99.9%',
    label: 'Uptime target',
    copy: 'Multi-region brokers mirrored across CN, EU, and US footprints to match compliance needs.',
  },
]

const features = [
  {
    badge: 'Flow Kernel',
    title: 'Orchestrated workspaces',
    copy: 'Lay out automation scenes that feel purposeful. Swap between coding canvases, docs, and reviews with motion that never breaks context.',
    bullets: [
      'Scene graph with typed events that stitches together extensions and native surfaces.',
      'Granular role lanes so ops, design, and eng move together without stepping on workflows.',
    ],
    link: { to: '/docs/flows', label: 'Design your flow' },
  },
  {
    badge: 'Marketplace',
    title: 'Signed extension market',
    copy: 'Curated, versioned extensions with rollout rings. Ship to beta teams, observe metrics, then promote to everyone with one toggle.',
    bullets: [
      'Signature and provenance baked into every release artifact.',
      'Progressive delivery and rollback controls built right into the launcher.',
    ],
    link: { to: '/marketplace', label: 'Browse marketplace' },
  },
  {
    badge: 'SDK · Tooling',
    title: 'Developer momentum',
    copy: 'Type-safe SDKs, VS Code sandboxes, and CI manifests mean your team iterates on flows without waiting on core platform updates.',
    bullets: [
      'Local dev server with GSAP-aware preview harnesses.',
      'CI templates mirroring the docs `.vitepress` linting and formatting rules.',
    ],
    link: { to: '/docs/sdk', label: 'Build with the SDK' },
  },
  {
    badge: 'Governance',
    title: 'Compliance ready',
    copy: 'Keep audit logs, sign-ins, and customer data segmented by geography without maintaining multiple builds.',
    bullets: [
      'Region-aware policy packs with instant enforcement toggles.',
      'Privacy-preserving presence that still surfaces intent and context.',
    ],
    link: { to: '/docs/platforms', label: 'See platform guide' },
  },
]

const experiences = [
  {
    badge: 'Live Boards',
    title: 'Synchronize motion across every surface.',
    copy: 'GSAP timelines power micro-interactions that match the luminous gradients from the docs theme. Launchers, docs, and dashboards move together.',
    points: [
      'Adaptive easing curves tune to input latency so animations feel natural on touch and desktop.',
      'Presence indicators glow with the same palette used in the VitePress docs headers.',
      'Scene capture lets you pin a moment and replay it inside documentation for async teams.',
    ],
    accent: 'Latency-aware motion cues',
  },
  {
    badge: 'Presence Graph',
    title: 'Context that respects privacy.',
    copy: 'Know who is editing, what they changed, and how the flow adapts—without leaking sensitive panels.',
    points: [
      'Diff previews surface highlights directly in the docs theme callouts.',
      'Ephemeral rooms for launches inherit typography and rhythm from docs `.vitepress` layouts.',
      'Escalation routes integrate with ops tooling so nothing slips during a deploy.',
    ],
    accent: 'Privacy guardrails by default',
  },
]

const ecosystem = [
  {
    title: 'Design tokens in lockstep',
    copy: 'Typography scale, gradients, and border radii are shared with the docs implementation so product teams can echo the tone instantly.',
    icon: 'i-carbon-color-palette',
    badge: 'Visual system',
    link: { to: '/docs/design', label: 'Review tokens' },
  },
  {
    title: 'Guides that match the product',
    copy: 'Tutorials in `docs/.vitepress` are written with the same states you see in the launcher, so screenshots and motion capture stay accurate.',
    icon: 'i-carbon-notebook-reference',
    badge: 'Documentation',
    link: { to: '/docs', label: 'Open documentation' },
  },
  {
    title: 'API + CLI parity',
    copy: 'Extend the launcher or automate flows using the same schema across REST, GraphQL, and CLI—no drift between tools.',
    icon: 'i-carbon-api',
    badge: 'Engine',
    link: { to: '/docs/api', label: 'Explore API' },
  },
]

const integrations = [
  {
    icon: 'i-carbon-logo-github',
    label: 'GitHub Actions',
    copy: 'Trigger flows from checks, releases, and PR discussions without leaving the launcher.',
  },
  {
    icon: 'i-carbon-logo-figma',
    label: 'Figma',
    copy: 'Drop live frames into boards and keep design handoff synced with FlowScript events.',
  },
  {
    icon: 'i-carbon-logo-slack',
    label: 'Slack + Lark',
    copy: 'Push adaptive announcements based on region manifests and recipient roles.',
  },
  {
    icon: 'i-carbon-logo-aws',
    label: 'Cloud runners',
    copy: 'Provision preview runners in CN/EU/US regions with mirrored configs and keys.',
  },
]

const waitlist = {
  eyebrow: 'Waitlist',
  title: 'Step into the Tuff ecosystem early.',
  copy: 'Drop your email and we’ll invite you to private previews, migration clinics, and the first extension showcase.',
  placeholder: 'you@studio.com',
  submitLabel: 'Notify me',
  perks: [
    { label: 'Free access through 2027·01·01.' },
    { label: 'Private previews and concierge onboarding.' },
    { label: 'Priority support from the launcher crew.' },
  ],
}

useHead({
  htmlAttrs: { class: 'dark' },
  bodyAttrs: { class: 'text-light antialiased' },
})
</script>

<template>
  <div class="relative min-h-screen flex flex-col text-light">
    <TuffLandingHero :hero="hero" />
    <TuffLandingStats :stats="stats" />
    <TuffLandingFeatures :features="features" />
    <TuffLandingExperience :experiences="experiences" />
    <TuffLandingEcosystem :items="ecosystem" />
    <TuffLandingIntegrations :integrations="integrations" />
    <TuffLandingWaitlist :waitlist="waitlist" />
  </div>
</template>
