import { createError, readBody } from 'h3'
import { updatePlugin } from '../../../utils/dashboardStore'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)
  const id = event.context.params?.id

  if (!id)
    throw createError({ statusCode: 400, statusMessage: 'Plugin id is required.' })

  const plugin = await updatePlugin(id, body)

  return {
    plugin,
  }
})
