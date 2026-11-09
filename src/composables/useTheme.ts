import { readonly, ref } from 'vue'
import { readStorage, writeStorage } from '@/utils/storage'

export type Theme = 'light' | 'dark'

// La misma clave se lee en el script en línea de index.html.
export const THEME_STORAGE_KEY = 'wlf-theme'

/*
 * Si index.html aplicó el tema antes del primer pintado, respetamos ese valor.
 * Si no, recuperamos la preferencia guardada o usamos el modo claro.
 * Así la primera visita siempre empieza en claro, incluso si el sistema es oscuro.
 */
function readInitialTheme(): Theme {
  const savedTheme = readStorage(THEME_STORAGE_KEY)
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme

  const appliedTheme = document.documentElement.dataset.theme
  if (appliedTheme === 'light' || appliedTheme === 'dark') return appliedTheme

  return 'light'
}

function applyTheme(nextTheme: Theme): void {
  const root = document.documentElement
  root.dataset.theme = nextTheme
  root.style.colorScheme = nextTheme
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content',
    nextTheme === 'dark' ? '#0A0A0A' : '#FAFAFA',
  )
}

const theme = ref<Theme>(readInitialTheme())
applyTheme(theme.value)

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(theme.value)
    // Guardamos únicamente las elecciones explícitas del usuario.
    writeStorage(THEME_STORAGE_KEY, theme.value)
  }

  return { theme: readonly(theme), toggleTheme }
}
