<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type StickyState = 'idle' | 'active' | 'leaving'

const sentinelRef = ref<HTMLElement | null>(null)
const state = ref<StickyState>('idle')

let observer: IntersectionObserver | null = null
let leaveTimeout: ReturnType<typeof setTimeout> | undefined

const isActive = computed(() => state.value === 'active')
const isLeaving = computed(() => state.value === 'leaving')
const shouldRender = computed(() => state.value !== 'idle')

const LEAVE_DURATION = 620

function clearLeaveTimeout() {
  if (leaveTimeout !== undefined) {
    clearTimeout(leaveTimeout)
    leaveTimeout = undefined
  }
}

function scheduleLeave() {
  clearLeaveTimeout()
  state.value = 'leaving'
  leaveTimeout = setTimeout(() => {
    if (state.value === 'leaving')
      state.value = 'idle'

    clearLeaveTimeout()
  }, LEAVE_DURATION)
}

const intersectionHandler: IntersectionObserverCallback = (entries) => {
  const [entry] = entries
  if (!entry)
    return

  if (entry.isIntersecting) {
    clearLeaveTimeout()
    state.value = 'active'
  }
  else if (state.value === 'active') {
    scheduleLeave()
  }
}

function initObserver(target: HTMLElement | null) {
  if (!target || typeof window === 'undefined')
    return

  if (!('IntersectionObserver' in window)) {
    state.value = 'active'
    return
  }

  observer?.disconnect()
  observer = new IntersectionObserver(intersectionHandler, {
    threshold: 0.05,
  })
  observer.observe(target)
}

onMounted(() => {
  initObserver(sentinelRef.value)
})

watch(sentinelRef, (el) => {
  if (!el)
    return
  initObserver(el)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  clearLeaveTimeout()
})
</script>

<template>
  <div
    ref="sentinelRef"
    aria-hidden="true"
    class="tuff-sticky-anchor"
  />

  <div
    v-if="shouldRender"
    class="TuffStickyBar"
    :class="{
      'is-active': isActive,
      'is-leaving': isLeaving,
    }"
  >
    <span class="TuffStickyBar__inner letter-spacing-1 rounded-full bg-gray px-6 py-4 font-bold dark:bg-[#262626]">
      <slot />
    </span>
  </div>
</template>

<style scoped>
.tuff-sticky-anchor {
  display: block;
  height: 1px;
  margin-top: -1px;
  pointer-events: none;
  opacity: 0;
}

.TuffStickyBar {
  position: fixed;
  left: 50%;
  bottom: 2.5vh;
  display: flex;
  justify-content: center;
  width: min(90vw, 480px);
  transform: translate3d(-50%, 96px, 0) scale(0.8);
  opacity: 0;
  filter: blur(28px);
  pointer-events: none;
  visibility: hidden;
  color: #4bd77d;
  z-index: 40;
  will-change: transform, opacity, filter;
}

.TuffStickyBar.is-active {
  pointer-events: auto;
  visibility: visible;
  animation: sticky-bar-enter 0.94s cubic-bezier(0.25, 1.15, 0.45, 1) forwards;
}

.TuffStickyBar.is-leaving {
  pointer-events: none;
  visibility: visible;
  animation: sticky-bar-exit 0.6s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

.TuffStickyBar__inner {
  backdrop-filter: blur(6px);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
}

@keyframes sticky-bar-enter {
  0% {
    transform: translate3d(-50%, 110px, 0) scale(0.74);
    opacity: 0;
    filter: blur(32px);
  }

  46% {
    transform: translate3d(-50%, -18px, 0) scale(1.14);
    opacity: 1;
    filter: blur(12px);
  }

  68% {
    transform: translate3d(-50%, 16px, 0) scale(0.9);
    filter: blur(5px);
  }

  82% {
    transform: translate3d(-50%, -6px, 0) scale(1.06);
    filter: blur(2px);
  }

  100% {
    transform: translate3d(-50%, 0, 0) scale(1);
    opacity: 1;
    filter: blur(0);
  }
}

@keyframes sticky-bar-exit {
  0% {
    transform: translate3d(-50%, 0, 0) scale(1);
    opacity: 1;
    filter: blur(0);
  }

  28% {
    transform: translate3d(-50%, -10px, 0) scale(1.05);
    filter: blur(10px);
  }

  48% {
    transform: translate3d(-50%, 8px, 0) scale(0.92);
    opacity: 0.6;
    filter: blur(14px);
  }

  100% {
    transform: translate3d(-50%, 96px, 0) scale(0.78);
    opacity: 0;
    filter: blur(26px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .TuffStickyBar,
  .TuffStickyBar.is-active,
  .TuffStickyBar.is-leaving {
    animation: none;
    transform: translate3d(-50%, 0, 0) scale(1);
    filter: none;
    opacity: 1;
  }
}
</style>
