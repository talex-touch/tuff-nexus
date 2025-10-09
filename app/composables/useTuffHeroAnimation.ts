import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

type ScrollTriggerClass = typeof import('gsap/ScrollTrigger')['ScrollTrigger']
type ScrollTriggerInstance = InstanceType<ScrollTriggerClass>
type TimelineWithScrollTrigger = GSAPTimeline & { scrollTrigger?: ScrollTriggerInstance | null }

export interface UseTuffHeroAnimationOptions {
  /**
   * 当滚动进度达到该值时，顶部 Header 开始显现。
   * 取值范围 0~1，默认 0.45。
   */
  headerAppearThreshold?: number
  /**
   * 当滚动进度达到该值时，外围容器 padding 开始回复到最终值。
   * 取值范围 0~1，默认 0.6。
   */
  paddingRevealThreshold?: number
}

interface InternalState {
  gsapInstance: GSAP | null
  ScrollTriggerPlugin: ScrollTriggerClass | null
  heroTimeline: TimelineWithScrollTrigger | null
  resizeRaf: number | null
  isBuilding: boolean
  shellElement: HTMLElement | null
  shellPaddingDefaults: { top: number, right: number, bottom: number, left: number } | null
  headerElement: HTMLElement | null
}

/**
 * 封装首页 WebGL 英雄区的滚动动画逻辑。
 * 返回 heroSection 引用，供组件直接绑定到 <section ref="heroSection">。
 */
export function useTuffHeroAnimation(options: UseTuffHeroAnimationOptions = {}) {
  const {
    headerAppearThreshold = 0.45,
    paddingRevealThreshold = 0.6,
  } = options

  // 英雄区根节点引用
  const heroSection = ref<HTMLElement | null>(null)

  const state: InternalState = {
    gsapInstance: null,
    ScrollTriggerPlugin: null,
    heroTimeline: null,
    resizeRaf: null,
    isBuilding: false,
    shellElement: null,
    shellPaddingDefaults: null,
    headerElement: null,
  }

  const applyHeroState = (value: 'expanded' | 'animating' | 'compact' | 'measuring') => {
    if (!heroSection.value)
      return
    heroSection.value.dataset.state = value
  }

  const measureCompactHeight = (element: HTMLElement) => {
    const previousState = element.dataset.state || 'expanded'
    element.dataset.state = 'measuring'
    const previousHeight = element.style.height
    element.style.height = ''
    const measured = element.scrollHeight
    element.style.height = previousHeight
    element.dataset.state = previousState
    return measured
  }

  const syncProgressState = (progress: number) => {
    if (progress <= 0.001)
      applyHeroState('expanded')
    else if (progress >= 0.999)
      applyHeroState('compact')
    else
      applyHeroState('animating')

    if (state.headerElement && state.gsapInstance) {
      const headerVisible = progress >= headerAppearThreshold
      state.headerElement.dataset.state = headerVisible ? 'visible' : 'hidden'
      state.gsapInstance.set(state.headerElement, { pointerEvents: headerVisible ? 'auto' : 'none' })
    }
  }

  const buildTimeline = async () => {
    const heroEl = heroSection.value
    if (!heroEl || !state.gsapInstance || state.isBuilding)
      return

    state.isBuilding = true

    try {
      await nextTick()

      const canvasEl = heroEl.querySelector<HTMLCanvasElement>('.tuff-banner-canvas')
      const bannerEl = heroEl.querySelector<HTMLElement>('.tuff-banner')
      const revealTargets = Array.from(heroEl.querySelectorAll<HTMLElement>('[data-hero-reveal]'))
      const highlightCards = Array.from(heroEl.querySelectorAll<HTMLElement>('[data-hero-highlight]'))

      state.shellElement = heroEl.closest<HTMLElement>('[data-home-shell]') ?? state.shellElement
      state.headerElement = state.headerElement ?? document.querySelector<HTMLElement>('[data-role="main-header"]')

      if (state.shellElement && !state.shellPaddingDefaults && typeof window !== 'undefined') {
        const computed = window.getComputedStyle(state.shellElement)
        state.shellPaddingDefaults = {
          top: Number.parseFloat(computed.paddingTop) || 0,
          right: Number.parseFloat(computed.paddingRight) || 0,
          bottom: Number.parseFloat(computed.paddingBottom) || 0,
          left: Number.parseFloat(computed.paddingLeft) || 0,
        }
      }

      if (state.shellElement && state.shellPaddingDefaults) {
        state.gsapInstance.set(state.shellElement, {
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
        })
      }

      if (state.heroTimeline) {
        state.heroTimeline.scrollTrigger?.kill()
        state.heroTimeline.kill()
        state.heroTimeline = null
      }

      state.gsapInstance.set(heroEl, { clearProps: 'height,overflow,borderRadius' })
      if (bannerEl)
        state.gsapInstance.set(bannerEl, { clearProps: 'transform' })
      if (canvasEl)
        state.gsapInstance.set(canvasEl, { clearProps: 'transform' })

      if (state.headerElement) {
        state.headerElement.dataset.state = 'hidden'
        state.gsapInstance.set(state.headerElement, { opacity: 0, yPercent: -100, pointerEvents: 'none' })
      }

      if (revealTargets.length)
        state.gsapInstance.set(revealTargets, { opacity: 0, y: 36 })
      if (highlightCards.length)
        state.gsapInstance.set(highlightCards, { opacity: 0, y: 24 })
      if (bannerEl)
        state.gsapInstance.set(bannerEl, { transformOrigin: 'center center', scale: 1.35 })

      applyHeroState('expanded')
      state.gsapInstance.set(heroEl, { height: window.innerHeight, borderRadius: 0, overflow: 'hidden' })

      const targetScrollHeight = () => Math.max(window.innerHeight * 1.2, measureCompactHeight(heroEl) + 320)

      state.heroTimeline = state.gsapInstance.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: () => `+=${targetScrollHeight()}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => applyHeroState('animating'),
          onLeave: () => applyHeroState('compact'),
          onEnterBack: () => applyHeroState('animating'),
          onLeaveBack: () => applyHeroState('expanded'),
          onRefresh: (self: any) => syncProgressState(self.progress),
        },
      })

      state.heroTimeline.fromTo(
        heroEl,
        {
          height: () => window.innerHeight,
          borderRadius: 0,
          overflow: 'hidden',
        },
        {
          height: () => measureCompactHeight(heroEl),
          borderRadius: '1.5rem',
        },
        0,
      )

      if (bannerEl) {
        state.heroTimeline.to(
          bannerEl,
          { scale: 1, duration: 1.2, ease: 'power3.out' },
          0,
        )
      }

      if (revealTargets.length) {
        state.heroTimeline.from(
          revealTargets,
          {
            opacity: 0,
            y: 36,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power2.out',
          },
          0.25,
        )
      }

      if (highlightCards.length) {
        state.heroTimeline.from(
          highlightCards,
          {
            opacity: 0,
            y: 24,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power2.out',
          },
          0.42,
        )
      }

      if (state.headerElement) {
        state.heroTimeline.to(
          state.headerElement,
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          headerAppearThreshold,
        )
      }

      if (state.shellElement && state.shellPaddingDefaults) {
        state.heroTimeline.to(
          state.shellElement,
          {
            paddingTop: state.shellPaddingDefaults.top,
            paddingRight: state.shellPaddingDefaults.right,
            paddingBottom: state.shellPaddingDefaults.bottom,
            paddingLeft: state.shellPaddingDefaults.left,
            duration: 0.8,
            ease: 'power2.out',
          },
          paddingRevealThreshold,
        )
      }

      state.heroTimeline.eventCallback('onUpdate', () => {
        if (!state.heroTimeline)
          return
        syncProgressState(state.heroTimeline.progress())
      })

      syncProgressState(state.heroTimeline.progress())

      state.ScrollTriggerPlugin?.refresh()
      state.heroTimeline.scrollTrigger?.update()
      syncProgressState(state.heroTimeline.progress())
    }
    finally {
      state.isBuilding = false
    }
  }

  const handleResize = () => {
    if (state.resizeRaf)
      cancelAnimationFrame(state.resizeRaf)
    state.resizeRaf = requestAnimationFrame(() => {
      applyHeroState('expanded')
      void buildTimeline()
    })
  }

  onMounted(async () => {
    if (!import.meta.client)
      return

    const [{ default: gsap }, scrollTriggerModule] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])

    const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default
    if (!ScrollTrigger)
      return

    gsap.registerPlugin(ScrollTrigger)
    state.gsapInstance = gsap
    state.ScrollTriggerPlugin = ScrollTrigger

    applyHeroState('expanded')
    await buildTimeline()
    window.addEventListener('resize', handleResize, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    if (state.resizeRaf) {
      cancelAnimationFrame(state.resizeRaf)
      state.resizeRaf = null
    }
    if (state.heroTimeline) {
      state.heroTimeline.scrollTrigger?.kill()
      state.heroTimeline.kill()
      state.heroTimeline = null
    }
    if (heroSection.value && state.gsapInstance) {
      state.gsapInstance.set(heroSection.value, { clearProps: 'height,overflow,borderRadius' })
      heroSection.value.dataset.state = 'compact'
    }
    if (state.shellElement && state.gsapInstance && state.shellPaddingDefaults) {
      state.gsapInstance.set(state.shellElement, {
        paddingTop: state.shellPaddingDefaults.top,
        paddingRight: state.shellPaddingDefaults.right,
        paddingBottom: state.shellPaddingDefaults.bottom,
        paddingLeft: state.shellPaddingDefaults.left,
      })
    }
    if (state.headerElement && state.gsapInstance) {
      state.gsapInstance.set(state.headerElement, { clearProps: 'opacity,transform,pointerEvents' })
      state.headerElement.dataset.state = 'visible'
    }
  })

  return {
    heroSection,
  }
}
