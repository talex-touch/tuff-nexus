import type { D1Database } from '@cloudflare/workers-types'
import type { H3Event } from 'h3'
import { useStorage } from '#imports'
import { createError } from 'h3'
import { Buffer } from 'node:buffer'
import { createHash, randomUUID } from 'node:crypto'
import { isPluginCategoryId } from '~/utils/plugin-categories'
import { readCloudflareBindings } from './cloudflare'
import { deleteImage, uploadImage } from './imageStorage'
import { deletePluginPackage, uploadPluginPackage } from './pluginPackageStorage'
import { extractTpexMetadata } from './tpex'

const PLUGINS_KEY = 'dashboard:plugins'
const PLUGIN_VERSIONS_KEY = 'dashboard:pluginVersions'
const PLUGINS_TABLE = 'dashboard_plugins'
const PLUGIN_VERSIONS_TABLE = 'dashboard_plugin_versions'

const MAX_PLUGINS_PER_USER = 10
const SUBMISSION_COOLDOWN_MS = 5 * 60 * 1000

let schemaInitialized = false

export type PluginChannel = 'SNAPSHOT' | 'BETA' | 'RELEASE'

export interface DashboardPluginAuthor {
  name: string
  avatarColor?: string
}

export interface DashboardPluginVersion {
  id: string
  pluginId: string
  createdBy: string
  channel: PluginChannel
  version: string
  signature: string
  packageKey: string
  packageUrl: string
  packageSize: number
  iconKey: string
  iconUrl: string
  readmeMarkdown?: string | null
  manifest?: Record<string, unknown> | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface DashboardPlugin {
  id: string
  userId: string
  ownerOrgId?: string | null
  name: string
  summary: string
  category: string
  installs: number
  homepage?: string | null
  isOfficial: boolean
  badges: string[]
  author?: DashboardPluginAuthor | null
  createdAt: string
  updatedAt: string
  latestVersionId?: string | null
  versions?: DashboardPluginVersion[]
}

interface D1PluginRow {
  id: string
  user_id: string
  owner_org_id: string | null
  name: string
  summary: string
  category: string
  installs: number
  homepage: string | null
  icon: string | null
  image_url: string | null
  last_updated: string | null
  version: string | null
  is_official: number
  badges: string | null
  author: string | null
  created_at: string
  updated_at: string
  latest_version_id: string | null
}

interface D1PluginVersionRow {
  id: string
  plugin_id: string
  created_by: string
  channel: string
  version: string
  signature: string
  package_key: string
  package_url: string
  package_size: number
  icon_key: string
  icon_url: string
  readme_markdown: string | null
  manifest: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

interface PluginVisibilityOptions {
  ownerId?: string
  viewerId?: string
  viewerOrgIds?: string[]
  viewerIsAdmin?: boolean
  includeVersions?: boolean
  forMarket?: boolean
}

interface CreatePluginInput {
  name: string
  summary: string
  category: string
  installs?: number
  homepage?: string | null
  isOfficial?: boolean
  badges?: string[]
  author?: DashboardPluginAuthor | null
}

interface UpdatePluginInput extends Partial<CreatePluginInput> {
  ownerOrgId?: string | null
}

interface PublishVersionInput {
  pluginId: string
  channel: PluginChannel
  version: string
  notes?: string | null
  homepage?: string | null
  packageFile: File
  iconFile: File
  createdBy: string
}

function getD1Database(event?: H3Event | null): D1Database | null {
  if (!event)
    return null

  const bindings = readCloudflareBindings(event)
  return bindings?.DB ?? null
}

async function ensurePluginSchema(db: D1Database) {
  if (schemaInitialized)
    return

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS ${PLUGINS_TABLE} (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      owner_org_id TEXT,
      name TEXT NOT NULL,
      summary TEXT NOT NULL,
      category TEXT NOT NULL,
      installs INTEGER NOT NULL DEFAULT 0,
      homepage TEXT,
      icon TEXT,
      image_url TEXT,
      last_updated TEXT,
      version TEXT,
      is_official INTEGER NOT NULL DEFAULT 0,
      badges TEXT NOT NULL,
      author TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      latest_version_id TEXT
    );
  `).run()

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS ${PLUGIN_VERSIONS_TABLE} (
      id TEXT PRIMARY KEY,
      plugin_id TEXT NOT NULL,
      created_by TEXT NOT NULL,
      channel TEXT NOT NULL,
      version TEXT NOT NULL,
      signature TEXT NOT NULL,
      package_key TEXT NOT NULL,
      package_url TEXT NOT NULL,
      package_size INTEGER NOT NULL,
      icon_key TEXT NOT NULL,
      icon_url TEXT NOT NULL,
      readme_markdown TEXT,
      manifest TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `).run()

  // Add missing columns for backward compatibility
  const pluginColumns = await db.prepare(`PRAGMA table_info(${PLUGINS_TABLE});`).all<{ name: string }>()
  const columnNames = new Set((pluginColumns.results ?? []).map(col => col.name))

  const addColumnIfMissing = async (column: string, ddl: string) => {
    if (!columnNames.has(column)) {
      await db.prepare(`ALTER TABLE ${PLUGINS_TABLE} ADD COLUMN ${ddl};`).run()
    }
  }

  await addColumnIfMissing('homepage', 'homepage TEXT')
  await addColumnIfMissing('owner_org_id', 'owner_org_id TEXT')
  await addColumnIfMissing('latest_version_id', 'latest_version_id TEXT')

  const versionColumns = await db.prepare(`PRAGMA table_info(${PLUGIN_VERSIONS_TABLE});`).all<{ name: string }>()
  const versionColumnNames = new Set((versionColumns.results ?? []).map(col => col.name))

  if (!versionColumnNames.has('notes')) {
    await db.prepare(`ALTER TABLE ${PLUGIN_VERSIONS_TABLE} ADD COLUMN notes TEXT;`).run()
  }

  schemaInitialized = true
}

function parseJsonArray(value: string | null): string[] {
  if (!value)
    return []

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(item => String(item)) : []
  }
  catch {
    return []
  }
}

function parseJsonObject<T>(value: string | null): T | null {
  if (!value)
    return null

  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? (parsed as T) : null
  }
  catch {
    return null
  }
}

function mapPluginRow(row: D1PluginRow): DashboardPlugin {
  return {
    id: row.id,
    userId: row.user_id,
    ownerOrgId: row.owner_org_id,
    name: row.name,
    summary: row.summary,
    category: row.category,
    installs: Number(row.installs ?? 0),
    homepage: row.homepage,
    isOfficial: Boolean(row.is_official),
    badges: parseJsonArray(row.badges),
    author: parseJsonObject<DashboardPluginAuthor>(row.author),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    latestVersionId: row.latest_version_id,
  }
}

function mapPluginVersionRow(row: D1PluginVersionRow): DashboardPluginVersion {
  return {
    id: row.id,
    pluginId: row.plugin_id,
    createdBy: row.created_by,
    channel: row.channel as PluginChannel,
    version: row.version,
    signature: row.signature,
    packageKey: row.package_key,
    packageUrl: row.package_url,
    packageSize: Number(row.package_size),
    iconKey: row.icon_key,
    iconUrl: row.icon_url,
    readmeMarkdown: row.readme_markdown,
    manifest: parseJsonObject<Record<string, unknown>>(row.manifest),
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function sanitizeBadges(badges?: string[]): string[] {
  return (badges ?? [])
    .map(badge => badge.trim())
    .filter(Boolean)
}

function validatePluginInput(input: CreatePluginInput, forUpdate = false) {
  if (!forUpdate) {
    if (!input.name || typeof input.name !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'Plugin name is required.' })
    if (!input.summary || typeof input.summary !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'Plugin summary is required.' })
    if (!input.category || typeof input.category !== 'string' || !isPluginCategoryId(input.category))
      throw createError({ statusCode: 400, statusMessage: 'Plugin category is invalid.' })
  }
  else {
    if (input.category && !isPluginCategoryId(input.category))
      throw createError({ statusCode: 400, statusMessage: 'Plugin category is invalid.' })
  }

  if (input.homepage) {
    try {
      const url = new URL(input.homepage)
      if (!['http:', 'https:'].includes(url.protocol))
        throw new Error('Invalid protocol')
    }
    catch {
      throw createError({ statusCode: 400, statusMessage: 'Plugin homepage must be a valid URL.' })
    }
  }
}

function validateChannel(channel: string): asserts channel is PluginChannel {
  const allowed: PluginChannel[] = ['SNAPSHOT', 'BETA', 'RELEASE']
  if (!allowed.includes(channel as PluginChannel))
    throw createError({ statusCode: 400, statusMessage: 'Invalid plugin channel.' })
}

function versionIsVisible(
  version: DashboardPluginVersion,
  plugin: DashboardPlugin,
  options: PluginVisibilityOptions,
): boolean {
  if (version.channel !== 'BETA')
    return true

  if (options.viewerIsAdmin)
    return true

  if (options.viewerId === plugin.userId)
    return true

  if (plugin.ownerOrgId && options.viewerOrgIds?.includes(plugin.ownerOrgId))
    return true

  return false
}

function selectLatestVisibleVersion(
  versions: DashboardPluginVersion[],
  plugin: DashboardPlugin,
  options: PluginVisibilityOptions,
): DashboardPluginVersion | undefined {
  const visible = versions.filter(version => versionIsVisible(version, plugin, options))
  if (!visible.length)
    return undefined

  const byChannelPriority = { RELEASE: 3, SNAPSHOT: 2, BETA: 1 } as const

  return visible
    .slice()
    .sort((a, b) => {
      const channelDiff = (byChannelPriority[b.channel] ?? 0) - (byChannelPriority[a.channel] ?? 0)
      if (channelDiff !== 0)
        return channelDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })[0]
}

async function readCollection<T>(key: string): Promise<T[]> {
  const storage = useStorage()
  const items = await storage.getItem<T[]>(key)
  return items ?? []
}

async function writeCollection<T>(key: string, items: T[]) {
  const storage = useStorage()
  await storage.setItem(key, items)
}

async function countUserPluginsInDb(db: D1Database, userId: string) {
  const result = await db.prepare(`
    SELECT COUNT(*) as count
    FROM ${PLUGINS_TABLE}
    WHERE user_id = ?1;
  `).bind(userId).first<{ count: number }>()

  return Number(result?.count ?? 0)
}

async function checkUserPluginLimit(event: H3Event, userId: string) {
  const db = getD1Database(event)

  if (db) {
    await ensurePluginSchema(db)
    const count = await countUserPluginsInDb(db, userId)
    if (count >= MAX_PLUGINS_PER_USER) {
      throw createError({
        statusCode: 400,
        statusMessage: `Plugin limit reached (${MAX_PLUGINS_PER_USER}).`,
      })
    }
  }
  else {
    const plugins = await readCollection<DashboardPlugin>(PLUGINS_KEY)
    const count = plugins.filter(plugin => plugin.userId === userId).length
    if (count >= MAX_PLUGINS_PER_USER) {
      throw createError({
        statusCode: 400,
        statusMessage: `Plugin limit reached (${MAX_PLUGINS_PER_USER}).`,
      })
    }
  }
}

async function ensureSubmissionCooldown(event: H3Event, userId: string) {
  const db = getD1Database(event)
  const now = Date.now()

  if (db) {
    await ensurePluginSchema(db)

    const row = await db.prepare(`
      SELECT created_at
      FROM ${PLUGIN_VERSIONS_TABLE}
      WHERE created_by = ?1
      ORDER BY datetime(created_at) DESC
      LIMIT 1;
    `).bind(userId).first<{ created_at: string }>()

    if (row) {
      const last = new Date(row.created_at).getTime()
      if (!Number.isNaN(last) && now - last < SUBMISSION_COOLDOWN_MS) {
        throw createError({
          statusCode: 429,
          statusMessage: 'You are submitting too frequently. Please wait before publishing again.',
        })
      }
    }
  }
  else {
    const versions = await readCollection<DashboardPluginVersion>(PLUGIN_VERSIONS_KEY)
    const latest = versions
      .filter(version => version.createdBy === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

    if (latest) {
      const last = new Date(latest.createdAt).getTime()
      if (!Number.isNaN(last) && now - last < SUBMISSION_COOLDOWN_MS) {
        throw createError({
          statusCode: 429,
          statusMessage: 'You are submitting too frequently. Please wait before publishing again.',
        })
      }
    }
  }
}

export async function listPlugins(event: H3Event | undefined, options: PluginVisibilityOptions = {}): Promise<DashboardPlugin[]> {
  const db = getD1Database(event)

  if (db) {
    await ensurePluginSchema(db)

    let query = `
      SELECT
        id,
        user_id,
        owner_org_id,
        name,
        summary,
        category,
        installs,
        homepage,
        icon,
        image_url,
        last_updated,
        version,
        is_official,
        badges,
        author,
        created_at,
        updated_at,
        latest_version_id
      FROM ${PLUGINS_TABLE}`

    const bindings: unknown[] = []

    if (options.ownerId) {
      query += ` WHERE user_id = ?1`
      bindings.push(options.ownerId)
    }

    query += ` ORDER BY datetime(created_at) DESC;`

    const stmt = db.prepare(query)
    const { results } = bindings.length
      ? await stmt.bind(...bindings).all<D1PluginRow>()
      : await stmt.all<D1PluginRow>()

    const plugins = (results ?? []).map(mapPluginRow)

    if (!options.includeVersions || !plugins.length)
      return plugins

    const ids = plugins.map(plugin => plugin.id)
    const placeholders = ids.map((_, idx) => `?${idx + 1}`).join(', ')

    const versionsQuery = `
      SELECT *
      FROM ${PLUGIN_VERSIONS_TABLE}
      WHERE plugin_id IN (${placeholders})
      ORDER BY datetime(created_at) DESC;
    `

    const versionResults = await db.prepare(versionsQuery).bind(...ids).all<D1PluginVersionRow>()
    const versions = (versionResults.results ?? []).map(mapPluginVersionRow)

    const byPlugin = new Map<string, DashboardPluginVersion[]>()
    for (const version of versions) {
      if (!byPlugin.has(version.pluginId))
        byPlugin.set(version.pluginId, [])
      byPlugin.get(version.pluginId)!.push(version)
    }

    return plugins.map((plugin) => {
      const pluginVersions = byPlugin.get(plugin.id) ?? []
      const filtered = pluginVersions.filter(version => versionIsVisible(version, plugin, options))
      const latest = selectLatestVisibleVersion(pluginVersions, plugin, options)

      return {
        ...plugin,
        versions: filtered,
        latestVersionId: latest?.id ?? null,
      }
    })
  }

  const storedPlugins = await readCollection<DashboardPlugin>(PLUGINS_KEY)
  const normalized = storedPlugins.map(plugin => ({
    ...plugin,
    badges: Array.isArray(plugin.badges) ? plugin.badges : [],
    author: plugin.author ?? null,
  }))

  const plugins = normalized
    .filter(plugin => (options.ownerId ? plugin.userId === options.ownerId : true))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (!options.includeVersions)
    return plugins

  const storedVersions = await readCollection<DashboardPluginVersion>(PLUGIN_VERSIONS_KEY)
  const byPlugin = new Map<string, DashboardPluginVersion[]>()

  for (const version of storedVersions) {
    if (!byPlugin.has(version.pluginId))
      byPlugin.set(version.pluginId, [])
    byPlugin.get(version.pluginId)!.push(version)
  }

  return plugins.map((plugin) => {
    const pluginVersions = (byPlugin.get(plugin.id) ?? [])
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const filtered = pluginVersions.filter(version => versionIsVisible(version, plugin, options))
    const latest = selectLatestVisibleVersion(pluginVersions, plugin, options)

    return {
      ...plugin,
      versions: filtered,
      latestVersionId: latest?.id ?? null,
    }
  })
}

export async function getPluginById(event: H3Event | undefined, id: string, options: PluginVisibilityOptions = {}) {
  const db = getD1Database(event)

  if (db) {
    await ensurePluginSchema(db)

    const row = await db.prepare(`
      SELECT *
      FROM ${PLUGINS_TABLE}
      WHERE id = ?1;
    `).bind(id).first<D1PluginRow>()

    if (!row)
      return null

    const plugin = mapPluginRow(row)

    if (!options.includeVersions)
      return plugin

    const versionResults = await db.prepare(`
      SELECT *
      FROM ${PLUGIN_VERSIONS_TABLE}
      WHERE plugin_id = ?1
      ORDER BY datetime(created_at) DESC;
    `).bind(id).all<D1PluginVersionRow>()

    const versions = (versionResults.results ?? []).map(mapPluginVersionRow)
    const filtered = versions.filter(version => versionIsVisible(version, plugin, options))
    const latest = selectLatestVisibleVersion(versions, plugin, options)

    return {
      ...plugin,
      versions: filtered,
      latestVersionId: latest?.id ?? null,
    }
  }

  const storedPlugins = await readCollection<DashboardPlugin>(PLUGINS_KEY)
  const normalized = storedPlugins.map(item => ({
    ...item,
    badges: Array.isArray(item.badges) ? item.badges : [],
    author: item.author ?? null,
  }))

  const plugin = normalized.find(item => item.id === id)

  if (!plugin)
    return null

  if (!options.includeVersions)
    return plugin

  const versions = await readCollection<DashboardPluginVersion>(PLUGIN_VERSIONS_KEY)
  const pluginVersions = versions
    .filter(version => version.pluginId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const filtered = pluginVersions.filter(version => versionIsVisible(version, plugin, options))
  const latest = selectLatestVisibleVersion(pluginVersions, plugin, options)

  return {
    ...plugin,
    versions: filtered,
    latestVersionId: latest?.id ?? null,
  }
}

export async function createPlugin(event: H3Event, input: CreatePluginInput & { userId: string, ownerOrgId?: string | null }) {
  validatePluginInput(input)
  await checkUserPluginLimit(event, input.userId)

  const now = new Date().toISOString()

  const plugin: DashboardPlugin = {
    id: randomUUID(),
    userId: input.userId,
    ownerOrgId: input.ownerOrgId ?? null,
    name: input.name,
    summary: input.summary,
    category: input.category,
    installs: Number(input.installs ?? 0),
    homepage: input.homepage ?? null,
    isOfficial: Boolean(input.isOfficial),
    badges: sanitizeBadges(input.badges),
    author: input.author ?? null,
    createdAt: now,
    updatedAt: now,
    latestVersionId: null,
  }

  const db = getD1Database(event)

  if (db) {
    await ensurePluginSchema(db)

    await db.prepare(`
      INSERT INTO ${PLUGINS_TABLE} (
        id,
        user_id,
        owner_org_id,
        name,
        summary,
        category,
        installs,
        homepage,
        icon,
        image_url,
        last_updated,
        version,
        is_official,
        badges,
        author,
        created_at,
        updated_at,
        latest_version_id
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, NULL, NULL, NULL, NULL, ?9, ?10, ?11, ?12, ?13, NULL);
    `).bind(
      plugin.id,
      plugin.userId,
      plugin.ownerOrgId ?? null,
      plugin.name,
      plugin.summary,
      plugin.category,
      plugin.installs,
      plugin.homepage ?? null,
      plugin.isOfficial ? 1 : 0,
      JSON.stringify(plugin.badges),
      plugin.author ? JSON.stringify(plugin.author) : null,
      plugin.createdAt,
      plugin.updatedAt,
    ).run()

    return plugin
  }

  const plugins = await readCollection<DashboardPlugin>(PLUGINS_KEY)
  plugins.unshift(plugin)
  await writeCollection(PLUGINS_KEY, plugins)
  return plugin
}

export async function updatePlugin(event: H3Event, id: string, input: UpdatePluginInput) {
  const existing = await getPluginById(event, id)

  if (!existing)
    throw createError({ statusCode: 404, statusMessage: 'Plugin not found.' })

  const merged: CreatePluginInput & { userId: string, ownerOrgId?: string | null } = {
    userId: existing.userId,
    ownerOrgId: input.ownerOrgId ?? existing.ownerOrgId ?? null,
    name: input.name ?? existing.name,
    summary: input.summary ?? existing.summary,
    category: input.category ?? existing.category,
    installs: input.installs ?? existing.installs,
    homepage: input.homepage ?? existing.homepage ?? null,
    isOfficial: input.isOfficial ?? existing.isOfficial,
    badges: input.badges ?? existing.badges,
    author: input.author ?? existing.author ?? null,
  }

  validatePluginInput(merged, true)

  const updated: DashboardPlugin = {
    ...existing,
    ...merged,
    badges: sanitizeBadges(merged.badges),
    updatedAt: new Date().toISOString(),
  }

  const db = getD1Database(event)

  if (db) {
    await ensurePluginSchema(db)
    await db.prepare(`
      UPDATE ${PLUGINS_TABLE}
      SET
        name = ?1,
        summary = ?2,
        category = ?3,
        installs = ?4,
        homepage = ?5,
        is_official = ?6,
        badges = ?7,
        author = ?8,
        owner_org_id = ?9,
        updated_at = ?10
      WHERE id = ?11;
    `).bind(
      updated.name,
      updated.summary,
      updated.category,
      updated.installs,
      updated.homepage ?? null,
      updated.isOfficial ? 1 : 0,
      JSON.stringify(updated.badges),
      updated.author ? JSON.stringify(updated.author) : null,
      updated.ownerOrgId ?? null,
      updated.updatedAt,
      updated.id,
    ).run()

    return updated
  }

  const plugins = await readCollection<DashboardPlugin>(PLUGINS_KEY)
  const index = plugins.findIndex(plugin => plugin.id === id)

  if (index === -1)
    throw createError({ statusCode: 404, statusMessage: 'Plugin not found.' })

  plugins[index] = updated
  await writeCollection(PLUGINS_KEY, plugins)
  return updated
}

export async function deletePlugin(event: H3Event, id: string) {
  const plugin = await getPluginById(event, id, { includeVersions: true })

  if (!plugin)
    throw createError({ statusCode: 404, statusMessage: 'Plugin not found.' })

  const db = getD1Database(event)

  if (db) {
    await ensurePluginSchema(db)

    const versionRows = await db.prepare(`
      SELECT *
      FROM ${PLUGIN_VERSIONS_TABLE}
      WHERE plugin_id = ?1;
    `).bind(id).all<D1PluginVersionRow>()

    const versions = (versionRows.results ?? []).map(mapPluginVersionRow)

    for (const version of versions) {
      await deletePluginPackage(event, version.packageKey)
      await deleteImage(event, version.iconKey)
    }

    await db.prepare(`
      DELETE FROM ${PLUGIN_VERSIONS_TABLE}
      WHERE plugin_id = ?1;
    `).bind(id).run()

    await db.prepare(`
      DELETE FROM ${PLUGINS_TABLE}
      WHERE id = ?1;
    `).bind(id).run()
  }
  else {
    const versions = await readCollection<DashboardPluginVersion>(PLUGIN_VERSIONS_KEY)
    const remainingVersions = versions.filter(version => version.pluginId !== id)

    const orphaned = versions.filter(version => version.pluginId === id)
    for (const version of orphaned) {
      await deletePluginPackage(event, version.packageKey)
      await deleteImage(event, version.iconKey)
    }

    await writeCollection(PLUGIN_VERSIONS_KEY, remainingVersions)

    const plugins = await readCollection<DashboardPlugin>(PLUGINS_KEY)
    await writeCollection(
      PLUGINS_KEY,
      plugins.filter(item => item.id !== id),
    )
  }

  return plugin
}

export async function publishPluginVersion(event: H3Event, input: PublishVersionInput) {
  validateChannel(input.channel)

  const plugin = await getPluginById(event, input.pluginId)

  if (!plugin)
    throw createError({ statusCode: 404, statusMessage: 'Plugin not found.' })

  if (plugin.userId !== input.createdBy)
    throw createError({ statusCode: 403, statusMessage: 'You cannot publish versions for this plugin.' })

  const pluginWithVersions = await getPluginById(event, plugin.id, {
    includeVersions: true,
    viewerId: input.createdBy,
    viewerOrgIds: plugin.ownerOrgId ? [plugin.ownerOrgId] : [],
    viewerIsAdmin: false,
  })
  const currentVersions = pluginWithVersions?.versions ?? []

  await ensureSubmissionCooldown(event, input.createdBy)

  const packageBuffer = Buffer.from(await input.packageFile.arrayBuffer())
  const signature = createHash('sha256').update(packageBuffer).digest('hex')

  const metadata = await extractTpexMetadata(packageBuffer)
  const iconResult = await uploadImage(event, input.iconFile)
  const packageResult = await uploadPluginPackage(event, input.packageFile, packageBuffer)

  const now = new Date().toISOString()
  const version: DashboardPluginVersion = {
    id: randomUUID(),
    pluginId: plugin.id,
    createdBy: input.createdBy,
    channel: input.channel,
    version: input.version,
    signature,
    packageKey: packageResult.key,
    packageUrl: packageResult.url,
    packageSize: packageResult.size,
    iconKey: iconResult.key,
    iconUrl: iconResult.url,
    readmeMarkdown: metadata.readmeMarkdown ?? null,
    manifest: metadata.manifest ?? null,
    notes: input.notes ?? null,
    createdAt: now,
    updatedAt: now,
  }

  const db = getD1Database(event)

  if (db) {
    await ensurePluginSchema(db)

    const existing = await db.prepare(`
      SELECT id FROM ${PLUGIN_VERSIONS_TABLE}
      WHERE plugin_id = ?1 AND version = ?2 AND channel = ?3;
    `).bind(plugin.id, input.version, input.channel).first<{ id: string }>()

    if (existing)
      throw createError({ statusCode: 400, statusMessage: 'This version and channel have already been published.' })

    await db.prepare(`
      INSERT INTO ${PLUGIN_VERSIONS_TABLE} (
        id,
        plugin_id,
        created_by,
        channel,
        version,
        signature,
        package_key,
        package_url,
        package_size,
        icon_key,
        icon_url,
        readme_markdown,
        manifest,
        notes,
        created_at,
        updated_at
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16);
    `).bind(
      version.id,
      version.pluginId,
      version.createdBy,
      version.channel,
      version.version,
      version.signature,
      version.packageKey,
      version.packageUrl,
      version.packageSize,
      version.iconKey,
      version.iconUrl,
      version.readmeMarkdown ?? null,
      version.manifest ? JSON.stringify(version.manifest) : null,
      version.notes ?? null,
      version.createdAt,
      version.updatedAt,
    ).run()

    const latest = selectLatestVisibleVersion(
      [...currentVersions, version],
      { ...plugin, versions: currentVersions },
      { viewerId: plugin.userId, viewerOrgIds: plugin.ownerOrgId ? [plugin.ownerOrgId] : [], viewerIsAdmin: false },
    )

    await db.prepare(`
      UPDATE ${PLUGINS_TABLE}
      SET
        latest_version_id = ?1,
        homepage = COALESCE(?2, homepage),
        updated_at = ?3
      WHERE id = ?4;
    `).bind(
      latest?.id ?? version.id,
      input.homepage ?? null,
      version.createdAt,
      plugin.id,
    ).run()
  }
  else {
    const versions = await readCollection<DashboardPluginVersion>(PLUGIN_VERSIONS_KEY)
    if (versions.some(item => item.pluginId === plugin.id && item.version === input.version && item.channel === input.channel)) {
      throw createError({ statusCode: 400, statusMessage: 'This version and channel have already been published.' })
    }

    versions.unshift(version)
    await writeCollection(PLUGIN_VERSIONS_KEY, versions)

    const plugins = await readCollection<DashboardPlugin>(PLUGINS_KEY)
    const index = plugins.findIndex(item => item.id === plugin.id)
    if (index !== -1) {
      const latest = selectLatestVisibleVersion(
        [...currentVersions, version],
        { ...plugin, versions: currentVersions },
        { viewerId: plugin.userId, viewerOrgIds: plugin.ownerOrgId ? [plugin.ownerOrgId] : [], viewerIsAdmin: false },
      )

      plugins[index] = {
        ...plugins[index],
        homepage: input.homepage ?? plugins[index].homepage ?? null,
        latestVersionId: latest?.id ?? version.id,
        updatedAt: version.createdAt,
      }

      await writeCollection(PLUGINS_KEY, plugins)
    }
  }

  return version
}

export async function listPluginVersions(event: H3Event | undefined, pluginId: string, options: PluginVisibilityOptions = {}) {
  const plugin = await getPluginById(event, pluginId, { includeVersions: true, ...options })
  return plugin?.versions ?? []
}

export async function deletePluginVersion(event: H3Event, pluginId: string, versionId: string, options: { bypassOwnerCheck?: boolean } = {}) {
  const plugin = await getPluginById(event, pluginId, { includeVersions: true })

  if (!plugin)
    throw createError({ statusCode: 404, statusMessage: 'Plugin not found.' })

  const version = (plugin.versions ?? []).find(item => item.id === versionId)

  if (!version)
    throw createError({ statusCode: 404, statusMessage: 'Version not found.' })

  if (!options.bypassOwnerCheck && version.createdBy !== plugin.userId)
    throw createError({ statusCode: 403, statusMessage: 'You cannot delete this version.' })

  const db = getD1Database(event)

  if (db) {
    await ensurePluginSchema(db)

    await db.prepare(`
      DELETE FROM ${PLUGIN_VERSIONS_TABLE}
      WHERE id = ?1;
    `).bind(version.id).run()

    await deletePluginPackage(event, version.packageKey)
    await deleteImage(event, version.iconKey)

    const latest = selectLatestVisibleVersion(
      (plugin.versions ?? []).filter(item => item.id !== version.id),
      plugin,
      { viewerId: plugin.userId, viewerOrgIds: plugin.ownerOrgId ? [plugin.ownerOrgId] : [], viewerIsAdmin: false },
    )

    await db.prepare(`
      UPDATE ${PLUGINS_TABLE}
      SET latest_version_id = ?1, updated_at = ?2
      WHERE id = ?3;
    `).bind(
      latest?.id ?? null,
      new Date().toISOString(),
      plugin.id,
    ).run()
  }
  else {
    const versions = await readCollection<DashboardPluginVersion>(PLUGIN_VERSIONS_KEY)
    const remaining = versions.filter(item => item.id !== version.id)
    await writeCollection(PLUGIN_VERSIONS_KEY, remaining)

    await deletePluginPackage(event, version.packageKey)
    await deleteImage(event, version.iconKey)

    const plugins = await readCollection<DashboardPlugin>(PLUGINS_KEY)
    const index = plugins.findIndex(item => item.id === plugin.id)
    if (index !== -1) {
      const remainingVersions = (plugin.versions ?? []).filter(item => item.id !== version.id)
      const latest = selectLatestVisibleVersion(
        remainingVersions,
        plugin,
        { viewerId: plugin.userId, viewerOrgIds: plugin.ownerOrgId ? [plugin.ownerOrgId] : [], viewerIsAdmin: false },
      )

      plugins[index] = {
        ...plugins[index],
        latestVersionId: latest?.id ?? null,
        updatedAt: new Date().toISOString(),
      }

      await writeCollection(PLUGINS_KEY, plugins)
    }
  }

  return version
}

export async function findVersionByPackageKey(event: H3Event, packageKey: string) {
  const db = getD1Database(event)

  if (db) {
    await ensurePluginSchema(db)

    const versionRow = await db.prepare(`
      SELECT *
      FROM ${PLUGIN_VERSIONS_TABLE}
      WHERE package_key = ?1
      LIMIT 1;
    `).bind(packageKey).first<D1PluginVersionRow>()

    if (!versionRow)
      return null

    const pluginRow = await db.prepare(`
      SELECT *
      FROM ${PLUGINS_TABLE}
      WHERE id = ?1
      LIMIT 1;
    `).bind(versionRow.plugin_id).first<D1PluginRow>()

    if (!pluginRow)
      return null

    return {
      plugin: mapPluginRow(pluginRow),
      version: mapPluginVersionRow(versionRow),
    }
  }

  const versions = await readCollection<DashboardPluginVersion>(PLUGIN_VERSIONS_KEY)
  const version = versions.find(item => item.packageKey === packageKey)

  if (!version)
    return null

  const plugins = await readCollection<DashboardPlugin>(PLUGINS_KEY)
  const plugin = plugins.find(item => item.id === version.pluginId)

  if (!plugin)
    return null

  return {
    plugin,
    version,
  }
}
