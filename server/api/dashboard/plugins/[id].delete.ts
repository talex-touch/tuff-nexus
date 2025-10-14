import { createError } from 'h3'
import { requireAdmin } from '../../../utils/auth'
import { deletePlugin } from '../../../utils/dashboardStore'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = event.context.params?.id

  if (!id)
    throw createError({ statusCode: 400, statusMessage: 'Plugin id is required.' })

  await deletePlugin(event, id)

  return {
    ok: true,
  }
})
