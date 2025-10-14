import { createError } from 'h3'
import { deleteUpdate } from '~/server/utils/dashboardStore'
import { requireAdmin } from '~/server/utils/auth'

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
