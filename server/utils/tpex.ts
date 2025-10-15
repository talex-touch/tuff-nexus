import type { Buffer } from 'node:buffer'
import JSZip from 'jszip'

export interface TpexMetadata {
  readmeMarkdown?: string | null
  manifest?: Record<string, unknown> | null
}

function isReadmeFile(name: string) {
  const lower = name.toLowerCase()
  return lower.endsWith('readme.md') || lower.endsWith('readme')
}

function isManifestFile(name: string) {
  return name.toLowerCase().endsWith('manifest.json')
}

export async function extractTpexMetadata(buffer: Buffer): Promise<TpexMetadata> {
  const zip = await JSZip.loadAsync(buffer)

  let readmeMarkdown: string | null = null
  let manifest: Record<string, unknown> | null = null

  const fileEntries = Object.values(zip.files)

  for (const entry of fileEntries) {
    if (entry.dir)
      continue

    if (!readmeMarkdown && isReadmeFile(entry.name)) {
      try {
        readmeMarkdown = await entry.async('string')
      }
      catch {
        readmeMarkdown = null
      }
    }

    if (!manifest && isManifestFile(entry.name)) {
      try {
        const manifestText = await entry.async('string')
        const parsed = JSON.parse(manifestText)
        if (parsed && typeof parsed === 'object')
          manifest = parsed as Record<string, unknown>
      }
      catch {
        manifest = null
      }
    }
  }

  return {
    readmeMarkdown,
    manifest,
  }
}
