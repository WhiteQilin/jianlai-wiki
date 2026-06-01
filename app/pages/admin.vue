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

function editEntry(path: string) {
  selectedEntryPath.value = path
}

function closeEditor() {
  selectedEntryPath.value = ''
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
        <button @click="closeEditor" class="close-btn">Back to Dashboard</button>
      </div>

      <div v-if="entryPending" class="loading">Loading entry...</div>
      
      <div v-else-if="selectedEntry" class="editor-panels">
        <div class="panel frontmatter-panel">
          <h3>Frontmatter (Read-Only)</h3>
          <pre>{{ selectedEntry.frontmatter }}</pre>
        </div>
        <div class="panel body-panel">
          <h3>Body (Read-Only)</h3>
          <textarea readonly :value="selectedEntry.body" class="body-textarea"></textarea>
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
