import { ref, onMounted, onUnmounted } from "vue";

interface Option {
	id: number;
	name: string;
}

export const useCategory = () => {
	const supplierCategory = ref<Option | null>(null);

	const supplierCategories = ref([
		{
			id: 1,
			name: "Local Supplier",
			position: "CEO",
			avatar: "https://randomuser.me/api/portraits/men/62.jpg",
		},
		{
			id: 2,
			name: "Overseas Supplier",
			position: "COO",
			avatar: "https://randomuser.me/api/portraits/women/62.jpg",
		},
	]);
	const paymentCategory = ref<Option | null>(null);

	const paymentCategories = ref([
		{
			id: 1,
			name: "Medical",
			position: "CEO",
			avatar: "https://randomuser.me/api/portraits/men/62.jpg",
		},
		{
			id: 2,
			name: "Logistics",
			position: "COO",
			avatar: "https://randomuser.me/api/portraits/women/62.jpg",
		},
	]);

	const setCategory = (category: Option) => {
		supplierCategory.value = category;
	};
	return {
		supplierCategories,
		supplierCategory,
		setCategory,
		paymentCategories,
		paymentCategory,
	};
};
