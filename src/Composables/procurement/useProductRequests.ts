import { ref } from "vue";
import api from "@/api";
// import { productRequeststatusMap } from "@/types";
import { formatDateForInput } from "@/helpers/formatDateForInput";

interface AssignedPerson {
	name: string;
	image: string | null;
}

interface TableRow {
	id: number;
	orderNo: string;
	supplierName: string;
	type: string;
	date: string;
	totalAmount: number;
	assigned: AssignedPerson;
	action?: string;
}

export const useproductRequests = () => {
	const productRequests = ref<TableRow[]>([]);
	const isLoading = ref(false);
	const totalPages = ref(1);
	const error = ref<string | null>(null);

	const fetchProductRequests = async ({
		page = 1,
		searchTerm = "",
		fromDate = "",
		toDate = "",
		branchId = 1,
		currentBranch = 1,
	} = {}) => {
		isLoading.value = true;
		try {
			const response = await api.get("/product_requests", {
				params: {
					searchTerm,
					page,
					perPage: 10,
					from_date: fromDate,
					to_date: toDate,
					[`filter[branch_id]`]: branchId,
					current_branch: currentBranch,
				},
			});

			// Transform the fetched data to match TableRow
			productRequests.value = (response.data.data || []).map(
				(item: any) => ({
					id: item.id,
					itemRequest: item.description,
					date: item.created_at,
					requesterName: item.user?.name || "Unavailable",
					...item,
				})
			);

			totalPages.value = response.data.last_page;
		} catch (err: any) {
			console.error("Error fetching product requests:", err);
			error.value = err.message || "Failed to fetch product requests.";
		} finally {
			isLoading.value = false;
		}
	};

	const viewRequest = (orderNo) => {
		// Implement edit logic here
		console.log(`Editing order ${orderNo}`);
	};

	const notifyRequester = async (orderNo) => {
		const response = await api.post(
			`/purchase_orders/${orderNo}/assign?current_branch=1`,
			{}
		);
		console.log("Assign order API response:", response.data);
		await fetchproductRequests();
	};

	const deleteRequest = async (orderNo) => {
		const response = await api.delete(
			`/purchase_orders/${orderNo}?current_branch=1`
		);
		console.log("delete order API response:", response.data);
	};

	const fetchPurchaseOrder = async (id) => {
		const response = await api.get(`/purchase_orders/${id}`, {
			params: { current_branch: 1 },
		});
		const item = response.data.purchaseOrder;
		console.log("item");
		console.log(item);
		return {
			id: item.id || "",
			orderNo: item.order_no || "",
			supplierName: item.supplier_name || "",
			supplierId: item.supplier_id || "",
			type: item.type || "",
			deliveryDate: formatDateForInput(item.delivery_date) || "",
			date: formatDateForInput(item.purchase_date) || "",
			discount: item.discount as number,
			totalAmount: Number(item.total_amount || 0),
			assigned: {
				name: item.assigned?.name || "Unassigned",
				image: item.assigned?.image || null,
			},
			status: productRequeststatusMap[item.status],
			items: item.items,
			// ...item,
		};
	};

	const approvePurchaseOrder = async (id: number) => {
		await api.post(`/purchase_orders/${id}/approve`, null, {
			params: { current_branch: 1 },
		});
	};

	return {
		productRequests,
		isLoading,
		totalPages,
		fetchProductRequests,
		error,
		notifyRequester,
		deleteRequest,
		viewRequest,
		fetchPurchaseOrder,
		approvePurchaseOrder,
	};
};
