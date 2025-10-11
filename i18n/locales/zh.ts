export default {
  nav: {
    home: '首页',
    docs: '文档',
    api: 'API',
    marketplace: '组件市场',
    about: '关于',
    qa: '问答',
    developers: '开发者',
  },
  ui: {
    languageToggle: {
      zhLabel: '中文',
      enLabel: 'English',
      switchToZh: '切换语言到中文',
      switchToEn: '切换语言到英文',
    },
  },
  landing: {
    hero: {
      badge: 'Beta 预览',
      description: '一套强大的多平台工具计划，让你的桌面化身为响应迅速的智能控制中心。',
      primaryCta: '下载 Beta',
      secondaryCta: '浏览文档',
      offlineNotice: '当前处于离线状态，搜索与即时预览将在网络恢复后自动启用。',
      stats: {
        commands: {
          value: '2M+',
          label: '自动化指令',
        },
        response: {
          value: '48 ms',
          label: '平均响应',
        },
        layouts: {
          value: '120+',
          label: '工作区布局',
        },
      },
      highlightLabel: '平台亮点',
      highlights: {
        integrations: {
          title: '原生集成',
          description: '开箱即配合系统自动化、启动器和语音控制。',
        },
        workspace: {
          title: '工作区 DNA',
          description: '在一个自适应界面中管理仪表盘、脚本与通信。',
        },
        focus: {
          title: '实时聚焦',
          description: '环境提示让关键信号始终触手可及。',
        },
      },
    },
    os: {
      aiSpotlight: {
        eyebrow: 'AI 核心体验',
        headline: '一处搜索，万物互联。',
        subheadline: '它不止是查找，更是理解。',
        demo: {
          queryLabel: '自然语言查询',
          queryText: '“给我看看 Sarah 上周分享的设计稿。”',
          summary: 'Tuff 读懂意图，将所有相关内容汇聚在一个沉静而鲜活的结果集中。',
          results: [
            {
              icon: 'i-carbon-logo-figma',
              title: 'Figma · 核心布局改版',
              meta: 'Sarah M. 分享 · 2 天前更新',
            },
            {
              icon: 'i-carbon-document',
              title: '本地文件 · brand-refresh.sketch',
              meta: '桌面 › Campaigns',
            },
            {
              icon: 'i-carbon-email',
              title: 'Gmail · “最新的页头迭代”',
              meta: '来自 Sarah · 周一 9:14',
            },
            {
              icon: 'i-carbon-logo-slack',
              title: '#brand-refresh · “正在附上最终导出。”',
              meta: 'Slack · 与 design-pod 的线程',
            },
          ],
        },
        highlights: [
          {
            title: '理解上下文',
            copy: '意图解析贯穿人物、工具与时间轴，让你告别来回翻找标签页。',
          },
          {
            title: '打破信息孤岛',
            copy: '设计、文件、对话与任务在同一窗口连续呈现。',
          },
          {
            title: '跟随你的节奏',
            copy: '动画克制而有节奏，始终把注意力留给真正重要的内容。',
          },
        ],
      },
      extensibility: {
        eyebrow: '能力中心',
        headline: '为你的世界，专属打造。',
        subheadline: 'Tuff 的强大，延伸至你常用的每个工具。',
        addLabel: '+ 添加',
        addedLabel: '已添加',
        capabilities: [
          {
            id: 'notion',
            icon: 'i-carbon-logo-notion',
            name: 'Notion',
            description: '一键召回文档、会议纪要和项目枢纽。',
          },
          {
            id: 'figma',
            icon: 'i-carbon-logo-figma',
            name: 'Figma',
            description: '即刻预览画板、同步组件与设计令牌。',
          },
          {
            id: 'github',
            icon: 'i-carbon-logo-github',
            name: 'GitHub',
            description: '在指令栏完成 PR 审查、差异对比与流程触发。',
          },
          {
            id: 'vscode',
            icon: 'i-carbon-logo-vscode',
            name: 'VS Code',
            description: '不中断专注即可切换工作区、运行脚本与查看诊断。',
          },
          {
            id: 'calendar',
            icon: 'i-carbon-calendar',
            name: 'Google 日历',
            description: '查看即将开始的仪式，快速预留专注时段并即时回复。',
          },
          {
            id: 'spotify',
            icon: 'i-carbon-logo-spotify',
            name: 'Spotify',
            description: '用自适应音景为专注时段增添节奏。',
          },
        ],
      },
      openFoundation: {
        eyebrow: '开放基石',
        headline: '开放打造，献给创造者。',
        subheadline: '透明内核、模块化工具链，与共创未来的开发者社区。',
        pillars: [
          {
            icon: 'i-carbon-certificate-check',
            title: '透明内核',
            copy: '可审计的运行时，每一次决策都清晰可循，放心分叉平台。',
          },
          {
            icon: 'i-carbon-cube',
            title: '模块化 SDK',
            copy: '类型安全 API、沙箱与签名管线，让拓展轻松顺手。',
          },
          {
            icon: 'i-carbon-collaborate',
            title: '活力社区',
            copy: '与先锋同行，共同审阅 manifest，在公开协作中推动平台进化。',
          },
        ],
        footnote: '我们构建的一切均有文档与版本记录，随时欢迎你的 Pull Request。',
      },
      proactive: {
        eyebrow: '情境智能',
        headline: '先你一步，懂你所需。',
        subheadline: 'Tuff 智能核心登场。端侧运行，守护隐私，深度感知你的语境。',
        shieldLabel: '端侧 AI · 隐私至上',
        scenarios: [
          {
            id: 'developer',
            icon: 'i-carbon-code',
            tab: '开发者 · VS Code',
            title: '选中任意 import，Tuff 预判你需要的文档。',
            copy: '内联推荐精准打开参考、示例代码与最新变更记录。',
            action: '打开 FlowScript API 参考',
          },
          {
            id: 'designer',
            icon: 'i-carbon-brush-freehand',
            tab: '设计师 · Figma',
            title: '选中图层时，情境动作即时浮现。',
            copy: '导出预设、CSS 令牌与无障碍检查一并呈现，毫不停顿。',
            action: '导出图层 PNG · 复制 CSS',
          },
          {
            id: 'zero',
            icon: 'i-carbon-sail-boat',
            tab: '零输入',
            title: '唤出 Tuff，你的下一步已准备就绪。',
            copy: '近期文件、会议与自动化场景依照你的节奏井然呈现。',
            action: '继续 “Launch Prep” 工作区 · 加入 Daily Sync',
          },
        ],
      },
      craftsmanship: {
        eyebrow: '工艺与细节',
        headline: '每一处细节，都已升华。',
        subheadline: '行云流水的体验，源自对基础的极致雕琢。',
        clips: [
          {
            id: 'system',
            tag: '系统控制',
            title: '“深色模式” 指令瞬间切换全局。',
            copy: '即便编排系统级切换，动画仍保持 120fps 的丝滑顺畅。',
          },
          {
            id: 'clipboard',
            tag: '剪贴板胶片库',
            title: '历史记录化身沉浸式胶片流。',
            copy: '图像、色板与文本预览以柔和视差呈现，一眼锁定所需内容。',
          },
          {
            id: 'performance',
            tag: '延迟实验室',
            title: '唤起 Tuff，零延迟，零多余动作。',
            copy: '从按键到呈现平均 18ms，并沿用文档动效同款调校。',
          },
        ],
      },
      pioneer: {
        eyebrow: '先锋计划',
        headline: '未来的工作方式，即将到来。成为第一位塑造者。',
        subheadline: '加入 Tuff 先锋计划。抢先体验、共同构建，定义下一代效率工具。',
        formTitle: '申请先锋资格',
        cta: '申请先锋资格',
        benefitsTitle: '专属先锋权益',
        benefits: [
          {
            title: '抢先体验',
            copy: '在正式发布前预览每一个前沿版本。',
          },
          {
            title: '影响产品',
            copy: '与核心团队直接对话，你的反馈将塑造产品路线。',
          },
          {
            title: '专属社区',
            copy: '参加专属交流、办公时段，并在平台内获得身份标识。',
          },
        ],
        privacy: '你的邮箱仅用于先锋计划的邀请与更新通知。',
      },
    },
    features: {
      badge: '为什么选择 Tuff',
      title: '比想象更进一步。',
      description: '依托智能编排、响应式视觉与可随团队野心扩展的工具。',
      items: {
        innovativeDesign: {
          title: '创新设计',
          description: '具备影院级动效的现代界面，在弱化噪点的同时突出关键信息。',
        },
        lightningFast: {
          title: '闪电般迅捷',
          description: '即刻启动、编排任务、切换工作区而不丢帧。',
        },
        secureReliable: {
          title: '安全可靠',
          description: '端到端加密通道守护创意，冗余机制守护每次同步。',
        },
        crossPlatform: {
          title: '跨平台',
          description: '跨桌面环境保持一致体验与原生手势。',
        },
        extensible: {
          title: '高度可扩展',
          description: '通过灵活插件 API 与团队化扩展生命周期工具定制行为。',
        },
        customizable: {
          title: '自由定制',
          description: '调校色彩、布局与自动化，让工作区贴合个人节奏。',
        },
      },
    },
    extensions: {
      badge: '可扩展平台',
      title: '从轻量插件扩展至完整工作区能力。',
      description: '多语言工具链助力从辅助插件到深度集成，每项能力都为可组合性、性能与轻松部署而设计。',
      cta: '浏览组件市场',
      items: {
        lightweight: {
          title: '轻量插件',
          description: '几分钟内交付专用工具，随时启用并迭代，无需完整发布流程。',
        },
        heavyweight: {
          title: '重量级扩展',
          description: '通过工作区感知扩展与深度钩子改造导航、面板或数据视图。',
        },
        integration: {
          title: '无缝集成',
          description: '调校命令面板、启动器与自动化栈，同时保持性能。',
        },
        developer: {
          title: '开发者友好',
          description: '结构化 SDK、极速热重载与精确诊断让迭代轻松自如。',
        },
      },
    },
    testing: {
      badge: '先锋测试',
      title: '加入共塑 Tuff 的抢先体验社区。',
      description: '通过先锋测试计划验证新集成、压力测试自动化，确保每次发布稳定。',
      items: {
        alpha: {
          tag: 'Alpha 航队',
          title: '抢先体验构建',
          description: '抢先预览新能力，实时反馈，影响下一版稳定发布。',
        },
        touch: {
          tag: 'Touch Lab',
          title: '场景自动化',
          description: '记录复杂流程、附加断言并零配置复播于不同构建。',
        },
        shield: {
          tag: 'Shield',
          title: '稳定性保障',
          description: '每个里程碑都历经多平台验证、性能基准与回归扫描。',
        },
      },
    },
    finalCta: {
      title: '准备好探索 Tuff 生态了吗？',
      description: '用一个放大创作者、运营者与高效团队的平台，打造沉浸式桌面体验。',
      primary: '浏览文档',
      secondary: '与团队交流',
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
} as const
