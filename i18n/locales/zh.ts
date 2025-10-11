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
