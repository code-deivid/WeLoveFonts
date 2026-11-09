<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import HomeStyleComposition from '@/components/home/HomeStyleComposition.vue'
import { DRAFT_TEXT_MAX_LENGTH, useDraftText } from '@/composables/useDraftText'
import { unicodeFontNames } from '@/utils/unicodeFonts'

/*
 * Hero de la Home: titular, campo de texto y la composición con el texto del
 * usuario en cinco estilos. El campo comparte estado con /fonts (useDraftText).
 */
defineProps<{
  /** Texto que se muestra: el del usuario o, si está vacío, la muestra de la Home. */
  previewText: string
}>()

const { draftText } = useDraftText()
const inputEl = ref<HTMLInputElement | null>(null)

function clearText() {
  draftText.value = ''
  inputEl.value?.focus()
}
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__inner container-px">
      <div class="hero__intro">
        <h1 id="hero-title" class="hero__title">
          Escribe normal. <em>Pega con estilo.</em>
        </h1>
        <p class="hero__lede">
          Letras Unicode para Instagram, X, WhatsApp o cualquier sitio donde no se puede cambiar la
          tipografía. Las tildes y la ñ se conservan.
        </p>
      </div>

      <div class="hero__field">
        <label for="hero-input" class="hero__label">Tu texto</label>
        <input
          id="hero-input"
          ref="inputEl"
          v-model="draftText"
          type="text"
          class="hero__input"
          placeholder="Escribe tu nombre, tu bio o una frase"
          autocomplete="off"
          spellcheck="false"
          :maxlength="DRAFT_TEXT_MAX_LENGTH"
        />
        <button v-if="draftText" type="button" class="hero__clear" @click="clearText">
          Borrar
        </button>
      </div>

      <div class="hero__hint">
        <p>Pulsa una versión para copiarla.</p>
        <RouterLink to="/fonts" class="hero__more">
          Ver los {{ unicodeFontNames.length }} estilos
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
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </RouterLink>
      </div>

      <HomeStyleComposition :text="previewText" class="hero__composition" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-top: calc(72px + clamp(28px, 2.8vw, 40px));
}

.hero__inner {
  max-width: 1240px;
  margin: 0 auto;
}

/* ===========================================================
   TITULAR Y ENTRADILLA
   =========================================================== */
.hero__intro {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
  align-items: end;
  gap: 20px clamp(32px, 6vw, 96px);
  padding-bottom: clamp(20px, 2vw, 28px);
  animation: hero-in 0.8s var(--ease-out-expo) both;
}

.hero__title {
  margin: 0;
  max-width: 12em;
  font-size: clamp(2.5rem, 4.6vw, 4rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--ink);
  text-wrap: balance;
}

.hero__title em {
  font-family: var(--font-display);
  font-weight: 400;
  /* La serif tiene un ojo más pequeño: se compensa para que ambas partes pesen igual */
  font-size: 1.12em;
  letter-spacing: -0.02em;
}

.hero__lede {
  margin: 0;
  max-width: 24rem;
  justify-self: end;
  font-size: 1rem;
  line-height: 1.55;
  color: var(--ink-soft);
  text-wrap: pretty;
}

/* ===========================================================
   CAMPO DE TEXTO — una franja entre líneas, no una caja
   =========================================================== */
.hero__field {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px 24px;
  min-height: 68px;
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--border-strong);
  transition: border-color 0.2s var(--ease-smooth);
  animation: hero-in 0.8s var(--ease-out-expo) 0.1s both;
}

.hero__field:focus-within {
  border-bottom-color: var(--ink);
}

.hero__label {
  min-width: 7rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--ink-soft);
}

.hero__input {
  width: 100%;
  min-width: 0;
  padding: 10px 0;
  background: transparent;
  border: 0;
  font-family: var(--font-sans);
  font-size: clamp(1.25rem, 2.2vw, 1.75rem);
  letter-spacing: -0.02em;
  color: var(--ink);
  caret-color: var(--ink);
}

.hero__input::placeholder {
  /* Mezcla de tinta y fondo que mantiene 4.5:1 en los dos temas */
  color: color-mix(in srgb, var(--ink) 60%, var(--bg));
  opacity: 1;
}

/* La franja marca el foco con su línea inferior */
.hero__input:focus-visible {
  outline: none;
}

.hero__clear {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  color: var(--ink-soft);
  cursor: pointer;
  transition:
    color 0.2s var(--ease-smooth),
    border-color 0.2s var(--ease-smooth);
}

.hero__clear:hover {
  color: var(--ink);
  border-color: var(--ink);
}

/* ===========================================================
   INDICACIÓN Y ENLACE A /fonts
   =========================================================== */
.hero__hint {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 24px;
  padding-block: 12px clamp(24px, 2.4vw, 32px);
  font-size: 0.875rem;
  color: var(--ink-soft);
  animation: hero-in 0.8s var(--ease-out-expo) 0.2s both;
}

.hero__hint p {
  margin: 0;
}

.hero__more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--ink);
  text-decoration: underline;
  text-decoration-color: var(--border-strong);
  text-decoration-thickness: 1px;
  text-underline-offset: 6px;
  transition: text-decoration-color 0.2s var(--ease-smooth);
}

.hero__more svg {
  transition: transform 0.3s var(--ease-out-expo);
}

.hero__more:hover {
  text-decoration-color: var(--ink);
}

.hero__more:hover svg {
  transform: translateX(3px);
}

@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* ===========================================================
   RESPONSIVE
   =========================================================== */
@media (max-width: 860px) {
  .hero__intro {
    grid-template-columns: minmax(0, 1fr);
  }

  .hero__lede {
    justify-self: start;
    max-width: 34rem;
  }
}

@media (max-width: 640px) {
  .hero {
    padding-top: calc(64px + 32px);
  }

  /* Etiqueta y botón en la primera línea; el campo ocupa todo el ancho debajo */
  .hero__field {
    grid-template-columns: minmax(0, 1fr) auto;
    padding-block: 12px;
  }

  .hero__input {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .hero__clear {
    grid-column: 2;
    grid-row: 1;
  }
}
</style>
