<script setup lang="ts">
// Dev-only route protection
if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

useSeoMeta({
  title: 'Local Editor | Jian Lai Wiki'
})

const { data: entries, pending } = await useFetch<any[]>('/api/editor/entries')

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

// --- Editor State ---
const editForm = ref<Record<string, any>>({})
const editBody = ref('')
const tagsString = ref('')
const relatedString = ref('')
const isSaving = ref(false)

// Sync fetched data into editable state
watch(selectedEntry, (newVal) => {
  if (newVal && newVal.frontmatter) {
    // Deep clone to avoid mutating the fetch cache directly
    editForm.value = JSON.parse(JSON.stringify(newVal.frontmatter))
    editBody.value = newVal.body || ''
    
    // Convert arrays to comma-separated strings for simple text inputs
    tagsString.value = Array.isArray(editForm.value.tags) ? editForm.value.tags.join(', ') : ''
    relatedString.value = Array.isArray(editForm.value.related) ? editForm.value.related.join(', ') : ''
  } else {
    editForm.value = {}
    editBody.value = ''
    tagsString.value = ''
    relatedString.value = ''
  }
}, { immediate: true })

// --- Validation ---
const availableCategories = computed(() => {
  if (!editForm.value.section) return []
  // We can fetch this from an API or hardcode the map. For MVP, we'll fetch it or rely on the server.
  // Since we don't have the sectionMeta imported here easily, we'll just allow any string for now
  // and let the server validate, OR we can hardcode the known ones.
  // Let's hardcode the map for client-side convenience based on the registry.
  const map: Record<string, string[]> = {
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
  return map[editForm.value.section] || []
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

  if (fm.verificationStatus === 'verified' && !editBody.value.includes('## References')) {
    warns.push('Status is "verified" but no "## References" section found in body.')
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
</style>
