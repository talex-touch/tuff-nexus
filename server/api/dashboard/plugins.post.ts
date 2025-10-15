import { clerkClient } from '@clerk/nuxt/server'
import { readBody } from 'h3'
import { requireAuth } from '../../utils/auth'
import { createPlugin } from '../../utils/pluginsStore'

export default defineEventHandler(async (event) => {
  const { userId } = await requireAuth(event)
  const body = await readBody(event)

  const client = clerkClient(event)
  const orgMemberships = await client.users.getOrganizationMembershipList({ userId })
  const ownerOrgId = orgMemberships.data?.[0]?.organization.id ?? null

  const plugin = await createPlugin(event, {
    userId,
    ownerOrgId,
    name: body.name,
    summary: body.summary,
    category: body.category,
    installs: body.installs,
    homepage: body.homepage,
    isOfficial: body.isOfficial,
    badges: body.badges,
    author: body.author,
  })

  return {
    plugin,
  }
})
