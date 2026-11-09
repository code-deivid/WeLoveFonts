import { onBeforeUnmount, onMounted, type Ref } from 'vue'

const EASING_FACTOR = 0.06
const SETTLE_THRESHOLD = 0.001

/**
 * Aplica un parallax sutil al elemento según la posición del ratón.
 * Expone la posición en las variables CSS --px y --py (rango -1..1), que el CSS
 * usa para desplazar las capas del fondo.
 *
 * El bucle de animación solo se ejecuta mientras el valor se está acercando a la
 * posición del ratón; cuando se estabiliza se detiene hasta el siguiente movimiento.
 */
export function useMouseParallax(target: Ref<HTMLElement | null>, intensity = 1) {
  let frameId = 0
  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0

  function renderFrame() {
    currentX += (targetX - currentX) * EASING_FACTOR
    currentY += (targetY - currentY) * EASING_FACTOR
    target.value?.style.setProperty('--px', currentX.toFixed(3))
    target.value?.style.setProperty('--py', currentY.toFixed(3))

    const isSettled =
      Math.abs(targetX - currentX) < SETTLE_THRESHOLD &&
      Math.abs(targetY - currentY) < SETTLE_THRESHOLD
    frameId = isSettled ? 0 : requestAnimationFrame(renderFrame)
  }

  function handleMouseMove(event: MouseEvent) {
    targetX = (event.clientX / window.innerWidth - 0.5) * 2 * intensity
    targetY = (event.clientY / window.innerHeight - 0.5) * 2 * intensity
    if (!frameId) frameId = requestAnimationFrame(renderFrame)
  }

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    cancelAnimationFrame(frameId)
  })
}
