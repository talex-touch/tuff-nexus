import { createError, readBody } from 'h3'
import { updateUpdate } from '~/server/utils/dashboardStore'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = event.context.params?.id

  if (!id)
    throw createError({ statusCode: 400, statusMessage: 'Update id is required.' })

  const body = await readBody(event)
  const update = await updateUpdate(id, body)

  return {
    update,
  }
})
