import { ref, onMounted, onUnmounted } from "vue";

enum ModalTypes {
	"sort",
	"filter",
	"none",
}

export const useFilterModal = () => {
	const modalTypeOpen = ref<keyof typeof ModalTypes>("none");

	const toggleModal = (type: keyof typeof ModalTypes) => {
		if (modalTypeOpen.value != type) {
			modalTypeOpen.value = type;
		} else {
			modalTypeOpen.value = "none";
		}
	};

	const close = (event: Event) => {
		if (!(event.target as HTMLElement).closest(".dropdown")) {
			modalTypeOpen.value = "none";
		}
	};

	onMounted(() => {
		window.addEventListener("click", close);
	});

	onUnmounted(() => {
		window.removeEventListener("click", close);
	});

	return { modalTypeOpen, toggleModal, ModalTypes, close };
};
