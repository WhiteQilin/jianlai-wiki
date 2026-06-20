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

defineProps<{
  records: RankingLedgerRecord[]
}>()
</script>

<template>
  <section class="ranking-ledger" aria-label="Ranking ledger records">
    <RankingsRankingLedgerRow
      v-for="record in records"
      :key="record.path"
      :record="record"
    />
  </section>
</template>

<style scoped>
.ranking-ledger {
  display: grid;
  gap: clamp(0.9rem, 2vw, 1.25rem);
}
</style>
