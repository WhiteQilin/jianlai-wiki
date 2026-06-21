<script setup lang="ts">
type RankingPreviewEntry = {
  rank?: string | number
  name: string
}

type RankingLedgerRecord = {
  path: string
  title: string
  chinese?: string
  category: string
  listType: string
  entryCount: number
  verificationStatus: string
  lastUpdated?: string
  description: string
  previewEntries: RankingPreviewEntry[]
}

const props = defineProps<{
  records: RankingLedgerRecord[]
}>()

const segmented = computed(() => {
  const records = props.records
  if (!records.length) return []
  const groups: { category: string; items: RankingLedgerRecord[] }[] = []
  for (const record of records) {
    const last = groups[groups.length - 1]
    if (last && last.category === record.category) {
      last.items.push(record)
    } else {
      groups.push({ category: record.category, items: [record] })
    }
  }
  return groups
})
</script>

<template>
  <section v-if="records.length" class="ranking-ledger" aria-label="Ranking ledger records">
    <template v-for="(group, gi) in segmented" :key="group.category">
      <UiSectionDivider
        v-if="gi > 0"
        motif="ledger"
        class="ranking-ledger-divider"
      />
      <RankingsRankingLedgerRow
        v-for="record in group.items"
        :key="record.path"
        :record="record"
      />
    </template>
  </section>
</template>

<style scoped>
.ranking-ledger {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(0.9rem, 2vw, 1.25rem);
}

.ranking-ledger-divider {
  margin: clamp(0.6rem, 1.6vw, 1rem) 0 clamp(0.2rem, 0.6vw, 0.4rem);
  width: 100%;
}
</style>
