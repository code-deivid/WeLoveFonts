import { readonly, ref } from 'vue'
import { readStorage, writeStorage } from '@/utils/storage'

export type Theme = 'light' | 'dark'

// La misma clave se lee en el script en línea de index.html.
export const THEME_STORAGE_KEY = 'wlf-theme'

/*
 * Si index.html aplicó el tema antes del primer pintado, respetamos ese valor.
 * Si no, recuperamos la preferencia guardada o la del sistema. De esta forma
 * el botón funciona también cuando no existe el script inicial en index.html.
 */
function readInitialTheme(): Theme {
  const savedTheme = readStorage(THEME_STORAGE_KEY)
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme

  const appliedTheme = document.documentElement.dataset.theme
  if (appliedTheme === 'light' || appliedTheme === 'dark') return appliedTheme

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(nextTheme: Theme): void {
  const root = document.documentElement
  root.dataset.theme = nextTheme
  root.style.colorScheme = nextTheme
}

const theme = ref<Theme>(readInitialTheme())
applyTheme(theme.value)

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(theme.value)
    // Solo se guarda una elección explícita del usuario: si nunca cambia el tema,
    // la web sigue la preferencia del sistema.
    writeStorage(THEME_STORAGE_KEY, theme.value)
  }

  return { theme: readonly(theme), toggleTheme }
}
