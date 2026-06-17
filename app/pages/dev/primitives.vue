<script setup lang="ts">
if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

useSeoMeta({
  title: 'Primitive Preview | Jian Lai Wiki',
})
</script>

<template>
  <main class="primitive-preview-page">
    <UiJianLaiPrimitivePreview />
  </main>
</template>

<style scoped>
.primitive-preview-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: clamp(1rem, 4vw, 3rem);
  background:
    radial-gradient(circle at 18% 16%, color-mix(in srgb, var(--c-seal-red) 5%, transparent), transparent 26rem),
    linear-gradient(180deg, var(--c-paper), var(--c-bg-soft));
}
</style>
