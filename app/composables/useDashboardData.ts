import { computed } from 'vue'

interface DashboardPluginResponse {
  plugins: DashboardPlugin[]
  featured: DashboardPlugin[]
  total: number
}

interface DashboardPlugin {
  id: string
  name: string
  summary: string
  category: string
  installs: number
  isOfficial: boolean
  badges: string[]
  latestVersion?: {
    channel: string
    version: string
    iconUrl?: string
    createdAt: string
  } | null
}

interface DashboardUpdate {
  id: string
  title: string
  timestamp: string
  summary: string
  tags: string[]
  link: string
}

interface DashboardTeam {
  name: string
  plan: string
  slots: {
    total: number
    used: number
  }
  members: Array<{
    id: string
    name: string
    role: string
    status: string
    email?: string
  }>
  invitations: unknown[]
  upcoming?: {
    label: string
    date: string
  }
  notes?: string
  organization?: {
    id: string
    name: string
    role: string
    membersCount?: number
  } | null
}

interface DashboardImage {
  key: string
  url: string
}

export function useDashboardPluginsData() {
  const state = useAsyncData('dashboard-plugins', () =>
    $fetch<DashboardPluginResponse>('/api/dashboard/plugins'),
  )

  const plugins = computed(() => state.data.value?.plugins ?? [])
  const featured = computed(() => state.data.value?.featured ?? [])
  const total = computed(() => state.data.value?.total ?? 0)

  return {
    ...state,
    plugins,
    featured,
    total,
  }
}

export function useDashboardUpdatesData() {
  const state = useAsyncData('dashboard-updates', () =>
    $fetch<{ updates: DashboardUpdate[] }>('/api/dashboard/updates'),
  )

  const updates = computed(() => state.data.value?.updates ?? [])

  return {
    ...state,
    updates,
  }
}

export function useDashboardTeamData() {
  const state = useAsyncData('dashboard-team', () =>
    $fetch<{ team: DashboardTeam }>('/api/dashboard/team'),
  )

  const team = computed(() => state.data.value?.team)

  return {
    ...state,
    team,
  }
}

export function useDashboardImagesData(options: { lazy?: boolean } = {}) {
  const state = useAsyncData(
    'dashboard-images',
    () => $fetch<{ images: DashboardImage[], total: number }>('/api/images/list'),
    {
      lazy: options.lazy ?? true,
    },
  )

  const images = computed(() => state.data.value?.images ?? [])
  const total = computed(() => state.data.value?.total ?? 0)

  return {
    ...state,
    images,
    total,
  }
}
