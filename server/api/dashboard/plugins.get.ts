import { listPlugins } from '../../utils/dashboardStore'

export default defineEventHandler(async (event) => {
  const plugins = await listPlugins(event)

  return {
    featured: plugins.filter(plugin => plugin.badges.includes('featured')),
    plugins,
    total: plugins.length,
  }
})
