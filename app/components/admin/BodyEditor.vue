<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const props = defineProps<{
  modelValue: string
  verificationStatus?: string
  hasReferences?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const viewMode = ref<'edit' | 'split' | 'preview'>('edit')

// Remember the last caret position so modal-driven inserts (e.g. the Media
// Library) land where the user was typing rather than appending to the end.
let lastCaretStart: number | null = null
let lastCaretEnd: number | null = null

function rememberCaret() {
  const el = textareaRef.value
  if (!el) return
  lastCaretStart = el.selectionStart
  lastCaretEnd = el.selectionEnd
}

// --- Counts ---
const charCount = computed(() => (props.modelValue || '').length)
const wordCount = computed(() => {
  const t = (props.modelValue || '').trim()
  if (!t) return 0
  return t.split(/\s+/).filter(Boolean).length
})

// --- Body warnings (local, contextual) ---
const startsWithTopLevelTitle = computed(() =>
  (props.modelValue || '').trimStart().startsWith('# '),
)
const missingReferences = computed(
  () => props.verificationStatus === 'verified' && !props.hasReferences,
)

const bodyWarnings = computed(() => {
  const w: string[] = []
  if (startsWithTopLevelTitle.value) {
    w.push('Body starts with a top-level "# Title". The layout already renders the title — use ## for sections.')
  }
  if (missingReferences.value) {
    w.push('Entry is marked "verified" but has no "## References" section.')
  }
  return w
})

// --- Emit helper ---
function updateValue(v: string) {
  emit('update:modelValue', v)
}

function onInput(e: Event) {
  updateValue((e.target as HTMLTextAreaElement).value)
}

// --- Insertion helpers (cursor-aware, never destroys content) ---
function applyWrap(before: string, after = before, placeholder = '') {
  const el = textareaRef.value
  const value = props.modelValue || ''
  if (!el) {
    updateValue(value + before + placeholder + after)
    return
  }
  const start = el.selectionStart ?? value.length
  const end = el.selectionEnd ?? value.length
  const selected = value.slice(start, end) || placeholder
  const next = value.slice(0, start) + before + selected + after + value.slice(end)
  updateValue(next)
  nextTick(() => {
    el.focus()
    const cursorStart = start + before.length
    const cursorEnd = cursorStart + selected.length
    el.setSelectionRange(cursorStart, cursorEnd)
  })
}

function applyLinePrefix(prefix: string) {
  const el = textareaRef.value
  const value = props.modelValue || ''
  if (!el) {
    updateValue(value ? `${value}\n${prefix}` : prefix)
    return
  }
  const start = el.selectionStart ?? value.length
  const lineStart = value.lastIndexOf('\n', start - 1) + 1
  const next = value.slice(0, lineStart) + prefix + value.slice(lineStart)
  updateValue(next)
  nextTick(() => {
    el.focus()
    const pos = start + prefix.length
    el.setSelectionRange(pos, pos)
  })
}

function insertAtCursor(text: string, opts: { useRemembered?: boolean } = {}) {
  const el = textareaRef.value
  const value = props.modelValue || ''
  if (!el) {
    updateValue(value + text)
    return
  }
  // When invoked from outside the textarea (e.g. the Media Library modal), the
  // textarea has lost focus, so fall back to the last remembered caret.
  const start = opts.useRemembered && lastCaretStart != null
    ? lastCaretStart
    : (el.selectionStart ?? value.length)
  const end = opts.useRemembered && lastCaretEnd != null
    ? lastCaretEnd
    : (el.selectionEnd ?? value.length)
  const next = value.slice(0, start) + text + value.slice(end)
  updateValue(next)
  nextTick(() => {
    el.focus()
    const pos = start + text.length
    el.setSelectionRange(pos, pos)
    lastCaretStart = pos
    lastCaretEnd = pos
  })
}

/**
 * Build and insert a Markdown media snippet at the remembered caret.
 * Images use standard Markdown; videos use a raw <video> tag so the media
 * still renders in the public Nuxt Content output. Used by the Media Library.
 */
function insertMediaSnippet(payload: { path: string; type: 'image' | 'video'; alt?: string }) {
  const path = (payload?.path || '').trim()
  if (!path) return
  const alt = (payload.alt || '').trim()
  const snippet = payload.type === 'video'
    ? `\n<video src="${path}" controls playsinline></video>\n`
    : `![${alt}](${path})`
  // Ensure the editor is on a pane that shows the textarea.
  if (viewMode.value === 'preview') viewMode.value = 'split'
  insertAtCursor(snippet, { useRemembered: true })
}

defineExpose({ insertMediaSnippet, insertReferencesHeading })

function insertReferencesHeading() {
  const value = props.modelValue || ''
  if (/(^|\n)##\s+References\s*(\n|$)/.test(value)) {
    // Already present — focus the existing section instead of duplicating.
    const idx = value.search(/(^|\n)##\s+References/)
    nextTick(() => {
      const el = textareaRef.value
      if (el && idx >= 0) {
        el.focus()
        el.setSelectionRange(idx, idx)
      }
    })
    return
  }
  const prefix = value.trimEnd()
  const snippet = '## References\n\n- **Source reference needed:** Supports ...\n'
  updateValue(prefix ? `${prefix}\n\n${snippet}` : snippet)
}

// --- Toolbar actions ---
function h2() { applyLinePrefix('## ') }
function h3() { applyLinePrefix('### ') }
function bold() { applyWrap('**', '**', 'bold text') }
function italic() { applyWrap('*', '*', 'italic text') }
function link() { applyWrap('[', '](/section/slug)', 'link text') }
function mediaSnippet() { insertAtCursor('![alt text](/images/...)') }

// --- Lightweight, dependency-free Markdown preview ---
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inline(text: string): string {
  // images first: ![alt](src)
  let out = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, src) => `<img alt="${alt}" src="${src}" />`)
  // links: [text](href)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, t, href) => `<a href="${href}">${t}</a>`)
  // bold: **text**
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // italic: *text*
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
  // inline code: `code`
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  return out
}

function renderMarkdown(md: string): string {
  if (!md.trim()) return '<p class="md-empty">Nothing to preview yet.</p>'

  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const html: string[] = []
  let inCode = false
  let codeBuffer: string[] = []
  let listType: 'ul' | 'ol' | null = null
  let paraBuffer: string[] = []

  function flushPara() {
    if (paraBuffer.length) {
      html.push(`<p>${inline(paraBuffer.join(' '))}</p>`)
      paraBuffer = []
    }
  }
  function closeList() {
    if (listType) {
      html.push(listType === 'ul' ? '</ul>' : '</ol>')
      listType = null
    }
  }

  for (const line of lines) {
    // code fence
    if (/^```/.test(line.trim())) {
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`)
        codeBuffer = []
        inCode = false
      } else {
        flushPara(); closeList()
        inCode = true
      }
      continue
    }
    if (inCode) { codeBuffer.push(line); continue }

    // blank line
    if (!line.trim()) { flushPara(); closeList(); continue }

    // heading
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      flushPara(); closeList()
      const level = h[1]!.length
      html.push(`<h${level}>${inline(escapeHtml(h[2]!))}</h${level}>`)
      continue
    }

    // horizontal rule
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      flushPara(); closeList()
      html.push('<hr />')
      continue
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      flushPara(); closeList()
      html.push(`<blockquote>${inline(escapeHtml(line.replace(/^>\s?/, '')))}</blockquote>`)
      continue
    }

    // unordered list
    const ul = line.match(/^[-*+]\s+(.*)$/)
    if (ul) {
      flushPara()
      if (listType !== 'ul') { closeList(); html.push('<ul>'); listType = 'ul' }
      html.push(`<li>${inline(escapeHtml(ul[1]!))}</li>`)
      continue
    }
    // ordered list
    const ol = line.match(/^\d+\.\s+(.*)$/)
    if (ol) {
      flushPara()
      if (listType !== 'ol') { closeList(); html.push('<ol>'); listType = 'ol' }
      html.push(`<li>${inline(escapeHtml(ol[1]!))}</li>`)
      continue
    }

    // paragraph text
    closeList()
    paraBuffer.push(escapeHtml(line.trim()))
  }

  flushPara(); closeList()
  if (inCode) html.push(`<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`)

  return html.join('\n')
}

const previewHtml = computed(() => renderMarkdown(props.modelValue || ''))
</script>

<template>
  <section class="body-editor">
    <div class="be-toolbar">
      <div class="be-tools" role="toolbar" aria-label="Markdown formatting">
        <button type="button" class="be-btn" title="Heading 2" @click="h2">H2</button>
        <button type="button" class="be-btn" title="Heading 3" @click="h3">H3</button>
        <span class="be-sep" />
        <button type="button" class="be-btn" title="Bold" @click="bold"><strong>B</strong></button>
        <button type="button" class="be-btn" title="Italic" @click="italic"><em>I</em></button>
        <button type="button" class="be-btn" title="Inline code link" @click="link">Link</button>
        <button type="button" class="be-btn" title="Insert image / media path" @click="mediaSnippet">Image</button>
        <span class="be-sep" />
        <button type="button" class="be-btn" title="Insert References heading" @click="insertReferencesHeading">References</button>
      </div>

      <div class="be-modes" role="tablist" aria-label="Body view mode">
        <button type="button" class="be-mode" :class="{ active: viewMode === 'edit' }" @click="viewMode = 'edit'">Edit</button>
        <button type="button" class="be-mode" :class="{ active: viewMode === 'split' }" @click="viewMode = 'split'">Split</button>
        <button type="button" class="be-mode" :class="{ active: viewMode === 'preview' }" @click="viewMode = 'preview'">Preview</button>
      </div>
    </div>

    <div v-if="bodyWarnings.length" class="be-warnings">
      <div v-for="w in bodyWarnings" :key="w" class="be-warning">⚠️ {{ w }}</div>
    </div>

    <div class="be-panes" :class="`mode-${viewMode}`">
      <textarea
        v-if="viewMode !== 'preview'"
        ref="textareaRef"
        :value="modelValue"
        class="be-textarea"
        spellcheck="false"
        placeholder="Write Markdown body here. Use ## for section headings."
        @input="onInput"
        @blur="rememberCaret"
        @select="rememberCaret"
        @keyup="rememberCaret"
        @mouseup="rememberCaret"
      />
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="viewMode !== 'edit'"
        class="be-preview mdc-content"
        v-html="previewHtml"
      />
      <!-- eslint-enable vue/no-v-html -->
    </div>

    <div class="be-statusbar">
      <span>{{ wordCount }} {{ wordCount === 1 ? 'word' : 'words' }}</span>
      <span class="be-dot">•</span>
      <span>{{ charCount }} {{ charCount === 1 ? 'character' : 'characters' }}</span>
    </div>
  </section>
</template>

<style scoped>
.body-editor {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* --- Toolbar --- */
.be-toolbar {
  position: sticky;
  top: calc(var(--header-height, 64px) + 0.25rem);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.4rem 0.5rem;
  background: var(--c-bg-soft);
  border: 1px solid var(--c-border);
  border-radius: 6px;
}

.be-tools,
.be-modes {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.be-btn {
  min-width: 2rem;
  padding: 0.3rem 0.55rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  background: var(--c-bg);
  color: var(--c-ink);
  font-size: 0.82rem;
  line-height: 1;
  cursor: pointer;
}

.be-btn:hover {
  border-color: var(--c-seal-red);
  color: var(--c-seal-red);
}

.be-sep {
  width: 1px;
  height: 1.3rem;
  background: var(--c-border);
  margin: 0 0.15rem;
}

.be-mode {
  padding: 0.3rem 0.7rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  background: var(--c-bg);
  color: var(--c-text-2);
  font-size: 0.82rem;
  cursor: pointer;
}

.be-mode.active {
  background: var(--c-seal-red);
  color: #fff;
  border-color: var(--c-seal-red);
}

/* --- Warnings --- */
.be-warnings {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.be-warning {
  font-size: 0.82rem;
  color: #5f4300;
  background: #fff8df;
  border: 1px solid #ecd98a;
  border-radius: 4px;
  padding: 0.4rem 0.6rem;
}

/* --- Panes --- */
.be-panes {
  display: grid;
  gap: 0.75rem;
}

.be-panes.mode-edit,
.be-panes.mode-preview {
  grid-template-columns: minmax(0, 1fr);
}

.be-panes.mode-split {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

@media (max-width: 900px) {
  .be-panes.mode-split {
    grid-template-columns: minmax(0, 1fr);
  }
}

.be-textarea {
  width: 100%;
  min-height: 460px;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.6;
  padding: 1rem;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  resize: vertical;
  background: var(--c-bg);
  color: var(--c-ink);
}

.be-preview {
  min-height: 460px;
  max-height: 70vh;
  overflow: auto;
  padding: 1rem 1.25rem;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  background: var(--c-bg);
}

.be-preview :deep(.md-empty) {
  color: var(--c-text-3);
  font-style: italic;
}

.be-preview :deep(h1),
.be-preview :deep(h2),
.be-preview :deep(h3) {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.be-preview :deep(p) {
  margin: 0.5rem 0;
  line-height: 1.7;
}

.be-preview :deep(ul),
.be-preview :deep(ol) {
  padding-left: 1.4rem;
  margin: 0.5rem 0;
}

.be-preview :deep(blockquote) {
  margin: 0.6rem 0;
  padding-left: 0.9rem;
  border-left: 3px solid var(--c-seal-red);
  color: var(--c-text-2);
}

.be-preview :deep(pre) {
  background: var(--c-bg-soft);
  border: 1px solid var(--c-border);
  border-radius: 4px;
  padding: 0.7rem;
  overflow: auto;
}

.be-preview :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.85em;
}

.be-preview :deep(img) {
  max-width: 100%;
  border-radius: 4px;
}

.be-preview :deep(hr) {
  border: none;
  border-top: 1px solid var(--c-border);
  margin: 1rem 0;
}

/* --- Status bar --- */
.be-statusbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: var(--c-text-3);
}

.be-dot {
  opacity: 0.6;
}
</style>
