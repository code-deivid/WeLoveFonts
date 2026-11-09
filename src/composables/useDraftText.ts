import { ref } from 'vue'

/** Longitud máxima del texto que se puede convertir. */
export const DRAFT_TEXT_MAX_LENGTH = 500

/*
 * Texto que el usuario escribe para convertirlo a estilos Unicode.
 *
 * Es un estado compartido a nivel de módulo: la Home y el generador de fuentes
 * usan la misma referencia, así que el texto escrito en una página sigue ahí al
 * navegar a la otra. Vive solo en memoria: no se añade a la URL ni se guarda en
 * localStorage, y desaparece al recargar la página.
 */
const draftText = ref('')

export function useDraftText() {
  return { draftText }
}
