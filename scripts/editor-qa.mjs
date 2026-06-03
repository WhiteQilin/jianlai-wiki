import { existsSync, readdirSync } from 'node:fs'
import { copyFile, mkdir, readFile, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const BASE_URL = process.env.EDITOR_QA_BASE_URL || 'http://localhost:3000'
const ROOT = process.cwd()
const TEMP_ROUTE = '/glossary/stage-8l-qa-temp-entry'
const TEMP_FILE = join(ROOT, 'content', 'glossary', 'stage-8l-qa-temp-entry.md')
const TAXONOMY_TEMP_ROUTE = '/world/haoran-heaven'
const TAXONOMY_TEMP_FILE = join(ROOT, 'content', 'world', 'haoran-heaven.md')

const results = []

const RETRY_ATTEMPTS = 5
const RETRY_DELAY_MS = 400

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** True for transient connection errors raised when the dev server restarts. */
function isTransientNetworkError(error) {
  const code = error?.cause?.code || error?.code || ''
  const msg = `${error?.message || ''}`
  return (
    code === 'ECONNREFUSED' ||
    code === 'ECONNRESET' ||
    code === 'UND_ERR_SOCKET' ||
    /ECONNREFUSED|ECONNRESET|fetch failed/i.test(msg)
  )
}

/**
 * Retry/settle guard: re-run a fetch-based action if the dev server is briefly
 * unreachable (e.g. it restarts mid-run during temp content create/delete).
 * Only transient connection errors are retried; assertion/HTTP errors bubble up.
 */
async function withRetry(fn, label = 'request') {
  let lastError
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (!isTransientNetworkError(error) || attempt === RETRY_ATTEMPTS) throw error
      console.warn(`[editor-qa] transient ${label} error (attempt ${attempt}/${RETRY_ATTEMPTS}); retrying...`)
      await sleep(RETRY_DELAY_MS * attempt)
    }
  }
  throw lastError
}

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
  const res = await withRetry(() => fetch(`${BASE_URL}${path}`, {
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  }), `${options.method || 'GET'} ${path}`)

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
    const res = await withRetry(() => fetch(`${BASE_URL}${path}`), `GET ${path}`)
    return res.status
  } catch {
    return -1
  }
}

async function cleanupRoute(route, file) {
  try {
    await jsonFetch('/api/editor/entry', { method: 'DELETE', body: { path: route } })
  } catch {
    if (existsSync(file)) await rm(file, { force: true })
  }
}

async function cleanupTemp() {
  await cleanupRoute(TEMP_ROUTE, TEMP_FILE)
  await cleanupRoute(TAXONOMY_TEMP_ROUTE, TAXONOMY_TEMP_FILE)
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

  // Stage 13B: confirm the new optional fields are declared in the registry and schema.
  const registrySource = await readFile(join(ROOT, 'app', 'data', 'fieldRegistry.ts'), 'utf-8')
  for (const key of ['contains', 'storedItems', 'region', 'denominations']) {
    assert(`Stage 13B field "${key}" registered in fieldRegistry.ts`, registrySource.includes(`key: '${key}'`))
  }
  const schemaSource = await readFile(join(ROOT, 'content.config.ts'), 'utf-8')
  for (const key of ['contains', 'storedItems', 'region', 'denominations']) {
    assert(`Stage 13B field "${key}" is optional in content.config.ts`, new RegExp(`${key}:[^\\n]*\\.optional\\(\\)`).test(schemaSource))
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
  // Stage 13B: prove a new optional taxonomy field round-trips without stripping.
  fm.denominations = ['stage-13b-snowflake-coin', 'stage-13b-grain-rain-coin']

  const saved = await jsonFetch('/api/editor/entry', {
    method: 'POST',
    body: {
      path: TEMP_ROUTE,
      frontmatter: fm,
      body: '## Overview\n\nTemporary Stage 8L QA save body.\n',
    },
  })
  assert('save creates backup before overwrite', Boolean(saved.backup && existsSync(join(ROOT, saved.backup))))

  const reloaded = await jsonFetch(`/api/editor/entry?path=${encodeURIComponent(TEMP_ROUTE)}`)
  const reloadedFm = reloaded.frontmatter || {}
  assert(
    'Stage 13B optional field (denominations) persists through save',
    Array.isArray(reloadedFm.denominations) &&
      reloadedFm.denominations.includes('stage-13b-snowflake-coin') &&
      reloadedFm.denominations.includes('stage-13b-grain-rain-coin'),
    `denominations=${JSON.stringify(reloadedFm.denominations)}`,
  )

  const deleted = await jsonFetch('/api/editor/entry', { method: 'DELETE', body: { path: TEMP_ROUTE } })
  assert('delete creates backup before removal', Boolean(deleted.backup && existsSync(join(ROOT, deleted.backup))))
  assert('temporary QA entry is removed', !existsSync(TEMP_FILE))

  const taxonomyMarkdown = [
    '---',
    'title: Haoran Heaven',
    'chinese: 浩然天下',
    'pinyin: Hao Ran Tian Xia',
    'section: world',
    'category: Heaven',
    'locationType: Heaven',
    'status: published',
    'importance: primary',
    'verificationStatus: verified',
    'image: ""',
    'banner: ""',
    'video: ""',
    'seal: 浩',
    'description: One of the primary worlds in the universe.',
    'tags:',
    '  - haoran-heaven',
    'related:',
    '  - /world/sword-qi-great-wall',
    'sourceNotes: Test taxonomy normalization.',
    'firstAppearance: ""',
    'lastUpdated: 2026-06-02',
    '---',
    '## Overview',
    '',
    'Test body.',
    '',
    '## References',
    '',
    '- **Source reference needed:** Supports test import only.',
    '',
  ].join('\n')

  const parsedTaxonomy = await jsonFetch('/api/editor/import-markdown', {
    method: 'POST',
    body: { mode: 'parse', markdown: taxonomyMarkdown },
  })
  assert('Haoran taxonomy maps Heaven to World', parsedTaxonomy.result.frontmatter.category === 'World')
  assert('Haoran taxonomy preserves locationType', parsedTaxonomy.result.frontmatter.locationType === 'Heaven')
  assert('Haoran taxonomy warning is returned', parsedTaxonomy.result.warnings.some((warning) => warning.includes('Mapped imported category "Heaven"')))
  assert('Haoran taxonomy review payload is returned', parsedTaxonomy.result.taxonomyReview?.originalCategory === 'Heaven')

  await jsonFetch('/api/editor/import-markdown', {
    method: 'POST',
    body: {
      mode: 'save',
      path: parsedTaxonomy.result.routePath,
      frontmatter: parsedTaxonomy.result.frontmatter,
      body: parsedTaxonomy.result.body,
    },
  })
  assert('Haoran taxonomy temp file created', existsSync(TAXONOMY_TEMP_FILE))

  await cleanupRoute(TAXONOMY_TEMP_ROUTE, TAXONOMY_TEMP_FILE)
  assert('Haoran taxonomy temp file removed', !existsSync(TAXONOMY_TEMP_FILE))

  const entries = await jsonFetch('/api/editor/entries')
  assert('temporary QA entry not listed after cleanup', !entries.some((entry) => entry.routePath === TEMP_ROUTE))
  assert('Haoran taxonomy temp entry not listed after cleanup', !entries.some((entry) => entry.routePath === TAXONOMY_TEMP_ROUTE))

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
