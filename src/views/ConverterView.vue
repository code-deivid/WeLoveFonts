<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ToolHeader from '@/components/ToolHeader.vue'
import { useClipboard } from '@/composables/useClipboard'
import { textTransforms, type TextTransformId } from '@/utils/textTools'

const PLACEHOLDER_TEXT = 'Escribe o pega tu texto aquí para transformarlo…'

interface TransformOption {
  id: TextTransformId
  label: string
  description: string
  example: string
}

const transforms: TransformOption[] = [
  {
    id: 'upper',
    label: 'MAYÚSCULAS',
    description: 'Convierte cada letra a mayúsculas',
    example: 'TEXTO EN MAYÚSCULAS',
  },
  {
    id: 'lower',
    label: 'minúsculas',
    description: 'Todo en letras pequeñas',
    example: 'texto en minúsculas',
  },
  {
    id: 'capitalize',
    label: 'Capitalize Each Word',
    description: 'Primera letra de cada palabra en mayúscula',
    example: 'Texto Con Cada Palabra Capitalizada',
  },
  {
    id: 'sentence',
    label: 'Sentence case',
    description: 'Solo la primera letra de cada frase',
    example: 'Texto en sentence case. Otra frase aquí.',
  },
  {
    id: 'alternating',
    label: 'AlTeRnAtInG',
    description: 'Mezcla mayúsculas y minúsculas',
    example: 'TeXtO aLtErNaDo PaRa MeMeS',
  },
  {
    id: 'inverse',
    label: 'iNVERTIDO',
    description: 'Invierte las mayúsculas y minúsculas',
    example: 'tEXTO con MAYÚSCULAS invertidas',
  },
  {
    id: 'reverse',
    label: 'odasreveR',
    description: 'Invierte el orden de los caracteres',
    example: 'odasreveR otxeT',
  },
]

const { copy } = useClipboard()

const text = ref('')
const activeId = ref<TextTransformId>('upper')
const inputEl = ref<HTMLTextAreaElement | null>(null)

// activeId solo puede tomar valores de la lista, así que find siempre encuentra uno.
const activeTransform = computed(() => transforms.find(({ id }) => id === activeId.value)!)

const output = computed(() => (text.value ? textTransforms[activeId.value](text.value) : ''))

const handleCopy = () => copy(output.value, 'Texto transformado copiado')

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
  <main class="conv-page">
    <ToolHeader eyebrow="03 · Conversor de texto">
      <template #title>
        Transforma tu texto
        <em class="font-display">en un click</em>
      </template>
      <template #description>
        Mayúsculas, minúsculas, capitalización, alternancia, inversión...
        {{ transforms.length }} transformaciones esenciales con resultado instantáneo.
      </template>
    </ToolHeader>

    <section class="conv container-px">
      <div class="conv-grid">
        <!-- Selector de transformación -->
        <aside class="conv-side anim-fade-up delay-300">
          <h3 class="side-label">Tipo de transformación</h3>
          <ul class="side-list">
            <li v-for="transform in transforms" :key="transform.id">
              <button
                type="button"
                class="side-item"
                :class="{ active: activeId === transform.id }"
                :aria-pressed="activeId === transform.id"
                @click="activeId = transform.id"
              >
                <div class="side-item-text">
                  <span class="side-item-name">{{ transform.label }}</span>
                  <span class="side-item-desc">{{ transform.description }}</span>
                </div>
                <svg
                  v-if="activeId === transform.id"
                  aria-hidden="true"
                  class="side-check"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span v-else class="side-arrow" aria-hidden="true">→</span>
              </button>
            </li>
          </ul>
        </aside>

        <!-- Editor + Output -->
        <div class="conv-main">
          <div class="editor surface anim-fade-up delay-400">
            <header class="editor-bar">
              <label for="converter-input" class="editor-label">
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Entrada
              </label>
              <button v-if="text" type="button" class="btn-ghost" @click="handleClear">
                Limpiar
              </button>
            </header>
            <textarea
              id="converter-input"
              ref="inputEl"
              v-model="text"
              class="editor-input"
              :placeholder="PLACEHOLDER_TEXT"
              spellcheck="false"
              rows="6"
            />
          </div>

          <div class="output surface anim-fade-up delay-500">
            <header class="editor-bar">
              <span class="editor-label">
                <span class="output-style">{{ activeTransform.label }}</span>
              </span>
              <button type="button" class="btn-ghost" :disabled="!output" @click="handleCopy">
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
                Copiar resultado
              </button>
            </header>
            <!--
              La clave cambia al elegir otra transformación o al pasar del ejemplo al
              resultado, pero no en cada tecla: así la animación no se repite al escribir.
            -->
            <Transition name="fade-text" mode="out-in">
              <div :key="`${activeId}-${output ? 'result' : 'example'}`" class="output-text">
                <p v-if="output">{{ output }}</p>
                <p v-else class="output-placeholder">
                  {{ activeTransform.example }}
                </p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.conv-page {
  position: relative;
}

/* Layout */
.conv {
  max-width: 1240px;
  margin: 0 auto;
  padding-block: 32px clamp(60px, 10vw, 120px);
}
.conv-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 18px;
  align-items: start;
}

/* Side */
.conv-side {
  position: sticky;
  top: 100px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 18px;
  box-shadow: var(--shadow-sm);
}
.side-label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ink-faint);
  margin: 6px 8px 14px;
}
.side-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.side-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 14px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.25s var(--ease-smooth),
    border-color 0.25s var(--ease-smooth),
    transform 0.4s var(--ease-out-expo);
}
.side-item:hover {
  background: var(--bg-subtle);
  transform: translateX(2px);
}
.side-item.active {
  background: var(--bg-subtle);
  border-color: var(--border-strong);
}

.side-item-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.side-item-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.01em;
}
.side-item-desc {
  font-size: 0.75rem;
  color: var(--ink-muted);
  letter-spacing: -0.005em;
}

.side-check {
  flex-shrink: 0;
  color: var(--ink);
}
.side-arrow {
  flex-shrink: 0;
  color: var(--ink-faint);
  font-size: 0.875rem;
  opacity: 0;
  transform: translateX(-4px);
  transition:
    opacity 0.25s var(--ease-smooth),
    transform 0.4s var(--ease-out-expo);
}
.side-item:hover .side-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Main */
.conv-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.editor,
.output {
  border-radius: 20px;
  overflow: hidden;
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
.output-style {
  color: var(--ink);
  font-weight: 600;
}

.editor-input {
  width: 100%;
  padding: 22px 24px;
  background: transparent;
  border: none;
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.65;
  color: var(--ink);
  resize: none;
  outline: none;
  letter-spacing: -0.005em;
  min-height: 200px;
}
.editor-input::placeholder {
  color: var(--ink-faint);
}

.output-text {
  padding: 22px 24px;
  min-height: 200px;
}
.output-text p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.65;
  color: var(--ink);
  word-break: break-word;
  letter-spacing: -0.005em;
}
.output-placeholder {
  color: var(--ink-faint) !important;
  font-style: italic;
}

/* Animation between transforms */
.fade-text-enter-active,
.fade-text-leave-active {
  transition:
    opacity 0.25s var(--ease-smooth),
    transform 0.35s var(--ease-out-expo);
}
.fade-text-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-text-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 960px) {
  .conv-grid {
    grid-template-columns: 1fr;
  }
  .conv-side {
    position: relative;
    top: 0;
  }
}
</style>
