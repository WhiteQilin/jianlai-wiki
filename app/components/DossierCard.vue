<script setup lang="ts">
import { resolvePublicImage } from '~/utils/publicMedia'

const props = defineProps<{
  link: string
  nameEn: string
  nameZh: string
  desc: string
  category: string
  status: string
  image?: string
}>()

const resolvedImage = computed(() => resolvePublicImage(props.image))
</script>

<template>
  <UiPaperSlipCard :to="link" accent seal-corner lift class="dossier-card">
    <div v-if="resolvedImage" class="dossier-card__art-wrap">
      <UiImageWashFrame
        :src="resolvedImage"
        :alt="nameEn"
        aspect="4:5"
        wash="cloth"
        :wash-opacity="0.2"
        :frame="false"
        class="dossier-card__art"
      />
    </div>
    <div v-else class="dossier-card__placeholder" aria-hidden="true">
      <span class="dossier-card__placeholder-char">{{ nameZh.charAt(0) || '无' }}</span>
    </div>

    <div class="dossier-card__body">
      <div class="dossier-card__meta">
        <UiCinnabarTag tone="section" size="sm">{{ category }}</UiCinnabarTag>
        <UiCinnabarTag tone="cinnabar" size="sm">{{ status }}</UiCinnabarTag>
      </div>
      <h4 class="dossier-card__name">
        <span class="dossier-card__name-en">{{ nameEn }}</span>
        <span v-if="nameZh" class="dossier-card__name-zh">{{ nameZh }}</span>
      </h4>
      <p class="dossier-card__desc">{{ desc }}</p>
    </div>
  </UiPaperSlipCard>
</template>

<style scoped>
.dossier-card {
  padding: 0;
  overflow: hidden;
}

.dossier-card :deep(.paper-slip-card__seal),
.dossier-card :deep(.has-seal::after) {
  z-index: 2;
}

.dossier-card__art-wrap {
  width: 100%;
  border-bottom: 1px solid var(--c-divider);
  position: relative;
  z-index: 1;
}

.dossier-card__art {
  margin: 0;
  display: block;
}

.dossier-card__art :deep(.image-wash-frame__inner) {
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.dossier-card__art :deep(.image-wash-frame__img) {
  transition: transform 600ms cubic-bezier(0.32, 0.72, 0, 1);
}

.dossier-card:hover :deep(.image-wash-frame__img) {
  transform: scale(1.04);
}

.dossier-card__placeholder {
  width: 100%;
  aspect-ratio: 4 / 5;
  display: grid;
  place-items: center;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--jl-section-mist) 28%, transparent), transparent),
    var(--jl-section-paper);
  border-bottom: 1px solid var(--c-divider);
  position: relative;
  overflow: hidden;
}

.dossier-card__placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/images/textures/ink-wash-02.webp');
  background-size: cover;
  background-blend-mode: multiply;
  opacity: 0.18;
  pointer-events: none;
}

.dossier-card__placeholder-char {
  font-family: var(--font-zh-display);
  font-size: clamp(4rem, 9vw, 5.4rem);
  color: color-mix(in srgb, var(--jl-section-accent) 42%, var(--jl-section-frame));
  z-index: 1;
  line-height: 1;
  letter-spacing: 0;
}

.dossier-card__body {
  padding: 1.2rem 1.3rem 1.35rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.7rem;
  position: relative;
  z-index: 1;
}

.dossier-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.45rem;
  align-items: center;
  margin-bottom: 0.15rem;
}

.dossier-card__name {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--c-ink);
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
  line-height: 1.18;
  transition: color 240ms cubic-bezier(0.32, 0.72, 0, 1);
}

.dossier-card:hover .dossier-card__name {
  color: var(--jl-section-seal);
}

.dossier-card__name-en {
  display: block;
}

.dossier-card__name-zh {
  font-family: var(--font-zh-display);
  font-size: 1.05rem;
  font-weight: 400;
  color: var(--c-text-3);
  letter-spacing: 0.06em;
  line-height: 1.1;
}

.dossier-card__desc {
  font-size: 0.92rem;
  color: var(--c-text-2);
  margin: 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 640px) {
  .dossier-card__name {
    font-size: 1.3rem;
  }

  .dossier-card__body {
    padding: 1rem 1.1rem 1.15rem;
  }

  .dossier-card__desc {
    font-size: 0.88rem;
    -webkit-line-clamp: 4;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dossier-card__name,
  .dossier-card__art :deep(.image-wash-frame__img) {
    transition: none;
  }

  .dossier-card:hover :deep(.image-wash-frame__img) {
    transform: none;
  }
}
</style>