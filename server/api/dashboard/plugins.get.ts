import { listPlugins } from '../../utils/dashboardStore'

export default defineEventHandler(async () => {
  const plugins = await listPlugins()

  return {
    featured: plugins.filter(plugin => plugin.badges.includes('featured')),
    plugins,
    total: plugins.length,
  }
})
