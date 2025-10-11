export default {
  nav: {
    home: 'Home',
    docs: 'Docs',
    api: 'API',
    marketplace: 'Marketplace',
    about: 'About',
    qa: 'Q & A',
    developers: 'Developers',
  },
  ui: {
    languageToggle: {
      zhLabel: '中文',
      enLabel: 'English',
      switchToZh: 'Switch language to Chinese',
      switchToEn: 'Switch language to English',
    },
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
    os: {
      aiSpotlight: {
        eyebrow: 'AI Spotlight',
        headline: 'One search. Everything, connected.',
        subheadline: "It doesn't just find. It understands.",
        demo: {
          queryLabel: 'Natural language query',
          queryText: '“Show me the design draft Sarah shared last week.”',
          summary: 'Tuff interprets intent, then fuses every relevant surface into one calm, living result set.',
          results: [
            {
              icon: 'i-carbon-logo-figma',
              title: 'Figma · Core layout revamp',
              meta: 'Shared by Sarah M. · Updated 2 days ago',
            },
            {
              icon: 'i-carbon-document',
              title: 'Local Files · brand-refresh.sketch',
              meta: 'Desktop › Campaigns',
            },
            {
              icon: 'i-carbon-email',
              title: 'Gmail · “Latest header iterations”',
              meta: 'From Sarah · Mon 9:14 AM',
            },
            {
              icon: 'i-carbon-logo-slack',
              title: '#brand-refresh · “Attaching the final export now.”',
              meta: 'Slack · Thread with design-pod',
            },
          ],
        },
        highlights: [
          {
            title: 'Understands context',
            copy: 'Intent parsing links people, tools, and time so you never sift through tabs again.',
          },
          {
            title: 'Breaks every silo',
            copy: 'Designs, files, conversations, and tasks flow back in one continuous pane.',
          },
          {
            title: 'Breathes with you',
            copy: 'Animations stay measured and calm, keeping attention on what matters most.',
          },
        ],
      },
      extensibility: {
        eyebrow: 'Capabilities Center',
        headline: 'Tailor-made for your world.',
        subheadline: "The power of Tuff, extended to every tool you use.",
        addLabel: '+ Add',
        addedLabel: 'Added',
        capabilities: [
          {
            id: 'notion',
            icon: 'i-carbon-logo-notion',
            name: 'Notion',
            description: 'Capture docs, meeting notes, and project hubs in one keystroke.',
          },
          {
            id: 'figma',
            icon: 'i-carbon-logo-figma',
            name: 'Figma',
            description: 'Preview frames, sync components, and ship design tokens instantly.',
          },
          {
            id: 'github',
            icon: 'i-carbon-logo-github',
            name: 'GitHub',
            description: 'Review pull requests, diff changes, and trigger workflows from the command bar.',
          },
          {
            id: 'vscode',
            icon: 'i-carbon-logo-vscode',
            name: 'VS Code',
            description: 'Jump between workspaces, run scripts, and surface diagnostics without breaking flow.',
          },
          {
            id: 'calendar',
            icon: 'i-carbon-calendar',
            name: 'Google Calendar',
            description: 'See upcoming rituals, block focus time, and RSVP instantly.',
          },
          {
            id: 'spotify',
            icon: 'i-carbon-logo-spotify',
            name: 'Spotify',
            description: 'Score your focus sessions with adaptive soundtracks.',
          },
        ],
      },
      openFoundation: {
        eyebrow: 'Open by Design',
        headline: 'Built in the open. Crafted for builders.',
        subheadline: 'Transparent core, modular tooling, and a community that shapes the roadmap with you.',
        pillars: [
          {
            icon: 'i-carbon-certificate-check',
            title: 'Transparent Core',
            copy: 'Audit the runtime, trace every decision, and fork the platform with confidence.',
          },
          {
            icon: 'i-carbon-cube',
            title: 'Modular SDK',
            copy: 'Typed APIs, sandboxes, and signing pipelines so shipping your next extension feels effortless.',
          },
          {
            icon: 'i-carbon-collaborate',
            title: 'Vibrant Community',
            copy: 'Pair with pioneers, review manifests together, and keep the platform evolving out in the open.',
          },
        ],
        footnote: 'Everything we build is documented, versioned, and ready for your pull request.',
      },
      proactive: {
        eyebrow: 'Proactive Intelligence',
        headline: 'It knows what you need. Before you do.',
        subheadline: 'Introducing Tuff Intelligence. On-device, private, and deeply aware of your context.',
        shieldLabel: 'On-Device AI · Your privacy is paramount',
        scenarios: [
          {
            id: 'developer',
            icon: 'i-carbon-code',
            tab: 'Developer · VS Code',
            title: 'Select any import and Tuff suggests the docs you need.',
            copy: 'Inline recommendations open the correct reference, example snippets, and recent changelog entries.',
            action: 'Open FlowScript API reference',
          },
          {
            id: 'designer',
            icon: 'i-carbon-brush-freehand',
            tab: 'Designer · Figma',
            title: 'Contextual actions appear the moment you select a layer.',
            copy: 'Export presets, CSS tokens, and accessibility checks line up without breaking your stride.',
            action: 'Export layer as PNG · Copy CSS',
          },
          {
            id: 'zero',
            icon: 'i-carbon-sail-boat',
            tab: 'Zero Input',
            title: 'Summon Tuff and your next moves are already queued.',
            copy: 'Recent files, meetings, and automation scenes appear based on the rhythm of your day.',
            action: 'Resume “Launch Prep” workspace · Join Daily Sync',
          },
        ],
      },
      craftsmanship: {
        eyebrow: 'Craftsmanship & Utility',
        headline: 'Every detail, elevated.',
        subheadline: 'Because a seamless experience is built on a foundation of flawless fundamentals.',
        clips: [
          {
            id: 'system',
            tag: 'System control',
            title: '“Dark mode” switches everything instantly.',
            copy: 'Animations stay buttery-smooth at 120 fps, even when orchestrating OS-level changes.',
          },
          {
            id: 'clipboard',
            tag: 'Clipboard vault',
            title: 'History, reimagined as a cinematic reel.',
            copy: 'Images, palettes, and text previews hover with gentle parallax so you find the right item at a glance.',
          },
          {
            id: 'performance',
            tag: 'Latency lab',
            title: 'Invoke Tuff. Zero lag. Zero wasted motion.',
            copy: 'Keystroke to render averages 18 ms across devices, tuned in the same rig we use for docs transitions.',
          },
        ],
      },
      pioneer: {
        eyebrow: 'Pioneer Program',
        headline: 'The future of work is coming. Be the first to build it.',
        subheadline: 'Join the Tuff Pioneer Program. Get early access, shape the development, and define the next generation of productivity.',
        formTitle: 'Request Pioneer Access',
        cta: 'Request Pioneer Access',
        benefitsTitle: 'Your Pioneer perks',
        benefits: [
          {
            title: 'Early Access',
            copy: 'Preview every frontier build before the public release.',
          },
          {
            title: 'Shape the Product',
            copy: 'Work directly with the team; your feedback steers the roadmap.',
          },
          {
            title: 'Exclusive Community',
            copy: 'Access private sessions, office hours, and recognition across the platform.',
          },
        ],
        privacy: 'We use your email only to coordinate Pioneer access and updates.',
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
