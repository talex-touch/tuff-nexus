import { listUpdates } from '~/server/utils/dashboardStore'

export default defineEventHandler(async () => {
  const updates = await listUpdates()

  return {
    updates,
  }
})
