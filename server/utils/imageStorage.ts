import { createError } from 'h3'
import type { H3Event } from 'h3'
import { Buffer } from 'node:buffer'
import { randomUUID } from 'node:crypto'
import { readCloudflareBindings } from './cloudflare'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const ATTACHMENT_TYPES = [
  ...ALLOWED_TYPES,
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
  'application/json',
  'text/plain',
  'text/markdown',
]

export const RESOURCE_ALLOWED_TYPES = ATTACHMENT_TYPES

// 内存存储（用于开发环境）
const memoryStorage = new Map<string, { data: Buffer, contentType: string }>()

interface UploadResult {
  url: string
  key: string
}

/**
 * 获取 R2 bucket
 */
function getR2Bucket(event?: H3Event | null): R2Bucket | null {
  if (!event)
    return null

  const bindings = readCloudflareBindings(event)
  return bindings?.IMAGES ?? bindings?.R2 ?? bindings?.ASSETS ?? null
}

/**
 * 验证文件类型和大小
 */
function validateFile(file: File, allowedTypes: string[]): void {
  if (!allowedTypes.includes(file.type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid file type.',
    })
  }

  if (file.size > MAX_FILE_SIZE) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File size exceeds 5MB limit.',
    })
  }
}

/**
 * 生成文件扩展名
 */
function getFileExtension(contentType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
  }
  return extensions[contentType] || 'jpg'
}

/**
 * 上传图片到 R2（生产环境）
 */
async function uploadToR2(
  bucket: R2Bucket,
  file: File,
  key: string,
): Promise<void> {
  const arrayBuffer = await file.arrayBuffer()
  await bucket.put(key, arrayBuffer, {
    httpMetadata: {
      contentType: file.type,
    },
  })
}

/**
 * 从 R2 获取图片
 */
async function getFromR2(
  bucket: R2Bucket,
  key: string,
): Promise<{ data: ArrayBuffer, contentType: string } | null> {
  const object = await bucket.get(key)
  if (!object)
    return null

  return {
    data: await object.arrayBuffer(),
    contentType: object.httpMetadata?.contentType || 'image/jpeg',
  }
}

/**
 * 从 R2 删除图片
 */
async function deleteFromR2(bucket: R2Bucket, key: string): Promise<void> {
  await bucket.delete(key)
}

/**
 * 上传图片到内存存储（开发环境）
 */
async function uploadToMemory(file: File, key: string): Promise<void> {
  const arrayBuffer = await file.arrayBuffer()
  memoryStorage.set(key, {
    data: Buffer.from(arrayBuffer),
    contentType: file.type,
  })
}

/**
 * 从内存获取图片
 */
function getFromMemory(key: string): { data: Buffer, contentType: string } | null {
  return memoryStorage.get(key) || null
}

/**
 * 从内存删除图片
 */
function deleteFromMemory(key: string): void {
  memoryStorage.delete(key)
}

/**
 * 上传图片
 */
export async function uploadImage(
  event: H3Event,
  file: File,
  options: { allowedTypes?: string[] } = {},
): Promise<UploadResult> {
  validateFile(file, options.allowedTypes ?? ALLOWED_TYPES)

  const ext = getFileExtension(file.type)
  const key = `${randomUUID()}.${ext}`

  const bucket = getR2Bucket(event)

  if (bucket) {
    // 生产环境：使用 R2
    await uploadToR2(bucket, file, key)
    return {
      url: `/api/images/${key}`,
      key,
    }
  }
  else {
    // 开发环境：使用内存存储
    await uploadToMemory(file, key)
    return {
      url: `/api/images/${key}`,
      key,
    }
  }
}

/**
 * 获取图片
 */
export async function getImage(
  event: H3Event,
  key: string,
): Promise<{ data: Buffer | ArrayBuffer, contentType: string } | null> {
  const bucket = getR2Bucket(event)

  if (bucket) {
    // 生产环境：从 R2 获取
    const result = await getFromR2(bucket, key)
    return result
      ? {
          data: result.data,
          contentType: result.contentType,
        }
      : null
  }
  else {
    // 开发环境：从内存获取
    return getFromMemory(key)
  }
}

/**
 * 删除图片
 */
export async function deleteImage(event: H3Event, key: string): Promise<void> {
  const bucket = getR2Bucket(event)

  if (bucket) {
    // 生产环境：从 R2 删除
    await deleteFromR2(bucket, key)
  }
  else {
    // 开发环境：从内存删除
    deleteFromMemory(key)
  }
}

/**
 * 列出所有图片（仅用于管理）
 */
export async function listImages(event: H3Event): Promise<string[]> {
  const bucket = getR2Bucket(event)

  if (bucket) {
    // 生产环境：列出 R2 中的所有对象
    const list = await bucket.list()
    return list.objects.map(obj => obj.key)
  }
  else {
    // 开发环境：列出内存中的所有键
    return Array.from(memoryStorage.keys())
  }
}
