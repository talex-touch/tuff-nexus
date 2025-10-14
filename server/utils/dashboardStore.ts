import { randomUUID } from 'node:crypto'
import { createError } from 'h3'
import { useStorage } from '#imports'

const PLUGINS_KEY = 'dashboard:plugins'
const UPDATES_KEY = 'dashboard:updates'

export interface DashboardPluginAuthor {
  name: string
  avatarColor?: string
}

export interface DashboardPlugin {
  id: string
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

  if (!forUpdate || category !== undefined) {
    if (!category || typeof category !== 'string')
      throw createError({ statusCode: 400, statusMessage: 'Plugin category is required.' })
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
    category: category ?? '',
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

export async function listPlugins(): Promise<DashboardPlugin[]> {
  const plugins = await readCollection<DashboardPlugin>(PLUGINS_KEY)
  const normalized = plugins.map(plugin => ({
    ...plugin,
    badges: Array.isArray(plugin.badges) ? plugin.badges : [],
    author: plugin.author ?? null,
  }))
  return normalized.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getPluginById(id: string) {
  const plugins = await listPlugins()
  return plugins.find(plugin => plugin.id === id) || null
}

export async function createPlugin(rawInput: Partial<PluginInput>) {
  const input = normalizePluginInput(rawInput)
  const now = new Date().toISOString()

  const newPlugin: DashboardPlugin = {
    id: randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  }

  const plugins = await listPlugins()
  plugins.unshift(newPlugin)
  await writeCollection(PLUGINS_KEY, plugins)
  return newPlugin
}

export async function updatePlugin(id: string, rawInput: Partial<PluginInput>) {
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

export async function deletePlugin(id: string) {
  const plugins = await listPlugins()
  const nextPlugins = plugins.filter(plugin => plugin.id !== id)

  if (nextPlugins.length === plugins.length)
    throw createError({ statusCode: 404, statusMessage: 'Plugin not found.' })

  await writeCollection(PLUGINS_KEY, nextPlugins)
}

export async function listUpdates(): Promise<DashboardUpdate[]> {
  const updates = await readCollection<DashboardUpdate>(UPDATES_KEY)
  const normalized = updates.map(update => ({
    ...update,
    tags: Array.isArray(update.tags) ? update.tags : [],
  }))

  return normalized.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function getUpdateById(id: string) {
  const updates = await listUpdates()
  return updates.find(update => update.id === id) || null
}

export async function createUpdate(rawInput: Partial<UpdateInput>) {
  const input = normalizeUpdateInput(rawInput)
  const now = new Date().toISOString()

  const update: DashboardUpdate = {
    id: randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  }

  const updates = await listUpdates()
  updates.unshift(update)
  await writeCollection(UPDATES_KEY, updates)
  return update
}

export async function updateUpdate(id: string, rawInput: Partial<UpdateInput>) {
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

export async function deleteUpdate(id: string) {
  const updates = await listUpdates()
  const nextUpdates = updates.filter(update => update.id !== id)

  if (nextUpdates.length === updates.length)
    throw createError({ statusCode: 404, statusMessage: 'Update not found.' })

  await writeCollection(UPDATES_KEY, nextUpdates)
}
