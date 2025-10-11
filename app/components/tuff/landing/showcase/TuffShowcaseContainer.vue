<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  class?: string
  colors?: string[]
  speed?: number
  thickness?: number
  radius?: number
  background?: string
  glowBlur?: number
}>(), {
  colors: () => [
    '#ff6bcb',
    '#ffa63f',
    '#fffb7d',
    '#38f9d7',
    '#4776e6',
    '#b967ff',
  ],
  speed: 18000,
  thickness: 2.4,
  radius: 28,
  background: 'rgba(9, 13, 27, 0.78)',
  glowBlur: 72,
})

const FALLBACK_COLORS = [
  '#ff6bcb',
  '#ffa63f',
  '#fffb7d',
  '#38f9d7',
  '#4776e6',
  '#b967ff',
] as const

const palette = computed(() => {
  const unique = props.colors?.length ? props.colors : Array.from(FALLBACK_COLORS)
  const tailMatchesHead = unique[0] === unique[unique.length - 1]
  return tailMatchesHead ? unique : [...unique, unique[0]]
})

const gradientStops = computed(() => {
  const stops = palette.value
  if (!stops.length)
    return 'rgba(255,255,255,0.25)'

  const step = stops.length > 1 ? 100 / (stops.length - 1) : 100
  return stops
    .map((color, index) => `${color} ${(index * step).toFixed(2)}%`)
    .join(', ')
})

const containerClass = computed(() =>
  `${props.class} tuff-showcase-container`.trim(),
)

const containerStyle = computed(() => ({
  '--showcase-stops': gradientStops.value,
  '--showcase-speed': `${props.speed}ms`,
  '--showcase-border-width': `${props.thickness}px`,
  '--showcase-radius': `${props.radius}px`,
  '--showcase-surface': props.background,
  '--showcase-glow-blur': `${props.glowBlur}px`,
}))
</script>

<template>
  <div
    :class="containerClass"
    :style="containerStyle"
  >
    <div class="tuff-showcase-container__glow" aria-hidden="true" />
    <div class="tuff-showcase-container__inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@property --showcase-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.tuff-showcase-container {
  --showcase-angle: 0deg;
  --showcase-stops: #ff6bcb, #ffa63f, #fffb7d, #38f9d7, #4776e6, #b967ff, #ff6bcb;
  --showcase-speed: 18000ms;
  --showcase-border-width: 2px;
  --showcase-radius: 24px;
  --showcase-surface: rgba(9, 13, 27, 0.78);
  --showcase-glow-blur: 72px;

  position: relative;
  display: inline-flex;
  flex-direction: column;
  width: fit-content;
  max-width: 100%;
  isolation: isolate;
  overflow: hidden;
  border-radius: var(--showcase-radius);
  padding: var(--showcase-border-width);
  background: conic-gradient(from var(--showcase-angle), var(--showcase-stops));
  animation: rotate-border var(--showcase-speed) linear infinite;
  box-shadow:
    0 24px 80px rgba(15, 19, 39, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.tuff-showcase-container__inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  border-radius: calc(var(--showcase-radius) - var(--showcase-border-width));
  background: var(--showcase-surface);
  background-image:
    radial-gradient(120% 120% at 15% 0%, rgba(255, 255, 255, 0.24), transparent 55%),
    radial-gradient(140% 140% at 85% 10%, rgba(164, 215, 255, 0.32), transparent 62%),
    linear-gradient(150deg, rgba(32, 48, 112, 0.52), rgba(17, 24, 56, 0.35));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.06),
    inset 0 -12px 32px rgba(2, 8, 20, 0.65),
    inset 0 20px 36px rgba(82, 115, 255, 0.18);
  box-sizing: border-box;
  backdrop-filter: blur(18px) saturate(120%);
}

.tuff-showcase-container__inner::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.28), transparent 40%),
    radial-gradient(220% 80% at 50% 0%, rgba(255, 255, 255, 0.32), transparent 60%);
  mix-blend-mode: screen;
  opacity: 0.65;
  z-index: 1;
}

.tuff-showcase-container__inner::after {
  content: '';
  position: absolute;
  inset: 1px;
  pointer-events: none;
  border-radius: calc(var(--showcase-radius) - var(--showcase-border-width) - 1px);
  background: radial-gradient(160% 100% at 50% 20%, rgba(255, 255, 255, 0.08), transparent 60%);
  mix-blend-mode: overlay;
  opacity: 0.35;
  z-index: 0;
}

.tuff-showcase-container__glow {
  position: absolute;
  inset: -40%;
  z-index: 0;
  pointer-events: none;
  background: conic-gradient(from var(--showcase-angle), var(--showcase-stops));
  opacity: 0.55;
  filter: blur(var(--showcase-glow-blur));
  mix-blend-mode: screen;
}

@keyframes rotate-border {
  to {
    --showcase-angle: 1turn;
  }
}
</style>
