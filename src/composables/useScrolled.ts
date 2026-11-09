import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useScrolled(threshold = 24) {
  const scrolled = ref(false)

  const onScroll = () => {
    scrolled.value = window.scrollY > threshold
  }

  onMounted(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { scrolled }
}
