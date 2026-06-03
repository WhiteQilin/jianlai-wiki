<script setup lang="ts">
/**
 * ProductionChecklist — Stage 12E
 *
 * Presentational only. Receives a list of pre-computed checks from the editor
 * and renders pass / warn / fail rows. No schema knowledge, no side effects.
 */

type CheckStatus = 'pass' | 'warn' | 'fail' | 'na'

export interface ProductionCheck {
  id: string
  label: string
  status: CheckStatus
  detail?: string
}

const props = defineProps<{
  checks: ProductionCheck[]
}>()

const summary = computed(() => {
  const counts = { pass: 0, warn: 0, fail: 0, na: 0 }
  for (const c of props.checks) counts[c.status] += 1
  return counts
})

const icon: Record<CheckStatus, string> = {
  pass: '✅',
  warn: '⚠️',
  fail: '❌',
  na: '➖',
}

const isReady = computed(() => summary.value.fail === 0)
</script>

<template>
  <div class="production-checklist">
    <div class="checklist-summary" :class="isReady ? 'ready' : 'blocked'">
      <strong>{{ isReady ? 'Production-ready' : 'Not production-ready' }}</strong>
      <span class="summary-counts">
        {{ summary.pass }} pass · {{ summary.warn }} warn · {{ summary.fail }} fail
      </span>
    </div>

    <ul class="checklist-rows">
      <li
        v-for="check in checks"
        :key="check.id"
        class="checklist-row"
        :class="`status-${check.status}`"
      >
        <span class="row-icon">{{ icon[check.status] }}</span>
        <span class="row-body">
          <span class="row-label">{{ check.label }}</span>
          <span v-if="check.detail" class="row-detail">{{ check.detail }}</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.production-checklist {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checklist-summary {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  border: 1px solid var(--c-border);
  font-size: 0.85rem;
}

.checklist-summary.ready {
  background: rgba(46, 125, 50, 0.08);
  border-color: rgba(46, 125, 50, 0.4);
}

.checklist-summary.blocked {
  background: rgba(176, 0, 32, 0.08);
  border-color: rgba(176, 0, 32, 0.4);
}

.summary-counts {
  font-family: var(--font-mono, monospace);
  font-size: 0.72rem;
  opacity: 0.85;
}

.checklist-rows {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.checklist-row {
  display: flex;
  gap: 0.55rem;
  align-items: flex-start;
  padding: 0.45rem 0.55rem;
  border: 1px solid var(--c-border);
  border-radius: 5px;
  background: var(--c-bg-soft);
}

.checklist-row.status-fail {
  border-color: rgba(176, 0, 32, 0.4);
}

.checklist-row.status-warn {
  border-color: rgba(230, 145, 0, 0.4);
}

.row-icon {
  line-height: 1.3;
}

.row-body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.row-label {
  font-size: 0.83rem;
  font-weight: 600;
}

.row-detail {
  font-size: 0.74rem;
  opacity: 0.8;
}
</style>
