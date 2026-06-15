<script setup lang="ts">
type RelatedLink = {
  titleEn: string
  titleZh: string
  link: string
  bgChar: string
}

defineProps<{
  links: RelatedLink[]
}>()

const labels: Record<string, string> = {
  '/characters': 'Owner dossiers',
  '/cultivation': 'Realm method',
  '/artifacts': 'Paired objects',
}
</script>

<template>
  <section class="related-exits" aria-labelledby="related-exits-title">
    <header class="related-header">
      <p>Leaving the manual</p>
      <h2 id="related-exits-title">Related Archives</h2>
    </header>

    <div class="exit-cards">
      <NuxtLink
        v-for="(item, index) in links"
        :key="item.link"
        :to="item.link"
        class="exit-card"
        :class="`exit-card--${index + 1}`"
      >
        <span class="exit-card__art" aria-hidden="true">
          <span class="exit-card__char">{{ item.bgChar }}</span>
          <span class="exit-card__slash"></span>
        </span>

        <span class="exit-card__copy">
          <span class="exit-card__label">{{ labels[item.link] || 'Archive path' }}</span>
          <strong>{{ item.titleEn }}</strong>
          <small>{{ item.titleZh }}</small>
        </span>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.related-exits {
  position: relative;
}

.related-header {
  width: min(42rem, 100%);
  margin-bottom: clamp(1.5rem, 3vw, 2.4rem);
}

.related-header p {
  margin: 0 0 0.55rem;
  color: rgba(145, 49, 43, 0.78);
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.16em;
  line-height: 1.4;
  text-transform: uppercase;
}

.related-header h2 {
  margin: 0;
  color: #0b2735;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4.4vw, 4.6rem);
  font-weight: 400;
  letter-spacing: -0.07em;
  line-height: 0.95;
  text-wrap: balance;
}

.related-header::after {
  content: '';
  display: block;
  width: min(8rem, 40%);
  height: 2px;
  margin-top: 1.2rem;
  background: linear-gradient(90deg,
    rgba(145, 49, 43, 0.5),
    rgba(145, 49, 43, 0.15),
    transparent
  );
}

.exit-cards {
  display: grid;
  grid-template-columns: 1.1fr 1fr 1.05fr;
  gap: clamp(0.9rem, 2vw, 1.25rem);
  align-items: stretch;
}

.exit-card {
  position: relative;
  min-height: clamp(18rem, 28vw, 24rem);
  display: grid;
  align-content: end;
  overflow: hidden;
  border: 1px solid rgba(31, 61, 74, 0.18);
  color: #f1fbfa;
  text-decoration: none;
  background: #071722;
  box-shadow: 0 28px 64px rgba(3, 18, 26, 0.18);
  isolation: isolate;
  transition: transform 0.32s ease, border-color 0.32s ease, box-shadow 0.32s ease;
}

.exit-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border: 1px solid rgba(224, 240, 238, 0.1);
  border-top: 2px solid rgba(145, 49, 43, 0.25);
  pointer-events: none;
}

.exit-card--2 {
  margin-top: clamp(2rem, 6vw, 4.4rem);
}

.exit-card--3 {
  margin-top: clamp(0.8rem, 3vw, 2rem);
}

.exit-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(to top, rgba(4, 15, 22, 0.95), rgba(4, 15, 22, 0.35) 54%, rgba(210, 229, 227, 0.12)),
    radial-gradient(circle at 30% 24%, rgba(154, 196, 198, 0.22), transparent 13rem);
  pointer-events: none;
}

.exit-card:hover,
.exit-card:focus-visible {
  border-color: rgba(145, 49, 43, 0.48);
  box-shadow: 0 34px 78px rgba(3, 18, 26, 0.24);
  outline: none;
  transform: translateY(-4px);
}

.exit-card:focus-visible {
  outline: 2px solid rgba(145, 49, 43, 0.72);
  outline-offset: 0.24rem;
}

.exit-card__art {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    radial-gradient(circle at 30% 24%,
      rgba(154, 196, 198, 0.18), transparent 16rem
    ),
    radial-gradient(ellipse at 70% 80%,
      rgba(30, 60, 72, 0.5), transparent 20rem
    ),
    linear-gradient(135deg,
      rgba(6, 20, 30, 0.98),
      rgba(28, 58, 70, 0.72) 48%,
      rgba(219, 234, 231, 0.35)
    );
}

.exit-card--2 .exit-card__art {
  background:
    radial-gradient(circle at 60% 30%,
      rgba(142, 180, 170, 0.15), transparent 18rem
    ),
    radial-gradient(ellipse at 20% 70%,
      rgba(21, 57, 55, 0.45), transparent 22rem
    ),
    linear-gradient(140deg,
      rgba(5, 19, 28, 0.98),
      rgba(21, 57, 55, 0.66) 48%,
      rgba(219, 234, 231, 0.28)
    );
}

.exit-card--3 .exit-card__art {
  background:
    radial-gradient(circle at 40% 60%,
      rgba(154, 196, 198, 0.12), transparent 14rem
    ),
    radial-gradient(ellipse at 80% 20%,
      rgba(49, 67, 75, 0.4), transparent 18rem
    ),
    linear-gradient(145deg,
      rgba(7, 18, 28, 0.98),
      rgba(49, 67, 75, 0.72) 48%,
      rgba(219, 234, 231, 0.32)
    );
}

.exit-card__char {
  position: absolute;
  right: -0.3rem;
  top: 5%;
  color: rgba(235, 247, 247, 0.18);
  font-family: var(--font-zh-display);
  font-size: clamp(9rem, 21vw, 15rem);
  line-height: 0.8;
  text-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
}

.exit-card__slash {
  position: absolute;
  left: -18%;
  top: 43%;
  width: 136%;
  height: 4.2rem;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(236, 253, 253, 0.42) 25%,
    rgba(224, 243, 243, 0.55) 48%,
    rgba(145, 49, 43, 0.12) 58%,
    rgba(236, 253, 253, 0.18) 72%,
    transparent 100%
  );
  opacity: 0.66;
  transform: rotate(-18deg);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.exit-card:hover .exit-card__slash,
.exit-card:focus-visible .exit-card__slash {
  opacity: 0.9;
  transform: rotate(-18deg) translateX(0.45rem);
}

.exit-card__copy {
  padding: clamp(1.15rem, 2.5vw, 1.8rem);
  display: grid;
  gap: 0.24rem;
}

.exit-card__label {
  color: rgba(215, 232, 232, 0.78);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.15em;
  line-height: 1.4;
  text-transform: uppercase;
}

.exit-card__copy strong {
  color: #f4ffff;
  font-family: var(--font-heading);
  font-size: clamp(1.7rem, 3.4vw, 3.25rem);
  font-weight: 400;
  letter-spacing: -0.06em;
  line-height: 0.95;
  text-wrap: balance;
  overflow-wrap: break-word;
}

.exit-card__copy small {
  color: rgba(215, 232, 232, 0.74);
  font-family: var(--font-zh-display);
  font-size: 1.08rem;
  line-height: 1.1;
}

@media (max-width: 920px) {
  .exit-cards {
    grid-template-columns: 1fr;
  }

  .exit-card,
  .exit-card--2,
  .exit-card--3 {
    min-height: 16rem;
    margin-top: 0;
  }
}

@media (max-width: 560px) {
  .exit-card {
    min-height: 14rem;
  }

  .exit-card__copy strong {
    font-size: clamp(1.5rem, 6vw, 2.2rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .exit-card,
  .exit-card__slash {
    transition: none;
  }

  .exit-card:hover,
  .exit-card:focus-visible,
  .exit-card:hover .exit-card__slash,
  .exit-card:focus-visible .exit-card__slash {
    transform: none;
  }
}
</style>
