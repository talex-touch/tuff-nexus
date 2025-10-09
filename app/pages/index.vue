<script setup lang="ts">
definePageMeta({
  layout: 'home',
})

import { computed } from 'vue'

const online = useOnline()
const { t } = useI18n()

const features = computed(() => [
  {
    title: t('landing.features.items.workspace.title'),
    description: t('landing.features.items.workspace.description'),
    icon: 'i-carbon-play-outline',
  },
  {
    title: t('landing.features.items.theming.title'),
    description: t('landing.features.items.theming.description'),
    icon: 'i-carbon-color-palette',
  },
  {
    title: t('landing.features.items.delivery.title'),
    description: t('landing.features.items.delivery.description'),
    icon: 'i-carbon-airplane',
  },
])

const workflow = computed(() => [
  {
    title: t('landing.workflow.steps.scope.title'),
    description: t('landing.workflow.steps.scope.description'),
    icon: 'i-carbon-map',
  },
  {
    title: t('landing.workflow.steps.polish.title'),
    description: t('landing.workflow.steps.polish.description'),
    icon: 'i-carbon-magic-wand',
  },
  {
    title: t('landing.workflow.steps.publish.title'),
    description: t('landing.workflow.steps.publish.description'),
    icon: 'i-carbon-rocket',
  },
])

const faqs = computed(() => [
  {
    question: t('landing.faq.items.content.question'),
    answer: t('landing.faq.items.content.answer'),
  },
  {
    question: t('landing.faq.items.styling.question'),
    answer: t('landing.faq.items.styling.answer'),
  },
  {
    question: t('landing.faq.items.automation.question'),
    answer: t('landing.faq.items.automation.answer'),
  },
])

const deckItems = computed(() => [
  {
    icon: 'i-carbon-language',
    title: t('landing.hero.deck.items.locale.title'),
    description: t('landing.hero.deck.items.locale.description'),
  },
  {
    icon: 'i-carbon-moon',
    title: t('landing.hero.deck.items.theming.title'),
    description: t('landing.hero.deck.items.theming.description'),
  },
  {
    icon: 'i-carbon-cloud-upload',
    title: t('landing.hero.deck.items.deploy.title'),
    description: t('landing.hero.deck.items.deploy.description'),
  },
])

const kitBullets = computed(() => [
  {
    icon: 'i-carbon-checkmark',
    text: t('landing.kit.bullets.tokens'),
  },
  {
    icon: 'i-carbon-checkmark',
    text: t('landing.kit.bullets.content'),
  },
  {
    icon: 'i-carbon-checkmark',
    text: t('landing.kit.bullets.components'),
  },
])
</script>

<template>
  <div class="w-full text-left">
    <div
      v-if="online === false"
      class="mx-auto mb-6 max-w-4xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100"
    >
      {{ t('landing.hero.offlineNotice') }}
    </div>

    <section class="container mx-auto grid gap-14 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
      <div class="space-y-6">
        <span class="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-semibold tracking-wide text-primary/80 dark:border-light/20 dark:bg-light/10 dark:text-light/70">
          <span class="i-carbon-rocket text-sm" />
          {{ t('landing.hero.badge') }}
        </span>
        <h1 class="text-3xl font-semibold leading-tight text-primary dark:text-light sm:text-5xl sm:leading-tight">
          {{ t('landing.hero.title') }}
        </h1>
        <p class="max-w-2xl text-base text-gray-600 dark:text-gray-200 sm:text-lg">
          {{ t('landing.hero.description') }}
        </p>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <NuxtLink
            to="/docs"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-medium text-light shadow-sm transition hover:bg-black dark:bg-light dark:text-primary dark:hover:bg-light/90"
          >
            <span class="i-carbon-arrow-right text-lg" />
            {{ t('landing.hero.primaryCta') }}
          </NuxtLink>
          <a
            href="https://github.com/tuff-docs/tuff-nexus"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 rounded-full border border-primary/15 px-6 py-3 text-base font-medium text-primary transition hover:border-primary/40 hover:text-black dark:border-light/20 dark:text-light dark:hover:border-light/40"
          >
            <span class="i-carbon-logo-github text-lg" />
            {{ t('landing.hero.secondaryCta') }}
          </a>
        </div>
      </div>
      <div class="relative">
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 blur-xl dark:from-light/10 dark:to-light/5" />
        <div class="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-white via-white to-gray-50 shadow-lg dark:border-light/10 dark:from-primary dark:via-primary/95 dark:to-primary">
          <div class="border-b border-primary/10 bg-white/90 px-6 py-4 text-xs uppercase tracking-[0.3em] text-primary/60 dark:border-light/10 dark:bg-primary/80 dark:text-light/60">
            {{ t('landing.hero.deck.title') }}
          </div>
          <div class="space-y-6 px-6 py-8">
            <div
              v-for="item in deckItems"
              :key="item.title"
              class="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white/80 p-4 text-sm shadow-sm dark:border-light/15 dark:bg-primary/70 dark:text-light/80"
            >
              <span :class="[item.icon, 'text-lg text-primary dark:text-light']" />
              <div>
                <p class="font-medium text-primary dark:text-light">{{ item.title }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-300">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-20 dark:bg-primary/80">
      <div class="container mx-auto space-y-12 px-6">
        <div class="space-y-4 text-center">
          <h2 class="text-2xl font-semibold text-primary dark:text-light sm:text-3xl">
            {{ t('landing.features.title') }}
          </h2>
          <p class="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-200">
            {{ t('landing.features.description') }}
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <article
            v-for="feature in features"
            :key="feature.title"
            class="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-light/10 dark:bg-primary/70"
          >
            <span :class="[feature.icon, 'h-10 w-10 rounded-full bg-primary/10 p-2.5 text-primary dark:bg-light/10 dark:text-light']" />
            <h3 class="text-lg font-semibold text-primary dark:text-light">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-200">
              {{ feature.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="container mx-auto grid gap-12 px-6 py-20 lg:grid-cols-[1fr_1fr]">
      <div class="space-y-5">
        <h2 class="text-2xl font-semibold text-primary dark:text-light sm:text-3xl">
          {{ t('landing.workflow.title') }}
        </h2>
        <p class="text-base text-gray-600 dark:text-gray-200">
          {{ t('landing.workflow.description') }}
        </p>
        <div class="space-y-4">
          <div
            v-for="step in workflow"
            :key="step.title"
            class="flex items-start gap-4 rounded-2xl border border-primary/10 bg-white/70 p-5 dark:border-light/10 dark:bg-primary/70"
          >
            <span :class="[step.icon, 'mt-1 h-8 w-8 rounded-full bg-primary/5 p-1.5 text-primary dark:bg-light/10 dark:text-light']" />
            <div>
              <p class="text-sm font-semibold uppercase tracking-wide text-primary/80 dark:text-light/70">
                {{ step.title }}
              </p>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-200">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-center gap-6 rounded-3xl border border-dashed border-primary/20 bg-gradient-to-br from-primary/5 via-white to-white p-8 dark:border-light/20 dark:from-primary/60 dark:via-primary/50 dark:to-primary/40">
        <p class="text-sm uppercase tracking-[0.4em] text-primary/60 dark:text-light/60">
          {{ t('landing.kit.label') }}
        </p>
        <h3 class="text-xl font-semibold text-primary dark:text-light">
          {{ t('landing.kit.title') }}
        </h3>
        <ul class="space-y-3 text-sm text-gray-600 dark:text-gray-200">
          <li
            v-for="bullet in kitBullets"
            :key="bullet.text"
            class="flex items-center gap-2"
          >
            <span :class="[bullet.icon, 'text-primary dark:text-light']" />
            {{ bullet.text }}
          </li>
        </ul>
        <NuxtLink
          to="/marketplace"
          class="inline-flex w-max items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-light transition hover:bg-black dark:bg-light dark:text-primary dark:hover:bg-light/90"
        >
          <span class="i-carbon-shopping-bag text-base" />
          {{ t('landing.kit.marketplaceCta') }}
        </NuxtLink>
      </div>
    </section>

    <section class="bg-primary py-20 text-light">
      <div class="container mx-auto space-y-12 px-6">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="max-w-2xl space-y-4">
            <h2 class="text-2xl font-semibold sm:text-3xl">
              {{ t('landing.faq.title') }}
            </h2>
            <p class="text-sm text-light/80">
              {{ t('landing.faq.description') }}
            </p>
          </div>
          <NuxtLink
            to="/docs/documents/start"
            class="inline-flex items-center gap-2 rounded-full border border-light/30 px-5 py-2 text-sm font-medium transition hover:bg-light hover:text-primary"
          >
            <span class="i-carbon-document text-base" />
            {{ t('landing.hero.primaryCta') }}
          </NuxtLink>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <article
            v-for="faq in faqs"
            :key="faq.question"
            class="rounded-2xl border border-light/15 bg-light/5 p-6 text-left"
          >
            <p class="text-sm font-semibold uppercase tracking-wide text-light/70">
              {{ faq.question }}
            </p>
            <p class="mt-3 text-sm text-light/80">
              {{ faq.answer }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="container mx-auto px-6 py-20">
      <div class="rounded-3xl border border-primary/10 bg-white p-10 text-center shadow-sm dark:border-light/10 dark:bg-primary/70">
        <h2 class="text-2xl font-semibold text-primary dark:text-light sm:text-3xl">
          {{ t('landing.cta.title') }}
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-base text-gray-600 dark:text-gray-200">
          {{ t('landing.cta.description') }}
        </p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <NuxtLink
            to="/docs"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-medium text-light transition hover:bg-black dark:bg-light dark:text-primary dark:hover:bg-light/90"
          >
            <span class="i-carbon-play text-lg" />
            {{ t('landing.cta.primary') }}
          </NuxtLink>
          <NuxtLink
            to="/docs/documents/start"
            class="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 px-6 py-3 text-base font-medium text-primary transition hover:border-primary/40 hover:text-black dark:border-light/20 dark:text-light dark:hover:border-light/40"
          >
            <span class="i-carbon-roadmap text-lg" />
            {{ t('landing.cta.secondary') }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
