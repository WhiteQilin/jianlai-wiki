import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const query = getQuery(event)
  const path = query.path as string

  if (!path || typeof path !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Path is required' })
  }

  // Basic path traversal prevention
  if (path.includes('..') || path.includes('\0')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid path' })
  }

  // Ensure it's a routed path (e.g., /characters/chen-pingan)
  if (!path.startsWith('/') || path.startsWith('/_') || path.startsWith('/titles')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid content path' })
  }

  const contentDir = join(process.cwd(), 'content')
  // Remove leading slash and append .md
  const relativePath = path.slice(1) + '.md'
  const fullPath = resolve(contentDir, relativePath)

  // Double check that the resolved path is still within the content directory
  if (!fullPath.startsWith(contentDir)) {
    throw createError({ statusCode: 400, statusMessage: 'Path traversal detected' })
  }

  try {
    const content = await readFile(fullPath, 'utf-8')
    
    // Simple frontmatter parser
    const match = content.match(/^---\n([\s\S]*?)\n---/)
    const frontmatter: Record<string, string> = {}
    let body = content

    if (match) {
      const fmString = match[1]
      body = content.slice(match[0].length).trim()
      
      // Very basic YAML parsing for read-only display
      const lines = fmString.split('\n')
      let currentKey = ''
      let currentValue = ''
      let inMultiline = false

      for (const line of lines) {
        if (inMultiline) {
          if (line.startsWith('  ') || line === '') {
            currentValue += '\n' + line
            continue
          } else {
            frontmatter[currentKey] = currentValue.trim()
            inMultiline = false
          }
        }

        const colonIdx = line.indexOf(':')
        if (colonIdx !== -1) {
          const key = line.slice(0, colonIdx).trim()
          const val = line.slice(colonIdx + 1).trim()
          
          if (val === '>' || val === '|') {
            inMultiline = true
            currentKey = key
            currentValue = ''
          } else if (val.startsWith('[')) {
             frontmatter[key] = val
          } else if (val === '') {
             frontmatter[key] = val
          } else {
            frontmatter[key] = val.replace(/^["']|["']$/g, '')
          }
        }
      }
      if (inMultiline) {
        frontmatter[currentKey] = currentValue.trim()
      }
    }

    return {
      routePath: path,
      filePath: fullPath,
      frontmatter,
      body,
      raw: content
    }
  } catch (e) {
    throw createError({ statusCode: 404, statusMessage: 'Entry not found' })
  }
})
