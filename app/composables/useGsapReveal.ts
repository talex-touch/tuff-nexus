import { onBeforeUnmount, onMounted, type Ref } from 'vue'

type TweenVars = import('gsap').TweenVars
type GsapContext = import('gsap').Context

interface UseGsapRevealOptions {
  /**
   * CSS selector used to grab elements inside the container.
   * Defaults to `[data-reveal]`.
   */
  targetSelector?: string
  /**
   * Base animation values passed to `gsap.from`.
   */
  from?: TweenVars
  /**
   * Whether the animation should only happen once.
   */
  once?: boolean
  /**
   * Stagger delay between each element.
   */
  stagger?: number
  /**
   * Additional ScrollTrigger configuration.
   */
  scrollTrigger?: Record<string, unknown>
}

let scrollTriggerRegistered = false

export function useGsapReveal(
  container: Ref<HTMLElement | null>,
  options: UseGsapRevealOptions = {},
) {
  let ctx: GsapContext | undefined

  onMounted(async () => {
    if (!container.value) return

    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')

    if (!scrollTriggerRegistered) {
      gsap.registerPlugin(ScrollTrigger)
      scrollTriggerRegistered = true
    }

    const fallbackFrom: TweenVars = {
      opacity: 0,
      y: 40,
      duration: 1.1,
      ease: 'power3.out',
    }

    ctx = gsap.context(() => {
      const targetSelector = options.targetSelector ?? '[data-reveal]'
      const elements = gsap.utils.toArray<HTMLElement>(targetSelector)

      if (!elements.length) return

      gsap.from(elements, {
        ...fallbackFrom,
        ...options.from,
        stagger: options.stagger ?? 0.12,
        scrollTrigger: {
          trigger: container.value,
          start: 'top 82%',
          once: options.once ?? true,
          ...options.scrollTrigger,
        },
      })
    }, container)
  })

  onBeforeUnmount(() => {
    ctx?.revert()
  })
}
