import { readBody } from 'h3'
import { createUpdate } from '../../utils/dashboardStore'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  const update = await createUpdate(body)

  return {
    update,
  }
})
