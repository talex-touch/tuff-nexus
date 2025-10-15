# Plugin Extensions Refactor Plan

## 1. Scope Overview
- Replace the current class-name based plugin submissions with binary uploads (`.tpex` bundle + icon).
- Persist package signatures, extracted README markdown, and icon assets to power a richer marketplace preview.
- Introduce plugin version history with release channels (`SNAPSHOT`, `BETA`, `RELEASE`) and enforce visibility & submission limits.

## 2. Data Model
### 2.1 `dashboard_plugins`
| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT PK | UUID |
| `user_id` | TEXT | Creator/owner |
| `owner_org_id` | TEXT NULL | Clerk Organization id recorded during first publish |
| `name` | TEXT | Plugin display name |
| `summary` | TEXT | Short marketing blurb |
| `category` | TEXT | Enum from `PLUGIN_CATEGORIES` |
| `installs` | INTEGER | Aggregate installs counter (existing behaviour) |
| `homepage` | TEXT NULL | Optional GitHub/project homepage |
| `is_official` | INTEGER | Existing boolean |
| `badges` | TEXT | JSON array |
| `author` | TEXT NULL | JSON encoded author data |
| `created_at` | TEXT | ISO string |
| `updated_at` | TEXT | ISO string |
| `latest_version_id` | TEXT NULL | FK to `dashboard_plugin_versions.id` (visible to requester) |

> Legacy columns (`icon`, `image_url`, `last_updated`, `version`) will be deprecated in favour of looking up values from `latest_version_id`. They will be kept temporarily for backward compatibility but no longer written to after migration.

### 2.2 `dashboard_plugin_versions`
| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT PK | UUID |
| `plugin_id` | TEXT | FK to `dashboard_plugins` |
| `created_by` | TEXT | User id of submitter |
| `channel` | TEXT | Enum: `SNAPSHOT`, `BETA`, `RELEASE` |
| `version` | TEXT | Semantic version string |
| `signature` | TEXT | SHA-256 digest of uploaded `.tpex` |
| `package_key` | TEXT | Storage key / filename |
| `package_url` | TEXT | public API path |
| `package_size` | INTEGER | Bytes |
| `icon_key` | TEXT | Storage key for icon |
| `icon_url` | TEXT | public API path |
| `readme_markdown` | TEXT NULL | Extracted README contents |
| `manifest` | TEXT NULL | Parsed manifest JSON when available |
| `notes` | TEXT NULL | Optional changelog / description |
| `created_at` | TEXT | ISO timestamp |
| `updated_at` | TEXT | ISO timestamp |

Uniqueness Constraints:
- (`plugin_id`, `version`, `channel`) unique.
- (`plugin_id`, `signature`) unique to prevent duplicate payloads.

### 2.3 Derived Entities
- `dashboard_plugin_submissions` (virtual): we can compute rate limiting by querying `dashboard_plugin_versions` filtered by `created_by`.
- Memory storage fallback mirrors the R2 buckets for both package and icon assets.

## 3. Asset Storage
- Reuse the existing Cloudflare binding approach. Introduce a generic storage helper that supports arbitrary MIME types and size limits.
- Constraints:
  - `.tpex` max 5 MB.
  - Accepted icon types: `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`, `image/gif`.
- Generated URLs are served through new API routes: `/api/plugins/assets/:key` (package) and `/api/images/:key` (icon, legacy compatible).

## 4. Backend Workflow
1. **Plugin Creation**
   - Authenticated users can create up to **10** distinct plugins (`COUNT(*) WHERE user_id = ?`).
   - Record `owner_org_id` from the first Clerk organization (if any) to support BETA visibility.
2. **Version Publishing**
   - Endpoint expects multipart form data:
     - Text fields: `pluginId`, `version`, `channel`, `notes?`, `homepage?`.
     - Files: `package` (`.tpex`), `icon`.
   - Validate `channel` ∈ `{SNAPSHOT,BETA,RELEASE}` and file sizes/types.
   - Compute SHA-256 signature, store binary, extract README:
     - Use `jszip` to load archive.
     - Search for `README.md` (case-insensitive, allow nested paths).
     - Persist markdown text (UTF-8).
   - Update `dashboard_plugins` metadata and `latest_version_id` if the channel is visible to requester (for BETA the pointer updates only for eligible viewers).
3. **Rate Limiting**
   - Enforce a cooldown (default **5 minutes**) between submissions per user by checking the latest `created_at` from `dashboard_plugin_versions`.
   - Return HTTP 429 on violation.
4. **Visibility Rules**
   - Market/List API resolves the latest accessible version per plugin:
     - `RELEASE` preferred, else `SNAPSHOT`.
     - `BETA` only exposed when requester is the owner or belongs to `owner_org_id`.
   - Dashboard API returns full history for the owner; other team members see BETA entries if they share the organization.
5. **Cleanup**
   - When deleting a plugin, cascade delete version rows and associated assets.
   - Individual version deletion removes stored files if no other references exist.

## 5. API Surface
| Route | Method | Description |
| --- | --- | --- |
| `/api/dashboard/plugins` | GET | Return plugins owned by requester (with latest version details & version history) |
| `/api/dashboard/plugins` | POST | Create plugin metadata (JSON) |
| `/api/dashboard/plugins/:id` | PATCH | Update metadata (summary/category/badges/homepage etc.) |
| `/api/dashboard/plugins/:id` | DELETE | Remove plugin and all versions |
| `/api/dashboard/plugins/:id/versions` | POST | Publish new version (multipart upload) |
| `/api/dashboard/plugins/:id/versions` | GET | List versions (owner/team visibility) |
| `/api/dashboard/plugins/:id/versions/:versionId` | DELETE | Remove a version (owner only) |
| `/api/market/plugins` | GET | Public marketplace feed (applies channel visibility rules) |
| `/api/plugins/assets/:key` | GET | Serve stored `.tpex` packages (auth needed for BETA) |

Responses include `signature`, `packageUrl`, `iconUrl`, `channel`, `version`, `readmeMarkdown`, and `createdAt`.

## 6. Front-End Changes
### Dashboard
- Replace the existing single form with:
  - **Metadata Editor**: name, summary, category, homepage, badges, author, install count.
  - **Version Publisher**: upload fields for `.tpex` & icon, select channel, optional release notes, preview README markdown before submission.
- Show per-plugin version history table (channel badge, version, created at, signature, download links). Provide “Publish new version” CTA.
- Render README preview using a Markdown component (e.g. `@nuxt/content` renderer or `markdown-it`).
- Display validation messages (file size/type, rate limit, per-user plugin cap).

### Marketplace & Detail Preview
- Fetch plugins with their latest accessible version; display icon (from uploaded file), channel badge, and release notes summary.
- Add pre-submit preview modal in dashboard that mirrors marketplace card layout using markdown-rendered README.

## 7. Testing & Validation
- Unit tests for utility helpers: file validation, README extraction, signature calculation, visibility filters.
- Integration tests (Nitro server) covering:
  - Successful publish flow (new plugin + version).
  - Rate limit rejection.
  - Per-user plugin cap.
  - BETA visibility filtering for authorized vs unauthorized viewers.
- Manual QA checklist:
  - Upload `.tpex` < 5 MB & `icon`.
  - Markdown preview renders correctly.
  - Deleting plugin tears down versions & assets.

## 8. Migration Notes
- D1 schema migrations executed lazily in `ensureDashboardSchema`: add new columns/tables with `ALTER TABLE` and `CREATE TABLE IF NOT EXISTS`.
- For existing rows:
  - Backfill `homepage` null.
  - Set `latest_version_id` null until the owner publishes via the new flow.
- Provide temporary compatibility by mapping legacy `icon` string to a default asset until versions exist.

