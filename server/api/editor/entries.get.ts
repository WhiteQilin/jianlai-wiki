import { readdir, readFile } from 'node:fs/promises'
import { join, extname, relative } from 'node:path'

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const contentDir = join(process.cwd(), 'content')
  const entries: any[] = []

  async function scanDir(dir: string) {
    const files = await readdir(dir, { withFileTypes: true })
    for (const file of files) {
      const fullPath = join(dir, file.name)
      if (file.isDirectory()) {
        // Ignore _meta, _templates, titles
        if (file.name.startsWith('_') || file.name === 'titles') continue
        await scanDir(fullPath)
      } else if (file.isFile() && extname(file.name) === '.md') {
        // Ignore sample.md
        if (file.name === 'sample.md') continue

        const relPath = relative(contentDir, fullPath).replace(/\\/g, '/')
        const routePath = '/' + relPath.replace(/\.md$/, '')
        const section = relPath.split('/')[0]

        const content = await readFile(fullPath, 'utf-8')
        const match = content.match(/^---\n([\s\S]*?)\n---/)
        
        let title = ''
        let chinese = ''
        let pinyin = ''
        let category = ''
        let verificationStatus = ''
        let description = ''

        if (match) {
          const fm = match[1]
          title = fm.match(/^title:\s*(.+)$/m)?.[1]?.replace(/^["']|["']$/g, '') || ''
          chinese = fm.match(/^chinese:\s*(.+)$/m)?.[1]?.replace(/^["']|["']$/g, '') || ''
          pinyin = fm.match(/^pinyin:\s*(.+)$/m)?.[1]?.replace(/^["']|["']$/g, '') || ''
          category = fm.match(/^category:\s*(.+)$/m)?.[1]?.replace(/^["']|["']$/g, '') || ''
          verificationStatus = fm.match(/^verificationStatus:\s*(.+)$/m)?.[1]?.replace(/^["']|["']$/g, '') || ''
          description = fm.match(/^description:\s*(.+)$/m)?.[1]?.replace(/^["']|["']$/g, '') || ''
        }

        entries.push({
          title,
          chinese,
          pinyin,
          section,
          category,
          routePath,
          filePath: fullPath,
          verificationStatus,
          description
        })
      }
    }
  }

  await scanDir(contentDir)
  return entries
})
