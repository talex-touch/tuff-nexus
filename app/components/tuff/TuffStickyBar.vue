<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap } from 'gsap'

type StickyState = 'idle' | 'active' | 'leaving'

const sentinelRef = ref<HTMLElement | null>(null)
const barRef = ref<HTMLElement | null>(null)
const state = ref<StickyState>('idle')

let observer: IntersectionObserver | null = null
let leaveTimeout: ReturnType<typeof setTimeout> | undefined
let motionCleanup: (() => void) | null = null
let reduceMotion = false
let activeTimeline: gsap.core.Timeline | null = null

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

const killActiveTimeline = () => {
  if (activeTimeline) {
    activeTimeline.kill()
    activeTimeline = null
  }
}

const playEnter = (target: HTMLElement) => {
  killActiveTimeline()

  if (reduceMotion) {
    gsap.set(target, {
      y: 0,
      scale: 1,
      opacity: 1,
      '--sticky-bar-blur': '0px',
      visibility: 'visible',
      pointerEvents: 'auto',
    })
    return
  }

  activeTimeline = gsap.timeline({
    onComplete: () => {
      gsap.set(target, { willChange: 'auto' })
      activeTimeline = null
    },
  })

  activeTimeline
    .set(target, {
      visibility: 'visible',
      pointerEvents: 'auto',
      willChange: 'transform, opacity, filter',
      opacity: 1,
    })
    .fromTo(target,
      {
        y: 104,
        scale: 0.8,
        opacity: 0,
        '--sticky-bar-blur': '26px',
      },
      {
        duration: 0.48,
        y: -18,
        scale: 1.14,
        opacity: 1,
        '--sticky-bar-blur': '10px',
        ease: 'power3.out',
      })
    .to(target, {
      duration: 0.26,
      y: 14,
      scale: 0.9,
      '--sticky-bar-blur': '4px',
      ease: 'power2.inOut',
    })
    .to(target, {
      duration: 0.52,
      y: 0,
      scale: 1,
      '--sticky-bar-blur': '0px',
      ease: 'elastic.out(1, 0.74)',
    })
}

const playExit = (target: HTMLElement) => {
  killActiveTimeline()

  if (reduceMotion) {
    gsap.set(target, {
      y: 0,
      scale: 1,
      opacity: 0,
      '--sticky-bar-blur': '0px',
      visibility: 'hidden',
      pointerEvents: 'none',
    })
    return
  }

  activeTimeline = gsap.timeline({
    onComplete: () => {
      gsap.set(target, {
        visibility: 'hidden',
        pointerEvents: 'none',
        y: 0,
        scale: 1,
        opacity: 0,
        '--sticky-bar-blur': '24px',
        willChange: 'auto',
      })
      activeTimeline = null
    },
  })

  activeTimeline
    .set(target, {
      pointerEvents: 'none',
      willChange: 'transform, opacity, filter',
    })
    .to(target, {
      duration: 0.2,
      y: -10,
      scale: 1.05,
      '--sticky-bar-blur': '12px',
      ease: 'power1.out',
    })
    .to(target, {
      duration: 0.4,
      y: 92,
      scale: 0.82,
      opacity: 0,
      '--sticky-bar-blur': '26px',
      ease: 'power3.in',
    })
}

const setupMotionPreference = () => {
  if (typeof window === 'undefined' || !('matchMedia' in window))
    return

  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduceMotion = media.matches

  const update = (event: MediaQueryListEvent) => {
    reduceMotion = event.matches
  }

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', update)
    motionCleanup = () => media.removeEventListener('change', update)
  }
  else {
    media.addListener(update)
    motionCleanup = () => media.removeListener(update)
  }
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
  setupMotionPreference()
})

watch(sentinelRef, (el) => {
  if (!el)
    return
  initObserver(el)
})

watch(state, async (value) => {
  if (value === 'idle')
    return

  await nextTick()
  const bar = barRef.value
  if (!bar)
    return

  if (value === 'active')
    playEnter(bar)
  else if (value === 'leaving')
    playExit(bar)
}, { flush: 'post' })

onBeforeUnmount(() => {
  observer?.disconnect()
  clearLeaveTimeout()
  motionCleanup?.()
  killActiveTimeline()
  if (barRef.value)
    gsap.killTweensOf(barRef.value)
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
    ref="barRef"
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
  bottom: 10vh;
  display: flex;
  justify-content: center;
  width: min(90vw, 480px);
  transform: translateX(-50%);
  opacity: 0;
  --sticky-bar-blur: 24px;
  filter: blur(var(--sticky-bar-blur));
  pointer-events: none;
  visibility: hidden;
  color: #4bd77d;
  z-index: 40;
}

.TuffStickyBar.is-active {
  pointer-events: auto;
  visibility: visible;
}

.TuffStickyBar.is-leaving {
  pointer-events: none;
  visibility: visible;
}

.TuffStickyBar__inner {
  backdrop-filter: blur(6px);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
}
</style>
