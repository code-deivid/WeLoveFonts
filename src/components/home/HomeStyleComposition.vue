<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import HomeStyleVersion, { type VersionScale } from '@/components/home/HomeStyleVersion.vue'
import { useClipboard } from '@/composables/useClipboard'
import { toUnicodeFont } from '@/utils/unicodeFonts'

/*
 * Composición del hero: el mismo texto en cinco estilos Unicode y cinco escalas.
 * Cada versión es a la vez la muestra y el botón que la copia.
 */
const props = defineProps<{
  text: string
}>()

interface CompositionVersion {
  style: string
  scale: VersionScale
  /** Nombre del área en la rejilla (ver grid-template-areas en el CSS). */
  area: string
}

const VERSIONS: CompositionVersion[] = [
  { style: 'Fraktur', scale: 'poster', area: 'poster' },
  { style: 'Monospace', scale: 'note', area: 'note' },
  { style: 'Double Struck', scale: 'large', area: 'large' },
  { style: 'Bold Italic', scale: 'medium', area: 'left' },
  { style: 'Small Caps', scale: 'medium', area: 'right' },
]

// Separación entre la entrada de una versión y la siguiente
const ENTRANCE_STAGGER_MS = 90
const COPIED_FEEDBACK_MS = 1600

const { copy } = useClipboard()
const copiedStyle = ref<string | null>(null)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

async function copyVersion(style: string) {
  const copied = await copy(toUnicodeFont(props.text, style), 'Copiado')
  if (!copied) return

  copiedStyle.value = style
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copiedStyle.value = null
  }, COPIED_FEEDBACK_MS)
}

onBeforeUnmount(() => clearTimeout(copiedTimer))
</script>

<template>
  <ul class="composition" aria-label="Tu texto en cinco estilos. Pulsa uno para copiarlo">
    <li
      v-for="(version, index) in VERSIONS"
      :key="version.style"
      class="composition__item"
      :style="{ gridArea: version.area }"
    >
      <HomeStyleVersion
        :text="text"
        :style-name="version.style"
        :scale="version.scale"
        :entrance-delay-ms="index * ENTRANCE_STAGGER_MS"
        :is-copied="copiedStyle === version.style"
        @copy="copyVersion(version.style)"
      />
    </li>
  </ul>
</template>

<style scoped>
/* ===========================================================
   REJILLA ASIMÉTRICA — 12 columnas, cinco áreas con escalas distintas
   =========================================================== */
.composition {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-areas:
    'poster poster poster poster poster poster poster poster note note note note'
    '. . . large large large large large large large large large'
    'left left left left left left right right right right right right';
  gap: clamp(4px, 0.8vw, 12px) clamp(16px, 2vw, 32px);
  align-items: end;
}

.composition__item {
  min-width: 0;
}

/* Asimetría: la nota se ancla arriba a la derecha y dos versiones se alinean a la derecha */
.composition__item:nth-child(2) {
  align-self: start;
  justify-self: end;
  text-align: right;
}

.composition__item:nth-child(3),
.composition__item:nth-child(5) {
  justify-self: end;
  text-align: right;
}

.composition__item:nth-child(2) :deep(.version),
.composition__item:nth-child(3) :deep(.version),
.composition__item:nth-child(5) :deep(.version) {
  align-items: flex-end;
}

/* Foco: al pasar por una versión, las demás se retiran para que destaque */
.composition:has(.version:hover, .version:focus-visible)
  :deep(.version:not(:hover, :focus-visible)) {
  opacity: 0.22;
}

/* ===========================================================
   MÓVIL — una columna, escalas descendentes
   =========================================================== */
@media (max-width: 640px) {
  .composition {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'poster'
      'large'
      'left'
      'right'
      'note';
    gap: 20px;
  }

  .composition__item:nth-child(2) {
    justify-self: start;
    text-align: left;
  }

  .composition__item:nth-child(2) :deep(.version) {
    align-items: flex-start;
  }
}
</style>
