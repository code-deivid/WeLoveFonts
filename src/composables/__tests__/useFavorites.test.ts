import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFavorites } from '../useFavorites'

const STORAGE_KEY = 'wlf-favorites'

function createMemoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial))
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
  }
}

describe('useFavorites', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('añade y quita favoritos y los guarda en localStorage', () => {
    const storage = createMemoryStorage()
    vi.stubGlobal('localStorage', storage)

    const { favorites, isFavorite, toggleFavorite } = useFavorites()
    toggleFavorite('Bold')
    toggleFavorite('Bubble')
    expect(favorites.value).toEqual(['Bold', 'Bubble'])
    expect(storage.getItem(STORAGE_KEY)).toBe('["Bold","Bubble"]')

    toggleFavorite('Bold')
    expect(isFavorite('Bold')).toBe(false)
    expect(storage.getItem(STORAGE_KEY)).toBe('["Bubble"]')
  })

  it('recupera los favoritos guardados anteriormente', () => {
    vi.stubGlobal('localStorage', createMemoryStorage({ [STORAGE_KEY]: '["Fraktur"]' }))
    expect(useFavorites().isFavorite('Fraktur')).toBe(true)
  })

  it('ignora datos guardados corruptos o con un formato inesperado', () => {
    vi.stubGlobal('localStorage', createMemoryStorage({ [STORAGE_KEY]: '{no es json' }))
    expect(useFavorites().favorites.value).toEqual([])

    vi.stubGlobal('localStorage', createMemoryStorage({ [STORAGE_KEY]: '{"Bold":true}' }))
    expect(useFavorites().favorites.value).toEqual([])
  })

  it('sigue funcionando si localStorage no está disponible', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('SecurityError')
      },
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    })

    const { favorites, toggleFavorite } = useFavorites()
    expect(() => toggleFavorite('Bold')).not.toThrow()
    expect(favorites.value).toEqual(['Bold'])
  })
})
