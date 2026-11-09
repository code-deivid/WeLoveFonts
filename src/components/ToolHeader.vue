<script setup lang="ts">
import AppBackground from './AppBackground.vue'
</script>

<template>
  <section class="head">
    <AppBackground :show-orbs="false" />
    <div class="head-inner container-px">
      <div class="head-content">
        <h1 class="head-title text-balance anim-fade-up delay-100">
          <slot name="title" />
        </h1>
        <p class="head-sub text-pretty anim-fade-up delay-200">
          <slot name="description" />
        </p>
      </div>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.head {
  position: relative;
  padding-top: 140px;
  padding-bottom: 24px;
  overflow: hidden;
}

.head-inner {
  position: relative;
  z-index: 1;
  max-width: 1240px;
  margin: 0 auto;
}

.head-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  margin-bottom: 48px;
}

.head-title {
  font-size: clamp(2rem, 5.5vw, 4rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.05;
  color: var(--ink);
  margin: 0;
  max-width: 800px;
}

/* El <em> llega por slot desde la vista, por eso necesita :deep */
.head-title :deep(em) {
  font-style: italic;
  font-weight: 400;
  color: var(--ink-2);
}

.head-sub {
  margin: 0;
  font-size: 1.0625rem;
  color: var(--ink-muted);
  max-width: 560px;
  line-height: 1.55;
}

@media (max-width: 768px) {
  .head {
    padding-top: 120px;
  }
}
</style>
