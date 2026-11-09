<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppBackground from '@/components/AppBackground.vue'
</script>

<template>
  <main class="nf">
    <AppBackground />
    <div class="nf-inner container-px">
      <span class="chip anim-fade-up">
        <span class="chip-dot"></span>
        Error 404
      </span>
      <h1 class="nf-title text-balance anim-fade-up delay-100">
        Esta página no <em class="font-display">existe</em>... todavía.
      </h1>
      <p class="nf-sub text-pretty anim-fade-up delay-200">
        El enlace que has seguido nos ha llevado a un callejón sin salida tipográfico. Volvamos al
        inicio.
      </p>
      <div class="nf-actions anim-fade-up delay-300">
        <RouterLink to="/" class="btn-primary">
          Ir al inicio
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </RouterLink>
        <RouterLink to="/fonts" class="btn-secondary">Probar herramientas</RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.nf {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 140px 20px 60px;
  overflow: hidden;
}

.nf-inner {
  position: relative;
  z-index: 1;
  max-width: 720px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
}

.nf-title {
  font-size: clamp(2rem, 6vw, 4.5rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.05;
  color: var(--ink);
  margin: 0;
}
.nf-title em {
  font-style: italic;
  font-weight: 400;
  color: var(--ink-2);
}
.nf-sub {
  margin: 0;
  font-size: 1.0625rem;
  color: var(--ink-muted);
  max-width: 480px;
  line-height: 1.55;
}
.nf-actions {
  margin-top: 12px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
