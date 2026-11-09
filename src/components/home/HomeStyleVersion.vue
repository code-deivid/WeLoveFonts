<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { splitGraphemes } from '@/utils/textTools'
import { toUnicodeFont } from '@/utils/unicodeFonts'

/*
 * Una versión del texto en un estilo Unicode, a una escala concreta.
 * Es un botón: al pulsarlo, el hero copia el texto completo en ese estilo.
 */
export type VersionScale = 'poster' | 'large' | 'medium' | 'note'

const props = defineProps<{
  text: string
  styleName: string
  scale: VersionScale
  /** Retraso de la animación de entrada, para escalonar las versiones. */
  entranceDelayMs: number
  isCopied: boolean
}>()

defineEmits<{
  copy: []
}>()

/*
 * Cuántos caracteres caben a tamaño completo en cada escala. Con textos más
 * largos el tamaño se reduce de forma progresiva (ver fitFactor).
 */
const COMFORTABLE_LENGTH: Record<VersionScale, number> = {
  poster: 7,
  large: 9,
  medium: 16,
  note: 40,
}

// Solo se dibuja el principio de los textos largos; al copiar se usa el texto completo.
const MAX_VISIBLE_GRAPHEMES = 60

const graphemes = computed(() => splitGraphemes(props.text))

const visibleText = computed(() => {
  if (graphemes.value.length <= MAX_VISIBLE_GRAPHEMES) return props.text
  return graphemes.value.slice(0, MAX_VISIBLE_GRAPHEMES).join('').trimEnd() + '…'
})

/** Factor entre 0 y 1 que reduce el tamaño cuando el texto no cabe en su escala. */
const fitFactor = computed(() => {
  const ratio = COMFORTABLE_LENGTH[props.scale] / Math.max(graphemes.value.length, 1)
  return Math.min(1, ratio ** 0.75)
})

/* ===========================================================
   ENTRADA — la versión prueba otros alfabetos antes de quedarse con el suyo
   =========================================================== */
const SHUFFLE_POOL = ['Bold', 'Italic', 'Monospace', 'Double Struck', 'Fraktur', 'Small Caps']
const SHUFFLE_STEPS = 4
const SHUFFLE_STEP_MS = 70

// Estilo temporal durante la entrada; null = el estilo definitivo.
const shuffleStyle = ref<string | null>(null)
const shuffleTimers: ReturnType<typeof setTimeout>[] = []

function playEntrance() {
  const pool = SHUFFLE_POOL.filter((style) => style !== props.styleName)
  for (let step = 0; step <= SHUFFLE_STEPS; step++) {
    const style = step < SHUFFLE_STEPS ? (pool[step % pool.length] ?? null) : null
    const delay = props.entranceDelayMs + step * SHUFFLE_STEP_MS
    shuffleTimers.push(
      setTimeout(() => {
        shuffleStyle.value = style
      }, delay),
    )
  }
}

const displayText = computed(() =>
  toUnicodeFont(visibleText.value, shuffleStyle.value ?? props.styleName),
)

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReducedMotion) playEntrance()
})

onBeforeUnmount(() => shuffleTimers.forEach(clearTimeout))
</script>

<template>
  <button
    type="button"
    class="version"
    :class="[`version--${scale}`, { 'is-copied': isCopied }]"
    :style="{ '--fit': fitFactor }"
    :aria-label="`Copiar en estilo ${styleName}`"
    @click="$emit('copy')"
  >
    <span class="version__label" aria-hidden="true">
      {{ isCopied ? 'Copiado' : styleName }}
    </span>
    <span class="version__text" aria-hidden="true">{{ displayText }}</span>
  </button>
</template>

<style scoped>
.version {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;
  max-width: 100%;
  padding: 0;
  background: transparent;
  border: 0;
  color: var(--ink);
  font: inherit;
  text-align: inherit;
  cursor: copy;
  transition: opacity 0.35s var(--ease-out-quart);
}

.version__label {
  display: inline-block;
  padding: 2px 8px;
  margin-inline: -8px;
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
  color: var(--ink-soft);
  transition:
    color 0.2s var(--ease-smooth),
    background 0.2s var(--ease-smooth);
}

.version__text {
  max-width: 100%;
  font-size: max(1.125rem, calc(var(--base) * var(--fit, 1)));
  line-height: 1.05;
  overflow-wrap: break-word;
}

.version--poster {
  --base: clamp(4rem, 12.5vw, 11.5rem);
}

.version--large {
  --base: clamp(2.5rem, 6.6vw, 6rem);
}

.version--medium {
  --base: clamp(1.625rem, 3vw, 2.75rem);
}

.version--note {
  --base: clamp(1.125rem, 1.6vw, 1.5rem);
}

.version:hover .version__label,
.version:focus-visible .version__label {
  color: var(--ink);
}

/* Copiado: la etiqueta se invierte a tinta sólida */
.version.is-copied .version__label {
  background: var(--ink);
  color: var(--bg);
}

.version:active .version__text {
  opacity: 0.7;
}
</style>
