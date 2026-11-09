import { describe, expect, it } from 'vitest'
import fontCharsets from '@/assets/data/dataFonts.json'
import { splitGraphemes } from '../textTools'
import { toUnicodeFont, unicodeFontNames } from '../unicodeFonts'

describe('dataFonts.json', () => {
  const plainLength = splitGraphemes(fontCharsets[0]!.chars).length

  it.each(fontCharsets.map((charset) => [charset.name, charset.chars] as const))(
    '"%s" tiene un carácter por cada carácter del estilo Normal',
    (_name, chars) => {
      // Si un estilo tuviera más o menos caracteres, toda la conversión se desplazaría.
      expect(splitGraphemes(chars)).toHaveLength(plainLength)
    },
  )
})

describe('unicodeFontNames', () => {
  it('incluye todos los estilos excepto Normal', () => {
    expect(unicodeFontNames).toHaveLength(fontCharsets.length - 1)
    expect(unicodeFontNames).not.toContain('Normal')
  })
})

describe('toUnicodeFont', () => {
  it('convierte letras y números al estilo indicado', () => {
    expect(toUnicodeFont('Abc 123', 'Bold')).toBe('𝐀𝐛𝐜 𝟏𝟐𝟑')
    expect(toUnicodeFont('Abc', 'Double Struck')).toBe('𝔸𝕓𝕔')
  })

  it('conserva las tildes, la ñ y la ç como marcas combinadas', () => {
    expect(toUnicodeFont('á', 'Bold')).toBe('𝐚́')
    expect(toUnicodeFont('Ñ', 'Bold')).toBe('𝐍̃')
    expect(toUnicodeFont('ç', 'Bold')).toBe('𝐜̧')
    // También tildes que no aparecen en dataFonts.json
    expect(toUnicodeFont('ü', 'Bold')).toBe('𝐮̈')
  })

  it('deja sin cambios los caracteres sin equivalente', () => {
    expect(toUnicodeFont('hola 👋 мир', 'Bold')).toBe('𝐡𝐨𝐥𝐚 👋 мир')
  })

  it('devuelve el texto original si el estilo no existe', () => {
    expect(toUnicodeFont('Hola', 'Inexistente')).toBe('Hola')
  })

  it('convierte con todos los estilos sin perder caracteres', () => {
    for (const fontName of unicodeFontNames) {
      expect(splitGraphemes(toUnicodeFont('WeLoveFonts 2026!', fontName))).toHaveLength(17)
    }
  })
})
