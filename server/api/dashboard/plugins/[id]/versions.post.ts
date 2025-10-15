import type { PluginChannel } from '../../../../utils/pluginsStore'
import { createError, readFormData } from 'h3'
import { requireAuth } from '../../../../utils/auth'
import { publishPluginVersion } from '../../../../utils/pluginsStore'

export default defineEventHandler(async (event) => {
  const { userId } = await requireAuth(event)
  const id = event.context.params?.id

  if (!id)
    throw createError({ statusCode: 400, statusMessage: 'Plugin id is required.' })

  const formData = await readFormData(event)

  const version = formData.get('version')
  const channel = formData.get('channel')
  const notes = formData.get('notes')
  const homepage = formData.get('homepage')
  const packageFile = formData.get('package')
  const iconFile = formData.get('icon')

  if (typeof version !== 'string' || !version.trim())
    throw createError({ statusCode: 400, statusMessage: 'Version is required.' })

  if (typeof channel !== 'string' || !channel.trim())
    throw createError({ statusCode: 400, statusMessage: 'Channel is required.' })

  if (!(packageFile instanceof File))
    throw createError({ statusCode: 400, statusMessage: 'Package file is required.' })

  if (!(iconFile instanceof File))
    throw createError({ statusCode: 400, statusMessage: 'Icon file is required.' })

  const normalizedChannel = channel.toUpperCase() as PluginChannel

  const versionRecord = await publishPluginVersion(event, {
    pluginId: id,
    channel: normalizedChannel,
    version: version.trim(),
    notes: typeof notes === 'string' ? notes.trim() || null : null,
    homepage: typeof homepage === 'string' ? homepage.trim() || null : null,
    packageFile,
    iconFile,
    createdBy: userId,
  })

  return {
    version: versionRecord,
  }
})
