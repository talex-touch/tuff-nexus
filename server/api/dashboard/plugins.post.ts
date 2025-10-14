import { readBody } from 'h3'
import { createPlugin } from '../../utils/dashboardStore'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  const plugin = await createPlugin(body)

  return {
    plugin,
  }
})
