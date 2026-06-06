<script setup lang="ts">
// Ambient motion layer for the Timeline cinematic hero
// Provides drifting ink mist and subtle gold particles
// Built entirely with CSS/SVG to remain lightweight and respect reduced-motion
</script>

<template>
  <div class="ambient-layer" aria-hidden="true">
    <!-- Gold Particles -->
    <svg class="particles-container" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <!-- We use a few circles animated via CSS for lightweight particles -->
      <circle cx="20" cy="80" r="0.5" class="particle p-1" />
      <circle cx="70" cy="60" r="0.8" class="particle p-2" />
      <circle cx="40" cy="30" r="0.4" class="particle p-3" />
      <circle cx="85" cy="90" r="0.6" class="particle p-4" />
      <circle cx="15" cy="20" r="0.7" class="particle p-5" />
      <circle cx="60" cy="15" r="0.5" class="particle p-6" />
      <circle cx="90" cy="40" r="0.3" class="particle p-7" />
    </svg>
    
    <!-- Faint brushline accents -->
    <div class="brush-accent brush-top"></div>
    <div class="brush-accent brush-bottom"></div>
  </div>
</template>

<style scoped>
.ambient-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
  /* Darken the overall layer slightly to ensure text legibility */
  background: radial-gradient(circle at center, transparent 0%, rgba(5, 5, 5, 0.6) 100%);
}

/* Gold Particles */
.particles-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

.particle {
  fill: #d4af37; /* Gold */
  opacity: 0;
  transform-origin: center;
}

/* Individual particle animations with different timings and paths */
.p-1 { animation: float-up 12s linear infinite, twinkle 4s ease-in-out infinite; animation-delay: 0s; }
.p-2 { animation: float-up 18s linear infinite, twinkle 5s ease-in-out infinite; animation-delay: -3s; }
.p-3 { animation: float-up 15s linear infinite, twinkle 3.5s ease-in-out infinite; animation-delay: -7s; }
.p-4 { animation: float-up 20s linear infinite, twinkle 6s ease-in-out infinite; animation-delay: -2s; }
.p-5 { animation: float-up 14s linear infinite, twinkle 4.5s ease-in-out infinite; animation-delay: -10s; }
.p-6 { animation: float-up 16s linear infinite, twinkle 5.5s ease-in-out infinite; animation-delay: -5s; }
.p-7 { animation: float-up 19s linear infinite, twinkle 4s ease-in-out infinite; animation-delay: -1s; }

@keyframes float-up {
  0% { transform: translateY(10px) translateX(0); }
  50% { transform: translateY(-30px) translateX(5px); }
  100% { transform: translateY(-70px) translateX(-5px); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.8; filter: drop-shadow(0 0 2px rgba(212, 175, 55, 0.8)); }
}

/* Brushline accents */
.brush-accent {
  position: absolute;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  width: 60%;
  left: 20%;
  opacity: 0.3;
}

.brush-top {
  top: 30%;
  animation: breathe 8s ease-in-out infinite;
}

.brush-bottom {
  bottom: 30%;
  animation: breathe 10s ease-in-out infinite alternate-reverse;
  width: 40%;
  left: 30%;
}

@keyframes breathe {
  0%, 100% { opacity: 0.1; transform: scaleX(0.9); }
  50% { opacity: 0.4; transform: scaleX(1.1); }
}

/* Reduced Motion Override */
@media (prefers-reduced-motion: reduce) {
  .brush-accent, .particle {
    animation: none !important;
    transform: none !important;
  }
  .particle { opacity: 0.3; }
  .brush-accent { opacity: 0.2; }
}
</style>
