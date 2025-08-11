import { ref } from "vue";
import api from "@/api";

export const useSupplierForm = () => {
	const isSubmitting = ref(false);
	const error = ref<string | null>(null);

	const createSupplier = async (supplierData: any, currentBranch = 1) => {
		isSubmitting.value = true;
		try {
			const response = await api.post(
				`/suppliers?current_branch=${currentBranch}`,
				supplierData
			);
			console.log("Supplier created:", response.data);
			return response.data;
		} catch (err: any) {
			console.error("Error creating supplier:", err);
			error.value =
				err.response?.data?.message || err.message || "Unknown error";
			throw error.value;
		} finally {
			isSubmitting.value = false;
		}
	};
	const updateSupplier = async (
		id: number,
		supplierData: any,
		currentBranch = 1
	) => {
		isSubmitting.value = true;
		try {
			const response = await api.put(
				`/suppliers/${id}?current_branch=${currentBranch}`,
				supplierData
			);
			console.log("Supplier updated:", response.data);
			return response.data;
		} catch (err: any) {
			console.error("Error updating supplier:", err);
			error.value =
				err.response?.data?.message || err.message || "Unknown error";
			throw error.value;
		} finally {
			isSubmitting.value = false;
		}
	};

	return {
		isSubmitting,
		error,
		createSupplier,
		updateSupplier,
	};
};
