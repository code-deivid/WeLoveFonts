import fontCharsets from '@/assets/data/dataFonts.json'
import { splitGraphemes } from './textTools'

interface FontCharset {
  name: string
  chars: string
}

const PLAIN_FONT_NAME = 'Normal'

/*
 * Cada estilo de dataFonts.json define sus caracteres en el mismo orden que el
 * estilo "Normal", así que el carácter en la posición N de un estilo sustituye
 * al carácter N de "Normal". Los mapas se construyen una sola vez al cargar el módulo.
 */
function buildCharMaps(charsets: FontCharset[]): Map<string, Map<string, string>> {
  const plainCharset = charsets.find((charset) => charset.name === PLAIN_FONT_NAME)
  if (!plainCharset) throw new Error(`dataFonts.json necesita un estilo "${PLAIN_FONT_NAME}"`)

  const plainChars = splitGraphemes(plainCharset.chars)
  const charMaps = new Map<string, Map<string, string>>()

  for (const charset of charsets) {
    if (charset === plainCharset) continue
    const styledChars = splitGraphemes(charset.chars)
    const charMap = new Map<string, string>()
    plainChars.forEach((plainChar, index) => {
      charMap.set(plainChar, styledChars[index] ?? plainChar)
    })
    charMaps.set(charset.name, charMap)
  }

  return charMaps
}

const charMapsByFont = buildCharMaps(fontCharsets)

/** Nombres de los estilos Unicode disponibles, en el orden de dataFonts.json. */
export const unicodeFontNames: string[] = [...charMapsByFont.keys()]

/**
 * Convierte un texto al estilo Unicode indicado.
 *
 * El texto se descompone (NFD) para separar las tildes de sus letras: la letra base
 * se sustituye por su versión estilizada y la tilde combinada se conserva, de modo
 * que "á" se convierte en "𝐚́" sin necesitar una entrada propia para cada vocal acentuada.
 * Los caracteres sin equivalente (emojis, otros alfabetos...) se mantienen tal cual.
 */
export function toUnicodeFont(text: string, fontName: string): string {
  const charMap = charMapsByFont.get(fontName)
  if (!charMap) return text

  let result = ''
  for (const char of text.normalize('NFD')) {
    result += charMap.get(char) ?? char
  }
  return result.normalize('NFC')
}
