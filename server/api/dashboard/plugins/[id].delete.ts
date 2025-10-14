import { createError } from 'h3'
import { deletePlugin } from '../../../utils/dashboardStore'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = event.context.params?.id

  if (!id)
    throw createError({ statusCode: 400, statusMessage: 'Plugin id is required.' })

  await deletePlugin(id)

  return {
    ok: true,
  }
})
