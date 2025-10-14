import { listUpdates } from '../../utils/dashboardStore'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  // 所有登录用户都可以查看 updates 列表
  await requireAuth(event)

  const updates = await listUpdates(event)

  return {
    updates,
  }
})
