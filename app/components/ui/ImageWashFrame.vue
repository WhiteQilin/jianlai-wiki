<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  aspect?: '1:1' | '4:5' | '3:4' | '16:9' | '16:5' | '2:3' | '3:2'
  wash?: 'none' | 'mist' | 'cloth' | 'ink'
  washOpacity?: number
  frame?: boolean
  scale?: 'cover' | 'contain'
  objectPosition?: string
}>(), {
  aspect: '4:5',
  wash: 'mist',
  washOpacity: 0.08,
  frame: true,
  scale: 'cover',
  objectPosition: 'center',
})
</script>

<template>
  <figure class="image-wash-frame" :class="`aspect-${aspect.replace(':', '-by-')}`">
    <div class="image-wash-frame__inner">
      <img
        :src="src"
        :alt="alt"
        class="image-wash-frame__img"
        :style="{
          objectFit: scale,
          objectPosition,
        }"
        loading="lazy"
      />

      <span
        v-if="wash !== 'none'"
        class="image-wash-frame__wash"
        :class="`wash-${wash}`"
        :style="{ opacity: washOpacity }"
        aria-hidden="true"
      ></span>

      <span v-if="frame" class="image-wash-frame__frame" aria-hidden="true">
        <span class="image-wash-frame__frame-edge image-wash-frame__frame-edge--tl"></span>
        <span class="image-wash-frame__frame-edge image-wash-frame__frame-edge--tr"></span>
        <span class="image-wash-frame__frame-edge image-wash-frame__frame-edge--bl"></span>
        <span class="image-wash-frame__frame-edge image-wash-frame__frame-edge--br"></span>
      </span>
    </div>

    <figcaption v-if="$slots.caption" class="image-wash-frame__caption">
      <slot name="caption" />
    </figcaption>
  </figure>
</template>

<style scoped>
.image-wash-frame {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
}

.image-wash-frame__inner {
  position: relative;
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--jl-section-frame);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--jl-section-mist) 28%, transparent), transparent),
    var(--jl-section-paper);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--c-paper-alt) 58%, transparent);
}

/* Aspect ratios */
.aspect-1-by-1 .image-wash-frame__inner { aspect-ratio: 1 / 1; }
.aspect-4-by-5 .image-wash-frame__inner { aspect-ratio: 4 / 5; }
.aspect-3-by-4 .image-wash-frame__inner { aspect-ratio: 3 / 4; }
.aspect-16-by-9 .image-wash-frame__inner { aspect-ratio: 16 / 9; }
.aspect-16-by-5 .image-wash-frame__inner { aspect-ratio: 16 / 5; }
.aspect-2-by-3 .image-wash-frame__inner { aspect-ratio: 2 / 3; }
.aspect-3-by-2 .image-wash-frame__inner { aspect-ratio: 3 / 2; }

.image-wash-frame__img {
  display: block;
  width: 100%;
  height: 100%;
}

.image-wash-frame__wash {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: multiply;
}

.wash-mist {
  background: linear-gradient(180deg, color-mix(in srgb, var(--jl-section-mist) 78%, transparent) 0%, transparent 60%);
}

.wash-cloth {
  background: linear-gradient(160deg, color-mix(in srgb, var(--jl-aged-paper) 70%, transparent) 0%, transparent 72%);
}

.wash-ink {
  background: linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--jl-lacquer) 60%, transparent) 100%);
}

/* Frame — corner ticks */
.image-wash-frame__frame {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.image-wash-frame__frame-edge {
  position: absolute;
  width: 0.7rem;
  height: 0.7rem;
  border-color: var(--jl-antique-gold);
  border-style: solid;
  border-width: 0;
}

.image-wash-frame__frame-edge--tl {
  top: 0.4rem;
  left: 0.4rem;
  border-top-width: 1.5px;
  border-left-width: 1.5px;
}
.image-wash-frame__frame-edge--tr {
  top: 0.4rem;
  right: 0.4rem;
  border-top-width: 1.5px;
  border-right-width: 1.5px;
}
.image-wash-frame__frame-edge--bl {
  bottom: 0.4rem;
  left: 0.4rem;
  border-bottom-width: 1.5px;
  border-left-width: 1.5px;
}
.image-wash-frame__frame-edge--br {
  bottom: 0.4rem;
  right: 0.4rem;
  border-bottom-width: 1.5px;
  border-right-width: 1.5px;
}

/* Caption */
.image-wash-frame__caption {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  line-height: 1.4;
  letter-spacing: 0.04em;
  color: var(--c-text-3);
  text-align: center;
  text-transform: uppercase;
}
</style>
