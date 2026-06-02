import { existsSync, readdirSync } from 'node:fs'
import { copyFile, mkdir, readFile, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const BASE_URL = process.env.EDITOR_QA_BASE_URL || 'http://localhost:3000'
const ROOT = process.cwd()
const TEMP_ROUTE = '/glossary/stage-8l-qa-temp-entry'
const TEMP_FILE = join(ROOT, 'content', 'glossary', 'stage-8l-qa-temp-entry.md')

const results = []

function pass(name, details = '') {
  results.push({ name, status: 'PASS', details })
}

function fail(name, details = '') {
  results.push({ name, status: 'FAIL', details })
}

function assert(name, condition, details = '') {
  if (condition) pass(name, details)
  else fail(name, details)
}

async function jsonFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!res.ok) {
    const message = typeof data === 'object' && data ? data.message || data.statusMessage : text
    throw new Error(`${options.method || 'GET'} ${path} failed (${res.status}): ${message}`)
  }

  return data
}

async function status(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}`)
    return res.status
  } catch {
    return -1
  }
}

async function cleanupTemp() {
  try {
    await jsonFetch('/api/editor/entry', { method: 'DELETE', body: { path: TEMP_ROUTE } })
  } catch {
    if (existsSync(TEMP_FILE)) await rm(TEMP_FILE, { force: true })
  }
}

function editorApiFiles() {
  const dir = join(ROOT, 'server', 'api', 'editor')
  return readdirSync(dir)
    .filter((name) => /\.(get|post|delete|put|patch)\.ts$/.test(name))
    .map((name) => join(dir, name))
}

async function main() {
  const adminStatus = await status('/admin')
  assert('dev editor opens at /admin', adminStatus === 200, `status=${adminStatus}`)

  assert('/admin is not prerendered', !existsSync(join(ROOT, '.output', 'public', 'admin')))
  assert('/titles is not generated', !existsSync(join(ROOT, '.output', 'public', 'titles')))

  for (const file of editorApiFiles()) {
    const raw = await readFile(file, 'utf-8')
    assert(`dev-only guard present in ${file.replace(`${ROOT}\\`, '').replaceAll('\\', '/')}`, raw.includes('import.meta.dev'))
  }

  const traversalStatus = await status('/api/editor/entry?path=/characters/../about')
  const sampleStatus = await status('/api/editor/entry?path=/characters/sample')
  const metaStatus = await status('/api/editor/entry?path=/_meta/characters')
  const templateStatus = await status('/api/editor/entry?path=/_templates/character')
  const titlesStatus = await status('/api/editor/entry?path=/titles/sample')
  assert('path traversal is blocked', traversalStatus === 400, `status=${traversalStatus}`)
  assert('sample.md is blocked', sampleStatus === 400, `status=${sampleStatus}`)
  assert('_meta path is blocked', metaStatus === 400, `status=${metaStatus}`)
  assert('_templates path is blocked', templateStatus === 400, `status=${templateStatus}`)
  assert('/titles editor path is blocked', titlesStatus === 400, `status=${titlesStatus}`)

  await cleanupTemp()

  await jsonFetch('/api/editor/create-entry', {
    method: 'POST',
    body: {
      title: 'Stage 8L QA Temp Entry',
      chinese: 'Stage 8L QA Temp',
      pinyin: 'Stage 8L QA Temp',
      section: 'glossary',
      category: 'Term',
      slug: 'stage-8l-qa-temp-entry',
      description: 'Temporary Stage 8L editor QA entry; safe to delete.',
      importance: 'minor',
      verificationStatus: 'to-be-verified',
      status: 'Temporary',
      seal: 'QA',
    },
  })

  const entry = await jsonFetch(`/api/editor/entry?path=${encodeURIComponent(TEMP_ROUTE)}`)
  const fm = entry.frontmatter
  fm.description = 'Temporary Stage 8L editor QA entry updated through save workflow; safe to delete.'
  fm.related = ['/characters/chen-pingan']
  fm.relatedTerms = ['stage-8l']
  fm.termType = 'QA Term'

  const saved = await jsonFetch('/api/editor/entry', {
    method: 'POST',
    body: {
      path: TEMP_ROUTE,
      frontmatter: fm,
      body: '## Overview\n\nTemporary Stage 8L QA save body.\n',
    },
  })
  assert('save creates backup before overwrite', Boolean(saved.backup && existsSync(join(ROOT, saved.backup))))

  const deleted = await jsonFetch('/api/editor/entry', { method: 'DELETE', body: { path: TEMP_ROUTE } })
  assert('delete creates backup before removal', Boolean(deleted.backup && existsSync(join(ROOT, deleted.backup))))
  assert('temporary QA entry is removed', !existsSync(TEMP_FILE))

  const entries = await jsonFetch('/api/editor/entries')
  assert('temporary QA entry not listed after cleanup', !entries.some((entry) => entry.routePath === TEMP_ROUTE))

  const failed = results.filter((result) => result.status === 'FAIL')
  console.table(results)

  if (failed.length) {
    console.error(`Editor QA failed: ${failed.length} check(s) failed.`)
    process.exit(1)
  }

  console.log('Editor QA passed.')
}

main().catch(async (error) => {
  try {
    await cleanupTemp()
  } catch {}
  console.error(error)
  process.exit(1)
})
