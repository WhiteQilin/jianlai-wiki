<script setup lang="ts">
// Dev-only route protection
if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

import {
  PUBLIC_SECTIONS,
  IMPORTANCE_VALUES,
  VERIFICATION_VALUES,
  CATEGORY_MAP,
  categoriesForSection,
  groupsForSection,
  unknownFieldKeys,
  knownFieldKeys,
} from '~/data/fieldRegistry'

useSeoMeta({
  title: 'Local Editor | Jian Lai Wiki'
})

const { data: entries, pending, refresh: refreshEntries } = await useFetch<any[]>('/api/editor/entries')
const { data: mediaCatalog } = await useFetch<{ success: boolean; media: Array<{ publicPath: string; extension: string; type: 'image' | 'video' }> }>('/api/editor/media')

const searchQuery = ref('')
const selectedSection = ref('All')

const sections = computed(() => {
  if (!entries.value || !Array.isArray(entries.value)) return ['All']
  const secs = new Set(entries.value.map((e: any) => e.section))
  return ['All', ...Array.from(secs)]
})

const filteredEntries = computed(() => {
  if (!entries.value || !Array.isArray(entries.value)) return []
  let result = entries.value

  if (selectedSection.value !== 'All') {
    result = result.filter((e: any) => e.section === selectedSection.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((e: any) =>
      e.title.toLowerCase().includes(q) ||
      e.chinese.toLowerCase().includes(q) ||
      e.routePath.toLowerCase().includes(q)
    )
  }

  return result
})

const selectedEntryPath = ref('')
const { data: selectedEntry, pending: entryPending } = await useFetch<any>(() =>
  selectedEntryPath.value ? `/api/editor/entry?path=${selectedEntryPath.value}` : '/api/editor/entry?path=/invalid'
)

// --- Preview / UX polish state ---
const previewNonce = ref(0)
const showPreviewPanel = ref(true)
const importSuccess = ref<null | {
  action: 'created' | 'updated'
  routePath: string
  fileRelPath: string
}>(null)

const previewRoute = computed(() => selectedEntryPath.value || selectedEntry?.value?.routePath || '')
const previewUrl = computed(() => {
  if (!previewRoute.value) return ''
  return `${previewRoute.value}${previewRoute.value.includes('?') ? '&' : '?'}preview=${previewNonce.value}`
})

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'])
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov'])

interface TaxonomyReview {
  section: string
  originalCategory: string
  normalizedCategory: string
  typeField: string
  preservedTypeValue: string
  mapped: boolean
  reviewNeeded: boolean
  message: string
}

interface ImportParseResult {
  frontmatter: Record<string, any>
  body: string
  section: string
  slug: string
  routePath: string
  fileRelPath: string
  exists: boolean
  errors: string[]
  warnings: string[]
  hasReferences: boolean
  taxonomyReview: TaxonomyReview | null
}

// --- Create Wizard State ---
const isCreateWizardOpen = ref(false)
const isCreating = ref(false)
const isSlugManuallyEdited = ref(false)
const createWizardError = ref('')

// --- Import Workflow State ---
const isImportModalOpen = ref(false)
const isImportParsing = ref(false)
const isImportSaving = ref(false)
const importRawMarkdown = ref('')
const importParseResult = ref<ImportParseResult | null>(null)
const importParseError = ref('')
const importOverwritePhrase = ref('')
const importBodyPreview = ref('')
const importFrontmatterPreview = ref('')

const createForm = ref({
  title: '',
  chinese: '',
  pinyin: '',
  section: 'characters',
  category: 'Character',
  slug: '',
  description: '',
  importance: 'minor',
  verificationStatus: 'to-be-verified',
  status: 'Unknown',
  seal: ''
})

const createAvailableCategories = computed(() => CATEGORY_MAP[createForm.value.section] || [])

watch(() => createForm.value.section, (section) => {
  const categories = CATEGORY_MAP[section] || []
  if (!categories.includes(createForm.value.category)) {
    createForm.value.category = categories[0] || ''
  }
})

watch(() => createForm.value.title, (title) => {
  if (isSlugManuallyEdited.value) return
  createForm.value.slug = slugifyTitle(title)
})

const routePreview = computed(() => `/${createForm.value.section}/${createForm.value.slug || '<slug>'}`)
const filePreview = computed(() => `content/${createForm.value.section}/${createForm.value.slug || '<slug>'}.md`)

const slugValidationError = computed(() => {
  const s = createForm.value.slug.trim()
  if (!s) return 'Slug is required'
  if (s.includes('..') || s.includes('/') || s.includes('\\') || s.includes('\0')) return 'Slug contains invalid characters'
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) return 'Slug must be lowercase ASCII and hyphenated'
  if (['sample', '_meta', '_templates', 'titles'].includes(s)) return `Slug "${s}" is reserved`
  return ''
})

function slugifyTitle(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function openCreateWizard() {
  createWizardError.value = ''
  isSlugManuallyEdited.value = false
  createForm.value = {
    title: '',
    chinese: '',
    pinyin: '',
    section: 'characters',
    category: CATEGORY_MAP.characters?.[0] || '',
    slug: '',
    description: '',
    importance: 'minor',
    verificationStatus: 'to-be-verified',
    status: 'Unknown',
    seal: ''
  }
  isCreateWizardOpen.value = true
}

function closeCreateWizard() {
  if (isCreating.value) return
  isCreateWizardOpen.value = false
}

function onSlugInput(val: string) {
  isSlugManuallyEdited.value = true
  createForm.value.slug = val
}

async function createEntry() {
  createWizardError.value = ''

  if (!createForm.value.title.trim()) {
    createWizardError.value = 'Title is required'
    return
  }
  if (!createForm.value.chinese.trim()) {
    createWizardError.value = 'Chinese is required'
    return
  }
  if (!createForm.value.description.trim()) {
    createWizardError.value = 'Description is required'
    return
  }
  if (slugValidationError.value) {
    createWizardError.value = slugValidationError.value
    return
  }

  isCreating.value = true

  try {
    const res = await $fetch<{ routePath: string }>('/api/editor/create-entry', {
      method: 'POST',
      body: {
        title: createForm.value.title,
        chinese: createForm.value.chinese,
        pinyin: createForm.value.pinyin,
        section: createForm.value.section,
        category: createForm.value.category,
        slug: createForm.value.slug,
        description: createForm.value.description,
        importance: createForm.value.importance,
        verificationStatus: createForm.value.verificationStatus,
        status: createForm.value.status,
        seal: createForm.value.seal,
      }
    })

    await refreshEntries()
    selectedEntryPath.value = res.routePath
    isCreateWizardOpen.value = false
    importSuccess.value = null
  } catch (e: any) {
    createWizardError.value = e?.data?.message || e?.data?.statusMessage || e?.message || 'Failed to create entry'
  } finally {
    isCreating.value = false
  }
}

function openImportModal() {
  importRawMarkdown.value = ''
  importParseResult.value = null
  importParseError.value = ''
  importOverwritePhrase.value = ''
  importBodyPreview.value = ''
  importFrontmatterPreview.value = ''
  importSuccess.value = null
  isImportModalOpen.value = true
}

function closeImportModal() {
  if (isImportParsing.value || isImportSaving.value) return
  isImportModalOpen.value = false
}

const expectedOverwritePhrase = computed(() => {
  if (!importParseResult.value?.exists) return ''
  return `OVERWRITE ${importParseResult.value.routePath}`
})

const importAvailableCategories = computed(() => {
  const section = importParseResult.value?.section || importParseResult.value?.frontmatter?.section || ''
  return CATEGORY_MAP[section] || []
})

const importValidationErrors = computed(() => {
  if (!importParseResult.value) return [] as string[]
  const category = importParseResult.value.frontmatter?.category
  const hasValidManualCategory = typeof category === 'string' && importAvailableCategories.value.includes(category)

  return importParseResult.value.errors.filter((err) => {
    if (!hasValidManualCategory) return true
    return err !== 'category is required' && !/^category ".+" is not valid for section/.test(err)
  })
})

const canSaveImport = computed(() => {
  if (!importParseResult.value) return false
  if (importValidationErrors.value.length > 0) return false
  if (importParseResult.value.exists) {
    return importOverwritePhrase.value.trim() === expectedOverwritePhrase.value
  }
  return true
})

function refreshImportFrontmatterPreview() {
  importFrontmatterPreview.value = JSON.stringify(importParseResult.value?.frontmatter || {}, null, 2)
}

function setImportCategory(category: string) {
  if (!importParseResult.value) return
  importParseResult.value.frontmatter.category = category
  if (importParseResult.value.taxonomyReview) {
    importParseResult.value.taxonomyReview.normalizedCategory = category
    importParseResult.value.taxonomyReview.reviewNeeded = !category
  }
  refreshImportFrontmatterPreview()
}

async function parseImportMarkdown() {
  importParseError.value = ''
  importParseResult.value = null
  importOverwritePhrase.value = ''

  if (!importRawMarkdown.value.trim()) {
    importParseError.value = 'Please paste markdown content first.'
    return
  }

  isImportParsing.value = true

  try {
    const res = await $fetch<{ success: boolean; result: ImportParseResult }>('/api/editor/import-markdown', {
      method: 'POST',
      body: {
        mode: 'parse',
        markdown: importRawMarkdown.value,
      }
    })

    importParseResult.value = res.result
    importBodyPreview.value = res.result.body
    refreshImportFrontmatterPreview()
  } catch (e: any) {
    importParseError.value = e?.data?.message || e?.data?.statusMessage || e?.message || 'Failed to parse markdown'
  } finally {
    isImportParsing.value = false
  }
}

async function importAndSaveMarkdown() {
  if (!importParseResult.value || !canSaveImport.value) return

  isImportSaving.value = true
  importParseError.value = ''

  try {
    const path = importParseResult.value.routePath
    const frontmatter = importParseResult.value.frontmatter
    const body = importBodyPreview.value

    if (importParseResult.value.exists) {
      // Must use existing save path for backup-on-overwrite safety
      await $fetch('/api/editor/entry', {
        method: 'POST',
        body: {
          path,
          frontmatter,
          body,
        }
      })
    } else {
      await $fetch('/api/editor/import-markdown', {
        method: 'POST',
        body: {
          mode: 'save',
          path,
          frontmatter,
          body,
        }
      })
    }

    await refreshEntries()
    selectedEntryPath.value = path
    importSuccess.value = {
      action: importParseResult.value.exists ? 'updated' : 'created',
      routePath: path,
      fileRelPath: importParseResult.value.fileRelPath,
    }
    isImportModalOpen.value = false
  } catch (e: any) {
    importParseError.value = e?.data?.message || e?.data?.statusMessage || e?.message || 'Import save failed'
  } finally {
    isImportSaving.value = false
  }
}

// --- Editor State ---
const editForm = ref<Record<string, any>>({})
const editBody = ref('')
const isSaving = ref(false)

const referencesEditor = ref<{ parseBody: () => void } | null>(null)
const referencesStatus = ref({ hasReferences: false, hasLowConfidence: false })

// --- Registry-driven field layout ---
const currentSection = computed(() => editForm.value.section || '')

const customKeys = computed(() => unknownFieldKeys(editForm.value))

const fieldGroups = computed(() =>
  groupsForSection(currentSection.value, Object.keys(editForm.value)),
)

const collapsedGroups = ref<Record<string, boolean>>({})

function toggleGroup(id: string) {
  collapsedGroups.value[id] = !collapsedGroups.value[id]
}

function expandAllGroups() {
  collapsedGroups.value = {}
}

function collapseAllGroups() {
  const next: Record<string, boolean> = {}
  for (const g of fieldGroups.value) next[g.id] = true
  collapsedGroups.value = next
}

function groupFilledCount(fields: { key: string }[]): number {
  return fields.filter((f) => {
    const v = editForm.value[f.key]
    if (Array.isArray(v)) return v.length > 0
    return v != null && `${v}`.trim() !== ''
  }).length
}

function groupMissingRequired(fields: any[]): number {
  return fields.filter((f) => {
    if (!f.required) return false
    const v = editForm.value[f.key]
    if (Array.isArray(v)) return v.length === 0
    return v == null || `${v}`.trim() === ''
  }).length
}

/** Update a known field in place (preserves all other keys, incl. unknown). */
function updateField(key: string, value: any) {
  if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
    delete editForm.value[key]
    return
  }
  editForm.value[key] = value
}

function jumpToField(anchorKey: string) {
  if (import.meta.client) {
    const el = document.getElementById(`field-${anchorKey}`) || document.getElementById(anchorKey)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

// --- Custom / Advanced field handling ---
const newCustomKey = ref('')
const customFieldWarning = ref('')

function updateCustomField(key: string, value: string) {
  if (value === '') {
    delete editForm.value[key]
    return
  }
  editForm.value[key] = value
}

function removeCustomField(key: string) {
  delete editForm.value[key]
}

function addCustomField() {
  customFieldWarning.value = ''
  const key = newCustomKey.value.trim()
  if (!key) return
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(key)) {
    customFieldWarning.value = 'Key must start with a letter and contain only letters, numbers, or underscores.'
    return
  }
  if (knownFieldKeys().has(key)) {
    customFieldWarning.value = `"${key}" is a known registry field. Use its dedicated editor instead of a custom field.`
    return
  }
  if (key in editForm.value) {
    customFieldWarning.value = `"${key}" already exists on this entry.`
    return
  }
  editForm.value[key] = ''
  newCustomKey.value = ''
  nextTick(() => jumpToField(`custom-${key}`))
}

function customValueIsScalar(key: string): boolean {
  const v = editForm.value[key]
  return v == null || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'
}

function handleReferencesStatus(status: { hasReferences: boolean, hasLowConfidence: boolean }) {
  referencesStatus.value = status
}

function hasReferencesSection(body: string): boolean {
  return /(^|\n)##\s+References\s*(\n|$)/.test(body)
}

// Sync fetched data into editable state
watch(selectedEntry, (newVal) => {
  if (newVal && newVal.frontmatter) {
    // Deep clone to avoid mutating the fetch cache directly
    editForm.value = JSON.parse(JSON.stringify(newVal.frontmatter))
    editBody.value = newVal.body || ''
    collapsedGroups.value = {}
    customFieldWarning.value = ''
    newCustomKey.value = ''

    referencesStatus.value = { hasReferences: hasReferencesSection(editBody.value), hasLowConfidence: false }

    nextTick(() => {
      referencesEditor.value?.parseBody()
    })
  } else {
    editForm.value = {}
    editBody.value = ''
    referencesStatus.value = { hasReferences: false, hasLowConfidence: false }
  }
}, { immediate: true })

// --- Validation ---
const availableCategories = computed(() => {
  if (!editForm.value.section) return []
  return categoriesForSection(editForm.value.section)
})

const validationErrors = computed(() => {
  const errs: string[] = []
  const fm = editForm.value
  if (!fm.title?.trim()) errs.push('Title is required')
  if (!fm.chinese?.trim()) errs.push('Chinese name is required')
  if (!fm.description?.trim()) errs.push('Description is required')
  if (!fm.category) errs.push('Category is required')

  if (Array.isArray(fm.entries)) {
    fm.entries.forEach((row: any, idx: number) => {
      if (!row?.name?.toString().trim()) {
        errs.push(`entries[${idx}]: name is required`)
      }
    })
  }

  return errs
})

const verificationHints = computed(() => {
  const hints: string[] = []
  const fm = editForm.value

  if (fm.verificationStatus === 'verified' && !referencesStatus.value.hasReferences) {
    hints.push('verificationStatus is "verified" but no references exist.')
  }

  if (referencesStatus.value.hasReferences && referencesStatus.value.hasLowConfidence) {
    hints.push('Some references are low confidence / need verification. Consider keeping verificationStatus as "to-be-verified".')
  }

  return hints
})

function fileExt(path: string): string {
  const idx = path.lastIndexOf('.')
  if (idx === -1) return ''
  return path.slice(idx).toLowerCase()
}

function mediaExists(path: string): boolean {
  const list = mediaCatalog.value?.media || []
  return list.some((m) => m.publicPath === path)
}

const validationWarnings = computed(() => {
  const warns: string[] = []
  const fm = editForm.value
  if (!fm.pinyin?.trim()) warns.push('Pinyin is recommended')
  if (fm.seal && fm.seal.length > 3) warns.push('Seal should ideally be 1-3 characters')

  if (editForm.value.tags && Array.isArray(editForm.value.tags)) {
    const hasInvalidTag = editForm.value.tags.some((t: string) => !/^[a-z0-9-]+$/.test(t))
    if (hasInvalidTag) warns.push('Tags should be lowercase and hyphenated')
  }

  function warnRelationshipPath(label: string, path: string) {
    const p = path.trim()
    if (!p) return

    if (p.includes('..') || p.includes('\\') || p.includes('\0')) warns.push(`${label}: Path "${p}" contains invalid traversal characters`)
    if (!p.startsWith('/')) warns.push(`${label}: Path "${p}" must start with /`)
    if (p.startsWith('/titles')) warns.push(`${label}: Path "${p}" points to internal /titles section`)
    if (p.startsWith('/_') || p.includes('/_')) warns.push(`${label}: Path "${p}" points to internal partial`)

    const segments = p.split('/').filter(Boolean)
    if (segments.length !== 2) warns.push(`${label}: Path "${p}" should be /section/slug`)

    // Check if it exists in entries list. Ghost links remain allowed, but visible.
    if (entries.value && !entries.value.some(e => e.routePath === p)) {
      warns.push(`${label}: Path "${p}" does not exist yet (Ghost Link)`)
    }
  }

  // Relationship validation warnings
  const relFields = [
    'related',
    'affiliations',
    'members',
    'leader',
    'headquarters',
    'location',
    'owners',
    'users',
    'practitioners',
    'participants',
    'relatedFactions',
    'inhabitants',
    'governingFaction',
    'parentLocation',
  ]
  for (const field of relFields) {
    const val = editForm.value[field]
    if (!val) continue
    const paths = Array.isArray(val) ? val : [val]
    for (const p of paths) {
      if (typeof p !== 'string') continue
      warnRelationshipPath(field, p)
    }
  }

  if (Array.isArray(fm.relationships)) {
    fm.relationships.forEach((row: any, idx: number) => {
      const link = typeof row?.link === 'string' ? row.link : ''
      warnRelationshipPath(`relationships[${idx}].link`, link)
    })
  }

  if (Array.isArray(fm.entries)) {
    fm.entries.forEach((row: any, idx: number) => {
      const rank = row?.rank
      if (rank == null || `${rank}`.trim() === '') {
        warns.push(`entries[${idx}]: rank is recommended for ordered rankings`)
      }
      const link = typeof row?.link === 'string' ? row.link : ''
      if (!link.trim()) {
        warns.push(`entries[${idx}]: link is blank (allowed unresolved/manual entry)`)
      } else {
        warnRelationshipPath(`entries[${idx}].link`, link)
      }
    })
  }

  const numericFields = ['realmLevel', 'eraOrder']
  for (const key of numericFields) {
    const val = editForm.value[key]
    if (val == null || val === '') continue
    if (typeof val !== 'number') {
      const n = Number(val)
      if (Number.isNaN(n)) warns.push(`${key} should be numeric`)
    }
  }

  const imagePath = typeof fm.image === 'string' ? fm.image.trim() : ''
  if (imagePath) {
    if (!imagePath.startsWith('/images/')) warns.push('image path should usually start with /images/')
    const ext = fileExt(imagePath)
    if (ext && !IMAGE_EXTS.has(ext)) warns.push(`image path uses unsupported extension "${ext}"`)
    if (!mediaExists(imagePath)) warns.push(`image path "${imagePath}" not found in media catalog (allowed placeholder)`)
  }

  const bannerPath = typeof fm.banner === 'string' ? fm.banner.trim() : ''
  if (bannerPath) {
    if (!bannerPath.startsWith('/images/')) warns.push('banner path should usually start with /images/')
    const ext = fileExt(bannerPath)
    if (ext && !IMAGE_EXTS.has(ext)) warns.push(`banner path uses unsupported extension "${ext}"`)
    if (!mediaExists(bannerPath)) warns.push(`banner path "${bannerPath}" not found in media catalog (allowed placeholder)`)
  }

  const videoPath = typeof fm.video === 'string' ? fm.video.trim() : ''
  if (videoPath) {
    if (!videoPath.startsWith('/videos/')) warns.push('video path should usually start with /videos/')
    const ext = fileExt(videoPath)
    if (ext && !VIDEO_EXTS.has(ext)) warns.push(`video path uses unsupported extension "${ext}"`)
    if (!mediaExists(videoPath)) warns.push(`video path "${videoPath}" not found in media catalog (allowed placeholder)`)
  }

  if (editBody.value.trim().startsWith('# ')) {
    warns.push('Body starts with a top-level # Title. The layout already renders the title.')
  }

  if (editForm.value.verificationStatus === 'verified' && !referencesStatus.value.hasReferences) {
    warns.push('Status is "verified" but no references found.')
  }

  if (editForm.value.verificationStatus === 'verified' && referencesStatus.value.hasLowConfidence) {
    warns.push('Status is "verified" but references include low confidence / needs verification rows.')
  }

  return warns
})

const initialSnapshot = ref('')

const canSave = computed(() => validationErrors.value.length === 0)

const hasUnsavedChanges = computed(() => {
  if (!selectedEntryPath.value || !selectedEntry.value) return false
  const normalized = {
    frontmatter: editForm.value,
    body: editBody.value,
  }
  return JSON.stringify(normalized) !== initialSnapshot.value
})

watch(selectedEntryPath, (newPath, oldPath) => {
  if (!oldPath) return
  if (hasUnsavedChanges.value) {
    const proceed = window.confirm('You have unsaved changes. Switch entry anyway?')
    if (!proceed) {
      selectedEntryPath.value = oldPath
    }
  }
})

watch([editForm, editBody], () => {
  // no-op: keeps computed reactive
}, { deep: true })

watch(selectedEntry, (val) => {
  if (!val) {
    initialSnapshot.value = ''
    return
  }
  initialSnapshot.value = JSON.stringify({
    frontmatter: val.frontmatter || {},
    body: val.body || '',
  })
}, { immediate: true })

if (import.meta.client) {
  window.addEventListener('beforeunload', (e) => {
    if (!hasUnsavedChanges.value) return
    e.preventDefault()
    e.returnValue = ''
  })
}

function refreshPreview() {
  previewNonce.value += 1
}

function openPublicPage() {
  const route = previewRoute.value
  if (!route) return
  window.open(route, '_blank', 'noopener,noreferrer')
}

// --- Actions ---
function editEntry(path: string) {
  selectedEntryPath.value = path
}

function closeEditor() {
  if (hasUnsavedChanges.value) {
    const proceed = window.confirm('You have unsaved changes. Close editor anyway?')
    if (!proceed) return
  }
  selectedEntryPath.value = ''
}

async function saveEntry() {
  if (validationErrors.value.length > 0) {
    alert('Please fix validation errors before saving.')
    return
  }

  isSaving.value = true

  try {
    const res = await $fetch('/api/editor/entry', {
      method: 'POST',
      body: {
        path: selectedEntryPath.value,
        frontmatter: editForm.value,
        body: editBody.value
      }
    })
    alert('Saved successfully! Backup created at: ' + (res as any).backup)
    initialSnapshot.value = JSON.stringify({
      frontmatter: editForm.value,
      body: editBody.value,
    })
  } catch (e: any) {
    alert('Save failed: ' + (e.data?.message || e.data?.statusMessage || e.message))
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="admin-page mdc-content">
    <div class="admin-warning">
      <strong>⚠️ LOCAL DEV ONLY:</strong> This is a private Markdown editor. It writes directly to the local file system and is not available in production.
    </div>

    <div v-if="!selectedEntryPath" class="dashboard">
      <h1>Editor Dashboard</h1>

      <div v-if="importSuccess" class="import-success">
        <strong>Import {{ importSuccess.action === 'created' ? 'created' : 'updated' }} successfully.</strong>
        <div>Route: <code>{{ importSuccess.routePath }}</code></div>
        <div>File: <code>content/{{ importSuccess.fileRelPath }}</code></div>
      </div>

      <div class="controls">
        <input v-model="searchQuery" type="text" placeholder="Search entries..." class="search-input" />
        <select v-model="selectedSection" class="section-select">
          <option v-for="sec in sections" :key="sec" :value="sec">{{ sec }}</option>
        </select>
        <button class="create-btn" @click="openCreateWizard">Create Entry</button>
        <button class="create-btn" @click="openImportModal">Import Markdown</button>
      </div>

      <div v-if="pending" class="loading">Loading entries...</div>

      <table v-else class="entries-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Chinese</th>
            <th>Section</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in filteredEntries" :key="entry.routePath">
            <td>{{ entry.title }}</td>
            <td>{{ entry.chinese }}</td>
            <td>{{ entry.section }}</td>
            <td>{{ entry.category }}</td>
            <td>{{ entry.verificationStatus }}</td>
            <td>
              <button @click="editEntry(entry.routePath)" class="edit-btn">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="editor-view">
      <div class="editor-header">
        <h2>Editing: {{ selectedEntry?.routePath }}</h2>
        <div class="header-actions">
          <span class="save-state" :class="canSave ? 'ok' : 'blocked'">
            {{ canSave ? 'Can save' : 'Cannot save' }}
          </span>
          <button @click="openPublicPage" class="create-btn" :disabled="!previewRoute">Open Public Page</button>
          <button @click="refreshPreview" class="create-btn" :disabled="!previewRoute">Refresh Preview</button>
          <button @click="saveEntry" class="save-btn" :disabled="isSaving || !canSave">
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
          <button @click="closeEditor" class="close-btn">Discard & Back</button>
        </div>
      </div>

      <div v-if="entryPending" class="loading">Loading entry...</div>

      <div v-else-if="selectedEntry" class="editor-body">
        <!-- Validation Panel -->
        <div v-if="validationErrors.length || validationWarnings.length" class="validation-panel">
          <div v-if="validationErrors.length" class="errors">
            <h4>❌ Errors (Cannot Save)</h4>
            <ul>
              <li v-for="err in validationErrors" :key="err">{{ err }}</li>
            </ul>
          </div>
          <div v-if="validationWarnings.length" class="warnings">
            <h4>⚠️ Warnings (Can Save)</h4>
            <ul>
              <li v-for="warn in validationWarnings" :key="warn">{{ warn }}</li>
            </ul>
          </div>
        </div>

        <!-- 3-column Fandom-like layout -->
        <div class="editor-grid">
          <!-- Left: Field Navigator -->
          <div class="col-nav">
            <AdminFieldsFieldNavigator
              :groups="fieldGroups"
              :frontmatter="editForm"
              :custom-keys="customKeys"
              @jump="jumpToField"
              @expand-all="expandAllGroups"
              @collapse-all="collapseAllGroups"
            />
          </div>

          <!-- Center: grouped fields + body -->
          <div class="col-fields">
            <AdminFieldsFieldGroup
              v-for="group in fieldGroups"
              :key="group.id"
              :label="group.label"
              :total="group.fields.length"
              :filled="groupFilledCount(group.fields)"
              :missing-required="groupMissingRequired(group.fields)"
              :open="!collapsedGroups[group.id]"
              @toggle="toggleGroup(group.id)"
            >
              <AdminFieldsFieldRenderer
                v-for="field in group.fields"
                :key="field.key"
                :field="field"
                :model-value="editForm[field.key]"
                :section="currentSection"
                :entries="entries || []"
                @update="updateField"
              />
            </AdminFieldsFieldGroup>

            <!-- Advanced / Custom Fields -->
            <section class="advanced-fields">
              <h3>Advanced / Custom Fields</h3>
              <p class="advanced-note">
                Unknown fields are preserved on save and never deleted. Add a simple scalar field if needed.
              </p>

              <div v-for="key in customKeys" :id="`custom-${key}`" :key="`custom-${key}`" class="custom-field-row">
                <div class="custom-field-head">
                  <code>{{ key }}</code>
                  <button type="button" class="remove-custom" @click="removeCustomField(key)">Remove</button>
                </div>
                <input
                  v-if="customValueIsScalar(key)"
                  :value="editForm[key] ?? ''"
                  type="text"
                  @input="updateCustomField(key, ($event.target as HTMLInputElement).value)"
                />
                <div v-else class="custom-complex">
                  <span class="custom-complex-note">Complex value (preserved as-is, edit via raw JSON below):</span>
                  <pre>{{ editForm[key] }}</pre>
                </div>
              </div>

              <div class="add-custom-row">
                <input
                  v-model="newCustomKey"
                  type="text"
                  placeholder="newFieldKey"
                  @keyup.enter="addCustomField"
                />
                <button type="button" class="create-btn" @click="addCustomField">Add custom field</button>
              </div>
              <div v-if="customFieldWarning" class="custom-warning">⚠️ {{ customFieldWarning }}</div>
            </section>

            <details class="raw-json-details">
              <summary>View Raw Frontmatter JSON (Includes preserved complex fields)</summary>
              <pre>{{ editForm }}</pre>
            </details>

            <!-- Body editor + references -->
            <section class="body-section">
              <h3>Body Markdown</h3>
              <AdminBodyEditor
                v-model="editBody"
                :verification-status="editForm.verificationStatus"
                :has-references="referencesStatus.hasReferences"
              />
              <AdminReferencesEditor
                ref="referencesEditor"
                v-model="editBody"
                @status-change="handleReferencesStatus"
              />
              <div v-if="verificationHints.length" class="source-hints">
                <div v-for="hint in verificationHints" :key="hint" class="hint-item">⚠️ {{ hint }}</div>
              </div>
            </section>
          </div>

          <!-- Right: live card preview + iframe -->
          <div class="col-preview">
            <AdminEntryCardPreview :frontmatter="editForm" />

            <div v-if="showPreviewPanel && previewUrl" class="preview-panel">
              <h4>Live Page Preview</h4>
              <iframe :src="previewUrl" class="preview-iframe" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Entry Wizard Modal -->
    <div v-if="isCreateWizardOpen" class="modal-overlay" @click.self="closeCreateWizard">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Create New Entry</h3>
          <button class="modal-close" :disabled="isCreating" @click="closeCreateWizard">✕</button>
        </div>

        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Title *</label>
              <input v-model="createForm.title" type="text" />
            </div>
            <div class="form-group">
              <label>Chinese *</label>
              <input v-model="createForm.chinese" type="text" />
            </div>
            <div class="form-group">
              <label>Pinyin</label>
              <input v-model="createForm.pinyin" type="text" />
            </div>
            <div class="form-group">
              <label>Section *</label>
              <select v-model="createForm.section">
                <option v-for="sec in PUBLIC_SECTIONS" :key="sec" :value="sec">{{ sec }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Category *</label>
              <select v-model="createForm.category">
                <option v-for="cat in createAvailableCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Slug *</label>
              <input :value="createForm.slug" type="text" @input="onSlugInput(($event.target as HTMLInputElement).value)" />
              <small v-if="slugValidationError" class="error-text">{{ slugValidationError }}</small>
            </div>
            <div class="form-group full-width">
              <label>Description *</label>
              <textarea v-model="createForm.description" rows="2"></textarea>
            </div>
            <div class="form-group">
              <label>Importance</label>
              <select v-model="createForm.importance">
                <option v-for="v in IMPORTANCE_VALUES" :key="v" :value="v">{{ v }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Verification Status</label>
              <select v-model="createForm.verificationStatus">
                <option v-for="v in VERIFICATION_VALUES" :key="v" :value="v">{{ v }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Status</label>
              <input v-model="createForm.status" type="text" placeholder="e.g. Active, Unknown" />
            </div>
            <div class="form-group">
              <label>Seal</label>
              <input v-model="createForm.seal" type="text" />
            </div>
            <div class="form-group full-width preview-group">
              <div><strong>Route preview:</strong> <code>{{ routePreview }}</code></div>
              <div><strong>File preview:</strong> <code>{{ filePreview }}</code></div>
            </div>
          </div>

          <div v-if="createWizardError" class="create-error">{{ createWizardError }}</div>
        </div>

        <div class="modal-footer">
          <button class="close-btn" :disabled="isCreating" @click="closeCreateWizard">Cancel</button>
          <button class="save-btn" :disabled="isCreating" @click="createEntry">
            {{ isCreating ? 'Creating...' : 'Create Entry' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Import Markdown Modal -->
    <div v-if="isImportModalOpen" class="modal-overlay" @click.self="closeImportModal">
      <div class="modal-card import-modal-card">
        <div class="modal-header">
          <h3>Import NotebookLM Markdown</h3>
          <button class="modal-close" :disabled="isImportParsing || isImportSaving" @click="closeImportModal">✕</button>
        </div>

        <div class="modal-body">
          <div class="form-group full-width">
            <label>Raw Markdown (frontmatter + body)</label>
            <textarea v-model="importRawMarkdown" rows="12" class="body-textarea"></textarea>
          </div>

          <div class="import-actions-row">
            <button class="create-btn" :disabled="isImportParsing || isImportSaving" @click="parseImportMarkdown">
              {{ isImportParsing ? 'Parsing...' : 'Parse Markdown' }}
            </button>
          </div>

          <div v-if="importParseError" class="create-error">{{ importParseError }}</div>

          <div v-if="importParseResult" class="import-preview">
            <div class="preview-group">
              <div><strong>Target Route:</strong> <code>{{ importParseResult.routePath || '(unresolved)' }}</code></div>
              <div><strong>Target File:</strong> <code>content/{{ importParseResult.fileRelPath || '(unresolved)' }}</code></div>
              <div>
                <strong>Operation:</strong>
                <span v-if="importParseResult.exists">Update existing entry (overwrite)</span>
                <span v-else>Create new entry</span>
              </div>
            </div>

            <div v-if="importParseResult.taxonomyReview" class="taxonomy-review-box">
              <h4>Taxonomy Review</h4>
              <p>{{ importParseResult.taxonomyReview.message }}</p>
              <div class="taxonomy-review-grid">
                <div><strong>Imported category:</strong> <code>{{ importParseResult.taxonomyReview.originalCategory }}</code></div>
                <div><strong>Site category:</strong> <code>{{ importParseResult.frontmatter.category || '(choose below)' }}</code></div>
                <div><strong>Preserved field:</strong> <code>{{ importParseResult.taxonomyReview.typeField }}</code></div>
                <div><strong>Preserved value:</strong> <code>{{ importParseResult.frontmatter[importParseResult.taxonomyReview.typeField] || importParseResult.taxonomyReview.preservedTypeValue }}</code></div>
              </div>
              <div class="form-group full-width">
                <label>Override Site Category</label>
                <select
                  :value="importParseResult.frontmatter.category || ''"
                  @change="setImportCategory(($event.target as HTMLSelectElement).value)"
                >
                  <option value="">Choose valid site category...</option>
                  <option v-for="cat in importAvailableCategories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
                <small>Site category controls public filter tabs. The imported canon label remains in the preserved type field.</small>
              </div>
            </div>

            <div v-if="importValidationErrors.length" class="validation-panel errors">
              <h4>❌ Import Errors</h4>
              <ul>
                <li v-for="err in importValidationErrors" :key="err">{{ err }}</li>
              </ul>
            </div>

            <div v-if="importParseResult.warnings.length" class="validation-panel warnings">
              <h4>⚠️ Import Warnings</h4>
              <ul>
                <li v-for="warn in importParseResult.warnings" :key="warn">{{ warn }}</li>
              </ul>
            </div>

            <div v-if="importParseResult.exists" class="form-group full-width">
              <label>Overwrite confirmation phrase</label>
              <input v-model="importOverwritePhrase" type="text" :placeholder="expectedOverwritePhrase" />
              <small class="error-text">Type exactly: {{ expectedOverwritePhrase }}</small>
            </div>

            <div class="form-group full-width">
              <label>Parsed Frontmatter Preview</label>
              <textarea :value="importFrontmatterPreview" rows="12" readonly class="body-textarea"></textarea>
            </div>

            <div class="form-group full-width">
              <label>Body Preview (editable before save)</label>
              <textarea v-model="importBodyPreview" rows="14" class="body-textarea"></textarea>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="close-btn" :disabled="isImportParsing || isImportSaving" @click="closeImportModal">Cancel</button>
          <button class="save-btn" :disabled="!canSaveImport || isImportParsing || isImportSaving" @click="importAndSaveMarkdown">
            {{ isImportSaving ? 'Importing...' : 'Import and Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: calc(var(--header-height) + 2rem);
}

.admin-warning {
  background-color: #fff3cd;
  color: #856404;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
  border: 1px solid #ffeeba;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input, .section-select {
  padding: 0.5rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  font-family: inherit;
}

.search-input {
  flex: 1;
}

.create-btn {
  padding: 0.5rem 0.9rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  background: var(--c-bg-soft);
  cursor: pointer;
}

.entries-table {
  width: 100%;
  border-collapse: collapse;
}

.entries-table th, .entries-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--c-border);
}

.entries-table th {
  background-color: var(--c-bg-soft);
  font-weight: 600;
}

.edit-btn, .close-btn {
  padding: 0.4rem 0.8rem;
  background-color: var(--c-seal-red);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn:hover, .close-btn:hover {
  background-color: #8a1f1f;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.save-btn {
  padding: 0.5rem 1rem;
  background: var(--c-seal-red);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.validation-panel {
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.validation-panel .errors {
  border: 1px solid #f2b8b5;
  background: #fdecec;
  color: #8f1d18;
  border-radius: 6px;
  padding: 0.75rem 1rem;
}

.validation-panel .warnings {
  border: 1px solid #ecd98a;
  background: #fff8df;
  color: #5f4300;
  border-radius: 6px;
  padding: 0.75rem 1rem;
}

.validation-panel h4 {
  margin: 0 0 0.4rem;
}

.validation-panel ul {
  margin: 0;
  padding-left: 1.2rem;
}

/* --- 3-column editor grid --- */
.editor-grid {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) 320px;
  gap: 1.25rem;
  align-items: start;
}

.col-nav,
.col-preview {
  position: relative;
}

.col-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.col-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 1200px) {
  .editor-grid {
    grid-template-columns: minmax(0, 1fr) 300px;
  }
  .col-nav {
    display: none;
  }
}

@media (max-width: 900px) {
  .editor-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .col-preview {
    display: none;
  }
}

/* --- Advanced / custom fields --- */
.advanced-fields {
  border: 1px dashed var(--c-border);
  border-radius: 8px;
  padding: 0.85rem 1rem;
  background: var(--c-bg-soft);
}

.advanced-fields h3 {
  margin: 0 0 0.3rem;
  font-size: 1rem;
}

.advanced-note {
  margin: 0 0 0.75rem;
  font-size: 0.78rem;
  color: var(--c-text-3);
}

.custom-field-row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.65rem;
  scroll-margin-top: calc(var(--header-height, 64px) + 1rem);
}

.custom-field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom-field-head code {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--c-ink);
}

.remove-custom {
  border: 1px solid var(--c-border);
  background: var(--c-bg);
  border-radius: 4px;
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  cursor: pointer;
  color: #8f1d18;
}

.custom-field-row input[type='text'] {
  padding: 0.45rem 0.55rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  background: var(--c-bg);
  color: var(--c-ink);
}

.custom-complex {
  font-size: 0.78rem;
  color: var(--c-text-3);
}

.custom-complex pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 4px;
  padding: 0.5rem;
}

.add-custom-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.add-custom-row input {
  flex: 1;
  padding: 0.4rem 0.55rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

.custom-warning {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #8f1d18;
}

.raw-json-details {
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
  background: var(--c-bg-soft);
}

.raw-json-details pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 0.78rem;
}

/* --- Body section --- */
.body-section {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 0.85rem 1rem;
  background: var(--c-bg);
}

.body-section h3 {
  margin: 0 0 0.6rem;
  font-size: 1rem;
}

.body-textarea {
  width: 100%;
  min-height: 360px;
  font-family: var(--font-mono);
  padding: 1rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  resize: vertical;
  background: var(--c-bg);
  color: var(--c-ink);
}

.source-hints {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.hint-item {
  font-size: 0.85rem;
  color: #856404;
}

.error-text {
  color: #b3261e;
}

/* --- Preview --- */
.preview-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-panel h4 {
  margin: 0;
  font-size: 0.85rem;
  color: var(--c-text-2);
}

.preview-iframe {
  width: 100%;
  min-height: 420px;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  background: #fff;
}

/* --- Modals (unchanged behavior) --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-card {
  width: min(900px, 96vw);
  max-height: 92vh;
  overflow: auto;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 8px;
}

.import-modal-card {
  width: min(1100px, 98vw);
}

.modal-header,
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--c-border);
}

.modal-footer {
  border-bottom: none;
  border-top: 1px solid var(--c-border);
}

.modal-body {
  padding: 1rem;
}

.modal-close {
  border: none;
  background: transparent;
  font-size: 1.1rem;
  cursor: pointer;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.45rem 0.55rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
}

.import-actions-row {
  display: flex;
  justify-content: flex-start;
  margin-top: 0.75rem;
}

.import-preview {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.taxonomy-review-box {
  padding: 0.75rem;
  border: 1px solid #d9c27a;
  background: #fff8df;
  color: #5f4300;
  border-radius: 4px;
}

.taxonomy-review-box h4 {
  margin: 0 0 0.45rem;
}

.taxonomy-review-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.4rem 0.8rem;
  margin: 0.6rem 0;
}

.preview-group code {
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

.save-state {
  font-size: 0.85rem;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  border: 1px solid transparent;
}

.save-state.ok {
  color: #1b5e20;
  background: #e8f5e9;
  border-color: #c8e6c9;
}

.save-state.blocked {
  color: #8f1d18;
  background: #fdecec;
  border-color: #f2b8b5;
}

.create-error {
  margin-top: 0.8rem;
  padding: 0.55rem 0.7rem;
  border: 1px solid #f2b8b5;
  background: #fdecec;
  color: #8f1d18;
  border-radius: 4px;
}

.import-success {
  margin-top: 0.8rem;
  padding: 0.65rem 0.75rem;
  border: 1px solid #c8e6c9;
  background: #e8f5e9;
  color: #1b5e20;
  border-radius: 4px;
}
</style>
