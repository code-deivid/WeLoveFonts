import { describe, expect, it } from 'vitest'
import { analyzeText, splitGraphemes, textTransforms } from '../textTools'

describe('splitGraphemes', () => {
  it('mantiene unidos emojis compuestos, banderas y tildes combinadas', () => {
    expect(splitGraphemes('👍🏽🇪🇸é')).toEqual(['👍🏽', '🇪🇸', 'é'])
  })
})

describe('textTransforms', () => {
  it('convierte a mayúsculas y minúsculas respetando tildes y ñ', () => {
    expect(textTransforms.upper('árbol ñandú')).toBe('ÁRBOL ÑANDÚ')
    expect(textTransforms.lower('ÁRBOL ÑANDÚ')).toBe('árbol ñandú')
  })

  it('capitaliza cada palabra, también tras guiones y signos de apertura', () => {
    expect(textTransforms.capitalize('hola MUNDO-feliz ¿qué tal?')).toBe(
      'Hola Mundo-Feliz ¿Qué Tal?',
    )
  })

  it('pone en mayúscula el inicio de cada frase aunque empiece por ¿ o ¡', () => {
    expect(textTransforms.sentence('¿QUÉ TAL? bien. ¡hola! adiós')).toBe(
      '¿Qué tal? Bien. ¡Hola! Adiós',
    )
  })

  it('trata cada línea como el inicio de una frase', () => {
    expect(textTransforms.sentence('primera línea\nsegunda línea')).toBe(
      'Primera línea\nSegunda línea',
    )
  })

  it('alterna mayúsculas y minúsculas solo en las letras', () => {
    expect(textTransforms.alternating('hola, mundo 1')).toBe('hOlA, mUnDo 1')
  })

  it('invierte mayúsculas y minúsculas sin tocar números ni símbolos', () => {
    expect(textTransforms.inverse('Árbol ÑU 3!')).toBe('áRBOL ñu 3!')
  })

  it('invierte el texto sin romper emojis, banderas ni tildes', () => {
    expect(textTransforms.reverse('ab 👍🏽 🇪🇸 café')).toBe('éfac 🇪🇸 👍🏽 ba')
  })

  it('devuelve un texto vacío sin errores', () => {
    for (const transform of Object.values(textTransforms)) {
      expect(transform('')).toBe('')
    }
  })
})

describe('analyzeText', () => {
  it('devuelve ceros para un texto vacío', () => {
    expect(analyzeText('')).toEqual({
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingMinutes: 0,
    })
  })

  it('cuenta los espacios como caracteres aunque no haya palabras', () => {
    const metrics = analyzeText('  \n\n  ')
    expect(metrics.characters).toBe(6)
    expect(metrics.words).toBe(0)
    expect(metrics.paragraphs).toBe(0)
  })

  it('cuenta la última frase aunque no termine en punto', () => {
    expect(analyzeText('Hola. Adiós').sentences).toBe(2)
  })

  it('no divide frases en números decimales', () => {
    expect(analyzeText('El valor es 3.14 aproximadamente.').sentences).toBe(1)
  })

  it('cuenta frases con signos de interrogación y exclamación en español', () => {
    expect(analyzeText('¿Qué tal? ¡Muy bien! Gracias.').sentences).toBe(3)
  })

  it('cuenta párrafos separados por líneas en blanco', () => {
    const metrics = analyzeText('Uno dos.\n\nTres cuatro\n\n\nCinco')
    expect(metrics.paragraphs).toBe(3)
    expect(metrics.sentences).toBe(3)
    expect(metrics.words).toBe(5)
  })

  it('cuenta los emojis compuestos como un solo carácter', () => {
    const metrics = analyzeText('Hola 👍🏽')
    expect(metrics.characters).toBe(6)
    expect(metrics.charactersNoSpaces).toBe(5)
  })

  it('calcula el tiempo de lectura con un mínimo de un minuto', () => {
    expect(analyzeText('palabra').readingMinutes).toBe(1)
    expect(analyzeText(Array(660).fill('palabra').join(' ')).readingMinutes).toBe(3)
  })
})
