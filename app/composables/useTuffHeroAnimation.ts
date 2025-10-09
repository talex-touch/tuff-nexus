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
  bodyOriginalBackground: string | null
  hasBannerInitialReveal: boolean
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
    bodyOriginalBackground: null,
    hasBannerInitialReveal: false,
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

      state.gsapInstance.set(heroEl, { clearProps: 'height,minHeight,overflow,borderRadius,transform,width,marginLeft,marginRight,backgroundColor' })
      if (bannerEl)
        state.gsapInstance.set(bannerEl, { clearProps: 'transform,opacity' })
      if (canvasEl)
        state.gsapInstance.set(canvasEl, { clearProps: 'transform,opacity' })

      if (state.headerElement) {
        state.headerElement.dataset.state = 'hidden'
        state.gsapInstance.set(state.headerElement, { opacity: 0, yPercent: -100, pointerEvents: 'none' })
      }

      if (revealTargets.length)
        state.gsapInstance.set(revealTargets, { opacity: state.hasBannerInitialReveal ? 1 : 0, y: state.hasBannerInitialReveal ? 0 : 36 })
      if (highlightCards.length)
        state.gsapInstance.set(highlightCards, { opacity: state.hasBannerInitialReveal ? 1 : 0, y: state.hasBannerInitialReveal ? 0 : 24 })
      if (bannerEl) {
        state.gsapInstance.set(bannerEl, {
          transformOrigin: 'center center',
          scale: 1.08,
          opacity: state.hasBannerInitialReveal ? 1 : 0,
        })
      }
      if (canvasEl)
        state.gsapInstance.set(canvasEl, { opacity: state.hasBannerInitialReveal ? 1 : 0 })

      const viewportHeight = window.innerHeight
      const targetHeight = viewportHeight * 0.85
      const naturalHeight = measureCompactHeight(heroEl)
      const compactHeight = Math.min(
        viewportHeight,
        Math.max(targetHeight, naturalHeight),
      )
      const shouldScaleDown = window.innerWidth >= 1024
      const scrollDistance = Math.max(viewportHeight * 1.05, compactHeight + 320)

      applyHeroState('expanded')
      state.gsapInstance.set(heroEl, {
        height: viewportHeight,
        minHeight: viewportHeight,
        borderRadius: 0,
        overflow: 'hidden',
        transformOrigin: 'center top',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#000',
        scale: 1,
      })

      state.heroTimeline = state.gsapInstance.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
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
          height: viewportHeight,
          borderRadius: 0,
          width: '100%',
          scale: 1,
        },
        {
          height: compactHeight,
          borderRadius: '3rem',
          scale: shouldScaleDown ? 0.85 : 1,
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

      if (bannerEl && !state.hasBannerInitialReveal) {
        state.gsapInstance.to(
          bannerEl,
          { opacity: 1, duration: 0.4, delay: 0.2, ease: 'power1.out' },
        )
      }

      if (canvasEl && !state.hasBannerInitialReveal) {
        state.gsapInstance.to(
          canvasEl,
          { opacity: 1, duration: 0.4, delay: 0.2, ease: 'power1.out' },
        )
      }

      if (revealTargets.length && !state.hasBannerInitialReveal) {
        state.gsapInstance.to(
          revealTargets,
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: 'power2.out',
            delay: 0.32,
          },
        )
      }

      if (highlightCards.length && !state.hasBannerInitialReveal) {
        state.gsapInstance.to(
          highlightCards,
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power2.out',
            delay: 0.44,
          },
        )
      }

      if (!state.hasBannerInitialReveal)
        state.hasBannerInitialReveal = true

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

    if (typeof document !== 'undefined') {
      const body = document.body
      if (!state.bodyOriginalBackground)
        state.bodyOriginalBackground = body.style.backgroundColor || ''
      body.style.backgroundColor = '#000'
    }

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
      state.gsapInstance.set(heroSection.value, { clearProps: 'height,minHeight,overflow,borderRadius,width,marginLeft,marginRight,transform,backgroundColor' })
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
    if (typeof document !== 'undefined' && state.bodyOriginalBackground !== null)
      document.body.style.backgroundColor = state.bodyOriginalBackground
  })

  return {
    heroSection,
  }
}
