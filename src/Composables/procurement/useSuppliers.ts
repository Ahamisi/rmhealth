import { ref } from "vue";
import api from "@/api"; // Axios wrapper
import { formatDateForInput } from "@/helpers/formatDateForInput";

const statusMap: Record<number, string> = {
	// 1: "Pending",
	1: "Active",
	2: "Inactive",
};

export const useSuppliers = () => {
	const suppliers = ref<any[]>([]);
	const isLoading = ref(false);
	const error = ref<string | null>(null);
	const totalSuppliers = ref<number>(0);
	const totalPages = ref<number>(0);

	const fetchSuppliers = async ({
		page = 1,
		perPage = 20,
		searchTerm = "",
		fromDate = "",
		toDate = "",
		category = "",
		status = "",
		branchId = 1,
		currentBranch = 1,
		sortField = "",
		sortOrder = "asc",
	} = {}) => {
		isLoading.value = true;
		try {
			const response = await api.get("/suppliers/all", {
				params: {
					searchTerm,
					page,
					perPage,
					from_date: fromDate,
					to_date: toDate,
					category,
					status,
					[`filter[branch_id]`]: branchId,
					current_branch: currentBranch,
					sortField,
					sortOrder,
				},
			});

			totalSuppliers.value = response.data.total || 0;
			totalPages.value = response.data.last_page || 0;
			const s = (response.data.data || []).map((item: any) => ({
				...item,
				supplierName: item.name,
				contactName: item.contact_name,
				status: statusMap[item.status] || "Unknown",
			}));
			suppliers.value = s;
			return s;
		} catch (err: any) {
			console.error("Error fetching suppliers:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
		} finally {
			isLoading.value = false;
		}
	};
	const fetchSupplierGRNs = async ({
		page = 1,
		perPage = 20,
		searchTerm = "",
		fromDate = "",
		toDate = "",
		category = "",
		status = "",
		branchId = 1,
		currentBranch = 1,
		sortField = "",
		sortOrder = "asc",
		id = "",
	} = {}) => {
		isLoading.value = true;
		try {
			const response = await api.get(`/suppliers/${id}/purchase_orders`, {
				params: {
					searchTerm,
					page,
					perPage,
					from_date: fromDate,
					to_date: toDate,
					category,
					status,
					[`filter[branch_id]`]: branchId,
					current_branch: currentBranch,
					sortField,
					sortOrder,
				},
			});

			totalSuppliers.value = response.data.total || 0;
			totalPages.value = response.data.last_page || 0;
			const s = (response.data.data || []).map((item: any) => ({
				id: item.id || "",
				orderNo: item.order_no || "",
				docNo: item.doc_no || "",
				supplierName: item.supplier?.name || "",
				type: item?.type || "",
				date: formatDateForInput(item.delivery_date) || "",
				totalAmount: Number(item.total_amount || 0),
				assigned: {
					name: item.assigned_to || "Unassigned",
					image: item.assigned || null,
				},
			}));
			return s;
		} catch (err: any) {
			console.error("Error fetching suppliers:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
		} finally {
			isLoading.value = false;
		}
	};
	const fetchSupplierInvoices = async ({
		page = 1,
		perPage = 20,
		searchTerm = "",
		fromDate = "",
		toDate = "",
		category = "",
		status = "",
		branchId = 1,
		currentBranch = 1,
		sortField = "",
		sortOrder = "asc",
		id = "",
		type = "",
	} = {}) => {
		isLoading.value = true;
		try {
			const response = await api.get(`/suppliers/${id}/invoices`, {
				params: {
					searchTerm,
					page,
					perPage,
					from_date: fromDate,
					to_date: toDate,
					category,
					status,
					[`filter[branch_id]`]: branchId,
					current_branch: currentBranch,
					sortField,
					sortOrder,
					type,
				},
			});

			totalSuppliers.value = response.data.total || 0;
			totalPages.value = response.data.last_page || 0;
			const s = (response.data.data || []).map((item: any) => ({
				id: item.id || "",
				orderNo: item.order_no || "",
				docNo: item.doc_no || "",
				supplierName: item.supplier?.name || "",
				type: item?.type || "",
				date: formatDateForInput(item.delivery_date) || "",
				totalAmount: Number(item.total_amount || 0),
				assigned: {
					name: item.assigned_to || "Unassigned",
					image: item.assigned || null,
				},
			}));
			return s;
		} catch (err: any) {
			console.error("Error fetching suppliers:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
		} finally {
			isLoading.value = false;
		}
	};
	const fetchSupplier = async ({ id = "" } = {}) => {
		isLoading.value = true;
		try {
			const response = await api.get(`/suppliers/${id}`);

			const item = response.data;
			const s = {
				...item,
				supplierName: item.name,
				contactName: item.contact_name,
				status: statusMap[item.status] || "Unknown",
			};
			return s;
		} catch (err: any) {
			console.error("Error fetching supplier:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
		} finally {
			isLoading.value = false;
		}
	};
	const deleteSuppliers = async ({ id = null, currentBranch = 1 } = {}) => {
		isLoading.value = true;
		try {
			const response = await api.delete(`/suppliers/${id}`, {
				params: {
					id: id,
					current_branch: currentBranch,
				},
			});
		} catch (err: any) {
			console.error("Error deleting suppliers:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
			throw err;
		} finally {
			isLoading.value = false;
		}
	};

	const fetchAllSuppliers = async (currentBranch = 1) => {
		isLoading.value = true;
		try {
			const response = await api.get("/suppliers", {
				params: {
					fields: "id,name",
					current_branch: currentBranch,
				},
			});
			suppliers.value = response.data || [];
			return suppliers.value;
		} catch (err: any) {
			console.error("Error fetching suppliers:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
			return [];
		} finally {
			isLoading.value = false;
		}
	};

	return {
		suppliers,
		isLoading,
		error,
		totalSuppliers,
		totalPages, // Expose this in your component
		fetchSuppliers,
		fetchSupplier,
		deleteSuppliers,
		fetchAllSuppliers,
		fetchSupplierGRNs,
		fetchSupplierInvoices,
	};
};
