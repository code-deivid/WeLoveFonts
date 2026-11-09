import { ref } from 'vue'
import { readStorage, writeStorage } from '@/utils/storage'

const FAVORITES_STORAGE_KEY = 'wlf-favorites'

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function loadFavorites(): string[] {
  const stored = readStorage(FAVORITES_STORAGE_KEY)
  if (!stored) return []
  try {
    const parsed: unknown = JSON.parse(stored)
    return isStringArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** Estilos favoritos del generador de fuentes, persistidos en localStorage. */
export function useFavorites() {
  const favorites = ref<string[]>(loadFavorites())

  function isFavorite(name: string): boolean {
    return favorites.value.includes(name)
  }

  function toggleFavorite(name: string) {
    favorites.value = isFavorite(name)
      ? favorites.value.filter((favorite) => favorite !== name)
      : [...favorites.value, name]
    writeStorage(FAVORITES_STORAGE_KEY, JSON.stringify(favorites.value))
  }

  return { favorites, isFavorite, toggleFavorite }
}
