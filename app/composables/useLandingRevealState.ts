import { onBeforeUnmount, type Ref } from 'vue'
import { useState } from '#imports'

interface LandingRevealTimings {
  mask: number
  content: number
  interactive: number
  header: number
}

const DEFAULT_TIMINGS: LandingRevealTimings = {
  mask: 900,
  content: 1600,
  interactive: 2300,
  header: 3200,
}

function isClient() {
  return typeof window !== 'undefined'
}

function schedule(timers: Ref<number[]>, delay: number, callback: () => void) {
  if (!isClient())
    return

  const id = window.setTimeout(() => {
    try {
      callback()
    }
    finally {
      const next = timers.value.filter(timerId => timerId !== id)
      timers.value = next
    }
  }, delay)

  timers.value = [...timers.value, id]
}

function clearTimers(timers: Ref<number[]>) {
  if (!isClient())
    return

  timers.value.forEach(timerId => window.clearTimeout(timerId))
  timers.value = []
}

export function useLandingRevealState() {
  const sequenceStarted = useState('landing-reveal-sequence-started', () => false)
  const maskProgress = useState('landing-reveal-mask-progress', () => 0)
  const contentVisible = useState('landing-reveal-content-visible', () => false)
  const interactiveReady = useState('landing-reveal-interactive-ready', () => false)
  const headerVisible = useState('landing-reveal-header-visible', () => false)
  const timers = useState('landing-reveal-timers', () => [] as number[])

  const resetSequence = () => {
    clearTimers(timers)
    sequenceStarted.value = false
    maskProgress.value = 0
    contentVisible.value = false
    interactiveReady.value = false
    headerVisible.value = false
  }

  const beginSequence = (timings: Partial<LandingRevealTimings> = {}) => {
    if (sequenceStarted.value)
      return

    sequenceStarted.value = true
    maskProgress.value = 0
    contentVisible.value = false
    interactiveReady.value = false
    headerVisible.value = false

    if (!isClient())
      return

    const merged: LandingRevealTimings = {
      ...DEFAULT_TIMINGS,
      ...timings,
    }

    // Slight delay so layout paints before we apply transitions
    window.requestAnimationFrame(() => {
      schedule(timers, merged.mask, () => {
        maskProgress.value = 1
      })

      schedule(timers, merged.content, () => {
        contentVisible.value = true
      })

      schedule(timers, merged.interactive, () => {
        interactiveReady.value = true
      })

      schedule(timers, merged.header, () => {
        headerVisible.value = true
      })
    })
  }

  onBeforeUnmount(() => {
    if (!sequenceStarted.value || headerVisible.value)
      return
    clearTimers(timers)
  })

  return {
    beginSequence,
    resetSequence,
    sequenceStarted,
    maskProgress,
    contentVisible,
    interactiveReady,
    headerVisible,
  }
}
