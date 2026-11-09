<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'
import { useClipboard } from '@/composables/useClipboard'
import { vReveal } from '@/directives/vReveal'
import { analyzeText, WORDS_PER_MINUTE } from '@/utils/textTools'

/*
 * Límites orientativos por plataforma. Se comparan con el número de caracteres
 * visibles; cada plataforma tiene sus propias reglas (p. ej. X cuenta los enlaces
 * y algunos emojis de forma distinta), así que el indicador es aproximado.
 */
const PLATFORM_LIMITS = [
  { label: 'Twitter / X', maxCharacters: 280 },
  { label: 'SMS', maxCharacters: 160 },
  { label: 'Meta description', maxCharacters: 160 },
]

const { copy } = useClipboard()

const text = ref('')
const inputEl = ref<HTMLTextAreaElement | null>(null)

const metrics = computed(() => analyzeText(text.value))

const limits = computed(() =>
  PLATFORM_LIMITS.map((limit) => {
    const used = metrics.value.characters
    return {
      ...limit,
      used,
      isExceeded: used > limit.maxCharacters,
      fillPercent: Math.min(100, (used / limit.maxCharacters) * 100),
    }
  }),
)

const handleCopy = () => copy(text.value, 'Texto copiado al portapapeles')

const handleClear = () => {
  text.value = ''
  inputEl.value?.focus()
}

// El foco se aplaza hasta que termina la animación de entrada de la página.
let focusTimer: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  focusTimer = setTimeout(() => inputEl.value?.focus(), 600)
})
onBeforeUnmount(() => clearTimeout(focusTimer))
</script>

<template>
  <main class="counter-page">
    <ToolHeader eyebrow="02 · Contador de palabras">
      <template #title>
        Análisis de texto
        <em class="font-display">en tiempo real</em>
      </template>
      <template #description>
        Pega tu contenido para obtener métricas instantáneas sobre palabras, caracteres, párrafos y
        tiempo estimado de lectura.
      </template>
    </ToolHeader>

    <section class="dash container-px">
      <div class="dash-grid">
        <!-- Editor -->
        <div class="editor surface anim-fade-up delay-300">
          <header class="editor-bar">
            <label for="counter-input" class="editor-label">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="4 7 4 4 20 4 20 7" />
                <line x1="9" y1="20" x2="15" y2="20" />
                <line x1="12" y1="4" x2="12" y2="20" />
              </svg>
              Entrada de texto
            </label>
            <div class="editor-actions">
              <button type="button" class="btn-ghost" :disabled="!text" @click="handleClear">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Limpiar
              </button>
              <button type="button" class="btn-ghost" :disabled="!text" @click="handleCopy">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copiar
              </button>
            </div>
          </header>
          <textarea
            id="counter-input"
            ref="inputEl"
            v-model="text"
            class="editor-input"
            placeholder="Escribe o pega tu texto aquí…"
            spellcheck="false"
          />
        </div>

        <!-- Sidebar de métricas -->
        <aside class="metrics anim-fade-up delay-400">
          <div class="metrics-card surface">
            <h3 class="metrics-title">Métricas</h3>

            <div class="metric-pair">
              <div class="metric metric-big">
                <div class="metric-label">Palabras</div>
                <div class="metric-value font-display">{{ metrics.words }}</div>
              </div>
              <div class="metric metric-big">
                <div class="metric-label">Caracteres</div>
                <div class="metric-value font-display">{{ metrics.characters }}</div>
              </div>
            </div>

            <div class="hairline-soft"></div>

            <ul class="metric-list">
              <li>
                <span>Caracteres (sin espacios)</span>
                <span class="num">{{ metrics.charactersNoSpaces }}</span>
              </li>
              <li>
                <span>Oraciones</span>
                <span class="num">{{ metrics.sentences }}</span>
              </li>
              <li>
                <span>Párrafos</span>
                <span class="num">{{ metrics.paragraphs }}</span>
              </li>
            </ul>

            <div class="hairline-soft"></div>

            <div class="reading">
              <div class="reading-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div class="reading-text">
                <div class="reading-label">Tiempo estimado de lectura</div>
                <div class="reading-value">
                  <span class="num font-display">{{ metrics.readingMinutes }}</span> min
                </div>
              </div>
            </div>
          </div>

          <!-- Limits card -->
          <div class="limits-card surface">
            <h3 class="metrics-title">Límites</h3>
            <ul class="limits-list">
              <li v-for="limit in limits" :key="limit.label">
                <div class="limits-row">
                  <span class="limits-label">{{ limit.label }}</span>
                  <span class="limits-num" :class="{ over: limit.isExceeded }">
                    {{ limit.used }} <span class="muted">/ {{ limit.maxCharacters }}</span>
                  </span>
                </div>
                <div class="bar" aria-hidden="true">
                  <div
                    class="bar-fill"
                    :class="{ over: limit.isExceeded }"
                    :style="{ width: limit.fillPercent + '%' }"
                  ></div>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>

    <!-- Sección informativa -->
    <section v-reveal class="info container-px">
      <div class="info-inner">
        <div class="info-col">
          <h2 class="info-title">¿Por qué usar un contador de palabras?</h2>
          <p>
            Ya sea que estés redactando un ensayo académico, optimizando una meta descripción para
            SEO o ajustando un post para que entre en Twitter, la precisión cuenta. Esta herramienta
            calcula tus métricas mientras escribes, sin recargas ni esperas.
          </p>
          <p>
            El cálculo de tiempo de lectura usa una velocidad media de
            {{ WORDS_PER_MINUTE }} palabras por minuto, ideal para bloggers y estrategas de
            contenido que buscan optimizar la atención de su audiencia.
          </p>
        </div>
        <div class="info-col">
          <h2 class="info-title">Datos privados, siempre</h2>
          <p>
            Todo el análisis ocurre directamente en tu navegador. Tu texto nunca se envía a un
            servidor, no se guarda en ninguna base de datos y no se comparte con terceros.
          </p>
          <p>
            Es la diferencia entre una herramienta hecha con respeto y una hecha para extraerte
            datos. Aquí, tú escribes y nosotros nos apartamos del camino.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.counter-page {
  position: relative;
}

.dash {
  max-width: 1240px;
  margin: 0 auto;
  padding-block: 32px 60px;
}

.dash-grid {
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 18px;
  align-items: stretch;
}

/* Editor */
.editor {
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  min-height: 560px;
}
.editor-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px 12px 18px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-subtle);
}
.editor-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink-faint);
}
.editor-actions {
  display: inline-flex;
  gap: 4px;
}

.editor-input {
  flex: 1;
  width: 100%;
  padding: 26px 28px;
  background: transparent;
  border: none;
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--ink);
  resize: none;
  outline: none;
  letter-spacing: -0.005em;
  min-height: 480px;
}
.editor-input::placeholder {
  color: var(--ink-faint);
}

/* Sidebar */
.metrics {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.metrics-card,
.limits-card {
  padding: 24px 26px;
  border-radius: 20px;
}

.metrics-title {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ink-faint);
  margin: 0 0 22px;
}

.metric-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.metric-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink-faint);
  font-weight: 500;
}
.metric-value {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-style: italic;
  line-height: 0.95;
  color: var(--ink);
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
  transition: color 0.3s var(--ease-smooth);
}

.hairline-soft {
  height: 1px;
  background: var(--border);
  margin: 22px 0;
}

.metric-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.metric-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--ink-soft);
}
.num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.9375rem;
  color: var(--ink);
  font-weight: 500;
}

/* Reading time */
.reading {
  display: flex;
  align-items: center;
  gap: 14px;
}
.reading-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: var(--bg-subtle);
  color: var(--ink-soft);
  border: 1px solid var(--border);
}
.reading-text {
  display: flex;
  flex-direction: column;
}
.reading-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink-faint);
  font-weight: 500;
}
.reading-value {
  font-size: 1rem;
  color: var(--ink);
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}
.reading-value .num {
  font-size: 1.875rem;
  font-style: italic;
  line-height: 1;
  letter-spacing: -0.03em;
}

/* Limits */
.limits-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.limits-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  margin-bottom: 8px;
}
.limits-label {
  color: var(--ink-soft);
}
.limits-num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: 0.8125rem;
  color: var(--ink);
  font-weight: 500;
}
.limits-num .muted {
  color: var(--ink-faint);
  font-weight: 400;
}
.limits-num.over {
  color: #b91c1c;
}
[data-theme='dark'] .limits-num.over {
  color: #f87171;
}

.bar {
  width: 100%;
  height: 4px;
  background: var(--bg-subtle);
  border-radius: 999px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: var(--ink);
  border-radius: 999px;
  transition:
    width 0.5s var(--ease-out-expo),
    background 0.3s var(--ease-smooth);
}
.bar-fill.over {
  background: #dc2626;
}
[data-theme='dark'] .bar-fill.over {
  background: #ef4444;
}

/* Info section */
.info {
  max-width: 1240px;
  margin: 0 auto;
  padding-block: clamp(60px, 10vw, 120px);
}
.info-inner {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(32px, 6vw, 80px);
}
.info-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.info-title {
  font-size: clamp(1.375rem, 2.5vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  margin: 0 0 4px;
  color: var(--ink);
}
.info-col p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.65;
  color: var(--ink-muted);
  letter-spacing: -0.005em;
}

@media (max-width: 960px) {
  .dash-grid {
    grid-template-columns: 1fr;
  }
  .editor {
    min-height: 360px;
  }
  .editor-input {
    min-height: 280px;
  }
}

@media (max-width: 768px) {
  .info-inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style>
