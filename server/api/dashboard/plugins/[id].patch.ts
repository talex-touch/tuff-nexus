import { createError, readBody } from 'h3'
import { requireAuth } from '../../../utils/auth'
import { updatePlugin, getPluginById } from '../../../utils/pluginsStore'
import { clerkClient } from '@clerk/nuxt/server'

export default defineEventHandler(async (event) => {
  const { userId } = await requireAuth(event)
  const body = await readBody(event)
  const id = event.context.params?.id

  if (!id)
    throw createError({ statusCode: 400, statusMessage: 'Plugin id is required.' })

  const client = clerkClient(event)
  const user = await client.users.getUser(userId)
  const isAdmin = user.publicMetadata?.role === 'admin'

  const existing = await getPluginById(event, id)

  if (!existing)
    throw createError({ statusCode: 404, statusMessage: 'Plugin not found.' })

  if (!isAdmin && existing.userId !== userId)
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const plugin = await updatePlugin(event, id, body)

  return {
    plugin,
  }
})
