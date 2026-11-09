<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { analyzeText, splitGraphemes, textTransforms } from '@/utils/textTools'

/*
 * Segunda sección de la Home: el texto del hero pasa por las otras dos
 * herramientas. El contador se dibuja como una regla de caracteres y el
 * conversor como líneas apiladas, usando las mismas funciones que /word-counter
 * y /converter.
 */
const props = defineProps<{
  text: string
}>()

// La regla solo dibuja el principio de textos largos; el total sí cuenta el texto entero.
const MAX_RULER_GRAPHEMES = 48
const RULER_MARK_EVERY = 5

const metrics = computed(() => analyzeText(props.text))

const rulerCells = computed(() =>
  splitGraphemes(props.text)
    .slice(0, MAX_RULER_GRAPHEMES)
    .map((grapheme, index) => {
      const position = index + 1
      return { grapheme, mark: position % RULER_MARK_EVERY === 0 ? position : null }
    }),
)

const isRulerTruncated = computed(() => metrics.value.characters > MAX_RULER_GRAPHEMES)

const conversions = computed(() => [
  { label: 'Mayúsculas', text: textTransforms.upper(props.text) },
  { label: 'Tipo título', text: textTransforms.capitalize(props.text) },
  { label: 'Al revés', text: textTransforms.reverse(props.text) },
])

const pluralize = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`
</script>

<template>
  <section class="same-text container-px" aria-labelledby="same-text-title">
    <div class="same-text__inner">
      <h2 id="same-text-title" class="same-text__title">
        El mismo texto, <em>medido y transformado.</em>
      </h2>

      <!-- CONTADOR -->
      <article class="tool" aria-labelledby="counter-title">
        <header class="tool__head">
          <h3 id="counter-title" class="tool__name">Contador de palabras</h3>
          <p class="tool__description">
            Palabras, caracteres, oraciones, párrafos y tiempo de lectura, con los límites de X,
            SMS y meta description.
          </p>
          <RouterLink to="/word-counter" class="tool__link">
            Abrir el contador
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
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </RouterLink>
        </header>

        <div class="tool__body">
          <!-- Cada carácter lleva una marca debajo; cada cinco, su número -->
          <p class="ruler" aria-hidden="true">
            <span
              v-for="(cell, index) in rulerCells"
              :key="index"
              class="ruler__cell"
              :class="{ 'ruler__cell--mark': cell.mark }"
              :data-mark="cell.mark"
              >{{ cell.grapheme }}</span
            ><span v-if="isRulerTruncated" class="ruler__more">…</span>
          </p>

          <p class="ruler__total">
            <strong>{{ pluralize(metrics.characters, 'carácter', 'caracteres') }}</strong>
            <span>{{ pluralize(metrics.words, 'palabra', 'palabras') }}</span>
            <span>{{ metrics.charactersNoSpaces }} sin espacios</span>
          </p>
          <p class="tool__note">Un emoji compuesto como 👍🏽 cuenta como un solo carácter.</p>
        </div>
      </article>

      <!-- CONVERSOR -->
      <article class="tool" aria-labelledby="converter-title">
        <header class="tool__head">
          <h3 id="converter-title" class="tool__name">Conversor de texto</h3>
          <p class="tool__description">
            Siete transformaciones: mayúsculas, minúsculas, tipo título, tipo oración, alternado,
            invertido y texto al revés.
          </p>
          <RouterLink to="/converter" class="tool__link">
            Abrir el conversor
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
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </RouterLink>
        </header>

        <dl class="tool__body conversions">
          <div v-for="conversion in conversions" :key="conversion.label" class="conversion">
            <dt class="conversion__label">{{ conversion.label }}</dt>
            <dd class="conversion__text">{{ conversion.text }}</dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
</template>

<style scoped>
.same-text {
  max-width: 1240px;
  margin: clamp(72px, 8vw, 120px) auto 0;
}

.same-text__title {
  margin: 0 0 clamp(32px, 4vw, 56px);
  font-size: clamp(2.25rem, 4.4vw, 3.75rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--ink);
  text-wrap: balance;
}

.same-text__title em {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.1em;
  letter-spacing: -0.02em;
}

/* ===========================================================
   BLOQUE DE HERRAMIENTA — cabecera a la izquierda, demostración a la derecha
   =========================================================== */
.tool {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
  gap: 24px clamp(32px, 5vw, 80px);
  padding-block: clamp(32px, 4vw, 56px);
  border-top: 1px solid var(--ink);
}

.tool__head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.tool__name {
  margin: 0;
  font-size: clamp(1.5rem, 2.2vw, 1.875rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  color: var(--ink);
}

.tool__description {
  margin: 0;
  max-width: 22rem;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--ink-soft);
  text-wrap: pretty;
}

.tool__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--ink);
  text-decoration: underline;
  text-decoration-color: var(--border-strong);
  text-decoration-thickness: 1px;
  text-underline-offset: 6px;
  transition: text-decoration-color 0.2s var(--ease-smooth);
}

.tool__link svg {
  transition: transform 0.3s var(--ease-out-expo);
}

.tool__link:hover {
  text-decoration-color: var(--ink);
}

.tool__link:hover svg {
  transform: translate(2px, -2px);
}

.tool__body {
  min-width: 0;
  margin: 0;
}

.tool__note {
  margin: 12px 0 0;
  font-size: 0.875rem;
  color: var(--ink-soft);
}

/* ===========================================================
   REGLA DE CARACTERES
   =========================================================== */
.ruler {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.ruler__cell {
  position: relative;
  display: inline-block;
  padding-bottom: 30px;
  /* Los espacios también son caracteres: se conservan con su anchura */
  white-space: pre;
}

/* Marca corta al inicio de cada carácter */
.ruler__cell::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 20px;
  width: 1px;
  height: 8px;
  background: var(--ink-soft);
}

/* Cada cinco caracteres: marca larga y su número */
.ruler__cell--mark::after {
  height: 12px;
  bottom: 14px;
  background: var(--ink);
}

.ruler__cell--mark::before {
  content: attr(data-mark);
  position: absolute;
  left: 0;
  bottom: 0;
  transform: translateX(-50%);
  font-family: var(--font-sans);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0;
  font-variant-numeric: tabular-nums;
  color: var(--ink-soft);
}

.ruler__more {
  display: inline-block;
  padding-bottom: 30px;
  color: var(--ink-soft);
}

.ruler__total {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
  margin: 16px 0 0;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  font-size: 1.0625rem;
  color: var(--ink-soft);
  font-variant-numeric: tabular-nums;
}

.ruler__total strong {
  font-weight: 500;
  color: var(--ink);
}

/* ===========================================================
   CONVERSIONES
   =========================================================== */
.conversion {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  align-items: baseline;
  gap: 4px 24px;
  padding-block: 14px;
  border-bottom: 1px solid var(--border);
}

.conversion:first-child {
  padding-top: 0;
}

.conversion__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--ink-soft);
}

.conversion__text {
  margin: 0;
  min-width: 0;
  font-size: clamp(1.5rem, 2.6vw, 2.25rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--ink);
  overflow-wrap: anywhere;
}

/* La línea "al revés" lleva la voz serif: es la transformación más visual */
.conversion:last-child .conversion__text {
  font-family: var(--font-display);
  font-style: italic;
  letter-spacing: -0.01em;
}

@media (max-width: 860px) {
  .tool {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .conversion {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
