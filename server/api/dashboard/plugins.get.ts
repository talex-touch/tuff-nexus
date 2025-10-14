import { listPlugins } from '../../utils/dashboardStore'
import { requireAuth } from '../../utils/auth'
import { clerkClient } from '@clerk/nuxt/server'

export default defineEventHandler(async (event) => {
  const { userId } = await requireAuth(event)

  const client = clerkClient(event)
  const user = await client.users.getUser(userId)
  const isAdmin = user.publicMetadata?.role === 'admin'

  // Admin 可以看到所有 plugins，普通用户只能看到自己的
  const plugins = await listPlugins(event, isAdmin ? undefined : userId)

  return {
    featured: plugins.filter(plugin => plugin.badges.includes('featured')),
    plugins,
    total: plugins.length,
  }
})
