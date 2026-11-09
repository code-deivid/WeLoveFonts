import { readonly, ref } from 'vue'

export type ToastTone = 'success' | 'error'

const TOAST_DURATION_MS = 2400

// Estado compartido: hay un único toast para toda la aplicación (AppToast).
const isVisible = ref(false)
const message = ref('')
const tone = ref<ToastTone>('success')
let hideTimer: ReturnType<typeof setTimeout> | undefined

export function useToast() {
  function showToast(text: string, toastTone: ToastTone = 'success') {
    message.value = text
    tone.value = toastTone

    // Se oculta y se vuelve a mostrar en el siguiente frame para que la animación
    // de entrada se repita aunque el toast ya estuviera visible.
    isVisible.value = false
    requestAnimationFrame(() => {
      isVisible.value = true
    })

    clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      isVisible.value = false
    }, TOAST_DURATION_MS)
  }

  return {
    isVisible: readonly(isVisible),
    message: readonly(message),
    tone: readonly(tone),
    showToast,
  }
}
