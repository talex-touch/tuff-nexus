<script setup lang="ts">
import { computed } from 'vue'

const { t } = useI18n()

const pioneerBenefitKeys = ['early', 'shape', 'community'] as const

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

const emailPlaceholder = 'tuff@tagzxia.com'
</script>

<template>
  <TuffLandingSection
    id="download"
    :sticky="pioneer.eyebrow"
    section-class="flex flex-col justify-center pb-32 pt-24"
    container-class="max-w-6xl w-full"
    :reveal-options="{
      from: {
        opacity: 0,
        y: 48,
        duration: 1.05,
      },
    }"
  >
    <template #decoration>
      <div class="absolute inset-x-0 top-[-40%] h-[520px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(90,125,255,0.28),_transparent_70%)] blur-3xl" />
      <div class="absolute bottom-[-45%] left-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(31,211,182,0.22),_transparent_70%)] blur-3xl" />
    </template>

    <div class="mt-10 overflow-hidden border border-white/10 rounded-[40px] bg-white/10 shadow-[0_40px_130px_rgba(8,15,41,0.55)] backdrop-blur-xl">
      <div class="grid gap-12 px-8 py-16 md:grid-cols-[1.05fr_0.95fr] md:px-12 md:py-20">
        <div
          data-reveal
          class="text-center text-white space-y-8"
        >
          <h2 class="text-[clamp(2.3rem,1.2vw+2.4rem,3.4rem)] text-white font-semibold leading-tight">
            <span class="block">{{ pioneer.headline }}</span>
          </h2>
          <p class="mx-auto max-w-2xl text-[clamp(.6rem,1vw+1.3rem,1.1rem)] text-white/70 font-semibold leading-relaxed space-y-2 sm:text-lg">
            <span class="block">{{ pioneer.subheadline }}</span>
          </p>
          <form
            class="mx-auto max-w-lg w-full flex flex-col gap-4 border border-white/10 rounded-[28px] bg-white/10 p-6 text-left shadow-[0_28px_90px_rgba(8,15,41,0.4)] backdrop-blur-xl"
            action="/pioneer"
            method="post"
          >
            <label class="text-[11px] text-white/60 font-semibold tracking-[0.28em] uppercase space-y-2">
              <span>{{ pioneer.formTitle }}</span>
              <input
                type="email"
                name="email"
                required
                autocomplete="email"
                :placeholder="emailPlaceholder"
                class="mt-3 w-full border border-white/20 rounded-full bg-white/20 px-5 py-3 text-sm text-white focus:border-white/80 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
            </label>
            <button
              type="submit"
              class="w-full inline-flex items-center justify-center gap-2 rounded-full from-[#4cc1ff] via-[#3b82f6] to-[#8b5cf6] bg-gradient-to-r px-6 py-3 text-sm text-white font-semibold shadow-[0_20px_60px_rgba(12,38,90,0.55)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 hover:brightness-110 hover:-translate-y-0.5"
            >
              <span class="i-carbon-rocket text-base" aria-hidden="true" />
              <span>{{ pioneer.cta }}</span>
            </button>
          </form>
          <p class="text-xs text-white/50">
            {{ pioneer.privacy }}
          </p>
        </div>

        <div
          data-reveal
          class="flex flex-col gap-6 border border-white/10 rounded-[30px] bg-white/10 p-8 text-center text-white shadow-[0_28px_90px_rgba(8,15,41,0.45)] backdrop-blur-lg"
        >
          <h3 class="text-sm text-white/60 font-semibold tracking-[0.3em] uppercase">
            {{ pioneer.benefitsTitle }}
          </h3>
          <ul class="text-white/70 space-y-5">
            <li
              v-for="benefit in pioneer.benefits"
              :key="benefit.title"
              class="border border-white/10 rounded-[22px] bg-white/10 p-5 text-left shadow-[0_24px_70px_rgba(8,15,41,0.4)] transition duration-300 hover:border-white/25 hover:bg-white/15 hover:-translate-y-1"
            >
              <h4 class="text-lg text-white font-semibold">
                {{ benefit.title }}
              </h4>
              <p class="mt-3 text-sm text-white/70 leading-relaxed">
                {{ benefit.copy }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </TuffLandingSection>
</template>
