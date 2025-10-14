import { readBody } from 'h3'
import { requireAdmin } from '../../utils/auth'
import { createPlugin } from '../../utils/dashboardStore'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  const plugin = await createPlugin(event, body)

  return {
    plugin,
  }
})
