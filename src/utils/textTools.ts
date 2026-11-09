// Intl.Segmenter no existe en navegadores antiguos (p. ej. Firefox < 125).
const graphemeSegmenter =
  typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : undefined

/**
 * Divide un texto en caracteres tal y como los percibe el usuario (grafemas).
 * A diferencia de `Array.from`, mantiene unidos los emojis con modificadores (👍🏽),
 * las banderas (🇪🇸) y las letras con tildes combinadas.
 * Sin Intl.Segmenter, recurre a separar por puntos de código.
 */
export function splitGraphemes(text: string): string[] {
  if (!graphemeSegmenter) return Array.from(text)
  return Array.from(graphemeSegmenter.segment(text), ({ segment }) => segment)
}

/* ============================================
   TRANSFORMACIONES DE TEXTO
   ============================================ */

function toSentenceCase(text: string): string {
  // Una frase empieza al inicio del texto, tras un salto de línea o tras un signo
  // de puntuación final. Los signos de apertura ("¿", "¡", comillas...) se saltan
  // para poner en mayúscula la primera letra real.
  return text
    .toLowerCase()
    .replace(
      /(^|[.!?…]\s+|\n)([\s¿¡"'«(]*)(\p{L})/gu,
      (_match, boundary: string, openingSigns: string, letter: string) =>
        boundary + openingSigns + letter.toUpperCase(),
    )
}

function toAlternatingCase(text: string): string {
  let letterIndex = 0
  return splitGraphemes(text)
    .map((grapheme) => {
      if (!/^\p{L}/u.test(grapheme)) return grapheme
      const converted = letterIndex % 2 === 0 ? grapheme.toLowerCase() : grapheme.toUpperCase()
      letterIndex++
      return converted
    })
    .join('')
}

function invertCase(text: string): string {
  return Array.from(text)
    .map((char) => {
      const upper = char.toUpperCase()
      const lower = char.toLowerCase()
      if (char === lower && char !== upper) return upper
      if (char === upper && char !== lower) return lower
      return char
    })
    .join('')
}

export const textTransforms = {
  upper: (text: string) => text.toUpperCase(),
  lower: (text: string) => text.toLowerCase(),
  capitalize: (text: string) =>
    text
      .toLowerCase()
      .replace(
        /(^|\s|[-—.,;:!?¿¡()[\]{}"])(\p{L})/gu,
        (_match, separator: string, letter: string) => separator + letter.toUpperCase(),
      ),
  sentence: toSentenceCase,
  alternating: toAlternatingCase,
  inverse: invertCase,
  reverse: (text: string) => splitGraphemes(text).reverse().join(''),
} satisfies Record<string, (text: string) => string>

export type TextTransformId = keyof typeof textTransforms

/* ============================================
   MÉTRICAS DE TEXTO
   ============================================ */

export const WORDS_PER_MINUTE = 220

export interface TextMetrics {
  words: number
  characters: number
  charactersNoSpaces: number
  sentences: number
  paragraphs: number
  readingMinutes: number
}

export function analyzeText(text: string): TextMetrics {
  // Se cuentan grafemas para que "👍🏽" o "🇪🇸" cuenten como un solo carácter.
  const characters = splitGraphemes(text).length
  const trimmed = text.trim()

  if (!trimmed) {
    return {
      words: 0,
      characters,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingMinutes: 0,
    }
  }

  const words = trimmed.split(/\s+/).length
  const charactersNoSpaces = splitGraphemes(text.replace(/\s/g, '')).length

  // Una frase termina en puntuación final seguida de espacio, o en un salto de línea.
  // Exigir el espacio evita partir números como "3.14", y la última frase se cuenta
  // aunque no tenga punto final. (Sin lookbehind: Safari < 16.4 no lo soporta.)
  const sentences = trimmed
    .replace(/([.!?…])\s+/g, '$1\n')
    .split('\n')
    .filter((sentence) => /[\p{L}\p{N}]/u.test(sentence)).length

  const paragraphs = trimmed.split(/\n\s*\n/).filter((paragraph) => paragraph.trim()).length
  const readingMinutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE))

  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingMinutes }
}
