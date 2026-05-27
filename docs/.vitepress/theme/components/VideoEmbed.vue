<script setup lang="ts">
defineProps<{
  src: string
  title?: string
  caption?: string
}>()
</script>

<template>
  <figure class="video-embed">
    <div class="video-wrapper">
      <!-- Using standard video element for local assets -->
      <video controls preload="metadata" :title="title">
        <source :src="src" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
    <figcaption v-if="caption" class="video-caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.video-embed {
  margin: 2.5rem 0;
  width: 100%;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
}

.video-wrapper video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-caption {
  margin-top: 1rem;
  font-family: var(--jl-font-heading);
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  text-align: center;
  line-height: 1.6;
}
</style>
