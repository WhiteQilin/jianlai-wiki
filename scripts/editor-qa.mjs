import { existsSync, readdirSync } from 'node:fs'
import { copyFile, mkdir, readFile, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { execSync } from 'node:child_process'

const BASE_URL = process.env.EDITOR_QA_BASE_URL || 'http://localhost:3000'
const ROOT = process.cwd()
const TEMP_ROUTE = '/glossary/stage-8l-qa-temp-entry'
const TEMP_FILE = join(ROOT, 'content', 'glossary', 'stage-8l-qa-temp-entry.md')
// Disposable QA-only world slug. Must never match a real content entry so that
// editor:qa can freely create/delete it without clobbering authored lore
// (e.g. a real /world/haoran-heaven entry).
const TAXONOMY_TEMP_ROUTE = '/world/editor-qa-temp-world'
const TAXONOMY_TEMP_FILE = join(ROOT, 'content', 'world', 'editor-qa-temp-world.md')

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
    'title: Editor QA Temp World',
    'chinese: 编辑器QA临时天下',
    'pinyin: Bian Ji Qi QA Lin Shi',
    'section: world',
    'category: Heaven',
    'locationType: Heaven',
    'status: published',
    'importance: primary',
    'verificationStatus: verified',
    'image: ""',
    'banner: ""',
    'video: ""',
    'seal: QA',
    'description: Disposable editor QA world; safe to delete.',
    'tags:',
    '  - editor-qa-temp-world',
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
  // Heaven is now a canonical world category: it must be kept as-is (not
  // aliased to World) and must NOT raise a taxonomy mapping warning/review.
  assert('taxonomy temp keeps Heaven as canonical category', parsedTaxonomy.result.frontmatter.category === 'Heaven')
  assert('taxonomy temp preserves locationType', parsedTaxonomy.result.frontmatter.locationType === 'Heaven')
  assert(
    'taxonomy temp does NOT map Heaven to World',
    !parsedTaxonomy.result.warnings.some((warning) => warning.includes('Mapped imported category "Heaven"')),
  )
  assert('taxonomy temp emits no Heaven taxonomy review', !parsedTaxonomy.result.taxonomyReview)
  assert(
    'taxonomy temp resolves to disposable QA route',
    parsedTaxonomy.result.routePath === TAXONOMY_TEMP_ROUTE,
    `routePath=${parsedTaxonomy.result.routePath}`,
  )

  // Alias mechanism still works for non-canonical values (天下 -> World).
  const aliasMarkdown = [
    '---',
    'title: Editor QA Temp Alias World',
    'chinese: 别名测试天下',
    'pinyin: Bie Ming',
    'section: world',
    'category: 天下',
    'locationType: Heaven',
    'description: Disposable alias QA world; safe to delete.',
    'importance: minor',
    'verificationStatus: to-be-verified',
    '---',
    '## Overview',
    '',
    'Body.',
    '',
  ].join('\n')
  const parsedAlias = await jsonFetch('/api/editor/import-markdown', {
    method: 'POST',
    body: { mode: 'parse', markdown: aliasMarkdown },
  })
  assert('taxonomy alias maps 天下 to World', parsedAlias.result.frontmatter.category === 'World')
  assert(
    'taxonomy alias warning is returned',
    parsedAlias.result.warnings.some((warning) => warning.includes('Mapped imported category "天下"')),
  )
  assert('taxonomy alias review payload is returned', parsedAlias.result.taxonomyReview?.originalCategory === '天下')

  // ---------------------------------------------------------------------------
  // Stage 13F: NotebookLM import coercion (parse-only; no file writes).
  // ---------------------------------------------------------------------------

  // Fixture A: null optional fields + an unknown custom field that must survive.
  const nullOptionalsMarkdown = [
    '---',
    'title: Stage 13F Null Optionals',
    'chinese: 空值测试',
    'pinyin: null',
    'section: factions',
    'category: Sect',
    'description: NotebookLM emits null for empty optional fields.',
    'importance: minor',
    'verificationStatus: to-be-verified',
    'region:',
    'sourceNotes: null',
    'firstAppearance:',
    'tags:',
    'related:',
    'members:',
    'leader:',
    'customLore: keep-me-please',
    '---',
    '## Overview',
    '',
    'Body.',
    '',
  ].join('\n')

  const parsedNulls = await jsonFetch('/api/editor/import-markdown', {
    method: 'POST',
    body: { mode: 'parse', markdown: nullOptionalsMarkdown },
  })
  const nullsFm = parsedNulls.result.frontmatter
  assert('Stage 13F null string field (region) coerced to ""', nullsFm.region === '')
  assert('Stage 13F null string field (sourceNotes) coerced to ""', nullsFm.sourceNotes === '')
  assert('Stage 13F null string field (pinyin) coerced to ""', nullsFm.pinyin === '')
  assert('Stage 13F null string field (firstAppearance) coerced to ""', nullsFm.firstAppearance === '')
  assert('Stage 13F null array field (tags) coerced to []', Array.isArray(nullsFm.tags) && nullsFm.tags.length === 0)
  assert('Stage 13F null array field (related) coerced to []', Array.isArray(nullsFm.related) && nullsFm.related.length === 0)
  assert('Stage 13F null array field (members) coerced to []', Array.isArray(nullsFm.members) && nullsFm.members.length === 0)
  assert('Stage 13F null union field (leader) coerced to ""', nullsFm.leader === '')
  assert('Stage 13F unknown/custom field (customLore) preserved', nullsFm.customLore === 'keep-me-please')
  assert(
    'Stage 13F null-coercion warning is returned',
    parsedNulls.result.warnings.some((w) => w.includes('Converted null optional fields')),
    `warnings=${JSON.stringify(parsedNulls.result.warnings)}`,
  )
  assert(
    'Stage 13F import review reports normalized null fields',
    Array.isArray(parsedNulls.result.importReview?.normalizedNullFields) &&
      parsedNulls.result.importReview.normalizedNullFields.includes('region'),
  )

  // Fixture B: string-array relationships → structured { name, relation, link }.
  const relStringsMarkdown = [
    '---',
    'title: Stage 13F Rel Strings',
    'chinese: 关系测试',
    'pinyin: Guan Xi',
    'section: characters',
    'category: Character',
    'description: NotebookLM emits relationships as plain string arrays.',
    'importance: minor',
    'verificationStatus: to-be-verified',
    'relationships:',
    '  - /characters/cui-chan',
    '  - Old Scholar',
    'customAside: also-keep-me',
    '---',
    '## Overview',
    '',
    'Body.',
    '',
  ].join('\n')

  const parsedRels = await jsonFetch('/api/editor/import-markdown', {
    method: 'POST',
    body: { mode: 'parse', markdown: relStringsMarkdown },
  })
  const relsFm = parsedRels.result.frontmatter
  const rels = relsFm.relationships
  assert('Stage 13F relationships normalized to object array', Array.isArray(rels) && rels.length === 2)
  assert(
    'Stage 13F path-like relationship infers name + link',
    rels?.[0]?.name === 'Cui Chan' && rels?.[0]?.link === '/characters/cui-chan' && rels?.[0]?.relation === '',
    `row0=${JSON.stringify(rels?.[0])}`,
  )
  assert(
    'Stage 13F plain-text relationship uses text as name with empty link',
    rels?.[1]?.name === 'Old Scholar' && rels?.[1]?.link === '' && rels?.[1]?.relation === '',
    `row1=${JSON.stringify(rels?.[1])}`,
  )
  assert(
    'Stage 13F normalized relationships are schema-safe (every row has string name)',
    Array.isArray(rels) && rels.every((r) => r && typeof r.name === 'string' && r.name.length > 0),
  )
  assert('Stage 13F relationship-string custom field preserved', relsFm.customAside === 'also-keep-me')
  assert(
    'Stage 13F relationship-conversion warning is returned',
    parsedRels.result.warnings.some((w) => w.includes('Converted relationship string array')),
    `warnings=${JSON.stringify(parsedRels.result.warnings)}`,
  )
  assert(
    'Stage 13F import review reports relationship conversion count',
    parsedRels.result.importReview?.normalizedRelationships === true &&
      parsedRels.result.importReview?.relationshipsConvertedCount === 2,
  )

  // ---------------------------------------------------------------------------
  // Stage 16A: realmLevel range adapter (realmLevel "6-10" → realmRange "6–10").
  // Preserves NotebookLM semantics while keeping realmLevel schema-safe (number).
  // ---------------------------------------------------------------------------
  const realmRangeMarkdown = [
    '---',
    'title: Stage 16A Realm Range',
    'chinese: 境界范围测试',
    'pinyin: Jing Jie',
    'section: cultivation',
    'category: Realm',
    'description: NotebookLM emits realmLevel as a 6-10 range.',
    'importance: minor',
    'verificationStatus: to-be-verified',
    'realmLevel: 6-10',
    '---',
    '## Overview',
    '',
    'Body.',
    '',
  ].join('\n')
  const parsedRealmRange = await jsonFetch('/api/editor/import-markdown', {
    method: 'POST',
    body: { mode: 'parse', markdown: realmRangeMarkdown },
  })
  const realmFm = parsedRealmRange.result.frontmatter
  assert('Stage 16A realmLevel range moved to realmRange "6–10"', realmFm.realmRange === '6–10', `realmRange=${JSON.stringify(realmFm.realmRange)}`)
  assert('Stage 16A realmLevel omitted after range move', !('realmLevel' in realmFm), `realmLevel=${JSON.stringify(realmFm.realmLevel)}`)
  assert(
    'Stage 16A realmLevel-range warning is surfaced',
    parsedRealmRange.result.warnings.some((w) => w.includes('Moved realmLevel range to realmRange')),
    `warnings=${JSON.stringify(parsedRealmRange.result.warnings)}`,
  )
  assert('Stage 16A import review reports realmLevel moved to range', parsedRealmRange.result.importReview?.movedRealmLevelToRange === true)

  // Real numeric realmLevel is preserved untouched.
  const realmNumberMarkdown = [
    '---',
    'title: Stage 16A Realm Number',
    'chinese: 单一境界测试',
    'pinyin: Dan Yi',
    'section: cultivation',
    'category: Realm',
    'description: A single numeric realmLevel must be preserved.',
    'importance: minor',
    'verificationStatus: to-be-verified',
    'realmLevel: 9',
    '---',
    '## Overview',
    '',
    'Body.',
    '',
  ].join('\n')
  const parsedRealmNumber = await jsonFetch('/api/editor/import-markdown', {
    method: 'POST',
    body: { mode: 'parse', markdown: realmNumberMarkdown },
  })
  assert('Stage 16A numeric realmLevel preserved', parsedRealmNumber.result.frontmatter.realmLevel === 9)
  assert('Stage 16A numeric realmLevel sets no realmRange', !parsedRealmNumber.result.frontmatter.realmRange)

  // Non-numeric prose realmLevel is dropped (no SQLite NaN crash) with a warning.
  const realmProseMarkdown = [
    '---',
    'title: Stage 16A Realm Prose',
    'chinese: 非数字测试',
    'pinyin: Fei Shu Zi',
    'section: cultivation',
    'category: Realm',
    'description: NotebookLM emits non-numeric prose for realmLevel.',
    'importance: minor',
    'verificationStatus: to-be-verified',
    'realmLevel: high tier',
    '---',
    '## Overview',
    '',
    'Body.',
    '',
  ].join('\n')
  const parsedRealmProse = await jsonFetch('/api/editor/import-markdown', {
    method: 'POST',
    body: { mode: 'parse', markdown: realmProseMarkdown },
  })
  assert('Stage 16A non-numeric realmLevel dropped', !('realmLevel' in parsedRealmProse.result.frontmatter))
  assert('Stage 16A non-numeric realmLevel review flag set', parsedRealmProse.result.importReview?.droppedRealmLevel === true)
  assert(
    'Stage 16A non-numeric realmLevel warning is surfaced',
    parsedRealmProse.result.warnings.some((w) => w.includes('Omitted non-numeric realmLevel')),
  )

  // ---------------------------------------------------------------------------
  // Stage 21B: NotebookLM body hardening (parse-only; no file writes).
  // Outer/trailing code fences stripped, placeholders flagged, unformatted
  // References flagged, and valid 剑来<number> citations preserved untouched.
  // ---------------------------------------------------------------------------

  // Fixture A: whole file wrapped in an outer ```markdown fence.
  const innerDoc = [
    '---',
    'title: Stage 21B Outer Fence',
    'chinese: 外层代码块测试',
    'pinyin: Wai Ceng',
    'section: characters',
    'category: Character',
    'description: NotebookLM wrapped the whole file in a code fence.',
    'importance: minor',
    'verificationStatus: to-be-verified',
    '---',
    '## Overview',
    '',
    'Body.',
    '',
    '## References',
    '',
    '- **剑来25：天地皆同力，第九章 — 不是剑客心难契:** A valid numbered citation that must be preserved.',
    '',
  ].join('\n')
  const outerFenceMarkdown = '```markdown\n' + innerDoc + '\n```'

  const parsedOuterFence = await jsonFetch('/api/editor/import-markdown', {
    method: 'POST',
    body: { mode: 'parse', markdown: outerFenceMarkdown },
  })
  assert(
    'Stage 21B outer fence removed (frontmatter still parses)',
    parsedOuterFence.result.frontmatter.title === 'Stage 21B Outer Fence',
    `title=${JSON.stringify(parsedOuterFence.result.frontmatter.title)}`,
  )
  assert(
    'Stage 21B outer-fence warning surfaced',
    parsedOuterFence.result.warnings.some((w) => w.includes('Removed outer Markdown code fence')),
    `warnings=${JSON.stringify(parsedOuterFence.result.warnings)}`,
  )
  assert(
    'Stage 21B valid 剑来<number> citation preserved through outer-fence strip',
    parsedOuterFence.result.body.includes('剑来25'),
  )
  assert(
    'Stage 21B body has no residual code fence after outer-fence strip',
    !parsedOuterFence.result.body.includes('```'),
  )

  // Fixture B: trailing accidental fence at the end of the body.
  const trailingFenceMarkdown = [
    '---',
    'title: Stage 21B Trailing Fence',
    'chinese: 尾部代码块测试',
    'pinyin: Wei Bu',
    'section: characters',
    'category: Character',
    'description: NotebookLM left a trailing code fence at the end.',
    'importance: minor',
    'verificationStatus: to-be-verified',
    '---',
    '## Overview',
    '',
    'Body.',
    '',
    '## References',
    '',
    '- **剑来2：忽为远行客，第四章 — 天亮:** Valid citation.',
    '```',
  ].join('\n')
  const parsedTrailingFence = await jsonFetch('/api/editor/import-markdown', {
    method: 'POST',
    body: { mode: 'parse', markdown: trailingFenceMarkdown },
  })
  assert(
    'Stage 21B trailing-fence warning surfaced',
    parsedTrailingFence.result.warnings.some((w) => w.includes('Removed trailing Markdown code fence')),
    `warnings=${JSON.stringify(parsedTrailingFence.result.warnings)}`,
  )
  assert(
    'Stage 21B trailing fence removed from body',
    !parsedTrailingFence.result.body.includes('```'),
  )
  assert(
    'Stage 21B valid citation preserved after trailing-fence strip',
    parsedTrailingFence.result.body.includes('剑来2'),
  )

  // Fixture C: placeholder tokens (剑来X literal + [Volume Title] + [specific claim]).
  const placeholderMarkdown = [
    '---',
    'title: Stage 21B Placeholders',
    'chinese: 占位符测试',
    'pinyin: Zhan Wei Fu',
    'section: characters',
    'category: Character',
    'description: NotebookLM left placeholder reference tokens.',
    'importance: minor',
    'verificationStatus: to-be-verified',
    '---',
    '## Overview',
    '',
    'Body.',
    '',
    '## References',
    '',
    '- **剑来X：[Volume Title]，[Chapter Number]:** [specific claim] placeholder reference.',
    '',
  ].join('\n')
  const parsedPlaceholders = await jsonFetch('/api/editor/import-markdown', {
    method: 'POST',
    body: { mode: 'parse', markdown: placeholderMarkdown },
  })
  assert(
    'Stage 21B placeholder warning surfaced',
    parsedPlaceholders.result.warnings.some((w) => w.includes('Reference placeholders found')),
    `warnings=${JSON.stringify(parsedPlaceholders.result.warnings)}`,
  )

  // Fixture D: valid numbered citation must NOT trigger the placeholder warning.
  const validCitationMarkdown = [
    '---',
    'title: Stage 21B Valid Citation',
    'chinese: 有效引用测试',
    'pinyin: You Xiao',
    'section: characters',
    'category: Character',
    'description: A valid numbered citation must not be flagged as a placeholder.',
    'importance: minor',
    'verificationStatus: to-be-verified',
    '---',
    '## Overview',
    '',
    'Body.',
    '',
    '## References',
    '',
    '- **剑来25：天地皆同力，第九章 — 不是剑客心难契:** Valid, properly formatted citation.',
    '',
  ].join('\n')
  const parsedValidCitation = await jsonFetch('/api/editor/import-markdown', {
    method: 'POST',
    body: { mode: 'parse', markdown: validCitationMarkdown },
  })
  assert(
    'Stage 21B valid 剑来<number> citation NOT flagged as placeholder',
    !parsedValidCitation.result.warnings.some((w) => w.includes('Reference placeholders found')),
    `warnings=${JSON.stringify(parsedValidCitation.result.warnings)}`,
  )
  assert(
    'Stage 21B well-formatted References NOT flagged as unformatted',
    !parsedValidCitation.result.warnings.some((w) => w.includes('unformatted References')),
  )

  // Fixture E: unformatted References (plain non-bullet line under ## References).
  const unformattedRefsMarkdown = [
    '---',
    'title: Stage 21B Unformatted Refs',
    'chinese: 未格式化引用测试',
    'pinyin: Wei Ge Shi Hua',
    'section: characters',
    'category: Character',
    'description: References section uses plain unbulleted lines.',
    'importance: minor',
    'verificationStatus: to-be-verified',
    '---',
    '## Overview',
    '',
    'Body.',
    '',
    '## References',
    '',
    '剑来2：忽为远行客 — plain unbulleted reference line.',
    '',
  ].join('\n')
  const parsedUnformatted = await jsonFetch('/api/editor/import-markdown', {
    method: 'POST',
    body: { mode: 'parse', markdown: unformattedRefsMarkdown },
  })
  assert(
    'Stage 21B unformatted References warning surfaced',
    parsedUnformatted.result.warnings.some((w) => w.includes('unformatted References')),
    `warnings=${JSON.stringify(parsedUnformatted.result.warnings)}`,
  )

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

  // ---------------------------------------------------------------------------
  // Stage 14A: editor stabilization & guidance (static source assertions only;
  // no file writes, no content creation).
  // ---------------------------------------------------------------------------

  // Dev-only font override exists and drops the remote R2 font from the stack.
  const devFontsPath = join(ROOT, 'app', 'assets', 'css', 'dev-fonts.css')
  assert('Stage 14A dev-only font override file exists', existsSync(devFontsPath))
  if (existsSync(devFontsPath)) {
    const devFontsSource = await readFile(devFontsPath, 'utf-8')
    assert(
      'Stage 14A dev font override redefines --font-zh-display without the R2 font',
      devFontsSource.includes('--font-zh-display') && !devFontsSource.includes('HYDiShengHero'),
    )
  }

  // nuxt.config wires the dev font override behind a dev-only condition, so the
  // production static build keeps the original R2 @font-face behavior.
  const nuxtConfigSource = await readFile(join(ROOT, 'nuxt.config.ts'), 'utf-8')
  assert(
    'Stage 14A dev font override is dev-only in nuxt.config',
    nuxtConfigSource.includes('dev-fonts.css') && nuxtConfigSource.includes('import.meta.dev'),
  )
  assert(
    'Stage 14A production CSS still includes main.css',
    nuxtConfigSource.includes("'~/assets/css/main.css'"),
  )

  // BodyEditor exposes an open-media-library action (so the toolbar can route to
  // the Media Library instead of only inserting a raw placeholder).
  const bodyEditorSource = await readFile(join(ROOT, 'app', 'components', 'admin', 'BodyEditor.vue'), 'utf-8')
  assert(
    'Stage 14A BodyEditor emits open-media-library',
    bodyEditorSource.includes("'open-media-library'") && bodyEditorSource.includes('openMediaLibrary'),
  )

  // Guidance copy: verificationStatus + media fields carry help text clarifying
  // verified vs to-be-verified and the placeholder convention.
  const registrySource14a = await readFile(join(ROOT, 'app', 'data', 'fieldRegistry.ts'), 'utf-8')
  assert(
    'Stage 14A verificationStatus has helper text',
    /verificationStatus[^\n]*help:/.test(registrySource14a),
  )
  assert(
    'Stage 14A media fields document the empty-placeholder convention',
    /key: 'image'[^\n]*placeholder/.test(registrySource14a) && /allowed placeholder/i.test(registrySource14a),
  )

  // Ghost relationship links are grouped into a single validation warning.
  const adminSource = await readFile(join(ROOT, 'app', 'pages', 'admin.vue'), 'utf-8')
  assert(
    'Stage 14A ghost links are reported as one grouped warning',
    adminSource.includes('ghost relationship link'),
  )

  // public/fonts must never be committable (local-only experiments).
  let fontsIgnored = false
  try {
    execSync('git check-ignore public/fonts/__stage14a_probe.ttf', { cwd: ROOT, stdio: 'ignore' })
    fontsIgnored = true
  } catch {
    fontsIgnored = false
  }
  assert('Stage 14A public/fonts is git-ignored (no font staging)', fontsIgnored)

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
