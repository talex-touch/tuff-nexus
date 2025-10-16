import type { H3Event } from 'h3'
import { createError } from 'h3'

let hasLoggedBindings = false

/**
 * Safely read Cloudflare bindings when running inside a Worker/Pages function.
 */
export function readCloudflareBindings(event: H3Event) {
  const bindings = event.context.cloudflare?.env as TuffCloudflareBindings | undefined

  if (!hasLoggedBindings) {
    const keys = bindings ? Object.keys(bindings) : []
    console.info('[cloudflare] 解析到的绑定', {
      keys,
      hasDB: Boolean(bindings?.DB),
      hasR2: Boolean(bindings?.R2 ?? bindings?.ASSETS ?? bindings?.IMAGES ?? bindings?.PACKAGES),
    })
    hasLoggedBindings = true
  }

  return bindings
}

/**
 * Require Cloudflare bindings when they are mandatory for the handler.
 * Throws a 500 in non-Cloudflare environments so it fails fast during preview.
 */
export function requireCloudflareBindings(event: H3Event) {
  const bindings = readCloudflareBindings(event)

  if (!bindings) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cloudflare bindings are not available in this runtime.',
    })
  }

  return bindings
}
