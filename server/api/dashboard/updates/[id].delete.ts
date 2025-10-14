import { createError } from 'h3'
import { deleteUpdate } from '../../../utils/dashboardStore'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = event.context.params?.id

  if (!id)
    throw createError({ statusCode: 400, statusMessage: 'Update id is required.' })

  await deleteUpdate(id)

  return {
    ok: true,
  }
})
