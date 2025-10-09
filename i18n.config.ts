export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
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
          badge: 'Tuff Launcher',
          title: 'Launch product docs in minutes.',
          description: 'Tuff is a minimal launcher for multilingual documentation portals. Start with a polished theme, live search, and deployment presets from day one.',
          primaryCta: 'Read the docs',
          secondaryCta: 'View on GitHub',
          offlineNotice: 'You are offline. Search and live previews will resume when the network is back.',
          deck: {
            title: 'Tuff Launcher Deck',
            items: {
              locale: {
                title: 'Locale aware routing',
                description: 'EN ↔ ZH in one content tree',
              },
              theming: {
                title: 'Light & dark tokens',
                description: 'Powered by UnoCSS design system',
              },
              deploy: {
                title: 'Ready for CI/CD',
                description: 'Ship to Pages, Netlify, Vercel',
              },
            },
          },
        },
        features: {
          title: 'Built for teams who move fast',
          description: 'Opinionated defaults keep the surface calm while leaving room for your own Vue components when you need them.',
          items: {
            workspace: {
              title: 'Zero-friction workspace',
              description: 'Spin up content collections, navigation, and SEO metadata with one command.',
            },
            theming: {
              title: 'Dual theme, dual language',
              description: 'Light and dark palettes ship alongside English and Chinese locale wiring.',
            },
            delivery: {
              title: 'Ready to ship anywhere',
              description: 'Export static assets or deploy to edge runtimes with the same configuration.',
            },
          },
        },
        workflow: {
          title: 'Launch workflow',
          description: 'How Tuff helps you ship a docs hub without wrestling boilerplate.',
          steps: {
            scope: {
              title: 'Plan',
              description: 'Collect guides, API references, and changelogs into structured content folders.',
            },
            polish: {
              title: 'Tailor',
              description: 'Drop in product imagery, adjust tokens with UnoCSS, and localize copy side by side.',
            },
            publish: {
              title: 'Launch',
              description: 'Push to your repo and let the built-in adapters publish to the CDN of your choice.',
            },
          },
        },
        kit: {
          label: 'Starter kit',
          title: 'What ships in the box',
          bullets: {
            tokens: 'UnoCSS tokens tuned for light and dark',
            content: 'Content collections wired for locale-aware docs',
            components: 'Ready-made header, sidebar, and search integrations',
          },
          marketplaceCta: 'Browse marketplace',
        },
        faq: {
          title: 'Questions we hear the most',
          description: 'Tuff stays minimal by default and expandable when you are ready.',
          items: {
            content: {
              question: 'Can we import existing Markdown?',
              answer: 'Yes. Place your files under `content/docs` and Tuff maps them into the navigation automatically.',
            },
            styling: {
              question: 'How custom can the visuals get?',
              answer: 'Extend UnoCSS tokens, swap components, or bring in your own Vue UI library without rewriting the core.',
            },
            automation: {
              question: 'Does it run in CI?',
              answer: 'Every command is CI friendly. Automate builds with GitHub Actions, Netlify, Cloudflare Pages, or custom pipelines.',
            },
          },
        },
        cta: {
          title: 'Ready to launch?',
          description: 'Clone the starter, run the setup script, and your bilingual documentation hub is online.',
          primary: 'Get started',
          secondary: 'Browse the roadmap',
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
    },
    zh: {
      nav: {
        home: '首页',
        docs: '文档',
        api: 'API',
        marketplace: '组件市场',
        about: '关于',
        qa: '问答',
      },
      landing: {
        hero: {
          badge: 'Tuff 启动器',
          title: '几分钟内上线你的产品文档。',
          description: 'Tuff 是一款为多语言文档门户设计的极简启动器，自带精致的主题、实时搜索与部署预设，让你开箱即可产出内容。',
          primaryCta: '查看文档',
          secondaryCta: '访问 GitHub',
          offlineNotice: '当前处于离线状态，搜索与即时预览将在网络恢复后自动启用。',
          deck: {
            title: 'Tuff Launcher Deck',
            items: {
              locale: {
                title: '智能语言路由',
                description: '同一内容树支持中英切换',
              },
              theming: {
                title: '明暗主题令牌',
                description: '基于 UnoCSS 的设计体系',
              },
              deploy: {
                title: 'CI/CD 即刻上线',
                description: '部署到 Pages、Netlify、Vercel',
              },
            },
          },
        },
        features: {
          title: '为行动派团队而生',
          description: '默认设计保持界面克制，同时保留与自定义 Vue 组件无缝衔接的空间。',
          items: {
            workspace: {
              title: '无摩擦工作区',
              description: '一次命令即可生成内容集合、导航结构与 SEO 元信息。',
            },
            theming: {
              title: '明暗双主题 + 中英双语',
              description: '内置浅色/深色配色与中英双语线路，让国际化一步到位。',
            },
            delivery: {
              title: '随时准备上线',
              description: '同一份配置即可导出静态资源或部署到边缘网络。',
            },
          },
        },
        workflow: {
          title: '上线流程',
          description: 'Tuff 帮你摆脱样板负担，专注在文档内容本身。',
          steps: {
            scope: {
              title: '规划',
              description: '将指南、API 参考与更新日志收敛进结构化内容目录。',
            },
            polish: {
              title: '打磨',
              description: '引入产品素材，借助 UnoCSS 调整设计令牌，并同步维护中英文文案。',
            },
            publish: {
              title: '发布',
              description: '推送到代码仓库，利用内建适配器发布到任意 CDN。',
            },
          },
        },
        kit: {
          label: '入门套件',
          title: '开箱即用的配置',
          bullets: {
            tokens: 'UnoCSS 令牌适配明暗模式',
            content: '内容集合天然支持多语言映射',
            components: '内置页头、侧边栏与搜索组件',
          },
          marketplaceCta: '前往组件市场',
        },
        faq: {
          title: '常见问题',
          description: 'Tuff 以极简为本，同时提供充分的扩展余地。',
          items: {
            content: {
              question: '现有的 Markdown 可以直接导入吗？',
              answer: '可以。将文件放到 `content/docs` 下，Tuff 会自动映射到导航结构中。',
            },
            styling: {
              question: '界面风格能否深度定制？',
              answer: '可以通过扩展 UnoCSS Token、替换组件或接入自有 Vue 组件库，无需重写核心逻辑。',
            },
            automation: {
              question: '能在 CI 中运行吗？',
              answer: '所有命令都支持 CI，可结合 GitHub Actions、Netlify、Cloudflare Pages 或自定义流水线自动化发布。',
            },
          },
        },
        cta: {
          title: '准备好上线了吗？',
          description: '克隆模板、运行初始化脚本，你的中英双语文档中心即可对外发布。',
          primary: '立即上手',
          secondary: '查看路线图',
        },
      },
      docs: {
        loading: '正在加载文档内容…',
        notFoundTitle: '未找到文档',
        notFoundDescription: '当前路径暂未匹配到内容，请返回文档首页。',
        backHome: '返回文档首页',
        redirecting: '正在跳转到文档入口…',
      },
      docsNav: {
        start: '快速上手',
      },
      docsSidebar: {
        error: '导航加载失败，请稍后再试。',
      },
    },
  },
}))
