import { readdir, readFile } from 'node:fs/promises'
import { join, extname, relative } from 'node:path'

import { parse as parseYaml } from 'yaml'

import { EDITOR_SECTIONS } from '../../utils/editor'

interface EditorEntryRow {
  title: string
  chinese: string
  pinyin: string
  section: string
  category: string
  routePath: string
  filePath: string
  verificationStatus: string
  description: string
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function parseFrontmatter(raw: string): Record<string, any> {
  // CRLF/LF-safe frontmatter extraction, same approach as entry.get.ts
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return {}

  try {
    return parseYaml(match[1] ?? '') ?? {}
  } catch {
    // Keep this endpoint resilient: return empty metadata if a single file has bad YAML
    return {}
  }
}

export default defineEventHandler(async () => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const contentDir = join(process.cwd(), 'content')
  const entries: EditorEntryRow[] = []

  async function scanDir(dir: string) {
    const files = await readdir(dir, { withFileTypes: true })

    for (const file of files) {
      const fullPath = join(dir, file.name)

      if (file.isDirectory()) {
        // Ignore _meta, _templates, titles
        if (file.name.startsWith('_') || file.name === 'titles') continue
        await scanDir(fullPath)
        continue
      }

      if (!file.isFile() || extname(file.name) !== '.md') continue

      // Ignore sample.md
      if (file.name === 'sample.md') continue

      const relPath = relative(contentDir, fullPath).replace(/\\/g, '/')
      const routePath = '/' + relPath.replace(/\.md$/, '')
      const section = relPath.split('/')[0] || ''

      // Ignore non-routed entries (e.g. about.md, index.md)
      if (!(EDITOR_SECTIONS as readonly string[]).includes(section)) continue

      const content = await readFile(fullPath, 'utf-8')
      const fm = parseFrontmatter(content)

      entries.push({
        title: asString(fm.title),
        chinese: asString(fm.chinese),
        pinyin: asString(fm.pinyin),
        section,
        category: asString(fm.category),
        routePath,
        filePath: fullPath,
        verificationStatus: asString(fm.verificationStatus),
        description: asString(fm.description),
      })
    }
  }

  await scanDir(contentDir)
  return entries
})
