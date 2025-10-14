import type { D1Database } from '@cloudflare/workers-types'
import type { H3Event } from 'h3'
import { randomUUID } from 'node:crypto'
import { useStorage } from '#imports'
import { createError } from 'h3'
import { isPluginCategoryId } from '~/utils/plugin-categories'
import { readCloudflareBindings } from './cloudflare'

const PLUGINS_KEY = 'dashboard:plugins'
const UPDATES_KEY = 'dashboard:updates'
const PLUGINS_TABLE = 'dashboard_plugins'
const UPDATES_TABLE = 'dashboard_updates'

let schemaInitialized = false

interface D1PluginRow {
  id: string
  user_id: string | null
  name: string
  summary: string
  category: string
  installs: number
  icon: string
  last_updated: string
  version: string
  is_official: number
  badges: string | null
  author: string | null
  created_at: string
  updated_at: string
}

interface D1UpdateRow {
  id: string
  title: string
  timestamp: string
  summary: string
  tags: string | null
  link: string
  created_at: string
  updated_at: string
}

function getD1Database(event?: H3Event | null): D1Database | null {
  if (!event)
    return null

  const bindings = readCloudflareBindings(event)
  return bindings?.DB ?? null
}

async function ensureDashboardSchema(db: D1Database) {
  if (schemaInitialized)
    return

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS ${PLUGINS_TABLE} (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT NOT NULL,
      summary TEXT NOT NULL,
      category TEXT NOT NULL,
      installs INTEGER NOT NULL,
      icon TEXT NOT NULL,
      last_updated TEXT NOT NULL,
      version TEXT NOT NULL,
      is_official INTEGER NOT NULL,
      badges TEXT NOT NULL,
      author TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `).run()

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS ${UPDATES_TABLE} (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      summary TEXT NOT NULL,
      tags TEXT NOT NULL,
      link TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `).run()

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
    userId: row.user_id ?? undefined,
    name: row.name,
    summary: row.summary,
    category: row.category,
    installs: Number(row.installs ?? 0),
    icon: row.icon,
    lastUpdated: row.last_updated,
    version: row.version,
    isOfficial: Boolean(row.is_official),
    badges: parseJsonArray(row.badges),
    author: parseJsonObject<DashboardPluginAuthor>(row.author),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapUpdateRow(row: D1UpdateRow): DashboardUpdate {
  return {
    id: row.id,
    title: row.title,
    timestamp: row.timestamp,
    summary: row.summary,
    tags: parseJsonArray(row.tags),
    link: row.link,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export interface DashboardPluginAuthor {
  name: string
  avatarColor?: string
}

export interface DashboardPlugin {
  id: string
  userId?: string
  name: string
  summary: string
  category: string
  installs: number
  icon: string
  lastUpdated: string
  version: string
  isOfficial: boolean
  badges: string[]
  author?: DashboardPluginAuthor | null
  createdAt: string
  updatedAt: string
}

export interface DashboardUpdate {
  id: string
  title: string
  timestamp: string
  summary: string
  tags: string[]
  link: string
  createdAt: string
  updatedAt: string
}

export type PluginInput = Omit<
  DashboardPlugin,
  'id' | 'createdAt' | 'updatedAt'
>

export type UpdateInput = Omit<
  DashboardUpdate,
  'id' | 'createdAt' | 'updatedAt'
>

function validIsoDate(value: string) {
  const date = new Date(value)
  return !Number.isNaN(date.getTime())
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

function sanitizeBadges(badges: string[]): string[] {
  return badges
    .map(badge => badge.trim())
    .filter(badge => badge.length > 0)
}

function normalizeDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime()))
    throw createError({ statusCode: 400, statusMessage: 'Invalid date provided.' })
  return date.toISOString()
}

function normalizePluginInput(input: Partial<PluginInput>, forUpdate = false): PluginInput {
  const {
    name,
    summary,
    category,
    installs,
    icon,
    lastUpdated,
    version,
    isOfficial,
    badges,
    author,
  } = input

  if (!forUpdate || name !== undefined) {
    if (!name || typeof name !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'Plugin name is required.' })
  }

  if (!forUpdate || summary !== undefined) {
    if (!summary || typeof summary !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'Plugin summary is required.' })
  }

  let normalizedCategory = ''

  if (category !== undefined) {
    if (typeof category !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'Plugin category is required.' })
    normalizedCategory = category.trim()
  }

  if (!forUpdate || category !== undefined) {
    if (!normalizedCategory)
      throw createError({ statusCode: 400, statusMessage: 'Plugin category is required.' })
    if (!forUpdate && !isPluginCategoryId(normalizedCategory))
      throw createError({ statusCode: 400, statusMessage: 'Plugin category is not supported.' })
  }

  const installsValue = installs ?? (forUpdate ? undefined : 0)
  if (installsValue === undefined || Number.isNaN(Number(installsValue)))
    throw createError({ statusCode: 400, statusMessage: 'Plugin installs must be a number.' })

  if (!forUpdate || icon !== undefined) {
    if (!icon || typeof icon !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'Plugin icon is required.' })
  }

  if (!forUpdate || lastUpdated !== undefined) {
    if (!lastUpdated || typeof lastUpdated !== 'string' || !validIsoDate(lastUpdated))
      throw createError({ statusCode: 400, statusMessage: 'Plugin lastUpdated must be an ISO date string.' })
  }

  if (!forUpdate || version !== undefined) {
    if (!version || typeof version !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'Plugin version is required.' })
  }

  if (!forUpdate || typeof isOfficial !== 'undefined') {
    if (typeof (isOfficial ?? false) !== 'boolean')
      throw createError({ statusCode: 400, statusMessage: 'Plugin isOfficial must be a boolean.' })
  }

  const normalizedBadges = sanitizeBadges(Array.isArray(badges) ? badges : [])

  let normalizedAuthor: DashboardPluginAuthor | null = null
  if (author && typeof author === 'object') {
    if (!author.name || typeof author.name !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'Plugin author name must be provided when author is set.' })
    normalizedAuthor = {
      name: author.name,
      avatarColor: author.avatarColor && typeof author.avatarColor === 'string' ? author.avatarColor : undefined,
    }
  }

  return {
    name: name ?? '',
    summary: summary ?? '',
    category: normalizedCategory || '',
    installs: Number(installsValue),
    icon: icon ?? '',
    lastUpdated: lastUpdated ? normalizeDate(lastUpdated) : normalizeDate(new Date().toISOString()),
    version: version ?? '',
    isOfficial: Boolean(isOfficial),
    badges: normalizedBadges,
    author: normalizedAuthor,
  }
}

function normalizeUpdateInput(input: Partial<UpdateInput>, forUpdate = false): UpdateInput {
  const { title, timestamp, summary, tags, link } = input

  if (!forUpdate || title !== undefined) {
    if (!title || typeof title !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'Update title is required.' })
  }

  if (!forUpdate || timestamp !== undefined) {
    if (!timestamp || typeof timestamp !== 'string' || !validIsoDate(timestamp))
      throw createError({ statusCode: 400, statusMessage: 'Update timestamp must be an ISO date string.' })
  }

  if (!forUpdate || summary !== undefined) {
    if (!summary || typeof summary !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'Update summary is required.' })
  }

  if (!forUpdate || link !== undefined) {
    if (!link || typeof link !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'Update link is required.' })
  }

  const normalizedTags = sanitizeBadges(Array.isArray(tags) ? tags : [])

  return {
    title: title ?? '',
    timestamp: timestamp ? normalizeDate(timestamp) : new Date().toISOString(),
    summary: summary ?? '',
    tags: normalizedTags,
    link: link ?? '',
  }
}

export async function listPlugins(event?: H3Event, userId?: string): Promise<DashboardPlugin[]> {
  const db = getD1Database(event)

  if (db) {
    await ensureDashboardSchema(db)

    let query = `
      SELECT
        id,
        user_id,
        name,
        summary,
        category,
        installs,
        icon,
        last_updated,
        version,
        is_official,
        badges,
        author,
        created_at,
        updated_at
      FROM ${PLUGINS_TABLE}`

    if (userId) {
      query += ` WHERE user_id = ?1`
    }

    query += ` ORDER BY datetime(created_at) DESC;`

    const stmt = db.prepare(query)
    const { results } = userId
      ? await stmt.bind(userId).all<D1PluginRow>()
      : await stmt.all<D1PluginRow>()

    return (results ?? []).map(mapPluginRow)
  }

  const plugins = await readCollection<DashboardPlugin>(PLUGINS_KEY)
  const normalized = plugins.map(plugin => ({
    ...plugin,
    badges: Array.isArray(plugin.badges) ? plugin.badges : [],
    author: plugin.author ?? null,
  }))

  let filtered = normalized
  if (userId) {
    filtered = normalized.filter(plugin => plugin.userId === userId)
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getPluginById(event: H3Event | undefined, id: string) {
  const db = getD1Database(event)

  if (db) {
    await ensureDashboardSchema(db)

    const row = await db.prepare(`
      SELECT
        id,
        user_id,
        name,
        summary,
        category,
        installs,
        icon,
        last_updated,
        version,
        is_official,
        badges,
        author,
        created_at,
        updated_at
      FROM ${PLUGINS_TABLE}
      WHERE id = ?1;
    `).bind(id).first<D1PluginRow>()

    return row ? mapPluginRow(row) : null
  }

  const plugins = await readCollection<DashboardPlugin>(PLUGINS_KEY)
  return plugins.find(plugin => plugin.id === id) || null
}

export async function createPlugin(event: H3Event, rawInput: Partial<PluginInput>, userId?: string) {
  const input = normalizePluginInput(rawInput)
  const now = new Date().toISOString()

  const newPlugin: DashboardPlugin = {
    id: randomUUID(),
    userId,
    ...input,
    createdAt: now,
    updatedAt: now,
  }

  const db = getD1Database(event)

  if (db) {
    await ensureDashboardSchema(db)

    await db.prepare(`
      INSERT INTO ${PLUGINS_TABLE} (
        id,
        user_id,
        name,
        summary,
        category,
        installs,
        icon,
        last_updated,
        version,
        is_official,
        badges,
        author,
        created_at,
        updated_at
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14);
    `).bind(
      newPlugin.id,
      newPlugin.userId ?? null,
      newPlugin.name,
      newPlugin.summary,
      newPlugin.category,
      newPlugin.installs,
      newPlugin.icon,
      newPlugin.lastUpdated,
      newPlugin.version,
      newPlugin.isOfficial ? 1 : 0,
      JSON.stringify(newPlugin.badges),
      newPlugin.author ? JSON.stringify(newPlugin.author) : null,
      newPlugin.createdAt,
      newPlugin.updatedAt,
    ).run()

    return newPlugin
  }

  const plugins = await listPlugins()
  plugins.unshift(newPlugin)
  await writeCollection(PLUGINS_KEY, plugins)
  return newPlugin
}

export async function updatePlugin(event: H3Event, id: string, rawInput: Partial<PluginInput>) {
  const db = getD1Database(event)

  if (db) {
    await ensureDashboardSchema(db)

    const existing = await getPluginById(event, id)

    if (!existing)
      throw createError({ statusCode: 404, statusMessage: 'Plugin not found.' })

    const mergedInput: PluginInput = normalizePluginInput(
      {
        ...existing,
        ...rawInput,
      },
      true,
    )

    const updatedPlugin: DashboardPlugin = {
      ...existing,
      ...mergedInput,
      updatedAt: new Date().toISOString(),
    }

    await db.prepare(`
      UPDATE ${PLUGINS_TABLE}
      SET
        name = ?1,
        summary = ?2,
        category = ?3,
        installs = ?4,
        icon = ?5,
        last_updated = ?6,
        version = ?7,
        is_official = ?8,
        badges = ?9,
        author = ?10,
        updated_at = ?11
      WHERE id = ?12;
    `).bind(
      updatedPlugin.name,
      updatedPlugin.summary,
      updatedPlugin.category,
      updatedPlugin.installs,
      updatedPlugin.icon,
      updatedPlugin.lastUpdated,
      updatedPlugin.version,
      updatedPlugin.isOfficial ? 1 : 0,
      JSON.stringify(updatedPlugin.badges),
      updatedPlugin.author ? JSON.stringify(updatedPlugin.author) : null,
      updatedPlugin.updatedAt,
      updatedPlugin.id,
    ).run()

    return updatedPlugin
  }

  const plugins = await listPlugins()
  const index = plugins.findIndex(plugin => plugin.id === id)

  if (index === -1)
    throw createError({ statusCode: 404, statusMessage: 'Plugin not found.' })

  const mergedInput: PluginInput = {
    ...plugins[index],
    ...normalizePluginInput(
      {
        ...plugins[index],
        ...rawInput,
      },
      true,
    ),
  }

  const updatedPlugin: DashboardPlugin = {
    ...plugins[index],
    ...mergedInput,
    updatedAt: new Date().toISOString(),
  }

  plugins[index] = updatedPlugin
  await writeCollection(PLUGINS_KEY, plugins)
  return updatedPlugin
}

export async function deletePlugin(event: H3Event, id: string) {
  const db = getD1Database(event)

  if (db) {
    await ensureDashboardSchema(db)

    const result = await db.prepare(`
      DELETE FROM ${PLUGINS_TABLE}
      WHERE id = ?1;
    `).bind(id).run()

    const changes = (result.meta as { changes?: number } | undefined)?.changes ?? 0

    if (changes === 0)
      throw createError({ statusCode: 404, statusMessage: 'Plugin not found.' })

    return
  }

  const plugins = await listPlugins()
  const nextPlugins = plugins.filter(plugin => plugin.id !== id)

  if (nextPlugins.length === plugins.length)
    throw createError({ statusCode: 404, statusMessage: 'Plugin not found.' })

  await writeCollection(PLUGINS_KEY, nextPlugins)
}

export async function listUpdates(event?: H3Event): Promise<DashboardUpdate[]> {
  const db = getD1Database(event)

  if (db) {
    await ensureDashboardSchema(db)

    const { results } = await db.prepare(`
      SELECT
        id,
        title,
        timestamp,
        summary,
        tags,
        link,
        created_at,
        updated_at
      FROM ${UPDATES_TABLE}
      ORDER BY datetime(timestamp) DESC;
    `).all<D1UpdateRow>()

    return (results ?? []).map(mapUpdateRow)
  }

  const updates = await readCollection<DashboardUpdate>(UPDATES_KEY)
  const normalized = updates.map(update => ({
    ...update,
    tags: Array.isArray(update.tags) ? update.tags : [],
  }))

  return normalized.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function getUpdateById(event: H3Event | undefined, id: string) {
  const db = getD1Database(event)

  if (db) {
    await ensureDashboardSchema(db)

    const row = await db.prepare(`
      SELECT
        id,
        title,
        timestamp,
        summary,
        tags,
        link,
        created_at,
        updated_at
      FROM ${UPDATES_TABLE}
      WHERE id = ?1;
    `).bind(id).first<D1UpdateRow>()

    return row ? mapUpdateRow(row) : null
  }

  const updates = await readCollection<DashboardUpdate>(UPDATES_KEY)
  return updates.find(update => update.id === id) || null
}

export async function createUpdate(event: H3Event, rawInput: Partial<UpdateInput>) {
  const input = normalizeUpdateInput(rawInput)
  const now = new Date().toISOString()

  const update: DashboardUpdate = {
    id: randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  }

  const db = getD1Database(event)

  if (db) {
    await ensureDashboardSchema(db)

    await db.prepare(`
      INSERT INTO ${UPDATES_TABLE} (
        id,
        title,
        timestamp,
        summary,
        tags,
        link,
        created_at,
        updated_at
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8);
    `).bind(
      update.id,
      update.title,
      update.timestamp,
      update.summary,
      JSON.stringify(update.tags),
      update.link,
      update.createdAt,
      update.updatedAt,
    ).run()

    return update
  }

  const updates = await listUpdates()
  updates.unshift(update)
  await writeCollection(UPDATES_KEY, updates)
  return update
}

export async function updateUpdate(event: H3Event, id: string, rawInput: Partial<UpdateInput>) {
  const db = getD1Database(event)

  if (db) {
    await ensureDashboardSchema(db)

    const existing = await getUpdateById(event, id)

    if (!existing)
      throw createError({ statusCode: 404, statusMessage: 'Update not found.' })

    const mergedInput: UpdateInput = normalizeUpdateInput(
      {
        ...existing,
        ...rawInput,
      },
      true,
    )

    const updated: DashboardUpdate = {
      ...existing,
      ...mergedInput,
      updatedAt: new Date().toISOString(),
    }

    await db.prepare(`
      UPDATE ${UPDATES_TABLE}
      SET
        title = ?1,
        timestamp = ?2,
        summary = ?3,
        tags = ?4,
        link = ?5,
        updated_at = ?6
      WHERE id = ?7;
    `).bind(
      updated.title,
      updated.timestamp,
      updated.summary,
      JSON.stringify(updated.tags),
      updated.link,
      updated.updatedAt,
      updated.id,
    ).run()

    return updated
  }

  const updates = await listUpdates()
  const index = updates.findIndex(update => update.id === id)

  if (index === -1)
    throw createError({ statusCode: 404, statusMessage: 'Update not found.' })

  const mergedInput: UpdateInput = {
    ...updates[index],
    ...normalizeUpdateInput(
      {
        ...updates[index],
        ...rawInput,
      },
      true,
    ),
  }

  const updated: DashboardUpdate = {
    ...updates[index],
    ...mergedInput,
    updatedAt: new Date().toISOString(),
  }

  updates[index] = updated
  await writeCollection(UPDATES_KEY, updates)
  return updated
}

export async function deleteUpdate(event: H3Event, id: string) {
  const db = getD1Database(event)

  if (db) {
    await ensureDashboardSchema(db)

    const result = await db.prepare(`
      DELETE FROM ${UPDATES_TABLE}
      WHERE id = ?1;
    `).bind(id).run()

    const changes = (result.meta as { changes?: number } | undefined)?.changes ?? 0

    if (changes === 0)
      throw createError({ statusCode: 404, statusMessage: 'Update not found.' })

    return
  }

  const updates = await listUpdates()
  const nextUpdates = updates.filter(update => update.id !== id)

  if (nextUpdates.length === updates.length)
    throw createError({ statusCode: 404, statusMessage: 'Update not found.' })

  await writeCollection(UPDATES_KEY, nextUpdates)
}
