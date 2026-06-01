<script setup lang="ts">
import { ref, watch } from 'vue'

type Confidence = 'high' | 'medium' | 'low' | 'needs-verification'

interface ReferenceRow {
  id: string
  volumeTitle: string
  chapterNumber: string
  chapterTitle: string
  claimSupported: string
  confidence: Confidence
  notes: string
  refMarker: string
}

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'status-change': [status: { hasReferences: boolean, hasLowConfidence: boolean }]
}>()

const references = ref<ReferenceRow[]>([])
const rawUnparsedReferences = ref<string[]>([])

const bodyBeforeReferences = ref('')
const bodyAfterReferences = ref('')

function newRow(partial?: Partial<ReferenceRow>): ReferenceRow {
  return {
    id: Math.random().toString(36).slice(2, 10),
    volumeTitle: partial?.volumeTitle ?? '',
    chapterNumber: partial?.chapterNumber ?? '',
    chapterTitle: partial?.chapterTitle ?? '',
    claimSupported: partial?.claimSupported ?? '',
    confidence: partial?.confidence ?? 'needs-verification',
    notes: partial?.notes ?? '',
    refMarker: partial?.refMarker ?? ''
  }
}

function cleanupClaim(claim: string): string {
  let cleaned = claim.trim()
  cleaned = cleaned.replace(/^Supports\s+/i, '')
  cleaned = cleaned.replace(/\.$/, '')
  cleaned = cleaned.replace(/,\s*but the exact chapter title still needs verification\.?$/i, '')
  cleaned = cleaned.replace(/,\s*but the exact uploaded source, volume, and chapter still need verification\.?$/i, '')
  return cleaned.trim()
}

function parseStructuredLine(line: string): ReferenceRow | null {
  // Canonical: - **剑来X：Volume, 第Y章 — Title:** Supports claim.
  const canonical = line.match(/^-\s+\*\*(.+?)\:\*\*\s+Supports\s+(.+?)\.?\s*$/i)
  if (canonical) {
    const sourcePart = (canonical[1] || '').trim()
    const claim = cleanupClaim(canonical[2] || '')

    if (sourcePart === 'Source reference needed') {
      return newRow({
        volumeTitle: '',
        chapterNumber: '',
        chapterTitle: '',
        claimSupported: claim,
        confidence: 'needs-verification'
      })
    }

    const chapterNeededMatch = sourcePart.match(/^(.+?),\s*Chapter reference needed$/i)
    if (chapterNeededMatch) {
      return newRow({
        volumeTitle: (chapterNeededMatch[1] || '').trim(),
        chapterNumber: '',
        chapterTitle: '',
        claimSupported: claim,
        confidence: 'medium'
      })
    }

    const fullMatch = sourcePart.match(/^(.+?),\s*([^—]+?)\s*—\s*(.+)$/)
    if (fullMatch) {
      return newRow({
        volumeTitle: (fullMatch[1] || '').trim(),
        chapterNumber: (fullMatch[2] || '').trim(),
        chapterTitle: (fullMatch[3] || '').trim(),
        claimSupported: claim,
        confidence: 'high'
      })
    }

    return null
  }

  // Legacy compatible: - **...:** Supports ...
  const legacy = line.match(/^-\s+\*\*(.+?)\:\*\*\s+(.+)$/)
  if (!legacy) return null

  const sourcePart = (legacy[1] || '').trim()
  const claim = cleanupClaim(legacy[2] || '')

  if (sourcePart === 'Source reference needed') {
    return newRow({
      volumeTitle: '',
      chapterNumber: '',
      chapterTitle: '',
      claimSupported: claim,
      confidence: 'needs-verification'
    })
  }

  const chapterNeededMatch = sourcePart.match(/^(.+?),\s*Chapter reference needed$/i)
  if (chapterNeededMatch) {
    return newRow({
      volumeTitle: (chapterNeededMatch[1] || '').trim(),
      chapterNumber: '',
      chapterTitle: '',
      claimSupported: claim,
      confidence: 'medium'
    })
  }

  const fullMatch = sourcePart.match(/^(.+?),\s*([^—]+?)\s*—\s*(.+)$/)
  if (fullMatch) {
    return newRow({
      volumeTitle: (fullMatch[1] || '').trim(),
      chapterNumber: (fullMatch[2] || '').trim(),
      chapterTitle: (fullMatch[3] || '').trim(),
      claimSupported: claim,
      confidence: 'high'
    })
  }

  return null
}

function splitReferenceSections(body: string) {
  const startMatch = body.match(/(^|\n)##\s+References\s*(\n|$)/)
  if (!startMatch || startMatch.index == null) {
    return {
      hasSection: false,
      before: body.trimEnd(),
      sectionBody: '',
      after: ''
    }
  }

  const headingStart = startMatch.index + (startMatch[1] ? startMatch[1].length : 0)
  const headingLineEnd = body.indexOf('\n', headingStart)
  const contentStart = headingLineEnd === -1 ? body.length : headingLineEnd + 1

  const rest = body.slice(contentStart)
  const nextHeadingRel = rest.search(/\n##\s+/)

  if (nextHeadingRel === -1) {
    return {
      hasSection: true,
      before: body.slice(0, headingStart).trimEnd(),
      sectionBody: rest,
      after: ''
    }
  }

  const sectionEnd = contentStart + nextHeadingRel + 1
  return {
    hasSection: true,
    before: body.slice(0, headingStart).trimEnd(),
    sectionBody: body.slice(contentStart, sectionEnd),
    after: body.slice(sectionEnd).trimStart()
  }
}

function emitStatus() {
  emit('status-change', {
    hasReferences: references.value.length > 0 || rawUnparsedReferences.value.length > 0,
    hasLowConfidence: references.value.some((r) => r.confidence === 'low' || r.confidence === 'needs-verification')
  })
}

function parseBody() {
  const body = props.modelValue || ''
  const split = splitReferenceSections(body)

  references.value = []
  rawUnparsedReferences.value = []
  bodyBeforeReferences.value = split.before
  bodyAfterReferences.value = split.after

  if (!split.hasSection) {
    emitStatus()
    return
  }

  const lines = split.sectionBody.split('\n')
  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    const parsed = parseStructuredLine(line)
    if (parsed) {
      references.value.push(parsed)
    } else {
      rawUnparsedReferences.value.push(rawLine)
    }
  }

  emitStatus()
}

function generateReferencesMarkdown(): string {
  if (references.value.length === 0 && rawUnparsedReferences.value.length === 0) {
    return ''
  }

  const lines: string[] = []

  for (const ref of references.value) {
    const claim = cleanupClaim(ref.claimSupported)

    if (!ref.volumeTitle.trim()) {
      lines.push(`- **Source reference needed:** Supports ${claim}, but the exact uploaded source, volume, and chapter still need verification.`)
      continue
    }

    if (!ref.chapterNumber.trim() || !ref.chapterTitle.trim()) {
      lines.push(`- **${ref.volumeTitle.trim()}, Chapter reference needed:** Supports ${claim}, but the exact chapter title still needs verification.`)
      continue
    }

    lines.push(`- **${ref.volumeTitle.trim()}, ${ref.chapterNumber.trim()} — ${ref.chapterTitle.trim()}:** Supports ${claim}.`)
  }

  if (rawUnparsedReferences.value.length > 0) {
    lines.push(...rawUnparsedReferences.value)
  }

  return `## References\n\n${lines.join('\n')}`
}

function regenerateReferences() {
  const currentBody = props.modelValue || ''
  const split = splitReferenceSections(currentBody)

  const generated = generateReferencesMarkdown()

  if (!split.hasSection) {
    if (!generated) {
      emit('update:modelValue', currentBody)
      return
    }

    const prefix = currentBody.trimEnd()
    const out = prefix ? `${prefix}\n\n${generated}\n` : `${generated}\n`
    emit('update:modelValue', out)
    return
  }

  if (!generated) {
    // No structured refs and no raw fallback -> remove only the existing references section,
    // preserve before/after content exactly around it.
    const before = split.before.trimEnd()
    const after = split.after.trim()
    if (before && after) {
      emit('update:modelValue', `${before}\n\n${after}\n`)
    } else if (before) {
      emit('update:modelValue', `${before}\n`)
    } else if (after) {
      emit('update:modelValue', `${after}\n`)
    } else {
      emit('update:modelValue', '')
    }
    return
  }

  const before = split.before.trimEnd()
  const after = split.after.trim()

  let out = ''
  if (before) out += `${before}\n\n`
  out += generated
  if (after) out += `\n\n${after}`
  out += '\n'

  emit('update:modelValue', out)
}

function addReference() {
  references.value.push(newRow())
  emitStatus()
}

function removeReference(index: number) {
  references.value.splice(index, 1)
  emitStatus()
}

function moveUp(index: number) {
  if (index <= 0) return
  const current = references.value[index]
  const prev = references.value[index - 1]
  if (!current || !prev) return
  references.value[index - 1] = current
  references.value[index] = prev
}

function moveDown(index: number) {
  if (index >= references.value.length - 1) return
  const current = references.value[index]
  const next = references.value[index + 1]
  if (!current || !next) return
  references.value[index + 1] = current
  references.value[index] = next
}

watch(references, emitStatus, { deep: true })
watch(rawUnparsedReferences, emitStatus, { deep: true })

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    // Parse on initial load and when a different entry body is loaded.
    if (!oldVal || oldVal !== newVal) {
      parseBody()
    }
  },
  { immediate: true }
)

defineExpose({
  parseBody,
  regenerateReferences
})
</script>

<template>
  <div class="references-editor">
    <div class="header">
      <h3>References Editor</h3>
      <div class="header-actions">
        <button
          type="button"
          class="parse-btn"
          title="Parse references from the Markdown body above"
          @click="parseBody"
        >
          Parse from Body
        </button>
        <button
          type="button"
          class="regen-btn"
          title="Generate Markdown and replace only the References section"
          @click="regenerateReferences"
        >
          Regenerate References Section
        </button>
      </div>
    </div>

    <div v-if="rawUnparsedReferences.length > 0" class="warning-box">
      <strong>Warning:</strong>
      {{ rawUnparsedReferences.length }} line(s) in the existing References section could not be parsed into structured rows.
      They will be preserved as raw text and not deleted.
    </div>

    <div class="ref-list">
      <div v-for="(refItem, index) in references" :key="refItem.id" class="ref-row">
        <div class="ref-actions">
          <button type="button" :disabled="index === 0" title="Move Up" @click="moveUp(index)">↑</button>
          <button
            type="button"
            :disabled="index === references.length - 1"
            title="Move Down"
            @click="moveDown(index)"
          >
            ↓
          </button>
          <button type="button" class="delete-btn" title="Remove" @click="removeReference(index)">✕</button>
        </div>

        <div class="ref-fields">
          <div class="field-group">
            <label>Volume Title</label>
            <input v-model="refItem.volumeTitle" type="text" placeholder="e.g. 剑来22：原挽天倾" />
          </div>
          <div class="field-group">
            <label>Chapter Number</label>
            <input v-model="refItem.chapterNumber" type="text" placeholder="e.g. 第七章" />
          </div>
          <div class="field-group">
            <label>Chapter Title</label>
            <input v-model="refItem.chapterTitle" type="text" placeholder="e.g. 同道中人" />
          </div>

          <div class="field-group full-width">
            <label>Claim Supported</label>
            <input v-model="refItem.claimSupported" type="text" placeholder="e.g. initial appearance in Lizhu Grotto-Heaven" />
          </div>

          <div class="field-group">
            <label>Confidence</label>
            <select v-model="refItem.confidence">
              <option value="high">high</option>
              <option value="medium">medium</option>
              <option value="low">low</option>
              <option value="needs-verification">needs-verification</option>
            </select>
          </div>

          <div class="field-group">
            <label>Notes (internal)</label>
            <input v-model="refItem.notes" type="text" placeholder="internal QA notes" />
          </div>

          <div class="field-group">
            <label>Ref marker (internal)</label>
            <input v-model="refItem.refMarker" type="text" placeholder="segment marker (not public)" />
          </div>
        </div>
      </div>
    </div>

    <button type="button" class="add-btn" @click="addReference">+ Add Reference</button>
  </div>
</template>

<style scoped>
.references-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--c-border);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.parse-btn {
  padding: 0.4rem 0.8rem;
  background-color: var(--c-bg-soft);
  color: var(--c-ink);
  border: 1px solid var(--c-border);
  border-radius: 4px;
  cursor: pointer;
}

.parse-btn:hover {
  background-color: var(--c-border);
}

.regen-btn {
  padding: 0.4rem 0.8rem;
  background-color: var(--c-ink);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.regen-btn:hover {
  background-color: #333;
}

.warning-box {
  background-color: #fff3cd;
  color: #856404;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #ffeeba;
  font-size: 0.9rem;
}

.ref-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ref-row {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  background: var(--c-bg-soft);
}

.ref-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ref-actions button {
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 4px;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  color: var(--c-text-2);
}

.ref-actions button:hover:not(:disabled) {
  background: var(--c-border);
  color: var(--c-ink);
}

.ref-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ref-actions .delete-btn {
  color: var(--c-seal-red);
  margin-top: auto;
}

.ref-actions .delete-btn:hover {
  background: #ffebeb;
}

.ref-fields {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  flex: 1;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.field-group.full-width {
  grid-column: 1 / -1;
}

.field-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--c-text-2);
}

.field-group input,
.field-group select {
  padding: 0.4rem;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.9rem;
}

.add-btn {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px dashed var(--c-border);
  border-radius: 4px;
  cursor: pointer;
  color: var(--c-text-2);
  font-weight: 600;
}

.add-btn:hover {
  border-color: var(--c-ink);
  color: var(--c-ink);
}
</style>
