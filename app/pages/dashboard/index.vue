<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nuxt/components'

definePageMeta({
  layout: 'dashboard',
  requiresAuth: true,
  pageTransition: {
    name: 'fade',
    mode: 'out-in',
  },
})

defineI18nRoute(false)

const { t, locale } = useI18n()
const route = useRoute()
const redirectUrl = computed(() => route.fullPath)

const { user, isLoaded } = useUser()

const fallbackName = computed(() => t('dashboard.header.defaultName'))

const greetingName = computed(() => {
  if (!isLoaded.value || !user.value)
    return fallbackName.value
  return user.value.firstName || user.value.fullName || fallbackName.value
})

const greetingLine = computed(() => t('dashboard.header.greeting', { name: greetingName.value }))

type PanelId = 'overview' | 'next-steps' | 'shortcuts' | 'plugins' | 'team' | 'updates'

const activePanel = ref<PanelId>('overview')

interface DashboardPluginAuthor {
  name: string
  avatarColor?: string
}

interface DashboardPlugin {
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
}

interface DashboardUpdate {
  id: string
  title: string
  timestamp: string
  summary: string
  tags: string[]
  link: string
}

interface DashboardTeamMember {
  id: string
  name: string
  role: string
  status: string
}

interface DashboardTeam {
  name: string
  plan: string
  slots: {
    total: number
    used: number
  }
  members: DashboardTeamMember[]
  invitations: unknown[]
  upcoming?: {
    label: string
    date: string
  }
  notes?: string
}

interface PluginFormState {
  name: string
  summary: string
  category: string
  installs: string
  icon: string
  lastUpdated: string
  version: string
  isOfficial: boolean
  badges: string
  authorName: string
  authorColor: string
}

interface UpdateFormState {
  title: string
  summary: string
  tags: string
  link: string
  timestamp: string
}

const {
  data: pluginsPayload,
  pending: pluginsPending,
  refresh: refreshPlugins,
} = await useAsyncData('dashboard-plugins', () =>
  $fetch<{ plugins: DashboardPlugin[]; featured: DashboardPlugin[]; total: number }>('/api/dashboard/plugins'),
)

const {
  data: updatesPayload,
  pending: updatesPending,
  refresh: refreshUpdates,
} = await useAsyncData('dashboard-updates', () =>
  $fetch<{ updates: DashboardUpdate[] }>('/api/dashboard/updates'),
)

const { data: teamPayload, pending: teamPending } = await useAsyncData('dashboard-team', () =>
  $fetch<{ team: DashboardTeam }>('/api/dashboard/team'),
)

const plugins = computed(() => pluginsPayload.value?.plugins ?? [])
const updates = computed(() => updatesPayload.value?.updates ?? [])
const team = computed(() => teamPayload.value?.team)

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

const overviewItems = computed(() => [
  {
    icon: 'i-carbon-rocket',
    text: t('dashboard.sections.overview.items.betaAccess'),
  },
  {
    icon: 'i-carbon-notification',
    text: t('dashboard.sections.overview.items.releaseNotify'),
  },
  {
    icon: 'i-carbon-chart-combo',
    text: t('dashboard.sections.overview.items.insights'),
  },
])

const nextStepItems = computed(() => [
  {
    icon: 'i-carbon-link',
    text: t('dashboard.sections.nextSteps.items.connectWorkspace'),
  },
  {
    icon: 'i-carbon-calendar',
    text: t('dashboard.sections.nextSteps.items.scheduleOnboarding'),
  },
  {
    icon: 'i-carbon-user-multiple',
    text: t('dashboard.sections.nextSteps.items.inviteTeammates'),
  },
])

const shortcutLinks = computed(() => [
  {
    to: '/docs/getting-started',
    label: t('dashboard.sections.shortcuts.links.gettingStarted'),
  },
  {
    to: '/marketplace',
    label: t('dashboard.sections.shortcuts.links.marketplace'),
  },
  {
    to: '/developers',
    label: t('dashboard.sections.shortcuts.links.developers'),
  },
])

const menuItems = computed(() => [
  {
    id: 'overview',
    label: t('dashboard.sections.menu.overview'),
  },
  {
    id: 'next-steps',
    label: t('dashboard.sections.menu.nextSteps'),
  },
  {
    id: 'shortcuts',
    label: t('dashboard.sections.menu.shortcuts'),
  },
  {
    id: 'plugins',
    label: t('dashboard.sections.menu.plugins'),
  },
  {
    id: 'team',
    label: t('dashboard.sections.menu.team'),
  },
  {
    id: 'updates',
    label: t('dashboard.sections.menu.updates'),
  },
])

const pluginBadgeLabels = computed<Record<string, string>>(() => ({
  featured: t('dashboard.sections.plugins.badges.featured'),
  stable: t('dashboard.sections.plugins.badges.stable'),
  beta: t('dashboard.sections.plugins.badges.beta'),
  community: t('dashboard.sections.plugins.badges.community'),
}))

function resolveBadgeLabel(badge: string) {
  return pluginBadgeLabels.value[badge] ?? badge
}

const teamStatusLabels = computed<Record<string, string>>(() => ({
  active: t('dashboard.sections.team.memberStatus.active'),
  automation: t('dashboard.sections.team.memberStatus.automation'),
  invited: t('dashboard.sections.team.memberStatus.invited'),
}))

function resolveTeamStatus(status: string) {
  return teamStatusLabels.value[status] ?? status
}

function selectPanel(panel: PanelId) {
  activePanel.value = panel
}

function isActivePanel(panel: PanelId) {
  return activePanel.value === panel
}

const todayInput = () => new Date().toISOString().slice(0, 10)

function createPluginFormState(): PluginFormState {
  return {
    name: '',
    summary: '',
    category: '',
    installs: '0',
    icon: 'i-carbon-cube',
    lastUpdated: todayInput(),
    version: '0.1.0',
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
  Object.assign(pluginForm, {
    name: plugin.name,
    summary: plugin.summary,
    category: plugin.category,
    installs: plugin.installs.toString(),
    icon: plugin.icon,
    lastUpdated: plugin.lastUpdated ? plugin.lastUpdated.slice(0, 10) : todayInput(),
    version: plugin.version,
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

    const lastUpdatedIso = pluginForm.lastUpdated
      ? new Date(`${pluginForm.lastUpdated}T00:00:00Z`).toISOString()
      : new Date().toISOString()

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

    const payload = {
      name: pluginForm.name.trim(),
      summary: pluginForm.summary.trim(),
      category: pluginForm.category.trim(),
      installs: installsNumber,
      icon: pluginForm.icon.trim(),
      lastUpdated: lastUpdatedIso,
      version: pluginForm.version.trim(),
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

function createUpdateFormState(): UpdateFormState {
  return {
    title: '',
    summary: '',
    tags: '',
    link: '',
    timestamp: todayInput(),
  }
}

const updateForm = reactive(createUpdateFormState())
const showUpdateForm = ref(false)
const updateFormMode = ref<'create' | 'edit'>('create')
const editingUpdateId = ref<string | null>(null)
const updateSaving = ref(false)
const updateFormError = ref<string | null>(null)

function resetUpdateForm() {
  Object.assign(updateForm, createUpdateFormState())
  editingUpdateId.value = null
  updateFormError.value = null
}

function openCreateUpdateForm() {
  updateFormMode.value = 'create'
  resetUpdateForm()
  showUpdateForm.value = true
}

function openEditUpdateForm(update: DashboardUpdate) {
  updateFormMode.value = 'edit'
  editingUpdateId.value = update.id
  Object.assign(updateForm, {
    title: update.title,
    summary: update.summary,
    tags: update.tags.join(', '),
    link: update.link,
    timestamp: update.timestamp ? update.timestamp.slice(0, 10) : todayInput(),
  })
  showUpdateForm.value = true
}

function closeUpdateForm() {
  showUpdateForm.value = false
}

async function submitUpdateForm() {
  updateSaving.value = true
  updateFormError.value = null

  try {
    const timestampIso = updateForm.timestamp
      ? new Date(`${updateForm.timestamp}T00:00:00Z`).toISOString()
      : new Date().toISOString()

    const tags = updateForm.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)

    const payload = {
      title: updateForm.title.trim(),
      summary: updateForm.summary.trim(),
      link: updateForm.link.trim(),
      tags,
      timestamp: timestampIso,
    }

    const endpoint = editingUpdateId.value
      ? `/api/dashboard/updates/${editingUpdateId.value}`
      : '/api/dashboard/updates'
    const method = editingUpdateId.value ? 'PATCH' : 'POST'

    await $fetch(endpoint, {
      method,
      body: payload,
    })

    await refreshUpdates()
    closeUpdateForm()
    resetUpdateForm()
  }
  catch (error: unknown) {
    updateFormError.value = error instanceof Error ? error.message : t('dashboard.sections.updates.errors.unknown')
  }
  finally {
    updateSaving.value = false
  }
}

async function deleteUpdateItem(update: DashboardUpdate) {
  if (import.meta.client) {
    const confirmed = window.confirm(t('dashboard.sections.updates.confirmDelete', { title: update.title }))
    if (!confirmed)
      return
  }

  try {
    await $fetch(`/api/dashboard/updates/${update.id}`, {
      method: 'DELETE',
    })

    await refreshUpdates()
  }
  catch (error: unknown) {
    updateFormError.value = error instanceof Error ? error.message : t('dashboard.sections.updates.errors.unknown')
  }
}
</script>

<template>
  <SignedIn>
    <section class="grid gap-8 lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr]">
      <aside class="space-y-6">
        <nav
          class="rounded-3xl border border-primary/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-light/10 dark:bg-primary/70"
          aria-label="Dashboard sections"
        >
          <p class="text-sm font-semibold uppercase tracking-wide text-primary/70 dark:text-light/80">
            {{ t('dashboard.sections.menu.title') }}
          </p>
          <ul
            class="mt-4 flex flex-col gap-2 text-sm"
            role="listbox"
            aria-label="Dashboard panels"
          >
            <li
              v-for="item in menuItems"
              :key="item.id"
            >
              <button
                type="button"
                class="group flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-primary/75 transition hover:bg-primary/5 hover:text-primary dark:text-light/70 dark:hover:bg-light/10 dark:hover:text-light"
                :class="isActivePanel(item.id as PanelId) ? 'bg-primary/5 text-primary dark:bg-light/15 dark:text-light' : ''"
                :aria-selected="isActivePanel(item.id as PanelId)"
                role="option"
                @click="selectPanel(item.id as PanelId)"
              >
                <span>{{ item.label }}</span>
                <span class="i-carbon-arrow-right text-base opacity-20 transition duration-200 group-hover:translate-x-0.5 group-hover:opacity-70" />
              </button>
            </li>
          </ul>
        </nav>

        <div class="rounded-3xl border border-primary/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-light/10 dark:bg-primary/60">
          <p class="text-xs uppercase tracking-widest text-primary/60 dark:text-light/60">
            {{ t('dashboard.sections.menu.betaHeading') }}
          </p>
          <p class="mt-2 text-sm text-primary/75 dark:text-light/80">
            {{ t('dashboard.sections.menu.betaDescription') }}
          </p>
        </div>
      </aside>

      <div class="space-y-8">
        <header class="rounded-3xl border border-primary/10 bg-white/80 p-10 shadow-lg backdrop-blur-sm dark:border-light/10 dark:bg-primary/70">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-sm uppercase tracking-widest text-primary/70 dark:text-light/80">
                {{ t('dashboard.header.badge') }}
              </p>
              <h1 class="mt-2 text-3xl font-semibold tracking-tight text-primary dark:text-light">
                {{ greetingLine }}
              </h1>
              <p class="mt-3 max-w-2xl text-base text-primary/70 dark:text-light/80">
                {{ t('dashboard.header.intro') }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <NuxtLink
                to="/docs"
                class="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition hover:border-primary/40 hover:bg-primary/10 dark:border-light/20 dark:bg-light/10 dark:text-light"
              >
                {{ t('dashboard.header.docsCta') }}
              </NuxtLink>
              <NuxtLink
                to="/marketplace"
                class="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90 dark:bg-light dark:text-primary dark:shadow-light/40 dark:hover:bg-light/90"
              >
                {{ t('dashboard.header.marketplaceCta') }}
              </NuxtLink>
            </div>
          </div>
        </header>

        <Transition name="fade" mode="out-in">
          <article
            v-if="activePanel === 'overview'"
            key="overview"
            class="rounded-3xl border border-primary/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-light/10 dark:bg-primary/60"
          >
            <h2 class="text-lg font-semibold text-primary dark:text-light">
              {{ t('dashboard.sections.overview.title') }}
            </h2>
            <ul class="mt-4 space-y-3 text-sm text-primary/70 dark:text-light/80">
              <li
                v-for="item in overviewItems"
                :key="item.icon"
                class="flex items-center gap-2"
              >
                <span
                  :class="[item.icon, 'text-lg text-primary dark:text-light']"
                />
                {{ item.text }}
              </li>
            </ul>
          </article>
          <article
            v-else-if="activePanel === 'next-steps'"
            key="next-steps"
            class="rounded-3xl border border-primary/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-light/10 dark:bg-primary/60"
          >
            <h2 class="text-lg font-semibold text-primary dark:text-light">
              {{ t('dashboard.sections.nextSteps.title') }}
            </h2>
            <ul class="mt-4 space-y-3 text-sm text-primary/70 dark:text-light/80">
              <li
                v-for="item in nextStepItems"
                :key="item.icon"
                class="flex items-center gap-2"
              >
                <span
                  :class="[item.icon, 'text-lg text-primary dark:text-light']"
                />
                {{ item.text }}
              </li>
            </ul>
          </article>
          <article
            v-else-if="activePanel === 'shortcuts'"
            key="shortcuts"
            class="rounded-3xl border border-primary/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-light/10 dark:bg-primary/60"
          >
            <h2 class="text-lg font-semibold text-primary dark:text-light">
              {{ t('dashboard.sections.shortcuts.title') }}
            </h2>
            <div class="mt-4 grid grid-cols-1 gap-3 text-sm">
              <NuxtLink
                v-for="shortcut in shortcutLinks"
                :key="shortcut.to"
                :to="shortcut.to"
                class="flex items-center justify-between rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 font-medium text-primary transition hover:border-primary/30 hover:bg-primary/10 dark:border-light/15 dark:bg-light/10 dark:text-light"
              >
                {{ shortcut.label }}
                <span class="i-carbon-arrow-right text-base" />
              </NuxtLink>
            </div>
          </article>
          <section
            v-else-if="activePanel === 'plugins'"
            key="plugins"
            class="rounded-3xl border border-primary/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-light/10 dark:bg-primary/70"
          >
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-primary dark:text-light">
                {{ t('dashboard.sections.plugins.title') }}
              </h2>
              <p class="mt-1 text-sm text-primary/70 dark:text-light/80">
                {{ t('dashboard.sections.plugins.subtitle') }}
              </p>
            </div>
            <NuxtLink
              to="/marketplace"
              class="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition hover:border-primary/40 hover:bg-primary/5 dark:border-light/20 dark:text-light dark:hover:bg-light/10"
            >
              <span class="i-carbon-cloud-upload text-base" />
              {{ t('dashboard.sections.plugins.cta') }}
            </NuxtLink>
          </div>

          <div
            v-if="isAdmin"
            class="mt-6 rounded-2xl border border-dashed border-primary/20 bg-white/70 p-4 text-sm text-primary dark:border-light/20 dark:bg-primary/50 dark:text-light"
          >
            <div class="flex flex-col gap-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 class="text-sm font-semibold text-primary dark:text-light">
                    {{ t('dashboard.sections.plugins.manageTitle') }}
                  </h3>
                  <p class="text-xs text-primary/60 dark:text-light/70">
                    {{ t('dashboard.sections.plugins.manageSubtitle') }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary transition hover:border-primary/30 hover:bg-primary/20 dark:border-light/30 dark:bg-light/10 dark:text-light"
                    @click="openCreatePluginForm"
                  >
                    <span class="i-carbon-add text-base" />
                    {{ t('dashboard.sections.plugins.addButton') }}
                  </button>
                  <button
                    v-if="showPluginForm"
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-transparent bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary/70 transition hover:bg-primary/15 dark:bg-light/10 dark:text-light/70 dark:hover:bg-light/15"
                    @click="closePluginForm"
                  >
                    <span class="i-carbon-close text-base" />
                    {{ t('dashboard.sections.plugins.closeButton') }}
                  </button>
                </div>
              </div>

              <form
                v-if="showPluginForm"
                class="space-y-4"
                @submit.prevent="submitPluginForm"
              >
                <div class="grid gap-4 md:grid-cols-2">
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 dark:text-light/60">
                    {{ t('dashboard.sections.plugins.form.name') }}
                    <input
                      v-model="pluginForm.name"
                      type="text"
                      required
                      class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-primary/40 dark:text-light dark:focus:border-light/40 dark:focus:ring-light/20"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 dark:text-light/60">
                    {{ t('dashboard.sections.plugins.form.category') }}
                    <input
                      v-model="pluginForm.category"
                      type="text"
                      required
                      class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-primary/40 dark:text-light"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 dark:text-light/60 md:col-span-2">
                    {{ t('dashboard.sections.plugins.form.summary') }}
                    <textarea
                      v-model="pluginForm.summary"
                      rows="3"
                      required
                      class="resize-y rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-primary/40 dark:text-light"
                    ></textarea>
                  </label>
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 dark:text-light/60">
                    {{ t('dashboard.sections.plugins.form.installCount') }}
                    <input
                      v-model="pluginForm.installs"
                      type="number"
                      min="0"
                      required
                      class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-primary/40 dark:text-light"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 dark:text-light/60">
                    {{ t('dashboard.sections.plugins.form.icon') }}
                    <input
                      v-model="pluginForm.icon"
                      type="text"
                      required
                      placeholder="i-carbon-cube"
                      class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-primary/40 dark:text-light"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 dark:text-light/60">
                    {{ t('dashboard.sections.plugins.form.version') }}
                    <input
                      v-model="pluginForm.version"
                      type="text"
                      required
                      class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-primary/40 dark:text-light"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 dark:text-light/60">
                    {{ t('dashboard.sections.plugins.form.lastUpdated') }}
                    <input
                      v-model="pluginForm.lastUpdated"
                      type="date"
                      required
                      class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-primary/40 dark:text-light"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 dark:text-light/60">
                    {{ t('dashboard.sections.plugins.form.badges') }}
                    <input
                      v-model="pluginForm.badges"
                      type="text"
                      placeholder="featured, beta"
                      class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-primary/40 dark:text-light"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 dark:text-light/60">
                    {{ t('dashboard.sections.plugins.form.authorName') }}
                    <input
                      v-model="pluginForm.authorName"
                      type="text"
                      placeholder="Greywater Studio"
                      class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-primary/40 dark:text-light"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 dark:text-light/60">
                    {{ t('dashboard.sections.plugins.form.authorColor') }}
                    <input
                      v-model="pluginForm.authorColor"
                      type="text"
                      placeholder="#0f172a"
                      class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-primary/40 dark:text-light"
                    >
                  </label>
                  <label class="md:col-span-2 flex items-center gap-2 rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary/70 dark:border-light/20 dark:bg-primary/40 dark:text-light/80">
                    <input
                      v-model="pluginForm.isOfficial"
                      type="checkbox"
                      class="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary dark:border-light/30 dark:bg-primary/20 dark:text-light"
                    >
                    {{ t('dashboard.sections.plugins.form.isOfficial') }}
                  </label>
                </div>
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <p
                    v-if="pluginFormError"
                    class="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-200"
                  >
                    {{ pluginFormError }}
                  </p>
                  <button
                    type="submit"
                    class="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-primary/40 transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60 dark:bg-light dark:text-primary dark:hover:bg-light/90"
                    :disabled="pluginSaving"
                  >
                    <span class="i-carbon-checkmark text-base" />
                    {{
                      pluginFormMode === 'create'
                        ? t('dashboard.sections.plugins.createSubmit')
                        : t('dashboard.sections.plugins.updateSubmit')
                    }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="mt-6 space-y-4">
            <div
              v-if="pluginsPending"
              class="flex items-center gap-3 rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-4 py-6 text-sm text-primary/60 dark:border-light/20 dark:bg-light/5 dark:text-light/70"
            >
              <span class="i-carbon-circle-dash animate-spin text-base" />
              <span>{{ t('dashboard.sections.plugins.loading') }}</span>
            </div>

            <div
              v-else-if="!plugins.length"
              class="rounded-2xl border border-dashed border-primary/15 bg-white/70 px-4 py-6 text-sm text-primary/60 dark:border-light/20 dark:bg-primary/60 dark:text-light/70"
            >
              {{ t('dashboard.sections.plugins.empty') }}
            </div>

            <div
              v-else
              class="grid gap-4 md:grid-cols-2"
            >
              <article
                v-for="plugin in plugins"
                :key="plugin.id"
                class="group relative overflow-hidden rounded-2xl border border-primary/10 bg-white/70 p-5 transition hover:border-primary/30 hover:shadow-lg dark:border-light/10 dark:bg-primary/60"
              >
                <div
                  v-if="isAdmin"
                  class="absolute right-4 top-4 flex items-center gap-2"
                >
                  <button
                    type="button"
                    class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-white/80 text-primary/70 transition hover:border-primary/40 hover:text-primary dark:border-light/20 dark:bg-primary/40 dark:text-light/70"
                    @click.stop="openEditPluginForm(plugin)"
                  >
                    <span class="i-carbon-edit text-sm" />
                  </button>
                  <button
                    type="button"
                    class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 transition hover:border-red-300 hover:text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"
                    @click.stop="deletePluginItem(plugin)"
                  >
                    <span class="i-carbon-trash-can text-sm" />
                  </button>
                </div>
                <div class="flex items-start justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <span :class="[plugin.icon, 'rounded-xl bg-primary/10 p-2 text-xl text-primary dark:bg-light/10 dark:text-light']" />
                    <div>
                      <p class="text-xs uppercase tracking-widest text-primary/60 dark:text-light/60">
                        {{ plugin.category }}
                      </p>
                      <h3 class="mt-1 text-base font-semibold text-primary dark:text-light">
                        {{ plugin.name }}
                      </h3>
                    </div>
                  </div>
                  <span
                    v-if="plugin.isOfficial"
                    class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary dark:bg-light/10 dark:text-light/80"
                  >
                    <span class="i-carbon-star text-sm" />
                    {{ t('dashboard.sections.plugins.officialBadge') }}
                  </span>
                </div>
                <p class="mt-3 text-sm leading-relaxed text-primary/70 dark:text-light/80">
                  {{ plugin.summary }}
                </p>

                <div class="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-medium text-primary/60 dark:text-light/60">
                  <span class="inline-flex items-center gap-1 rounded-full bg-primary/5 px-3 py-1 text-primary/70 dark:bg-light/10 dark:text-light/70">
                    <span class="i-carbon-user-multiple text-sm" />
                    {{ t('dashboard.sections.plugins.stats.installs', { count: formatInstalls(plugin.installs) }) }}
                  </span>
                  <span class="inline-flex items-center gap-1 rounded-full bg-primary/5 px-3 py-1 text-primary/70 dark:bg-light/10 dark:text-light/70">
                    <span class="i-carbon-time text-sm" />
                    {{ t('dashboard.sections.plugins.updatedOn', { date: formatDate(plugin.lastUpdated) }) }}
                  </span>
                  <span class="inline-flex items-center gap-1 rounded-full bg-primary/5 px-3 py-1 text-primary/70 dark:bg-light/10 dark:text-light/70">
                    <span class="i-carbon-cube text-sm" />
                    v{{ plugin.version }}
                  </span>
                  <span
                    v-for="badge in plugin.badges || []"
                    :key="badge"
                    class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary/70 dark:bg-light/10 dark:text-light/70"
                  >
                    <span class="i-carbon-badge text-sm" />
                    {{ resolveBadgeLabel(badge) }}
                  </span>
                  <span
                    v-if="!plugin.isOfficial && plugin.author"
                    class="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-primary/70 dark:bg-light/10 dark:text-light/70"
                  >
                    <span
                      class="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                      :style="{ backgroundColor: plugin.author.avatarColor ?? '#1f2937' }"
                    >
                      {{ plugin.author.name.slice(0, 2).toUpperCase() }}
                    </span>
                    {{ plugin.author.name }}
                  </span>
                </div>
              </article>
            </div>
          </div>
          </section>
          <section
            v-else-if="activePanel === 'team'"
            key="team"
            class="rounded-3xl border border-primary/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-light/10 dark:bg-primary/70"
          >
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-primary dark:text-light">
                {{ t('dashboard.sections.team.title') }}
              </h2>
              <p class="mt-1 text-sm text-primary/70 dark:text-light/80">
                {{ t('dashboard.sections.team.subtitle') }}
              </p>
            </div>
            <a
              href="https://docs.tuff.chat/changelog/teams-preview"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition hover:border-primary/40 hover:bg-primary/5 dark:border-light/20 dark:text-light dark:hover:bg-light/10"
            >
              <span class="i-carbon-progress-bar text-base" />
              {{ t('dashboard.sections.team.waitlistCta') }}
            </a>
          </div>

          <div class="mt-6 space-y-4">
            <div
              v-if="teamPending"
              class="flex items-center gap-3 rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-4 py-6 text-sm text-primary/60 dark:border-light/20 dark:bg-light/5 dark:text-light/70"
            >
              <span class="i-carbon-circle-dash animate-spin text-base" />
              <span>{{ t('dashboard.sections.team.pending') }}</span>
            </div>

            <div v-else>
              <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
                <div class="rounded-2xl border border-primary/10 bg-white/70 p-4 dark:border-light/10 dark:bg-primary/60">
                  <p class="text-xs uppercase tracking-widest text-primary/60 dark:text-light/60">
                    {{ t('dashboard.sections.team.seatUsage', { used: team?.slots?.used ?? 0, total: team?.slots?.total ?? 0 }) }}
                  </p>
                  <ul class="mt-4 space-y-3">
                    <li
                      v-for="member in team?.members || []"
                      :key="member.id"
                      class="flex items-center justify-between gap-3 rounded-xl border border-primary/10 bg-white/80 px-3 py-3 text-sm dark:border-light/10 dark:bg-primary/50"
                    >
                      <div>
                        <p class="font-medium text-primary dark:text-light">
                          {{ member.name }}
                        </p>
                        <p class="text-xs uppercase tracking-widest text-primary/60 dark:text-light/60">
                          {{ member.role }}
                        </p>
                      </div>
                      <span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary dark:bg-light/10 dark:text-light/80">
                        {{ resolveTeamStatus(member.status) }}
                      </span>
                    </li>
                    <li
                      v-if="!(team?.members?.length)"
                      class="rounded-xl border border-dashed border-primary/15 bg-white/60 px-3 py-3 text-xs text-primary/60 dark:border-light/20 dark:bg-primary/50 dark:text-light/70"
                    >
                      {{ t('dashboard.sections.team.emptyMembers') }}
                    </li>
                  </ul>
                </div>

                <div class="rounded-2xl border border-primary/10 bg-white/70 p-4 text-sm text-primary/70 dark:border-light/10 dark:bg-primary/60 dark:text-light/80">
                  <div class="space-y-2">
                    <div>
                      <p class="text-xs uppercase tracking-widest text-primary/60 dark:text-light/60">
                        {{ t('dashboard.sections.team.statusLabel') }}
                      </p>
                      <p class="mt-1 font-medium text-primary dark:text-light">
                        {{ t('dashboard.sections.team.previewStatus') }}
                      </p>
                    </div>
                    <div
                      v-if="team?.upcoming"
                      class="pt-2"
                    >
                      <p class="text-xs uppercase tracking-widest text-primary/60 dark:text-light/60">
                        {{ t('dashboard.sections.team.upcomingLabel') }}
                      </p>
                      <p class="mt-1 font-medium text-primary dark:text-light">
                        {{ team?.upcoming?.label }} · {{ formatDate(team?.upcoming?.date) }}
                      </p>
                    </div>
                    <div class="pt-2">
                      <p class="text-xs uppercase tracking-widest text-primary/60 dark:text-light/60">
                        {{ t('dashboard.sections.team.notesLabel') }}
                      </p>
                      <p class="mt-1 leading-relaxed">
                        {{ team?.notes || t('dashboard.sections.team.notesPlaceholder') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </section>
          <section
            v-else
            key="updates"
            class="rounded-3xl border border-primary/10 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-light/10 dark:bg-primary/70"
          >
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-primary dark:text-light">
                {{ t('dashboard.sections.updates.title') }}
              </h2>
              <p class="mt-1 text-sm text-primary/70 dark:text-light/80">
                {{ t('dashboard.sections.updates.subtitle') }}
              </p>
            </div>
            <a
              href="https://docs.tuff.chat/changelog"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition hover:border-primary/40 hover:bg-primary/5 dark:border-light/20 dark:text-light dark:hover:bg-light/10"
            >
              <span class="i-carbon-news text-base" />
              {{ t('dashboard.sections.updates.cta') }}
            </a>
          </div>

          <div
            v-if="isAdmin"
            class="mt-6 rounded-2xl border border-dashed border-primary/20 bg-white/70 p-4 text-sm text-primary dark:border-light/20 dark:bg-primary/50 dark:text-light"
          >
            <div class="flex flex-col gap-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 class="text-sm font-semibold text-primary dark:text-light">
                    {{ t('dashboard.sections.updates.manageTitle') }}
                  </h3>
                  <p class="text-xs text-primary/60 dark:text-light/70">
                    {{ t('dashboard.sections.updates.manageSubtitle') }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary transition hover:border-primary/30 hover:bg-primary/20 dark:border-light/30 dark:bg-light/10 dark:text-light"
                    @click="openCreateUpdateForm"
                  >
                    <span class="i-carbon-add text-base" />
                    {{ t('dashboard.sections.updates.addButton') }}
                  </button>
                  <button
                    v-if="showUpdateForm"
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-transparent bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary/70 transition hover:bg-primary/15 dark:bg-light/10 dark:text-light/70 dark:hover:bg-light/15"
                    @click="closeUpdateForm"
                  >
                    <span class="i-carbon-close text-base" />
                    {{ t('dashboard.sections.updates.closeButton') }}
                  </button>
                </div>
              </div>

              <form
                v-if="showUpdateForm"
                class="space-y-4"
                @submit.prevent="submitUpdateForm"
              >
                <div class="grid gap-4 md:grid-cols-2">
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 dark:text-light/60">
                    {{ t('dashboard.sections.updates.form.title') }}
                    <input
                      v-model="updateForm.title"
                      type="text"
                      required
                      class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-primary/40 dark:text-light"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 dark:text-light/60">
                    {{ t('dashboard.sections.updates.form.date') }}
                    <input
                      v-model="updateForm.timestamp"
                      type="date"
                      required
                      class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-primary/40 dark:text-light"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 dark:text-light/60 md:col-span-2">
                    {{ t('dashboard.sections.updates.form.summary') }}
                    <textarea
                      v-model="updateForm.summary"
                      rows="3"
                      required
                      class="resize-y rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-primary/40 dark:text-light"
                    ></textarea>
                  </label>
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 dark:text-light/60">
                    {{ t('dashboard.sections.updates.form.tags') }}
                    <input
                      v-model="updateForm.tags"
                      type="text"
                      placeholder="release, roadmap"
                      class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-primary/40 dark:text-light"
                    >
                  </label>
                  <label class="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 dark:text-light/60">
                    {{ t('dashboard.sections.updates.form.link') }}
                    <input
                      v-model="updateForm.link"
                      type="url"
                      required
                      placeholder="https://"
                      class="rounded-xl border border-primary/15 bg-white/90 px-3 py-2 text-sm text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:border-light/20 dark:bg-primary/40 dark:text-light"
                    >
                  </label>
                </div>
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <p
                    v-if="updateFormError"
                    class="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-200"
                  >
                    {{ updateFormError }}
                  </p>
                  <button
                    type="submit"
                    class="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-primary/40 transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60 dark:bg-light dark:text-primary dark:hover:bg-light/90"
                    :disabled="updateSaving"
                  >
                    <span class="i-carbon-checkmark text-base" />
                    {{
                      updateFormMode === 'create'
                        ? t('dashboard.sections.updates.createSubmit')
                        : t('dashboard.sections.updates.updateSubmit')
                    }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="mt-6 space-y-4">
            <div
              v-if="updatesPending"
              class="flex items-center gap-3 rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-4 py-6 text-sm text-primary/60 dark:border-light/20 dark:bg-light/5 dark:text-light/70"
            >
              <span class="i-carbon-circle-dash animate-spin text-base" />
              <span>{{ t('dashboard.sections.updates.loading') }}</span>
            </div>

            <div
              v-else-if="!updates.length"
              class="rounded-2xl border border-dashed border-primary/15 bg-white/70 px-4 py-6 text-sm text-primary/60 dark:border-light/20 dark:bg-primary/60 dark:text-light/70"
            >
              {{ t('dashboard.sections.updates.empty') }}
            </div>

            <ul
              v-else
              class="space-y-4"
            >
              <li
                v-for="update in updates"
                :key="update.id"
                class="group relative rounded-2xl border border-primary/10 bg-white/70 p-5 transition hover:border-primary/30 hover:shadow-lg dark:border-light/10 dark:bg-primary/60"
              >
                <div
                  v-if="isAdmin"
                  class="absolute right-4 top-4 flex items-center gap-2"
                >
                  <button
                    type="button"
                    class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-white/80 text-primary/70 transition hover:border-primary/40 hover:text-primary dark:border-light/20 dark:bg-primary/40 dark:text-light/70"
                    @click.stop="openEditUpdateForm(update)"
                  >
                    <span class="i-carbon-edit text-sm" />
                  </button>
                  <button
                    type="button"
                    class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 transition hover:border-red-300 hover:text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"
                    @click.stop="deleteUpdateItem(update)"
                  >
                    <span class="i-carbon-trash-can text-sm" />
                  </button>
                </div>
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p class="text-xs uppercase tracking-widest text-primary/60 dark:text-light/60">
                      {{ formatDate(update.timestamp) }}
                    </p>
                    <h3 class="mt-1 text-base font-semibold text-primary dark:text-light">
                      {{ update.title }}
                    </h3>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 text-[11px] font-medium text-primary/60 dark:text-light/60">
                    <span
                      v-for="tag in update.tags"
                      :key="tag"
                      class="inline-flex items-center gap-1 rounded-full bg-primary/5 px-3 py-1 text-primary/70 dark:bg-light/10 dark:text-light/70"
                    >
                      <span class="i-carbon-tag text-sm" />
                      {{ tag }}
                    </span>
                  </div>
                </div>
                <p class="mt-3 text-sm leading-relaxed text-primary/70 dark:text-light/80">
                  {{ update.summary }}
                </p>
                <a
                  :href="update.link"
                  target="_blank"
                  rel="noopener"
                  class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary/80 dark:text-light dark:hover:text-light/80"
                >
                  {{ t('dashboard.sections.updates.readMore') }}
                  <span class="i-carbon-arrow-up-right text-base" />
                </a>
              </li>
            </ul>
          </div>
          </section>
        </Transition>
      </div>
    </section>
  </SignedIn>
  <SignedOut>
    <RedirectToSignIn :redirect-url="redirectUrl" />
  </SignedOut>
</template>
