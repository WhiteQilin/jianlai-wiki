<script setup lang="ts">
// Dev-only route protection
if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

useSeoMeta({
  title: 'Local Editor | Jian Lai Wiki'
})

const { data: entries, pending, refresh: refreshEntries } = await useFetch<any[]>('/api/editor/entries')

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

const PUBLIC_SECTIONS = ['characters', 'world', 'cultivation', 'swordsmanship', 'factions', 'artifacts', 'timeline', 'glossary', 'rankings', 'teachings', 'pantheon'] as const
const IMPORTANCE_VALUES = ['primary', 'major', 'minor', 'background'] as const
const VERIFICATION_VALUES = ['verified', 'to-be-verified', 'disputed', 'speculative'] as const

const CATEGORY_MAP: Record<string, string[]> = {
  characters: ['Character', 'Major', 'Minor', 'Gods'],
  world: ['Continent', 'Grotto-Heaven', 'Blessed Land', 'City', 'Landmark', 'Sword-Qi-Great-Wall'],
  cultivation: ['Realm', 'Path', 'Method', 'Concept'],
  swordsmanship: ['Technique', 'Flying-Sword-Art', 'Ability', 'Sword-Style'],
  factions: ['Sect', 'Dynasty', 'Academy', 'Clan', 'Alliance'],
  artifacts: ['Weapon', 'Flying-Sword', 'Sword-Nurturing-Gourd', 'Treasure', 'Material', 'Talisman'],
  timeline: ['Era', 'Event', 'Arc'],
  rankings: ['Tier-List', 'Realm-Ladder', 'Named-List'],
  teachings: ['Teaching', 'School'],
  pantheon: ['God', 'Demon', 'Spirit', 'Mountain-Water-Deity'],
  glossary: ['Term', 'Concept', 'Phrase']
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
  } catch (e: any) {
    createWizardError.value = e?.data?.statusMessage || e?.message || 'Failed to create entry'
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

const canSaveImport = computed(() => {
  if (!importParseResult.value) return false
  if (importParseResult.value.errors.length > 0) return false
  if (importParseResult.value.exists) {
    return importOverwritePhrase.value.trim() === expectedOverwritePhrase.value
  }
  return true
})

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
    importFrontmatterPreview.value = JSON.stringify(res.result.frontmatter, null, 2)
  } catch (e: any) {
    importParseError.value = e?.data?.statusMessage || e?.message || 'Failed to parse markdown'
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
    isImportModalOpen.value = false
  } catch (e: any) {
    importParseError.value = e?.data?.statusMessage || e?.message || 'Import save failed'
  } finally {
    isImportSaving.value = false
  }
}

// --- Editor State ---
const editForm = ref<Record<string, any>>({})
const editBody = ref('')
const tagsString = ref('')
const relatedString = ref('')
const isSaving = ref(false)

const referencesEditor = ref<{ parseBody: () => void } | null>(null)
const referencesStatus = ref({ hasReferences: false, hasLowConfidence: false })

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

    // Convert arrays to comma-separated strings for simple text inputs
    tagsString.value = Array.isArray(editForm.value.tags) ? editForm.value.tags.join(', ') : ''
    relatedString.value = Array.isArray(editForm.value.related) ? editForm.value.related.join(', ') : ''

    referencesStatus.value = { hasReferences: hasReferencesSection(editBody.value), hasLowConfidence: false }

    nextTick(() => {
      referencesEditor.value?.parseBody()
    })
  } else {
    editForm.value = {}
    editBody.value = ''
    tagsString.value = ''
    relatedString.value = ''
    referencesStatus.value = { hasReferences: false, hasLowConfidence: false }
  }
}, { immediate: true })

// --- Validation ---
const availableCategories = computed(() => {
  if (!editForm.value.section) return []
  return CATEGORY_MAP[editForm.value.section] || []
})

const validationErrors = computed(() => {
  const errs: string[] = []
  const fm = editForm.value
  if (!fm.title?.trim()) errs.push('Title is required')
  if (!fm.chinese?.trim()) errs.push('Chinese name is required')
  if (!fm.description?.trim()) errs.push('Description is required')
  if (!fm.category) errs.push('Category is required')
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

const validationWarnings = computed(() => {
  const warns: string[] = []
  const fm = editForm.value
  if (!fm.pinyin?.trim()) warns.push('Pinyin is recommended')
  if (fm.seal && fm.seal.length > 3) warns.push('Seal should ideally be 1-3 characters')

  if (editForm.value.tags && Array.isArray(editForm.value.tags)) {
    const hasInvalidTag = editForm.value.tags.some((t: string) => !/^[a-z0-9-]+$/.test(t))
    if (hasInvalidTag) warns.push('Tags should be lowercase and hyphenated')
  }

  // Relationship validation warnings
  const relFields = ['related', 'affiliations', 'members', 'leader', 'headquarters', 'location', 'owners', 'users', 'practitioners']
  for (const field of relFields) {
    const val = editForm.value[field]
    if (!val) continue
    const paths = Array.isArray(val) ? val : [val]
    for (const p of paths) {
      if (typeof p !== 'string') continue
      if (!p.startsWith('/')) warns.push(`${field}: Path "${p}" must start with /`)
      if (p.startsWith('/titles')) warns.push(`${field}: Path "${p}" points to internal /titles section`)
      if (p.startsWith('/_')) warns.push(`${field}: Path "${p}" points to internal partial`)

      // Check if it exists in entries list
      if (entries.value && !entries.value.some(e => e.routePath === p)) {
        warns.push(`${field}: Path "${p}" does not exist yet (Ghost Link)`)
      }
    }
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

// --- Actions ---
function editEntry(path: string) {
  selectedEntryPath.value = path
}

function closeEditor() {
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
  } catch (e: any) {
    alert('Save failed: ' + (e.data?.statusMessage || e.message))
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
          <button @click="saveEntry" class="save-btn" :disabled="isSaving">
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
          <button @click="closeEditor" class="close-btn">Discard & Back</button>
        </div>
      </div>

      <div v-if="entryPending" class="loading">Loading entry...</div>

      <div v-else-if="selectedEntry" class="editor-panels">
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

        <div class="panel frontmatter-panel">
          <h3>Frontmatter</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Title *</label>
              <input v-model="editForm.title" type="text" />
            </div>
            <div class="form-group">
              <label>Chinese *</label>
              <input v-model="editForm.chinese" type="text" />
            </div>
            <div class="form-group">
              <label>Pinyin</label>
              <input v-model="editForm.pinyin" type="text" />
            </div>
            <div class="form-group">
              <label>Section (Read-Only)</label>
              <input :value="editForm.section" type="text" disabled />
            </div>
            <div class="form-group">
              <label>Category *</label>
              <select v-model="editForm.category">
                <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Status</label>
              <input v-model="editForm.status" type="text" placeholder="e.g. Alive, Active" />
            </div>
            <div class="form-group">
              <label>Importance</label>
              <select v-model="editForm.importance">
                <option value="primary">primary</option>
                <option value="major">major</option>
                <option value="minor">minor</option>
                <option value="background">background</option>
              </select>
            </div>
            <div class="form-group">
              <label>Verification Status</label>
              <select v-model="editForm.verificationStatus">
                <option value="verified">verified</option>
                <option value="to-be-verified">to-be-verified</option>
                <option value="disputed">disputed</option>
                <option value="speculative">speculative</option>
              </select>
            </div>
            <div class="form-group">
              <label>Seal</label>
              <input v-model="editForm.seal" type="text" />
            </div>
            <div class="form-group full-width">
              <label>Description *</label>
              <textarea v-model="editForm.description" rows="2"></textarea>
            </div>
            <div class="form-group full-width">
              <label>Tags (comma separated)</label>
              <input v-model="tagsString" type="text" placeholder="e.g. sword-cultivator, fourteen-realm" />
            </div>
            <div class="form-group">
              <label>Image Path</label>
              <input v-model="editForm.image" type="text" />
            </div>
            <div class="form-group">
              <label>Banner Path</label>
              <input v-model="editForm.banner" type="text" />
            </div>
            <div class="form-group full-width">
              <label>Source Notes</label>
              <textarea v-model="editForm.sourceNotes" rows="3"></textarea>
              <div v-if="verificationHints.length" class="source-hints">
                <div v-for="hint in verificationHints" :key="hint" class="hint-item">⚠️ {{ hint }}</div>
              </div>
            </div>
            <div class="form-group full-width">
              <label>Related (comma separated paths)</label>
              <input v-model="relatedString" type="text" placeholder="e.g. /characters/chen-pingan, /world/lizhu-grotto-heaven" />
            </div>
          </div>

          <details class="raw-json-details">
            <summary>View Raw Frontmatter JSON (Includes preserved complex fields)</summary>
            <pre>{{ editForm }}</pre>
          </details>
        </div>

        <div class="panel body-panel">
          <h3>Body Markdown</h3>
          <textarea v-model="editBody" class="body-textarea"></textarea>
          <AdminReferencesEditor
            ref="referencesEditor"
            v-model="editBody"
            @status-change="handleReferencesStatus"
          />
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

            <div v-if="importParseResult.errors.length" class="validation-panel errors">
              <h4>❌ Import Errors</h4>
              <ul>
                <li v-for="err in importParseResult.errors" :key="err">{{ err }}</li>
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
  max-width: 1200px;
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
}

.editor-panels {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel {
  border: 1px solid var(--c-border);
  border-radius: 4px;
  padding: 1rem;
  background: var(--c-bg-soft);
}

.panel pre {
  white-space: pre-wrap;
  word-wrap: break-word;
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

.body-textarea {
  width: 100%;
  min-height: 400px;
  font-family: var(--font-mono);
  padding: 1rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  resize: vertical;
  background: var(--c-bg);
  color: var(--c-ink);
}

.error-text {
  color: #b3261e;
}

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

.preview-group code {
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

.create-error {
  margin-top: 0.8rem;
  padding: 0.55rem 0.7rem;
  border: 1px solid #f2b8b5;
  background: #fdecec;
  color: #8f1d18;
  border-radius: 4px;
}
</style>
