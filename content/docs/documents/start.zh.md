---
title: 快速上手 Tuff 启动器
description: 几分钟内打造你的中英双语文档工作区。
navigation: false
---

# 快速上手

Tuff 启动器基于 Nuxt，为你准备好了理解中英双语的文档工作区，并匹配明暗双主题、导航、搜索与部署等默认配置。从克隆仓库到发布上线，只需要几个步骤。

## 1. 安装依赖

项目使用 **pnpm** 管理依赖。克隆仓库后执行：

```bash
pnpm install
pnpm dev
```

提示：追加 `--open` 可在启动开发服务器后自动打开浏览器。

## 2. 规划文档结构

所有文档内容位于 `content/docs` 目录下。子目录会映射到左侧导航分组。新增 Markdown 或 MDC 文件时可以通过 Front Matter 控制排序：

```md
---
title: 发布节奏
navigation:
  order: 4
---
```

UnoCSS 预设好的设计令牌可以保证在明暗模式下，标题、列表与代码块都保持舒适的阅读体验。

## 3. 维护双语内容

启动器会自动解析本地化文件。复制任意 Markdown 文件并追加 `.zh.md` 后缀即可提供中文版本：

```text
content/docs/documents/start.md
content/docs/documents/start.zh.md
```

当读者切换语言时，Tuff 会优先加载对应语言的文件；若中文内容暂未准备，则回退至英文原文。

## 4. 发布上线

使用以下命令构建生产版本：

```bash
pnpm generate
```

生成的 `dist` 目录可以直接部署到 Netlify、Vercel、Cloudflare Pages 等静态托管平台。若需服务端渲染或边缘运行时，可以执行 `pnpm build` 并结合 `package.json` 中的适配器命令发布。

---

后续建议：

- 在 `uno.config.ts` 调整字重、间距或配色。
- 在 `i18n.config.ts` 扩展更多中英文文案。
- 配置 CI/CD，在部署前执行 `pnpm generate` 生成最新静态资源。
