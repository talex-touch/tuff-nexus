<script setup lang="ts">
import { ref, useSlots } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

const props = withDefaults(defineProps<{
  id?: string
  sectionClass?: string
  containerClass?: string
  sticky?: string
  stickyClass?: string
  title?: string
  subtitle?: string
  titleTag?: string
  headerClass?: string
  titleClass?: string
  subtitleClass?: string
  revealOptions?: Parameters<typeof useGsapReveal>[1]
}>(), {
  sectionClass: '',
  containerClass: '',
  stickyClass: '',
  titleTag: 'h2',
  headerClass: '',
  titleClass: '',
  subtitleClass: '',
})

const slots = useSlots()
const sectionRef = ref<HTMLElement | null>(null)

useGsapReveal(sectionRef, props.revealOptions ?? {})
</script>

<template>
  <section
    :id="props.id"
    ref="sectionRef"
    :class="[
      'relative isolate overflow-hidden bg-black py-24 text-white',
      props.sectionClass,
    ]"
  >
    <div
      v-if="slots.decoration"
      class="pointer-events-none absolute inset-0 -z-10"
    >
      <slot name="decoration" />
    </div>

    <div
      class="relative mx-auto w-full px-6"
      :class="props.containerClass"
    >
      <template v-if="slots.sticky">
        <slot name="sticky" />
      </template>
      <TuffStickyBar
        v-else-if="props.sticky"
        :class="props.stickyClass"
      >
        {{ props.sticky }}
      </TuffStickyBar>

      <template v-if="slots.header">
        <slot name="header" />
      </template>
      <header
        v-else-if="props.title || props.subtitle"
        :class="[
          'space-y-4 text-center',
          props.headerClass,
        ]"
      >
        <component
          :is="props.titleTag"
          v-if="props.title"
          :class="[
            'my-0 font-semibold leading-tight',
            props.titleClass,
          ]"
        >
          {{ props.title }}
        </component>
        <p
          v-if="props.subtitle"
          :class="[
            'mx-auto my-0 text-base leading-relaxed text-white/70',
            props.subtitleClass,
          ]"
        >
          {{ props.subtitle }}
        </p>
      </header>

      <slot />
    </div>
  </section>
</template>
