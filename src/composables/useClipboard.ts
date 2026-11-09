import { useToast } from './useToast'

export function useClipboard() {
  const { showToast } = useToast()

  async function copy(text: string, successMessage = 'Copiado al portapapeles'): Promise<boolean> {
    if (!text) return false
    try {
      // La API del portapapeles solo existe en contextos seguros (HTTPS o localhost).
      await navigator.clipboard.writeText(text)
      showToast(successMessage)
      return true
    } catch {
      showToast('No se pudo copiar', 'error')
      return false
    }
  }

  return { copy }
}
