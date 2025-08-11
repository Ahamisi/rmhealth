import { ref } from "vue";
import api from "@/api"; // Axios wrapper

const statusMap: Record<number, string> = {
	1: "Active",
	2: "Inactive",
};

export const useReturns = () => {
	const returns = ref<any[]>([]);
	const isLoading = ref(false);
	const error = ref<string | null>(null);
	const totalReturns = ref<number>(0);
	const totalPages = ref<number>(0);

	const fetchReturns = async ({
		page = 1,
		perPage = 20,
		searchTerm = "",
		fromDate = "",
		toDate = "",
		status = "",
		branchId = 1,
		currentBranch = 1,
		sortField = "",
		sortOrder = "asc",
	} = {}) => {
		isLoading.value = true;
		try {
			const response = await api.get("/supplier_returns", {
				params: {
					searchTerm,
					page,
					perPage,
					from_date: fromDate,
					to_date: toDate,
					status,
					[`filter[branch_id]`]: branchId,
					current_branch: currentBranch,
					sortField,
					sortOrder,
				},
			});

			totalReturns.value = response.data.total || 0;
			totalPages.value = response.data.last_page || 0;

			const r = (response.data.data || []).map((item: any) => ({
				...item,
				supplierName: item.invoice?.purchase_order?.supplier?.name,
				supplierId: item.invoice?.purchase_order?.supplier?.id,
				invoiceNo: item.invoice.doc_no,
				total: item.total_amount,
				date: item.return_date,
				adminName: "unavailable",
				// contactName: item.contact_name,
				// status: statusMap[item.status] || "Unknown",
			}));

			returns.value = r;
			return r;
		} catch (err: any) {
			console.error("Error fetching returns:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
		} finally {
			isLoading.value = false;
		}
	};
	//data returned from this endpoint does not have complete data
	const fetchReturn = async ({ id }: { id: number | string }) => {
		try {
			const response = await api.get(`/supplier_returns/${id}`);
			const returnData = response.data.return;
			return {
				...returnData,
				supplierName:
					returnData.invoice?.purchase_order?.supplier?.name,
				orderNo: returnData.invoice?.doc_no,
				returnDate: returnData.return_date,
				supplierId: returnData.invoice?.purchase_order?.supplier_id,
				grnId: returnData.invoice_id,
				items: returnData.items.map((item: any) => ({
					name: item.invoice_item?.product?.name || "Unavailable",
					batch_no: item.invoice_item?.batch_no || "N/A",
					quantity_supplied: item.invoice_item?.quantity || 0,
					quantity_to_return: item.quantity,
					price: item.invoice_item?.unit_price || 0,
					discount: item.invoice_item?.discount || 0,
					total_amount: item.invoice_item?.total_price || 0,
				})),
			};
		} catch (error) {
			console.error("Error fetching supplier return:", error);
			throw error;
		}
	};

	const deleteReturn = async ({ id = null, currentBranch = 1 } = {}) => {
		isLoading.value = true;
		try {
			await api.delete("/supplier_returns", {
				params: {
					id,
					current_branch: currentBranch,
				},
			});
		} catch (err: any) {
			console.error("Error deleting return:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
		} finally {
			isLoading.value = false;
		}
	};

	const fetchAllReturns = async (currentBranch = 1) => {
		isLoading.value = true;
		try {
			const response = await api.get("/supplier_returns", {
				params: {
					fields: "id,return_code",
					current_branch: currentBranch,
				},
			});
			returns.value = response.data || [];
			return returns.value;
		} catch (err: any) {
			console.error("Error fetching all returns:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
			return [];
		} finally {
			isLoading.value = false;
		}
	};

	return {
		returns,
		isLoading,
		error,
		totalReturns,
		totalPages,
		fetchReturns,
		fetchReturn,
		deleteReturn,
		fetchAllReturns,
	};
};
