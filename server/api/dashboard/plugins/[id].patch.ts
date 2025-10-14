import { createError, readBody } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { updatePlugin } from '../../../utils/dashboardStore'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)
  const id = event.context.params?.id

  if (!id)
    throw createError({ statusCode: 400, statusMessage: 'Plugin id is required.' })

  const plugin = await updatePlugin(event, id, body)

  return {
    plugin,
  }
})
