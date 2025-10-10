export default {
  nav: {
    home: 'Home',
    docs: 'Docs',
    api: 'API',
    marketplace: 'Marketplace',
    about: 'About',
    qa: 'Q & A',
  },
  landing: {
    hero: {
      badge: 'Beta Preview',
      description:
        'A strong adaptation more platform all-tool program that elevates your desktop into a responsive, intelligent control center.',
      primaryCta: 'Download Beta',
      secondaryCta: 'Explore Docs',
      offlineNotice: 'You are offline. Search and live previews will resume when the network is back.',
      stats: {
        commands: {
          value: '2M+',
          label: 'Commands automated',
        },
        response: {
          value: '48 ms',
          label: 'Average response',
        },
        layouts: {
          value: '120+',
          label: 'Workspace layouts',
        },
      },
      highlightLabel: 'Platform Highlights',
      highlights: {
        integrations: {
          title: 'Native integrations',
          description: 'Aligns with system automation, launchers, and voice control out of the box.',
        },
        workspace: {
          title: 'Workspace DNA',
          description: 'Curate dashboards, scripts, and messaging in a single adaptive surface.',
        },
        focus: {
          title: 'Realtime focus',
          description: 'Ambient cues keep the most important signals one glance away.',
        },
      },
    },
    features: {
      badge: 'Why Choose Tuff',
      title: 'More than imagination.',
      description:
        'Depend on smart orchestration, responsive visuals, and tooling that scales with your ambitions.',
      items: {
        innovativeDesign: {
          title: 'Innovative Design',
          description:
            'A modern interface with cinematic motion that highlights the content you need while reducing visual noise.',
        },
        lightningFast: {
          title: 'Lightning Fast',
          description:
            'Launch instantly, orchestrate tasks, and pivot between workspaces without dropping a single frame.',
        },
        secureReliable: {
          title: 'Secure & Reliable',
          description:
            'End-to-end encrypted channels keep your ideas safe while redundancy protects every sync.',
        },
        crossPlatform: {
          title: 'Cross-Platform',
          description:
            'Stay in the flow across desktop environments with pixel-perfect parity and native gestures.',
        },
        extensible: {
          title: 'Extensible',
          description:
            'Craft behaviours with a flexible plugin API and extension lifecycle tooling built for teams.',
        },
        customizable: {
          title: 'Customizable',
          description:
            'Dial in colour, layout, and automation so every workspace mirrors your personal rhythm.',
        },
      },
    },
    extensions: {
      badge: 'Extensible Platform',
      title: 'Scale from lightweight plugins to full workspace extensions.',
      description:
        'Polyglot tooling to grow from helpers to deep integrations. Every capability is designed for composability, performance, and effortless deployment across Tuff environments.',
      cta: 'Explore Marketplace',
      items: {
        lightweight: {
          title: 'Lightweight Plugins',
          description:
            'Ship focused utilities in minutes. Toggle and evolve them without shipping a full release.',
        },
        heavyweight: {
          title: 'Heavyweight Extensions',
          description:
            'Transform navigation, panels, or data views with workspace-aware extensions and deep hooks.',
        },
        integration: {
          title: 'Seamless Integration',
          description:
            'Dial in the command palette, launcher, and automation stack without sacrificing performance.',
        },
        developer: {
          title: 'Developer Friendly',
          description:
            'Structured SDK, blazing-fast reloads, and precise diagnostics make iteration effortless.',
        },
      },
    },
    testing: {
      badge: 'Pioneer Testing',
      title: 'Join the early access community shaping Tuff.',
      description:
        'Validate new integrations, stress-test automation, and keep every release stable with the Pioneer Testing Program.',
      items: {
        alpha: {
          tag: 'Alpha Flight',
          title: 'Early access builds',
          description:
            'Preview new capabilities, leave feedback in real time, and influence the next stable release.',
        },
        touch: {
          tag: 'Touch Lab',
          title: 'Scenario automation',
          description:
            'Record complex flows, attach assertions, and replay across builds with zero setup.',
        },
        shield: {
          tag: 'Shield',
          title: 'Stability guarantees',
          description:
            'Every milestone goes through multi-platform verification, performance benchmarking, and regression sweeps.',
        },
      },
    },
    finalCta: {
      title: 'Ready to explore the Tuff ecosystem?',
      description:
        'Build immersive desktop experiences with a platform that amplifies creators, operators, and teams who ship fast.',
      primary: 'Browse Documentation',
      secondary: 'Talk with the team',
    },
  },
  docs: {
    loading: 'Loading document…',
    notFoundTitle: 'Document not found',
    notFoundDescription: 'We could not find content for this route yet. Head back to the docs overview.',
    backHome: 'Back to docs home',
    redirecting: 'Redirecting to the docs landing…',
  },
  docsNav: {
    start: 'Get started',
  },
  docsSidebar: {
    error: 'Navigation failed to load. Please try again.',
  },
} as const

