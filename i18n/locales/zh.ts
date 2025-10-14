export default {
  nav: {
    home: '首页',
    docs: '文档',
    api: 'API',
    marketplace: '组件市场',
    about: '关于',
    qa: '问答',
    developers: '开发者',
    login: '登录',
    dashboard: '控制台',
    pricing: '订阅方案',
    market: '市场',
    doc: '文档',
    developer: '开发者',
    download: '下载',
    blog: '博客',
  },
  ui: {
    languageToggle: {
      zhLabel: '中文',
      enLabel: 'English',
      switchToZh: '切换语言到中文',
      switchToEn: '切换语言到英文',
    },
  },
  auth: {
    callbackProcessing: '正在处理登录回调，请稍候…',
    linuxdoWaitlistNotice:
      'LinuxDo 2、3 级用户可直接加入 Waitlist，无需排队等待。请使用与 LinuxDo 相同的邮箱登录，以便我们快速核验资格。',
    backToHome: '返回首页',
  },
  pricing: {
    title: '选择与你节奏匹配的订阅方案',
    subtitle: '直接通过 Clerk 完成升级，订阅后即可即时解锁高级自动化与指挥面板。',
    missingTable: '暂未配置 Pricing Table，请设置环境变量 NUXT_PUBLIC_CLERK_PRICING_TABLE_ID 后再试。',
    loading: '正在加载订阅信息…',
  },
  dashboard: {
    header: {
      badge: 'Tuff Nexus',
      defaultName: '伙伴',
      greeting: '欢迎回来，{name}',
      intro: '这里汇总了你的环境、发布与扩展状态。未来我们会在此提供自动化洞察与任务提醒。',
      docsCta: '查看文档',
      marketplaceCta: '浏览扩展',
    },
    sections: {
      overview: {
        title: '快速概览',
        items: {
          betaAccess: 'Beta 等级访问正在生效，后续将解锁更多模块。',
          releaseNotify: '订阅 Release 通知以在第一时间获得版本更新。',
          insights: '数据洞察与团队协作将在正式版开放。',
        },
      },
      nextSteps: {
        title: '下一步行动',
        items: {
          connectWorkspace: '连接你的首个工作区来解锁自动同步。',
          scheduleOnboarding: '与团队成员预约一次 Onboarding Session。',
          inviteTeammates: '邀请伙伴加入，协作即将开放多人协同。',
        },
      },
      shortcuts: {
        title: '快捷入口',
        links: {
          gettingStarted: '入门指南',
          marketplace: '扩展市场',
          developers: '开发者中心',
        },
      },
    },
  },
  landing: {
    hero: {
      badge: 'Beta 预览',
      description: '一套强大的多平台工具计划，让你的桌面化身为响应迅速的智能控制中心。',
      heading: '深厚实力，简洁呈现。',
      bullets: {
        cinematic: '电影感的指挥界面，在桌面、网页与移动端保持同步过渡。',
        policy: '策略感知的发布控制，结合签名扩展与区域化清单。',
        realtime: '实时协作，忠实呈现你的 FlowScript 与文档手册意图。',
      },
      primaryCta: '加入候补名单',
      secondaryCta: '开发者文档',
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
        summary: 'Tuff 读懂意图，将所有相关内容汇聚在一个沉静而鲜活的结果集中。',
        queryLabel: '自然语言查询',
        queryText: '“给我看看 Sarah 上周分享的设计稿。”',
        results: {
          figma: {
            title: 'Figma · 核心布局改版',
            meta: 'Sarah M. 分享 · 2 天前更新',
          },
          files: {
            title: '本地文件 · brand-refresh.sketch',
            meta: '桌面 › Campaigns',
          },
          gmail: {
            title: 'Gmail · “最新的页头迭代”',
            meta: '来自 Sarah · 周一 9:14',
          },
          slack: {
            title: '#brand-refresh · “正在附上最终导出。”',
            meta: 'Slack · 与 design-pod 的线程',
          },
        },
        highlights: {
          context: {
            title: '理解上下文',
            copy: '意图解析贯穿人物、工具与时间轴，让你告别来回翻找标签页。',
          },
          silo: {
            title: '打破信息孤岛',
            copy: '设计、文件、对话与任务在同一窗口连续呈现。',
          },
          breathe: {
            title: '跟随你的节奏',
            copy: '动画克制而有节奏，始终把注意力留给真正重要的内容。',
          },
        },
      },
      plugins: {
        eyebrow: '插件中心',
        headline: '扩展 Tuff 到你的工具',
        subheadline: '将 Tuff 连接到你的工具，扩展其功能。',
        extensions: {
          notion: {
            name: 'Notion',
            description: '一键召回文档、会议纪要和项目枢纽。',
          },
          figma: {
            name: 'Figma',
            description: '即刻预览画板、同步组件与设计令牌。',
          },
          github: {
            name: 'GitHub',
            description: '在指令栏完成 PR 审查、差异对比与流程触发。',
          },
          vscode: {
            name: 'VS Code',
            description: '不中断专注即可切换工作区、运行脚本与查看诊断。',
          },
          calendar: {
            name: 'Google Calendar',
            description: '即刻查看 upcoming rituals、阻塞专注时间与 RSVP。',
          },
          spotify: {
            name: 'Spotify',
            description: '根据你的专注会话，自适应播放音乐。',
          },
        },
      },
      aiOverview: {
        eyebrow: 'AI 专项',
        headline: '为你的工作节奏量身打造的智能核心。',
        subheadline: '代理、检索与自动化在 Tuff 内部自然编排。',
        hero: {
          title: '嵌入指令面的智能助手。',
          copy: '唤起情境感知的 copilots，读取屏幕、规划下一步，并在你确认后执行。',
          primaryCta: '探索 AI 蓝图',
          secondaryCta: '查看代理 API',
          bullets: {
            understand: '理解屏幕上发生的一切，并关联同事、文档与数据。',
            instant: '40ms 内给出建议动作，可立即触发执行。',
            privacy: '默认端侧运行，邀请协作者时也仅做零知识加密同步。',
          },
        },
        highlights: {
          orchestrate: {
            title: '编排式序列',
            copy: '在代理、脚本与人工复核之间无缝交接，状态与意图始终保持一致。',
          },
          copilot: {
            title: '每个界面都有 Copilot',
            copy: '写作、调试与设计助手同时进入指令面板，随时呼出。',
          },
          memory: {
            title: '长期记忆',
            copy: '检索索引映射你的系统，快速生成总结、对比与后续动作。',
          },
        },
      },
      builtForYou: {
        eyebrow: '为你而生',
        headline: '面向设计、开发与运营团队的统一工作台。',
        subheadline: '不同角色拥有定制界面，同时保持协作步调一致。',
        personas: {
          makers: {
            title: '设计师 / 创作者',
            copy: '在一个画布中切换探索、检查资源、发布设计令牌。',
            quote: '“Tuff 让交接几乎没有摩擦 - 指令栏比我更熟悉日常仪式。”',
            name: 'Jasmine Ortega',
            role: 'Highline 首席产品设计师',
          },
          developers: {
            title: '工程师',
            copy: '在同一指令面中查看日志、重跑流水线、调整特性开关。',
            quote: '“PR、测试与部署脚本汇集到一个入口，发版终于从容。”',
            name: 'Nikhil Sharma',
            role: 'Drift Labs 资深工程师',
          },
          operators: {
            title: '运营与负责人',
            copy: '创建仪表盘、同步例会、用自动化保障节奏不跑偏。',
            quote: '“每一个 ritual 都被固化，Tuff 让远程团队依然同步。”',
            name: 'Morgan Lee',
            role: 'Northwind 运营负责人',
          },
        },
        stats: {
          latency: {
            label: '自动化平均耗时',
            value: '27 ms',
          },
          adoption: {
            label: '30 天内完成落地团队',
            value: '92%',
          },
          satisfaction: {
            label: '周活满意度',
            value: '4.8/5',
          },
        },
      },
      starSnippets: {
        eyebrow: '星标片段',
        headline: '一次保存，随处调用。',
        subheadline: '精选片段让团队的最佳回复与脚本随时可用。',
        categories: {
          meetings: {
            title: '会议跟进',
            copy: '一键生成纪要、下一步与排期宏指令。',
            action: '预览模版',
          },
          support: {
            title: '客服回复',
            copy: 'AI 结合实时产品数据在你打开工单前就草拟回应。',
            action: '插入片段',
          },
          builders: {
            title: '研发捷径',
            copy: '不离开聊天即可部署流程、追日志、推送热修复分支。',
            action: '执行指令',
          },
        },
        footnote: '为团队固定片段，随着 playbook 更新自动同步。',
      },
      aggregation: {
        eyebrow: '聚合视图',
        headline: '所有信号，凝练为一张冷静的总览。',
        subheadline: '文档、对话、提醒与自动化在每个工作区持续同步。',
        panels: {
          overview: {
            title: '实时总览',
            copy: '晨间简报聚合最新提交、笔记与阻塞，不再噪音轰炸。',
          },
          timelines: {
            title: '节奏时间线',
            copy: '按项目自动排布节点与依赖，异常会抬头提醒。',
          },
          alerts: {
            title: '智能提醒',
            copy: '关键变化合并为分层通知，只在需要你决策时打扰。',
          },
        },
        footnote: '聚合引擎持续运行，无论何时上线都能迅速回到节奏。',
      },
      community: {
        eyebrow: '社区',
        headline: '与全球创造者一起共建。',
        subheadline: '加入这些渠道，第一时间了解扩展、仪式与版本预览。',
        channels: {
          slack: {
            title: 'Slack',
            meta: '32k 名成员',
            description: '深度讨论、版本预览与核心团队的开放办公时间。',
            cta: '加入 Slack',
            href: '#',
          },
          github: {
            title: 'GitHub',
            meta: '3k 位贡献者',
            description: '浏览 manifest、提交 PR，并保持平台透明。',
            cta: '访问 GitHub',
            href: '#',
          },
          events: {
            title: 'Live Sessions',
            meta: '每周',
            description: 'AMA、动手工作坊与社区 Showcase 轮番进行。',
            cta: '查看日程',
            href: '#',
          },
        },
        spotlights: {
          learning: {
            title: '学习中心',
            copy: '工作坊、专题课与录播演示，帮助团队快速进阶。',
          },
          newsletter: {
            title: 'Dispatch 通讯',
            copy: '每月总结发布内容、路线规划与真实使用案例。',
          },
        },
      },
      pricing: {
        eyebrow: '定价',
        headline: '先锋阶段全量开放，完全免费。',
        subheadline: '在与你共同打磨体验期间，我们保持所有能力解锁。',
        plan: {
          name: 'Pioneer',
          price: '0 元',
          period: '每位成员',
          features: {
            unlimited: '不限席位、指令与扩展',
            support: '直接接入产品团队的反馈通道',
            roadmap: '付费层推出时提供平滑迁移方案',
          },
          footnote: '作为首批团队，你们在正式定价上线后仍保留 Pioneer 权益。',
        },
      },
      faq: {
        eyebrow: '常见问题',
        headline: '你的疑问，我们都想好答案。',
        items: {
          access: {
            question: '如何加入 Beta？',
            answer: '预约先锋计划，我们每周批次开通，并为团队安排引导会议。',
          },
          privacy: {
            question: '数据如何被处理？',
            answer: '绝大多数逻辑在本地运行，云端同步全程加密，密钥由你掌控，可按工作区开启。',
          },
          build: {
            question: '不会写代码也能搭建自动化吗？',
            answer: '可以。FlowScript 提供可视化构建器，开发者也可随时下沉到代码层。',
          },
          migration: {
            question: '现有快捷指令能迁移吗？',
            answer: '支持从 Raycast、Alfred 与自定义脚本导入，Tuff 会转化为类型化指令。',
          },
          pricing: {
            question: '免费阶段会持续多久？',
            answer: '未来会推出付费层，但 Pioneer 团队会一直免费直至正式公开发布。',
          },
        },
      },
      extensibility: {
        eyebrow: '能力中心',
        headline: '自由万物，强大工具包。',
        subheadline: '为你介绍，全新 TuffFamilyKit 百余种工具可选。',
      },
      openFoundation: {
        eyebrow: '开放基石',
        headline: '开放打造，献给创造者。',
        subheadline: '透明内核、模块化工具链，与共创未来的开发者社区。',
        pillars: {
          core: {
            title: '透明内核',
            copy: '可审计的运行时，每一次决策都清晰可循，放心分叉平台。',
          },
          sdk: {
            title: '模块化 SDK',
            copy: '类型安全 API、沙箱与签名管线，让拓展轻松顺手。',
          },
          community: {
            title: '活力社区',
            copy: '与先锋同行，共同审阅 manifest，在公开协作中推动平台进化。',
          },
        },
        footnote: '我们构建的一切均有文档与版本记录，随时欢迎你的 Pull Request。',
      },
      proactive: {
        eyebrow: '情境智能',
        headline: '先你一步，懂你所需。',
        subheadline: 'Tuff 智能核心登场。端侧运行，守护隐私，深度感知你的语境。',
        shieldLabel: '端侧 AI · 隐私至上',
        scenarios: {
          developer: {
            tab: '开发者 · VS Code',
            title: '选中任意 import，Tuff 预判你需要的文档。',
            copy: '内联推荐精准打开参考、示例代码与最新变更记录。',
            action: '打开 FlowScript API 参考',
          },
          designer: {
            tab: '设计师 · Figma',
            title: '选中图层时，情境动作即时浮现。',
            copy: '导出预设、CSS 令牌与无障碍检查一并呈现，毫不停顿。',
            action: '导出图层 PNG · 复制 CSS',
          },
          zero: {
            tab: '零输入',
            title: '唤出 Tuff，你的下一步已准备就绪。',
            copy: '近期文件、会议与自动化场景依照你的节奏井然呈现。',
            action: '继续 “Launch Prep” 工作区 · 加入 Daily Sync',
          },
        },
      },
      craftsmanship: {
        eyebrow: '工艺与细节',
        headline: '每一处细节，都已升华。',
        subheadline: '行云流水的体验，源自对基础的极致雕琢。',
        clips: {
          system: {
            tag: '系统控制',
            title: '“深色模式” 指令瞬间切换全局。',
            copy: '即便编排系统级切换，动画仍保持 120fps 的丝滑顺畅。',
          },
          clipboard: {
            tag: '剪贴板胶片库',
            title: '历史记录化身沉浸式胶片流。',
            copy: '图像、色板与文本预览以柔和视差呈现，一眼锁定所需内容。',
          },
          performance: {
            tag: '延迟实验室',
            title: '唤起 Tuff，零延迟，零多余动作。',
            copy: '从按键到呈现平均 18ms，并沿用文档动效同款调校。',
          },
        },
      },
      pioneer: {
        eyebrow: '先锋计划',
        headline: '未来的工作方式，即将到来。成为第一位塑造者。',
        subheadline: '加入 Tuff 先锋计划。抢先体验、共同构建，定义下一代效率工具。',
        formTitle: '邮箱',
        cta: '申请先锋资格',
        benefitsTitle: '专属先锋权益',
        benefits: {
          early: {
            title: '抢先体验',
            copy: '在正式发布前预览每一个前沿版本。',
          },
          shape: {
            title: '影响产品',
            copy: '与核心团队直接对话，你的反馈将塑造产品路线。',
          },
          community: {
            title: '专属社区',
            copy: '参加专属交流、办公时段，并在平台内获得身份标识。',
          },
        },
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
    footer: {
      tagline: '为高速团队打造的沉静操作系统。',
      primaryCta: '下载 Beta',
      secondaryCta: '查看文档',
      rights: '保留所有权利。',
      socials: {
        github: 'GitHub',
      },
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
