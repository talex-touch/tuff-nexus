import { createError, readFormData } from 'h3'
import { requireAdmin } from '../../utils/auth'
import { uploadImage } from '../../utils/imageStorage'

export default defineEventHandler(async (event) => {
  // 只有 admin 可以上传图片
  await requireAdmin(event)

  const formData = await readFormData(event)
  const file = formData.get('file')

  if (!file || !(file instanceof File)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file provided',
    })
  }

  const result = await uploadImage(event, file)

  return {
    success: true,
    url: result.url,
    key: result.key,
  }
})
