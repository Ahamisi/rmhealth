import { ref, onMounted, onUnmounted } from "vue";

export const useModalOpen = () => {
  const isModalOpen = ref(false);

  const toggleModal = () => {
    isModalOpen.value = !isModalOpen.value
  };

  const close = (event: Event) => {
    if (!(event.target as HTMLElement).closest(".dropdown")) {
      isModalOpen.value = false;
    }
  };

  onMounted(() => {
    window.addEventListener("click", close);
  });

  onUnmounted(() => {
    window.removeEventListener("click", close);
  });

  return { isModalOpen, toggleModal };
};
