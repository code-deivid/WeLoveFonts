<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'
import { useClipboard } from '@/composables/useClipboard'
import { DRAFT_TEXT_MAX_LENGTH, useDraftText } from '@/composables/useDraftText'
import { useFavorites } from '@/composables/useFavorites'
import { vReveal } from '@/directives/vReveal'
import { toUnicodeFont, unicodeFontNames } from '@/utils/unicodeFonts'

const MAX_INPUT_LENGTH = DRAFT_TEXT_MAX_LENGTH
const PLACEHOLDER_TEXT = 'Esto es un texto de ejemplo WeLoveFonts'

interface FontCategory {
  id: string
  label: string
  /** Estilos incluidos. Sin valor, la categoría muestra todos. */
  fontNames?: string[]
}

const categories: FontCategory[] = [
  { id: 'all', label: 'Todos' },
  { id: 'bold', label: 'Bold', fontNames: ['Bold', 'Bold Italic', 'Bold Fraktur'] },
  { id: 'italic', label: 'Cursiva', fontNames: ['Italic', 'Bold Italic'] },
  {
    id: 'decorative',
    label: 'Decorativos',
    fontNames: ['Bubble', 'Fraktur', 'Bold Fraktur', 'Double Struck'],
  },
  { id: 'utility', label: 'Utilidad', fontNames: ['Monospace', 'Small Caps'] },
]

const { copy } = useClipboard()
const { isFavorite, toggleFavorite } = useFavorites()

// Compartido con la Home: el texto escrito allí aparece aquí al navegar.
const { draftText: inputText } = useDraftText()
const activeCategoryId = ref('all')
const inputEl = ref<HTMLTextAreaElement | null>(null)

const visibleFontNames = computed(() => {
  const category = categories.find((item) => item.id === activeCategoryId.value)
  const fontNames = category?.fontNames
  const filtered = fontNames
    ? unicodeFontNames.filter((name) => fontNames.includes(name))
    : unicodeFontNames
  // Los favoritos van primero; el resto conserva el orden original (sort es estable).
  return [...filtered].sort((a, b) => Number(isFavorite(b)) - Number(isFavorite(a)))
})

// Cada estilo se convierte una vez por cambio de texto, no en cada uso dentro del template.
const fontPreviews = computed(() => {
  const text = inputText.value || PLACEHOLDER_TEXT
  return visibleFontNames.value.map((name) => ({ name, text: toUnicodeFont(text, name) }))
})

const copyPreview = (name: string, text: string) => copy(text, `${name} copiado`)

const clearInput = () => {
  inputText.value = ''
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
  <main class="fonts-page">
    <ToolHeader eyebrow="01 · Fuentes Unicode">
      <template #title>
        Convierte tu texto a
        <em class="font-display">cualquier estilo</em>
      </template>
      <template #description>
        {{ unicodeFontNames.length }} estilos tipográficos basados en Unicode. Funciona en
        Instagram, Twitter, WhatsApp, biografías y casi cualquier sitio.
      </template>

      <div class="composer anim-fade-up delay-300">
        <div class="composer-bar">
          <label for="fonts-input" class="composer-label">
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
              <path d="M4 7V4h16v3" />
              <path d="M9 20h6" />
              <path d="M12 4v16" />
            </svg>
            Tu texto
          </label>
          <button v-if="inputText" type="button" class="btn-ghost" @click="clearInput">
            Limpiar
          </button>
        </div>
        <textarea
          id="fonts-input"
          ref="inputEl"
          v-model="inputText"
          class="composer-input"
          :placeholder="PLACEHOLDER_TEXT"
          rows="2"
          :maxlength="MAX_INPUT_LENGTH"
        />
        <div class="composer-meta">
          <span>{{ inputText.length }} / {{ MAX_INPUT_LENGTH }} caracteres</span>
          <span>·</span>
          <span>{{ visibleFontNames.length }} estilos disponibles</span>
        </div>
      </div>

      <div class="cats" role="group" aria-label="Filtrar por categoría">
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="cat"
          :class="{ active: activeCategoryId === category.id }"
          :aria-pressed="activeCategoryId === category.id"
          @click="activeCategoryId = category.id"
        >
          {{ category.label }}
        </button>
      </div>
    </ToolHeader>

    <section class="results container-px">
      <div class="results-grid">
        <article
          v-for="(preview, index) in fontPreviews"
          :key="preview.name"
          v-reveal
          class="font-card surface lift"
          :style="{ transitionDelay: index * 30 + 'ms' }"
          @click="copyPreview(preview.name, preview.text)"
        >
          <header class="font-card-head">
            <div class="font-card-meta">
              <span class="font-card-name">{{ preview.name }}</span>
              <span v-if="isFavorite(preview.name)" class="font-card-fav-pill">★ Favorito</span>
            </div>
            <div class="font-card-actions">
              <button
                type="button"
                class="icon-btn"
                :class="{ active: isFavorite(preview.name) }"
                :aria-pressed="isFavorite(preview.name)"
                :aria-label="`${isFavorite(preview.name) ? 'Quitar de' : 'Añadir a'} favoritos: ${preview.name}`"
                @click.stop="toggleFavorite(preview.name)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  :fill="isFavorite(preview.name) ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  />
                </svg>
              </button>
              <button
                type="button"
                class="icon-btn"
                :aria-label="`Copiar texto en ${preview.name}`"
                @click.stop="copyPreview(preview.name, preview.text)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
          </header>

          <p class="font-card-text">{{ preview.text }}</p>

          <footer class="font-card-foot">
            <span class="font-card-hint">Click para copiar</span>
            <span class="font-card-arrow" aria-hidden="true">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </footer>
        </article>
      </div>

      <div v-if="fontPreviews.length === 0" class="empty">
        <p>No hay estilos en esta categoría todavía.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.fonts-page {
  position: relative;
}

/* Solo en Fuentes: el titular responde al tema de forma inmediata. */
.fonts-page :deep(.head-title),
.fonts-page :deep(.head-title em) {
  animation: none;
  transition: none;
}

/* Composer */
.composer {
  max-width: 760px;
  margin: 0 auto;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition:
    border-color 0.3s var(--ease-smooth),
    box-shadow 0.3s var(--ease-smooth);
}
.composer:focus-within {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-lg);
}

.composer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 12px 18px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-subtle);
}
.composer-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink-faint);
}

.composer-input {
  width: 100%;
  padding: 22px 24px;
  background: transparent;
  border: none;
  font-family: var(--font-sans);
  font-size: 1.125rem;
  color: var(--ink);
  resize: none;
  outline: none;
  letter-spacing: -0.01em;
}
.composer-input::placeholder {
  color: var(--ink-faint);
}

.composer-meta {
  display: flex;
  gap: 8px;
  padding: 10px 18px 14px;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--ink-faint);
  letter-spacing: -0.005em;
}

/* Categorías */
.cats {
  margin-top: 32px;
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 6px;
  border-radius: 999px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  width: fit-content;
  margin-inline: auto;
  margin-bottom: 32px;
}
.cat {
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--ink-muted);
  cursor: pointer;
  /* Cambiar el tema no debe dejar este selector con colores anteriores. */
  transition: none;
}
.cat:hover {
  color: var(--ink);
}
.cat.active {
  background: var(--bg-elevated);
  color: var(--ink);
  box-shadow: var(--shadow-xs);
}

/* Resultados */
.results {
  max-width: 1240px;
  margin: 0 auto;
  padding-block: 56px clamp(60px, 10vw, 120px);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.font-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px 26px;
  border-radius: 20px;
  cursor: pointer;
  position: relative;
}

.font-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.font-card-meta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.font-card-name {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ink-faint);
}

.font-card-fav-pill {
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--ink-soft);
}

.font-card-actions {
  display: inline-flex;
  gap: 4px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--ink-muted);
  cursor: pointer;
  transition:
    color 0.25s var(--ease-smooth),
    background 0.25s var(--ease-smooth),
    border-color 0.25s var(--ease-smooth),
    transform 0.4s var(--ease-out-expo);
}
.icon-btn:hover {
  color: var(--ink);
  border-color: var(--border-hover);
  background: var(--bg-subtle);
}
.icon-btn:active {
  transform: scale(0.92);
}
.icon-btn.active {
  color: var(--ink);
  background: var(--bg-subtle);
  border-color: var(--border-hover);
}

.font-card-text {
  font-size: 1.25rem;
  line-height: 1.4;
  color: var(--ink);
  word-break: break-word;
  margin: 0;
  letter-spacing: -0.005em;
}

.font-card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
  font-size: 0.75rem;
  color: var(--ink-faint);
  font-family: var(--font-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.font-card-arrow {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--bg-subtle);
  color: var(--ink-soft);
  transition:
    transform 0.45s var(--ease-out-expo),
    background 0.3s var(--ease-smooth),
    color 0.3s var(--ease-smooth);
}
.font-card:hover .font-card-arrow {
  background: var(--ink);
  color: var(--bg);
  transform: translateX(4px) rotate(-12deg);
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--ink-muted);
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
  .composer-input {
    font-size: 1rem;
    padding: 18px 20px;
  }
}

/* En móvil, los filtros forman una sola fila desplazable en lugar de
   una cápsula de dos líneas con la última categoría aislada. */
@media (max-width: 640px) {
  .cats {
    width: 100%;
    max-width: 100%;
    flex-wrap: nowrap;
    justify-content: flex-start;
    gap: 4px;
    padding: 5px;
    margin-top: 24px;
    margin-bottom: 28px;
    border-radius: 18px;
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .cats::-webkit-scrollbar {
    display: none;
  }
  .cat {
    flex: 0 0 auto;
    min-height: 40px;
    padding: 10px 14px;
    white-space: nowrap;
  }
}
</style>
