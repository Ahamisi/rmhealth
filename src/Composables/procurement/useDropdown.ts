import { ref, onMounted, onUnmounted } from 'vue'

export const useDropdown = () => {
  const isOpen = ref(false)

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const close = (event: Event) => {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      isOpen.value = false
    }
  }

  onMounted(() => {
    window.addEventListener('click', close)
  })

  onUnmounted(() => {
    window.removeEventListener('click', close)
  })

  return { isOpen, toggle }
}
