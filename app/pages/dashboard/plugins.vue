<script setup lang="ts">
import JSZip from 'jszip'
import { computed, reactive, ref } from 'vue'
import { PLUGIN_CATEGORIES, isPluginCategoryId } from '~/utils/plugin-categories'
import { useDashboardPluginsData } from '~/composables/useDashboardData'

type PluginChannel = 'SNAPSHOT' | 'BETA' | 'RELEASE'

interface DashboardPluginAuthor {
  name: string
  avatarColor?: string
}

interface DashboardPluginVersion {
  id: string
  pluginId: string
  channel: PluginChannel
  version: string
  signature: string
  packageUrl: string
  packageKey: string
  iconUrl: string
  iconKey: string
  packageSize: number
  readmeMarkdown?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

interface DashboardPlugin {
  id: string
  userId?: string
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
  versions?: DashboardPluginVersion[]
  latestVersion?: DashboardPluginVersion | null
}

interface PluginFormState {
  name: string
  summary: string
  category: string
  installs: string
  homepage: string
  isOfficial: boolean
  badges: string
  authorName: string
  authorColor: string
}

interface VersionFormState {
  pluginId: string
  version: string
  channel: PluginChannel
  homepage: string
  notes: string
  packageFile: File | null
  iconFile: File | null
}

definePageMeta({
  pageTransition: {
    name: 'fade',
    mode: 'out-in',
  },
})

defineI18nRoute(false)

const { t, locale } = useI18n()
const { user } = useUser()

const { plugins, pending: pluginsPending, refresh: refreshPlugins } = useDashboardPluginsData()

const isAdmin = computed(() => {
  const metadata = (user.value?.publicMetadata ?? {}) as Record<string, unknown>
  return metadata?.role === 'admin'
})

const localeTag = computed(() => (locale.value === 'zh' ? 'zh-CN' : 'en-US'))
const numberFormatter = computed(() => new Intl.NumberFormat(localeTag.value))
const dateFormatter = computed(() => new Intl.DateTimeFormat(localeTag.value, { dateStyle: 'medium' }))

function formatInstalls(count: number) {
  return numberFormatter.value.format(count)
}

function formatDate(value?: string) {
  if (!value)
    return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime()))
    return value
  return dateFormatter.value.format(parsed)
}

const pluginCategoryOptions = computed(() =>
  PLUGIN_CATEGORIES.map(category => ({
    ...category,
    label: t(category.i18nKey),
  })),
)

const pluginCategoryLabels = computed<Record<string, string>>(() =>
  Object.fromEntries(pluginCategoryOptions.value.map(category => [category.id, category.label])),
)

function resolvePluginCategory(category: string) {
  return pluginCategoryLabels.value[category] ?? category
}

const pluginBadgeLabels = computed<Record<string, string>>(() => ({
  featured: t('dashboard.sections.plugins.badges.featured'),
  stable: t('dashboard.sections.plugins.badges.stable'),
  beta: t('dashboard.sections.plugins.badges.beta'),
  community: t('dashboard.sections.plugins.badges.community'),
}))

function resolveBadgeLabel(badge: string) {
  return pluginBadgeLabels.value[badge] ?? badge
}

const defaultPluginCategoryId = PLUGIN_CATEGORIES[0]?.id ?? ''

function createPluginFormState(): PluginFormState {
  return {
    name: '',
    summary: '',
    category: defaultPluginCategoryId,
    installs: '0',
    homepage: '',
    isOfficial: false,
    badges: '',
    authorName: '',
    authorColor: '',
  }
}

const pluginForm = reactive(createPluginFormState())
const showPluginForm = ref(false)
const pluginFormMode = ref<'create' | 'edit'>('create')
const editingPluginId = ref<string | null>(null)
const pluginSaving = ref(false)
const pluginFormError = ref<string | null>(null)

function resetPluginForm() {
  Object.assign(pluginForm, createPluginFormState())
  editingPluginId.value = null
  pluginFormError.value = null
}

function openCreatePluginForm() {
  pluginFormMode.value = 'create'
  resetPluginForm()
  showPluginForm.value = true
}

function openEditPluginForm(plugin: DashboardPlugin) {
  pluginFormMode.value = 'edit'
  editingPluginId.value = plugin.id
  const categoryValue = isPluginCategoryId(plugin.category) ? plugin.category : defaultPluginCategoryId
  Object.assign(pluginForm, {
    name: plugin.name,
    summary: plugin.summary,
    category: categoryValue,
    installs: plugin.installs.toString(),
    homepage: plugin.homepage ?? '',
    isOfficial: plugin.isOfficial,
    badges: (plugin.badges ?? []).join(', '),
    authorName: plugin.author?.name ?? '',
    authorColor: plugin.author?.avatarColor ?? '',
  })
  showPluginForm.value = true
}

function closePluginForm() {
  showPluginForm.value = false
}

async function submitPluginForm() {
  pluginSaving.value = true
  pluginFormError.value = null
  try {
    const installsNumber = Number(pluginForm.installs)
    if (Number.isNaN(installsNumber) || installsNumber < 0)
      throw new Error(t('dashboard.sections.plugins.errors.invalidInstalls'))

    if (!isPluginCategoryId(pluginForm.category))
      throw new Error(t('dashboard.sections.plugins.errors.invalidCategory'))

    const badges = pluginForm.badges
      .split(',')
      .map(badge => badge.trim())
      .filter(Boolean)

    const authorName = pluginForm.authorName.trim()
    const author = authorName
      ? {
          name: authorName,
          avatarColor: pluginForm.authorColor.trim() || undefined,
        }
      : null

    const homepage = pluginForm.homepage.trim()

    const payload = {
      name: pluginForm.name.trim(),
      summary: pluginForm.summary.trim(),
      category: pluginForm.category.trim(),
      installs: installsNumber,
      homepage: homepage.length ? homepage : undefined,
      isOfficial: pluginForm.isOfficial,
      badges,
      author,
    }

    const endpoint = editingPluginId.value
      ? `/api/dashboard/plugins/${editingPluginId.value}`
      : '/api/dashboard/plugins'
    const method = editingPluginId.value ? 'PATCH' : 'POST'

    await $fetch(endpoint, {
      method,
      body: payload,
    })

    await refreshPlugins()
    closePluginForm()
    resetPluginForm()
  }
  catch (error: unknown) {
    pluginFormError.value = error instanceof Error ? error.message : t('dashboard.sections.plugins.errors.unknown')
  }
  finally {
    pluginSaving.value = false
  }
}

async function deletePluginItem(plugin: DashboardPlugin) {
  if (import.meta.client) {
    const confirmed = window.confirm(t('dashboard.sections.plugins.confirmDelete', { name: plugin.name }))
    if (!confirmed)
      return
  }

  try {
    await $fetch(`/api/dashboard/plugins/${plugin.id}`, {
      method: 'DELETE',
    })

    await refreshPlugins()
  }
  catch (error: unknown) {
    pluginFormError.value = error instanceof Error ? error.message : t('dashboard.sections.plugins.errors.unknown')
  }
}

function createVersionFormState(plugin?: DashboardPlugin): VersionFormState {
  return {
    pluginId: plugin?.id ?? '',
    version: '',
    channel: 'SNAPSHOT',
    homepage: plugin?.homepage ?? '',
    notes: '',
    packageFile: null,
    iconFile: null,
  }
}

const versionForm = reactive(createVersionFormState())
const showVersionForm = ref(false)
const versionFormError = ref<string | null>(null)
const versionSaving = ref(false)
const versionReadme = ref('')
const versionPreviewLoading = ref(false)

function resetVersionForm(plugin?: DashboardPlugin) {
  Object.assign(versionForm, createVersionFormState(plugin))
  versionFormError.value = null
  versionReadme.value = ''
  showVersionForm.value = Boolean(plugin)
}

function closeVersionForm() {
  showVersionForm.value = false
  resetVersionForm()
}

function openPublishVersionForm(plugin: DashboardPlugin) {
  resetVersionForm(plugin)
  showVersionForm.value = true
}

async function extractReadmePreview(file: File) {
  versionPreviewLoading.value = true
  versionReadme.value = ''
  try {
    const arrayBuffer = await file.arrayBuffer()
    const zip = await JSZip.loadAsync(arrayBuffer)
    const entries = Object.values(zip.files)
    for (const entry of entries) {
      if (entry.dir)
        continue
      const lower = entry.name.toLowerCase()
      if (lower.endsWith('readme.md') || lower.endsWith('readme')) {
        versionReadme.value = await entry.async('string')
        break
      }
    }
  }
  catch (error: unknown) {
    console.error('Failed to parse README from tpex:', error)
    versionFormError.value = error instanceof Error ? error.message : t('dashboard.sections.plugins.errors.unknown')
  }
  finally {
    versionPreviewLoading.value = false
  }
}

function handleVersionPackageInput(event: Event) {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0] ?? null
  versionForm.packageFile = file
  versionFormError.value = null
  if (file)
    extractReadmePreview(file)
  else
    versionReadme.value = ''
}

function handleVersionIconInput(event: Event) {
  const target = event.target as HTMLInputElement | null
  versionForm.iconFile = target?.files?.[0] ?? null
  versionFormError.value = null
}

async function submitVersionForm() {
  versionSaving.value = true
  versionFormError.value = null

  try {
    if (!versionForm.pluginId)
      throw new Error(t('dashboard.sections.plugins.errors.missingPlugin'))
    if (!versionForm.version.trim())
      throw new Error(t('dashboard.sections.plugins.errors.missingVersion'))
    if (!versionForm.packageFile)
      throw new Error(t('dashboard.sections.plugins.errors.missingPackage'))
    if (!versionForm.iconFile)
      throw new Error(t('dashboard.sections.plugins.errors.missingIcon'))

    const formData = new FormData()
    formData.append('version', versionForm.version.trim())
    formData.append('channel', versionForm.channel)

    const homepage = versionForm.homepage.trim()
    if (homepage.length)
      formData.append('homepage', homepage)

    const notes = versionForm.notes.trim()
    if (notes.length)
      formData.append('notes', notes)

    formData.append('package', versionForm.packageFile)
    formData.append('icon', versionForm.iconFile)

    await $fetch(`/api/dashboard/plugins/${versionForm.pluginId}/versions`, {
      method: 'POST',
      body: formData,
    })

    await refreshPlugins()
    closeVersionForm()
  }
  catch (error: unknown) {
    versionFormError.value = error instanceof Error ? error.message : t('dashboard.sections.plugins.errors.unknown')
  }
  finally {
    versionSaving.value = false
  }
}

async function deletePluginVersion(plugin: DashboardPlugin, version: DashboardPluginVersion) {
  if (import.meta.client) {
    const confirmed = window.confirm(t('dashboard.sections.plugins.confirmDeleteVersion', { version: version.version }))
    if (!confirmed)
      return
  }

  try {
    await $fetch(`/api/dashboard/plugins/${plugin.id}/versions/${version.id}`, {
      method: 'DELETE',
    })

    await refreshPlugins()
  }
  catch (error: unknown) {
    versionFormError.value = error instanceof Error ? error.message : t('dashboard.sections.plugins.errors.unknown')
  }
}
</script>

<template>
  <section class="rounded-3xl border border-primary/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-light/10 dark:bg-dark/70">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-lg font-semibold text-black dark:text-light">
          {{ t('dashboard.sections.plugins.title') }}
        </h2>
        <p class="mt-1 text-sm text-black/70 dark:text-light/80">
          {{ t('dashboard.sections.plugins.subtitle') }}
        </p>
      </div>
      <NuxtLink
        to="/marketplace"
        class="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-black transition hover:border-primary/40 hover:bg-dark/5 dark:border-light/20 dark:text-light dark:hover:bg-light/10"
      >
        <span class="i-carbon-store text-base" />
        {{ t('dashboard.sections.plugins.cta') }}
      </NuxtLink>
    </div>

    <div
      v-if="isAdmin"
      class="mt-6 rounded-2xl border border-dashed border-primary/20 bg-white/70 p-4 text-sm text-black dark:border-light/20 dark:bg-dark/50 dark:text-light"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="text-sm font-semibold text-black dark:text-light">
            {{ t('dashboard.sections.plugins.manageTitle') }}
          </h3>
          <p class="text-xs text-black/60 dark:text-light/70">
            {{ t('dashboard.sections.plugins.manageSubtitle') }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-dark/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black transition hover:border-primary/30 hover:bg-dark/20 dark:border-light/30 dark:bg-light/10 dark:text-light"
            @click="openCreatePluginForm"
          >
            <span class="i-carbon-add text-base" />
            {{ t('dashboard.sections.plugins.addButton') }}
          </button>
          <button
            v-if="showPluginForm"
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-transparent bg-dark/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black/70 transition hover:bg-dark/15 dark:bg-light/10 dark:text-light/70 dark:hover:bg-light/15"
            @click="closePluginForm"
          >
            <span class="i-carbon-close text-base" />
            {{ t('dashboard.sections.plugins.closeButton') }}
          </button>
        </div>
      </div>

      <form
        v-if="showPluginForm"
        class="mt-4 space-y-4"
        @submit.prevent="submitPluginForm"
      >
        <div class="grid gap-4 md:grid-cols-2">
          <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-light/60">
            {{ t('dashboard.sections.plugins.form.name') }}
            <input
              v-model="pluginForm.name"
              type="text"
              required
              class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-black outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-dark/40 dark:text-light dark:focus:border-light/40 dark:focus:ring-light/20"
            >
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-light/60">
            {{ t('dashboard.sections.plugins.form.category') }}
            <select
              v-model="pluginForm.category"
              required
              class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-black outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-dark/40 dark:text-light"
            >
              <option
                v-for="category in pluginCategoryOptions"
                :key="category.id"
                :value="category.id"
              >
                {{ category.label }}
              </option>
            </select>
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-light/60 md:col-span-2">
            {{ t('dashboard.sections.plugins.form.summary') }}
            <textarea
              v-model="pluginForm.summary"
              rows="3"
              required
              class="resize-y rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-black outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-dark/40 dark:text-light"
            ></textarea>
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-light/60">
            {{ t('dashboard.sections.plugins.form.installCount') }}
            <input
              v-model="pluginForm.installs"
              type="number"
              min="0"
              required
              class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-black outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-dark/40 dark:text-light"
            >
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-light/60">
            {{ t('dashboard.sections.plugins.form.homepage') }}
            <input
              v-model="pluginForm.homepage"
              type="url"
              placeholder="https://github.com/..."
              class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-black outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-dark/40 dark:text-light"
            >
          </label>
          <label class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-light/60">
            <input
              v-model="pluginForm.isOfficial"
              type="checkbox"
              class="h-4 w-4 rounded border border-primary/30 text-black focus:ring-primary/40 dark:border-light/30 dark:bg-dark/40"
            >
            {{ t('dashboard.sections.plugins.form.isOfficial') }}
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-light/60 md:col-span-2">
            {{ t('dashboard.sections.plugins.form.badges') }}
            <input
              v-model="pluginForm.badges"
              type="text"
              placeholder="featured, stable"
              class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-black outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-dark/40 dark:text-light"
            >
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-light/60">
            {{ t('dashboard.sections.plugins.form.authorName') }}
            <input
              v-model="pluginForm.authorName"
              type="text"
              class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-black outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-dark/40 dark:text-light"
            >
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-light/60">
            {{ t('dashboard.sections.plugins.form.authorColor') }}
            <input
              v-model="pluginForm.authorColor"
              type="text"
              placeholder="#FAFAFA"
              class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-black outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-dark/40 dark:text-light"
            >
          </label>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <p
            v-if="pluginFormError"
            class="text-xs text-red-500"
          >
            {{ pluginFormError }}
          </p>
          <button
            type="submit"
            class="inline-flex items-center gap-2 rounded-full bg-dark px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-dark/90 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-light dark:text-black dark:hover:bg-light/90"
            :disabled="pluginSaving"
          >
            <span v-if="pluginSaving" class="i-carbon-circle-dash animate-spin" />
            {{ pluginFormMode === 'create' ? t('dashboard.sections.plugins.createSubmit') : t('dashboard.sections.plugins.updateSubmit') }}
          </button>
        </div>
      </form>

      <form
        v-if="showVersionForm"
        class="mt-6 space-y-4"
        @submit.prevent="submitVersionForm"
      >
        <div class="grid gap-4 md:grid-cols-2">
          <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-light/60">
            {{ t('dashboard.sections.plugins.versionForm.version') }}
            <input
              v-model="versionForm.version"
              type="text"
              required
              class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-black outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-dark/40 dark:text-light"
            >
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-light/60">
            {{ t('dashboard.sections.plugins.versionForm.channel') }}
            <select
              v-model="versionForm.channel"
              required
              class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-black outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-dark/40 dark:text-light"
            >
              <option value="SNAPSHOT">SNAPSHOT</option>
              <option value="BETA">BETA</option>
              <option value="RELEASE">RELEASE</option>
            </select>
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-light/60">
            {{ t('dashboard.sections.plugins.form.homepage') }}
            <input
              v-model="versionForm.homepage"
              type="url"
              placeholder="https://github.com/..."
              class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-black outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-dark/40 dark:text-light"
            >
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-light/60">
            {{ t('dashboard.sections.plugins.versionForm.notes') }}
            <textarea
              v-model="versionForm.notes"
              rows="2"
              class="resize-y rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-black outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-dark/40 dark:text-light"
            ></textarea>
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-light/60">
            {{ t('dashboard.sections.plugins.versionForm.package') }}
            <input
              type="file"
              accept=".tpex"
              required
              class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-black outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-dark/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-dark/40 dark:text-light dark:file:bg-light/10 dark:file:text-light"
              @change="handleVersionPackageInput"
            >
          </label>
          <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-light/60">
            {{ t('dashboard.sections.plugins.versionForm.icon') }}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              required
              class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-black outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-dark/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-dark/40 dark:text-light dark:file:bg-light/10 dark:file:text-light"
              @change="handleVersionIconInput"
            >
          </label>
        </div>
        <div class="rounded-2xl border border-primary/10 bg-dark/5 p-4 text-xs text-black/70 dark:border-light/20 dark:bg-light/10 dark:text-light/70">
          <p class="font-semibold uppercase tracking-wide">
            {{ t('dashboard.sections.plugins.readmePreview') }}
          </p>
          <p v-if="versionPreviewLoading" class="mt-2 text-[11px]">
            {{ t('dashboard.sections.plugins.previewLoading') }}
          </p>
          <div v-else-if="versionReadme" class="prose prose-sm mt-2 max-w-none dark:prose-invert">
            <ContentRendererMarkdown :value="versionReadme" />
          </div>
          <p v-else class="mt-2 text-[11px]">
            {{ t('dashboard.sections.plugins.noReadme') }}
          </p>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <p
            v-if="versionFormError"
            class="text-xs text-red-500"
          >
            {{ versionFormError }}
          </p>
          <button
            type="submit"
            class="inline-flex items-center gap-2 rounded-full bg-dark px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-dark/90 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-light dark:text-black dark:hover:bg-light/90"
            :disabled="versionSaving"
          >
            <span v-if="versionSaving" class="i-carbon-circle-dash animate-spin" />
            {{ t('dashboard.sections.plugins.versionForm.submit') }}
          </button>
        </div>
      </form>
    </div>

    <div
      v-if="pluginsPending"
      class="mt-6 rounded-2xl border border-primary/15 bg-white/80 p-6 text-sm text-black/70 dark:border-light/15 dark:bg-dark/40 dark:text-light/80"
    >
      {{ t('dashboard.sections.plugins.loading') }}
    </div>
    <div
      v-else-if="!plugins.length"
      class="mt-6 rounded-2xl border border-primary/15 bg-white/80 p-6 text-sm text-black/70 dark:border-light/15 dark:bg-dark/40 dark:text-light/80"
    >
      {{ t('dashboard.sections.plugins.empty') }}
    </div>
    <div
      v-else
      class="mt-6 space-y-6"
    >
      <article
        v-for="plugin in plugins"
        :key="plugin.id"
        class="rounded-2xl border border-primary/15 bg-white/90 p-5 shadow-sm dark:border-light/15 dark:bg-dark/50"
      >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-primary/15 bg-dark/5 dark:border-light/20 dark:bg-light/10">
            <img
              v-if="plugin.latestVersion?.iconUrl"
              :src="plugin.latestVersion.iconUrl"
              :alt="`${plugin.name} icon`"
              class="h-full w-full object-cover"
            >
            <span v-else class="text-2xl font-semibold text-black/70 dark:text-light/80">
              {{ plugin.name.charAt(0) }}
            </span>
          </div>
          <div class="flex-1 space-y-3">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-base font-semibold text-black dark:text-light">
                    {{ plugin.name }}
                  </h3>
                  <span
                    v-if="plugin.latestVersion"
                    class="inline-flex items-center gap-1 rounded-full bg-dark/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-black dark:bg-light/10 dark:text-light"
                  >
                    {{ plugin.latestVersion.channel }}
                  </span>
                  <span
                    v-if="plugin.isOfficial"
                    class="inline-flex items-center gap-1 rounded-full bg-dark/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-black dark:bg-light/10 dark:text-light"
                  >
                    <span class="i-carbon-certificate text-xs" />
                    {{ t('dashboard.sections.plugins.officialBadge') }}
                  </span>
                </div>
                <p class="text-sm text-black/70 dark:text-light/80">
                  {{ plugin.summary }}
                </p>
                <div class="mt-2 flex flex-wrap items-center gap-3 text-xs text-black/60 dark:text-light/60">
                  <span class="inline-flex items-center gap-1 rounded-full bg-dark/10 px-2 py-0.5 dark:bg-light/10">
                    <span class="i-carbon-tag text-sm" />
                    {{ resolvePluginCategory(plugin.category) }}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <span class="i-carbon-user-multiple text-sm" />
                    {{ t('dashboard.sections.plugins.stats.installs', { count: formatInstalls(plugin.installs) }) }}
                  </span>
                  <span
                    v-if="plugin.latestVersion"
                    class="inline-flex items-center gap-1"
                  >
                    <span class="i-carbon-time text-sm" />
                    {{ formatDate(plugin.latestVersion.createdAt) }}
                  </span>
                  <span
                    v-if="plugin.latestVersion"
                    class="inline-flex items-center gap-1"
                  >
                    <span class="i-carbon-cube text-sm" />
                    v{{ plugin.latestVersion.version }}
                  </span>
                </div>
                <div v-if="plugin.homepage" class="mt-2">
                  <a
                    :href="plugin.homepage"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-xs font-medium text-black underline-offset-2 hover:underline dark:text-light"
                  >
                    <span class="i-carbon-logo-github text-sm" />
                    {{ t('dashboard.sections.plugins.homepage') }}
                  </a>
                </div>
                <div v-if="plugin.badges.length" class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="badge in plugin.badges"
                    :key="badge"
                    class="inline-flex items-center rounded-full bg-dark/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black/80 dark:bg-light/10 dark:text-light/80"
                  >
                    {{ resolveBadgeLabel(badge) }}
                  </span>
                </div>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-if="isAdmin"
                  type="button"
                  class="inline-flex items-center gap-1 rounded-full border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black transition hover:border-primary/30 hover:bg-dark/10 dark:border-light/20 dark:text-light dark:hover:bg-light/10"
                  @click="openPublishVersionForm(plugin)"
                >
                  <span class="i-carbon-cloud-upload text-xs" />
                  {{ t('dashboard.sections.plugins.publishVersion') }}
                </button>
                <button
                  v-if="isAdmin"
                  type="button"
                  class="inline-flex items-center gap-1 rounded-full border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black transition hover:border-primary/30 hover:bg-dark/10 dark:border-light/20 dark:text-light dark:hover:bg-light/10"
                  @click="openEditPluginForm(plugin)"
                >
                  <span class="i-carbon-edit text-xs" />
                  {{ t('dashboard.sections.plugins.editMetadata') }}
                </button>
                <button
                  v-if="isAdmin"
                  type="button"
                  class="inline-flex items-center gap-1 rounded-full border border-red/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-500 transition hover:border-red-400/60 hover:bg-red-50 dark:border-red-400/40 dark:text-red-200 dark:hover:bg-red-400/20"
                  @click="deletePluginItem(plugin)"
                >
                  <span class="i-carbon-trash-can text-xs" />
                  {{ t('dashboard.sections.plugins.delete') }}
                </button>
              </div>
            </div>

            <div class="rounded-2xl border border-primary/10 bg-dark/5 p-4 text-sm text-black/70 dark:border-light/20 dark:bg-light/10 dark:text-light/80">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-semibold text-black dark:text-light">
                    {{ t('dashboard.sections.plugins.versionHistory') }}
                  </p>
                  <p class="text-xs text-black/60 dark:text-light/60">
                    {{ t('dashboard.sections.plugins.versionDescription') }}
                  </p>
                </div>
              </div>
              <div v-if="plugin.versions?.length" class="mt-4 space-y-4">
                <article
                  v-for="version in plugin.versions"
                  :key="version.id"
                  class="rounded-xl border border-primary/15 bg-white/80 p-3 text-xs text-black/80 dark:border-light/15 dark:bg-dark/40 dark:text-light/80"
                >
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p class="text-sm font-semibold text-black dark:text-light">
                        v{{ version.version }} · {{ version.channel }}
                      </p>
                      <p class="mt-1 font-mono text-[11px] text-black/70 dark:text-light/70">
                        {{ t('dashboard.sections.plugins.signature') }}: {{ version.signature }}
                      </p>
                      <p class="text-[11px] text-black/60 dark:text-light/60">
                        {{ formatDate(version.createdAt) }} • {{ version.packageSize ? (version.packageSize / 1024).toFixed(1) : '—' }} KB
                      </p>
                      <p v-if="version.notes" class="mt-1 text-[11px] text-black/70 dark:text-light/70">
                        {{ version.notes }}
                      </p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <a
                        :href="version.packageUrl"
                        target="_blank"
                        rel="noopener"
                        class="inline-flex items-center gap-1 rounded-full border border-primary/20 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-black transition hover:border-primary/30 hover:bg-dark/10 dark:border-light/20 dark:text-light dark:hover:bg-light/10"
                      >
                        <span class="i-carbon-download text-xs" />
                        {{ t('dashboard.sections.plugins.downloadPackage') }}
                      </a>
                      <button
                        v-if="isAdmin"
                        type="button"
                        class="inline-flex items-center gap-1 rounded-full border border-red/20 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-500 transition hover:border-red-400/60 hover:bg-red-50 dark:border-red-400/40 dark:text-red-200 dark:hover:bg-red-400/20"
                        @click="deletePluginVersion(plugin, version)"
                      >
                        <span class="i-carbon-trash-can text-xs" />
                        {{ t('dashboard.sections.plugins.deleteVersion') }}
                      </button>
                    </div>
                  </div>
                  <details class="mt-3 rounded-lg border border-primary/10 bg-dark/5 p-3 dark:border-light/20 dark:bg-light/5">
                    <summary class="cursor-pointer text-xs font-semibold uppercase tracking-wide text-black/70 dark:text-light/70">
                      {{ t('dashboard.sections.plugins.readmePreview') }}
                    </summary>
                    <div v-if="version.readmeMarkdown" class="prose prose-sm mt-2 max-w-none dark:prose-invert">
                      <ContentRendererMarkdown :value="version.readmeMarkdown" />
                    </div>
                    <p v-else class="mt-2 text-[11px] text-black/60 dark:text-light/60">
                      {{ t('dashboard.sections.plugins.noReadme') }}
                    </p>
                  </details>
                </article>
              </div>
              <p v-else class="mt-3 text-xs text-black/60 dark:text-light/60">
                {{ t('dashboard.sections.plugins.noVersions') }}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
