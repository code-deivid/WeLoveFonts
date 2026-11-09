import {
  createRouter,
  createWebHistory,
  START_LOCATION,
  type RouterScrollBehavior,
} from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Título de la pestaña del navegador para la ruta. */
    title?: string
  }
}

const NAVBAR_OFFSET_PX = 80

/*
 * Las vistas cambian con una transición `out-in` (App.vue): la vista nueva no está
 * en el DOM hasta que termina de salir la anterior. Si se hiciera scroll en ese
 * momento, un ancla como "/#tools" todavía no existiría. Por eso, al cambiar de
 * vista, el scroll espera a que App.vue avise con `notifyPageEntered`.
 */
let resolvePendingScroll: (() => void) | undefined

export function notifyPageEntered() {
  resolvePendingScroll?.()
  resolvePendingScroll = undefined
}

const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
  const position = savedPosition ?? (to.hash ? { el: to.hash, top: NAVBAR_OFFSET_PX } : { top: 0 })

  // En la carga inicial no hay transición de entrada que esperar.
  if (from === START_LOCATION) return position

  const isSameView = to.matched[0]?.components === from.matched[0]?.components
  if (isSameView) return { ...position, behavior: 'smooth' }

  return new Promise((resolve) => {
    resolvePendingScroll = () => resolve(position)
  })
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'fonts' },

    },
    {
      path: '/fonts',
      name: 'fonts',
      component: () => import('@/views/FontsView.vue'),
      meta: { title: 'Generador de fuentes — WeLoveFonts' },
    },
    {
      path: '/word-counter',
      name: 'word-counter',
      component: () => import('@/views/WordCounterView.vue'),
      meta: { title: 'Contador de palabras — WeLoveFonts' },
    },
    {
      path: '/converter',
      name: 'converter',
      component: () => import('@/views/ConverterView.vue'),
      meta: { title: 'Conversor de texto — WeLoveFonts' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Página no encontrada — WeLoveFonts' },
    },
  ],
  scrollBehavior,
})



export default router
