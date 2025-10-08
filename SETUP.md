# Cloudflare Pages + D1/R2 集成指引

> 本文档描述了如何让 `tuff-nexus` 在 Cloudflare Pages 上运行，并接入 D1 数据库与 R2 对象存储。按照顺序完成即可完成迁移。

## 0. 前置准备
- 安装最新版本的 `pnpm`（项目使用 `pnpm@10.13.1`）。
- 使用 Node.js 22+（内置 `node:sqlite`），项目已启用 `Nuxt Content` 的 `nativeSqlite`，无需再安装 `better-sqlite3`。
- 全局或项目内安装 `wrangler`（已经添加到 `devDependencies`，执行 `pnpm install` 同步依赖）。
- 确保本地已登录 Cloudflare：`npx wrangler login`。
- 在 Cloudflare Dashboard 中提前创建：
  - Pages 项目（仓库已经绑定，后文只需配置环境变量和绑定）。
  - D1 数据库（记下 `database_id` 和 `name`）。
  - R2 Bucket（生产/预览可共用，也可以创建两个）。

## 1. 初始化依赖
```bash
pnpm install
```

> 这一步会同步 `wrangler`、`@cloudflare/workers-types` 等新依赖，并更新 `pnpm-lock.yaml`。

## 2. 配置 wrangler
编辑根目录的 `wrangler.toml`：

```toml
name = "tuff-nexus"
compatibility_date = "2024-08-14"
pages_build_output_dir = ".output/public"

[[d1_databases]]
binding = "DB"
database_name = "tuff-nexus"
database_id = "REPLACE_WITH_D1_DATABASE_ID"

[[r2_buckets]]
binding = "R2"
bucket_name = "tuff-nexus-assets"
preview_bucket_name = "tuff-nexus-assets-preview"
```

- 将 `database_id`、`database_name`、`bucket_name` 替换为实际值。
- 如暂时没有预览 bucket，可删除 `preview_bucket_name`。
- 若需要额外的 R2 绑定（例如 `ASSETS`），可按相同格式追加。

## 3. 准备 D1 表结构
1. 将下面的示例 SQL 保存为 `database/schema.sql`（可根据需求调整字段）：
   ```sql
   CREATE TABLE IF NOT EXISTS metrics (
     key TEXT PRIMARY KEY,
     value INTEGER NOT NULL
   );

    -- 发布记录
   CREATE TABLE IF NOT EXISTS releases (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     version TEXT UNIQUE NOT NULL,
     release_notes TEXT,
     download_key TEXT,
     published_at TEXT DEFAULT CURRENT_TIMESTAMP
   );

   -- 资源存储清单（与 R2 对应）
   CREATE TABLE IF NOT EXISTS assets (
     key TEXT PRIMARY KEY,
     file_name TEXT NOT NULL,
     size INTEGER,
     r2_path TEXT NOT NULL,
     created_at TEXT DEFAULT CURRENT_TIMESTAMP
   );

   -- 插件扩展列表
   CREATE TABLE IF NOT EXISTS plugins (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     description TEXT,
     version TEXT NOT NULL,
     asset_key TEXT REFERENCES assets(key),
     updated_at TEXT DEFAULT CURRENT_TIMESTAMP
   );
   ```
2. 创建迁移（一次即可）：
   ```bash
   npx wrangler d1 migrations create DB init
   ```
3. 将生成的迁移文件替换为上述 SQL，然后执行：
   ```bash
   npx wrangler d1 migrations apply DB
   ```

## 4. 上传 R2 资源
- 将安装包、插件、截图等文件上传到指定的 R2 bucket：
  ```bash
  npx wrangler r2 object put tuff-nexus-assets/releases/tuff-1.0.0.dmg --file=./downloads/tuff-1.0.0.dmg
  ```
- 推荐以业务分类作为前缀（如 `releases/`, `plugins/`, `media/`）。
- 记录每个对象的 `key` 与 `etag`，填入 D1 的 `assets` 表。

## 5. 本地开发/预览

### 5.1 传统本地开发
```bash
pnpm dev
```

### 5.2 模拟 Cloudflare Pages
```bash
pnpm preview:cf
```
命令会先执行 `pnpm build`，再调用 `wrangler pages dev`，使用 `.output/public` 与 Nitro 产出的 Functions 进行本地模拟。

> 如提示未登录 Cloudflare，运行 `npx wrangler login` 或提供 `CLOUDFLARE_API_TOKEN`。

## 6. 部署流水线建议
1. 在 Cloudflare Pages 的 **Build settings** 中配置：
   - Build command: `pnpm install && pnpm build`
   - Build output directory: `.output/public`
2. 在 Pages 项目的 **Settings → Functions** 区域开启 Functions，并填写与 `wrangler.toml` 一致的绑定。
3. 在 **Settings → Environment variables** 中补充：
   - `NITRO_PRESET=cloudflare-pages`（冗余保险，Nuxt 会读取）
   - 自定义的 `NUXT_PUBLIC_*` 或其他应用变量。
4. 若需要在部署后同步 R2 或运行 D1 迁移，可以：
   - 使用 Cloudflare Pages 的 `Post-deployment hooks` 调用 webhook。
   - 或者在仓库的 CI（例如 GitHub Actions）中执行 `wrangler d1 migrations apply` 与 R2 上传。

## 7. 代码中的 Cloudflare 适配点
- `nuxt.config.ts` 使用 `nitro.preset = 'cloudflare-pages'`，构建时会生成 Pages Functions。
- `server/utils/cloudflare.ts` 提供 `readCloudflareBindings` 与 `requireCloudflareBindings`，在 API 中读取 `env.DB`/`env.R2`。
- `server/api/pageview.ts` 示例：优先写入 D1 的 `metrics` 表；未绑定 D1 时退回内存计数。
- 新增 `types/cloudflare-env.d.ts` 以补全 `TuffCloudflareBindings` 类型，`tsconfig.json` 已引入该声明。

## 8. 后续扩展思路
1. **版本/下载 API**
   - 创建 `server/api/releases.get.ts` 返回最新版本及下载链接。
   - 创建 `server/api/download/[key].get.ts` 从 D1 校验 `key`，再调用 `env.R2.get` 生成一次性签名 URL。
2. **后台管理界面**
   - 使用 Nuxt Admin 路由（加 Basic Auth 或 Cloudflare Access）管理 Releases/Plugins。
3. **缓存策略**
   - 针对热门数据使用 Cloudflare KV 或 Cache API 缓存，减少 D1 查询次数。
4. **监控与日志**
   - 在 Wrangler 中开启 tail，将关键日志 `console.log` 输送到 Cloudflare Dashboard。

## 9. 常见问题
- **D1 报错 `no such table`**：确认迁移是否执行；`pageview` API 会尝试自动建表，但推荐提前迁移。
- **本地 `wrangler pages dev` 找不到输出**：确保已执行 `pnpm build`，命令自动处理；如路径变更，更新 `pages_build_output_dir`。
- **`better-sqlite3` 编译失败**：依赖已移除，如本地缓存仍存在，删除 `node_modules` 后重新安装。

---

完成以上步骤后，Cloudflare Pages 部署将使用 D1 存储业务数据，R2 分发大文件，Nuxt 仅负责界面与渲染。后续可按业务需求进一步补充 API 与后台逻辑。祝顺利！
