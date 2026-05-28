<template>
  <div class="site-shell">
    <SiteHeader />
    <main class="site-main">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.site-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.site-main {
  flex-grow: 1;
  /* Push content down to avoid clipping under fixed header */
  margin-top: var(--header-height);
}
</style>
