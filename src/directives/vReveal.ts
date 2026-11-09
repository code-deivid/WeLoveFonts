import type { Directive } from 'vue'

/*
 * v-reveal: muestra el elemento con una transición cuando entra en el viewport.
 *
 * Es una directiva (y no un composable que busque `.reveal` al montar la vista)
 * para que también funcione con elementos que se crean más tarde, por ejemplo
 * las tarjetas que aparecen al cambiar de categoría en el generador de fuentes.
 *
 * El estado se guarda en `data-reveal` en lugar de en una clase para que Vue no
 * lo sobrescriba al actualizar los bindings `:class` del elemento.
 * Los estilos están en main.css ([data-reveal]).
 */

let sharedObserver: IntersectionObserver | undefined

function markVisible(element: Element) {
  element.setAttribute('data-reveal', 'visible')
  sharedObserver?.unobserve(element)
}

function getObserver(): IntersectionObserver {
  sharedObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Los elementos que ya han quedado por encima del viewport (por un salto a
        // un ancla o al final de la página) también se muestran.
        const isAboveViewport = entry.boundingClientRect.bottom < 0
        if (entry.isIntersecting || isAboveViewport) markVisible(entry.target)
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  )
  return sharedObserver
}

export const vReveal: Directive<HTMLElement> = {
  beforeMount(element) {
    element.setAttribute('data-reveal', 'hidden')
  },
  mounted(element) {
    if (!('IntersectionObserver' in window)) {
      markVisible(element)
      return
    }
    getObserver().observe(element)
  },
  beforeUnmount(element) {
    sharedObserver?.unobserve(element)
  },
}
