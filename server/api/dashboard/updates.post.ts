import { readBody } from 'h3'
import { createUpdate } from '~/server/utils/dashboardStore'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  const update = await createUpdate(body)

  return {
    update,
  }
})
