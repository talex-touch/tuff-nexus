<script setup lang="ts">
import { computed } from 'vue'
import { PricingTable } from '@clerk/nuxt/components'

definePageMeta({
  layout: 'home',
  pageTransition: {
    name: 'fade',
    mode: 'out-in',
  },
})

const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()

const pricingTableId = computed(() => runtimeConfig.public?.clerk?.pricingTableId || '')
const publishableKey = computed(() => runtimeConfig.public?.clerk?.publishableKey || '')
const hasPricingConfig = computed(() => Boolean(pricingTableId.value && publishableKey.value))
</script>

<template>
  <section class="relative mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-24 sm:px-8 lg:px-12">
    <header class="space-y-4 text-center">
      <p class="mx-auto inline-flex rounded-full border border-primary/15 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary/80 dark:border-light/20 dark:bg-light/10 dark:text-light/80">
        {{ t('nav.pricing') }}
      </p>
      <h1 class="text-3xl font-semibold tracking-tight text-primary dark:text-light sm:text-4xl">
        {{ t('pricing.title') }}
      </h1>
      <p class="mx-auto max-w-2xl text-base text-primary/70 dark:text-light/80">
        {{ t('pricing.subtitle') }}
      </p>
    </header>

    <div class="mx-auto w-full max-w-3xl rounded-3xl border border-primary/10 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-light/10 dark:bg-primary/70">
      <ClientOnly>
        <template #fallback>
          <div class="text-center text-sm text-primary/70 dark:text-light/80">
            {{ t('pricing.loading') }}
          </div>
        </template>
        <PricingTable
          v-if="hasPricingConfig"
          :publishable-key="publishableKey"
          :pricing-table-id="pricingTableId"
        />
        <div
          v-else
          class="text-center text-sm text-primary/70 dark:text-light/80"
        >
          {{ t('pricing.missingTable') }}
        </div>
      </ClientOnly>
    </div>
  </section>
</template>
