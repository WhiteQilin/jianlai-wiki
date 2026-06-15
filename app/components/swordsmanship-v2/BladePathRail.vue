<template>
  <nav class="blade-path-rail" aria-label="Sword manual page ritual">
    <a class="rail-node rail-node--active" href="#featured-slip">
      <span class="rail-node__glyph">一</span>
      <span class="rail-node__copy">
        <span>Slip</span>
        <strong>Caged Sparrow</strong>
      </span>
    </a>

    <a class="rail-node" href="#marginal-notes">
      <span class="rail-node__glyph">注</span>
      <span class="rail-node__copy">
        <span>Margin</span>
        <strong>Commentary</strong>
      </span>
    </a>

    <a class="rail-node" href="#recorded-arts">
      <span class="rail-node__glyph">录</span>
      <span class="rail-node__copy">
        <span>Register</span>
        <strong>Recorded Arts</strong>
      </span>
    </a>

    <a class="rail-node" href="#related-exits">
      <span class="rail-node__glyph">引</span>
      <span class="rail-node__copy">
        <span>Exits</span>
        <strong>Related Archives</strong>
      </span>
    </a>
  </nav>
</template>

<style scoped>
.blade-path-rail {
  position: sticky;
  top: calc(var(--header-height, 4rem) + 1rem);
  min-height: min(34rem, calc(100dvh - var(--header-height, 4rem) - 2rem));
  padding: 0.75rem 0 0.75rem 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  isolation: isolate;
}

.blade-path-rail::before,
.blade-path-rail::after {
  content: '';
  position: absolute;
  left: 1.75rem;
  top: 0;
  bottom: 0;
  width: 2px;
  pointer-events: none;
}

.blade-path-rail::before {
  background: linear-gradient(to bottom, transparent, rgba(31, 58, 70, 0.35), rgba(167, 55, 47, 0.55), rgba(31, 58, 70, 0.35), transparent);
}

.blade-path-rail::after {
  background: linear-gradient(to bottom, rgba(231, 245, 244, 0), rgba(231, 245, 244, 0.95), rgba(231, 245, 244, 0));
  transform-origin: top center;
  animation: railDraw 2.2s cubic-bezier(0.22, 0.8, 0.2, 1) both;
}

.rail-node {
  position: relative;
  z-index: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: 1.1rem minmax(0, 1fr);
  gap: 0.85rem;
  align-items: center;
  color: rgba(23, 45, 56, 0.72);
  text-decoration: none;
}

.rail-node::before {
  content: '';
  position: absolute;
  left: 0.18rem;
  top: 50%;
  width: 2.35rem;
  height: 2.35rem;
  border: 1.5px solid rgba(34, 64, 76, 0.25);
  background: rgba(226, 237, 235, 0.72);
  box-shadow: inset 0 0 0 4px rgba(17, 44, 57, 0.04), 0 6px 18px rgba(8, 25, 34, 0.1);
  transform: translateY(-50%) rotate(45deg);
  transition: border-color 0.24s ease, background-color 0.24s ease, transform 0.24s ease, box-shadow 0.24s ease;
}

.rail-node__glyph {
  position: relative;
  z-index: 2;
  width: 2.6rem;
  color: rgba(16, 39, 53, 0.82);
  font-family: var(--font-zh-display);
  font-size: 1.08rem;
  line-height: 1;
  text-align: center;
}

.rail-node__copy {
  min-width: 0;
  display: grid;
  gap: 0.16rem;
  padding: 0.65rem 0.75rem;
  background: linear-gradient(90deg, rgba(225, 237, 235, 0.74), rgba(225, 237, 235, 0));
  opacity: 1;
}

.rail-node__copy span {
  color: rgba(139, 50, 43, 0.72);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.15em;
  line-height: 1;
  text-transform: uppercase;
}

.rail-node__copy strong {
  overflow: hidden;
  color: rgba(16, 39, 53, 0.86);
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.15;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rail-node:hover::before,
.rail-node:focus-visible::before,
.rail-node--active::before {
  border-color: rgba(171, 55, 47, 0.62);
  background: rgba(241, 244, 238, 0.88);
  transform: translateY(-50%) rotate(45deg) scale(1.08);
}

.rail-node--active::before {
  border-color: rgba(171, 55, 47, 0.7);
  background: rgba(246, 240, 232, 0.92);
  box-shadow:
    inset 0 0 0 4px rgba(171, 55, 47, 0.08),
    0 0 18px rgba(171, 55, 47, 0.18),
    0 6px 18px rgba(8, 25, 34, 0.12);
}

.rail-node--active .rail-node__glyph {
  color: rgba(171, 55, 47, 0.9);
}

.rail-node:hover .rail-node__copy,
.rail-node:focus-visible .rail-node__copy,
.rail-node--active .rail-node__copy {
  opacity: 1;
}

.rail-node:focus-visible {
  outline: 2px solid rgba(171, 55, 47, 0.74);
  outline-offset: 0.38rem;
}

@keyframes railDraw {
  from {
    transform: scaleY(0);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}

@media (max-width: 900px) {
  .blade-path-rail {
    top: calc(var(--header-height, 4rem) + 0.5rem);
    padding-left: 0;
  }

  .blade-path-rail::before,
  .blade-path-rail::after {
    left: 0.74rem;
  }

  .rail-node {
    grid-template-columns: 1.5rem;
  }

  .rail-node::before {
    left: -0.26rem;
  }

  .rail-node__glyph {
    width: 1.5rem;
  }

  .rail-node__copy {
    position: absolute;
    left: 2rem;
    width: min(10rem, 60vw);
    border: 1px solid rgba(31, 58, 70, 0.1);
    opacity: 0;
    pointer-events: none;
    transform: translateX(-0.35rem);
    transition: opacity 0.22s ease, transform 0.22s ease;
  }

  .rail-node:hover .rail-node__copy,
  .rail-node:focus-visible .rail-node__copy {
    opacity: 1;
    transform: translateX(0);
  }

  .rail-node--active .rail-node__copy {
    opacity: 0;
  }
}

@media (max-width: 560px) {
  .blade-path-rail {
    min-height: min(27rem, calc(100dvh - var(--header-height, 4rem) - 1rem));
  }
}

@media (prefers-reduced-motion: reduce) {
  .blade-path-rail::after {
    animation: none;
  }

  .rail-node::before,
  .rail-node__copy {
    transition: none;
  }
}
</style>
