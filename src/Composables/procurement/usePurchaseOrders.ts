import { ref } from "vue";
import api from "@/api";
import { purchaseOrderStatusMap } from "@/types";
import { formatDateForInput } from "@/helpers/formatDateForInput";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import createdImg from "@/assets/images/createdImg.svg";
import confirmedImg from "@/assets/images/confirmedImg.svg";
import rejectedImg from "@/assets/images/rejectedImg.svg";

const activityGroups = ref([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const statusIconMap: Record<string, string> = {
	created: createdImg,
	confirmed: confirmedImg,
	rejected: rejectedImg,
	updated: createdImg,
	deleted: rejectedImg,
};

const extractStatus = (action: string): string => {
	const keywords = ["created", "confirmed", "rejected", "updated", "deleted"];
	const keyword = keywords.find((word) =>
		action.toLowerCase().includes(word)
	);
	return keyword || "created";
};

const getDateLabel = (isoDate: string) => {
	const date = parseISO(isoDate);
	if (isToday(date)) return "Today";
	if (isYesterday(date)) return "Yesterday";
	return format(date, "do MMMM yyyy");
};

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

export const usePurchaseOrders = () => {
	const purchaseOrders = ref<TableRow[]>([]);
	const isLoading = ref(false);
	const totalPages = ref(1);
	const error = ref<string | null>(null);

	const fetchPurchaseOrders = async ({
		page = 1,
		searchTerm = "",
		fromDate = "",
		toDate = "",
		branchId = 1,
		currentBranch = 1,
	} = {}) => {
		isLoading.value = true;
		try {
			const response = await api.get("/purchase_orders/all", {
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
			const p = (response.data.data || []).map((item: any) => ({
				id: item.id || "",
				orderNo: item.order_no || "",
				supplierName: item.supplier_name || "",
				type: item.type || "",
				date: item.date || "",
				totalAmount: Number(item.total_amount || 0),
				assigned: {
					name: item.assigned?.name || "Unassigned",
					image: item.assigned?.image || null,
				},
			}));

			totalPages.value = response.data.last_page;
			purchaseOrders.value = p;
			return p;
		} catch (err: any) {
			console.error("Error fetching purchase orders:", err);
			error.value = err.message || "Failed to fetch purchase orders.";
		} finally {
			isLoading.value = false;
		}
	};

	const fetchActivityGroups = async (
		id,
		{
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
		} = {}
	) => {
		isLoading.value = true;

		try {
			const response = await api.get(`/purchase_orders/${id}/logs`, {
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

			const logs = response.data.data || [];

			// Transform logs into activity items
			const activities = logs.map((log: any) => {
				const status = extractStatus(log.action);
				const dateLabel = getDateLabel(log.created_at);
				return {
					dateLabel,
					activity: {
						title: log.action,
						user: log.user?.name || "Unknown User",
						status,
						time: format(parseISO(log.created_at), "p"),
						icon: statusIconMap[status] || createdImg,
					},
				};
			});

			// Group by date
			const grouped: Record<string, any> = {};

			activities.forEach(({ dateLabel, activity }) => {
				if (!grouped[dateLabel]) {
					grouped[dateLabel] = [];
				}
				grouped[dateLabel].push(activity);
			});

			// Convert to desired format
			const finalOutput = Object.entries(grouped).map(
				([date, activities]) => ({
					date,
					activities,
				})
			);

			// activityGroups.value = finalOutput;
			return finalOutput;
		} catch (err: any) {
			console.error("Error fetching activity logs:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
		} finally {
			isLoading.value = false;
		}
	};
	const fetchGRNs = async ({
		page = 1,
		searchTerm = "",
		fromDate = "",
		toDate = "",
		branchId = 1,
		currentBranch = 1,
		type = "",
	} = {}) => {
		isLoading.value = true;
		try {
			const response = await api.get("/invoices", {
				params: {
					searchTerm,
					page,
					perPage: 10,
					from_date: fromDate,
					to_date: toDate,
					[`filter[branch_id]`]: branchId,
					current_branch: currentBranch,
					type,
				},
			});

			// Transform the fetched data to match TableRow
			const p = (response.data.data || []).map((item: any) => ({
				id: item.id || "",
				orderNo: item.purchase_order?.order_no || "",
				docNo: item.doc_no || "",
				supplierName: item.purchase_order?.supplier?.name || "",
				type: item.purchase_order?.type || "",
				date: formatDateForInput(item.due_date) || "",
				totalAmount: Number(item.total || 0),
				assigned: {
					name: item.assigned_to || "Unassigned",
					image: item.assigned || null,
				},
			}));

			totalPages.value = response.data.last_page;
			purchaseOrders.value = p;
			return p;
		} catch (err: any) {
			console.error("Error fetching purchase orders:", err);
			error.value = err.message || "Failed to fetch purchase orders.";
		} finally {
			isLoading.value = false;
		}
	};
	const fetchAllGRNs = async ({
		page = 1,
		searchTerm = "",
		fromDate = "",
		toDate = "",
		branchId = 1,
		currentBranch = 1,
		type = "all",
	} = {}) => {
		isLoading.value = true;
		try {
			const response = await api.get("/invoices", {
				params: {
					searchTerm,
					page,
					perPage: 10,
					from_date: fromDate,
					to_date: toDate,
					[`filter[branch_id]`]: branchId,
					current_branch: currentBranch,
					type,
				},
			});

			// Transform the fetched data to match TableRow
			const p = (response.data || []).map((item: any) => ({
				id: item.id || "",
				orderNo: item.purchase_order?.order_no || "",
				docNo: item.doc_no || "",
				supplierName: item.purchase_order?.supplier?.name || "",
				type: item.purchase_order?.type || "",
				date: formatDateForInput(item.due_date) || "",
				totalAmount: Number(item.total || 0),
				assigned: {
					name: item.assigned_to || "Unassigned",
					image: item.assigned || null,
				},
			}));

			totalPages.value = response.data.last_page;
			// purchaseOrders.value = p;
			return p;
		} catch (err: any) {
			console.error("Error fetching purchase orders:", err);
			error.value = err.message || "Failed to fetch purchase orders.";
		} finally {
			isLoading.value = false;
		}
	};

	const deleteOrder = async ({ id = null, currentBranch = 1 } = {}) => {
		isLoading.value = true;
		try {
			const response = await api.delete("/purchase_orders/", {
				params: {
					id: id,
					current_branch: currentBranch,
				},
			});
			return response.data;
		} catch (err: any) {
			console.error("Error deleting suppliers:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
		} finally {
			isLoading.value = false;
		}
	};

	const editOrder = async (payload: any) => {
		try {
			const response = await api.put(
				`/purchase_orders/${payload.id}`,
				payload,
				{
					params: { current_branch: 1 },
				}
			);
			return response.data;
		} catch (err: any) {
			console.error("Error updating purchase order:", err);
			throw err;
		}
	};
	const createOrder = async (payload: any) => {
		try {
			const response = await api.post(`/purchase_orders`, payload, {
				params: { current_branch: 1 },
			});
			return response.data;
		} catch (err: any) {
			console.error("Error updating purchase order:", err);
			throw err;
		}
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
			status: purchaseOrderStatusMap[item.status],
			items: item.items,
			// ...item,
		};
	};

	const approvePurchaseOrder = async (id: number) => {
		try {
			await api.get(`/purchase-orders/${id}/approve`);
		} catch (err: any) {
			console.error("Error approving purchase order:", err);
			throw err;
		}
	};
	const assignOrder = async (id: number) => {
		try {
			await api.get(`/purchase-orders/${id}/assign`, {
				params: { current_branch: 1 },
			});
		} catch (err: any) {
			console.error("Error assigning purchase order:", err);
			throw err;
		}
	};
	const fetchAllProducts = async ({
		page = 1,
		searchTerm = "",
		fromDate = "",
		toDate = "",
		branchId = 1,
		currentBranch = 1,
		type = "",
	} = {}) => {
		isLoading.value = true;
		try {
			const response = await api.get("/invoices/all", {
				params: {
					searchTerm,
					page,
					perPage: 10,
					from_date: fromDate,
					to_date: toDate,
					[`filter[branch_id]`]: branchId,
					current_branch: currentBranch,
					type,
				},
			});

			// Transform the fetched data to match TableRow
			const p = (response.data.data || []).map((item: any) => ({
				id: item.id || "",
				orderNo: item.purchase_order?.order_no || "",
				docNo: item.doc_no || "",
				supplierName: item.purchase_order?.supplier?.name || "",
				type: item.purchase_order?.type || "",
				date: formatDateForInput(item.due_date) || "",
				totalAmount: Number(item.total || 0),
				assigned: {
					name: item.assigned_to || "Unassigned",
					image: item.assigned || null,
				},
			}));

			totalPages.value = response.data.last_page;
			// purchaseOrders.value = p;
			return p;
		} catch (err: any) {
			console.error("Error fetching purchase orders:", err);
			error.value = err.message || "Failed to fetch purchase orders.";
			throw err;
		} finally {
			isLoading.value = false;
		}
		// search_products_typeahead?q=ibu&fields=id,name,price_per_pack,unit_cost,min_reorder&current_branch=1
		// [{"id":4702,"name":"M & B LIXYPED COUGH SYRUP 100ML","price_per_pack":475,"unit_cost":"454.55","min_reorder":1,"is_saved_item":false,"shelves":["2DB006"],"has_notified":false,"out_of_stock":true,"expiry_date":"01\/06\/2027","hmo_pharm_selling_price":593.75,"hmo_pharm_buying_price":546.25,"price":475,"hmo_quantity_sold":0,"category":null,"manufacturer":null,"product_images":[{"id":82493,"path":null,"url":"https:\/\/cdn.remedial.health\/product_images\/0UJLT8VJWO6WOAYjQcPkZTJqfnd1sq9TCN9zr6Yg47020.webp","default":0,"product_id":4702,"created_at":"2024-08-22T08:16:11.000000Z","updated_at":"2024-08-22T08:16:11.000000Z"},{"id":82494,"path":null,"url":"https:\/\/cdn.remedial.health\/product_images\/qSwrtACEKWR8YHfGkJiHkn1uRPPu0v45fN2CLPe147021.webp","default":1,"product_id":4702,"created_at":"2024-08-22T08:16:11.000000Z","updated_at":"2024-08-22T08:16:11.000000Z"}]},{"id":5045,"name":"NIGHTINGALE TOWEL UNDERPADS X 5","price_per_pack":2447,"unit_cost":"2250.00","min_reorder":0,"is_saved_item":false,"shelves":["RC005"],"has_notified":false,"out_of_stock":true,"expiry_date":"01\/11\/2026","hmo_pharm_selling_price":3058.75,"hmo_pharm_buying_price":2814.05,"price":2447,"hmo_quantity_sold":0,"category":null,"manufacturer":null,"product_images":[{"id":85376,"path":null,"url":"https:\/\/cdn.remedial.health\/product_images\/wWGz7jtpqi2mNnRc8X2XcqzkwHHrcPI15wqsY6RB50451.webp","default":1,"product_id":5045,"created_at":"2024-08-26T12:22:27.000000Z","updated_at":"2024-08-26T12:22:27.000000Z"},{"id":85377,"path":null,"url":"https:\/\/cdn.remedial.health\/product_images\/uPh5s5DfUxkwXrbiuYvDcFQUf1USJkxHAHeHYa2G50450.webp","default":0,"product_id":5045,"created_at":"2024-08-26T12:22:27.000000Z","updated_at":"2024-08-26T12:22:27.000000Z"}]},{"id":5075,"name":"OLPADIN EYE DROP 5ML","price_per_pack":3908,"unit_cost":"3600.00","min_reorder":0,"is_saved_item":false,"shelves":["CB007"],"has_notified":false,"out_of_stock":true,"expiry_date":"01\/09\/2026","hmo_pharm_selling_price":4885,"hmo_pharm_buying_price":4494.2,"price":3908,"hmo_quantity_sold":0,"category":null,"manufacturer":null,"product_images":[{"id":85573,"path":null,"url":"https:\/\/cdn.remedial.health\/product_images\/9RaO6g4bmK1Al0k68qzi2Lh8hjod80zyQiiUe6K650751.webp","default":1,"product_id":5075,"created_at":"2024-08-26T15:26:59.000000Z","updated_at":"2024-08-26T15:26:59.000000Z"},{"id":85574,"path":null,"url":"https:\/\/cdn.remedial.health\/product_images\/GJ8qwO77RhJecdlQOk1G14We7E1EcERQZBzQVj8P50750.webp","default":0,"product_id":5075,"created_at":"2024-08-26T15:26:59.000000Z","updated_at":"2024-08-26T15:26:59.000000Z"}]},{"id":5502,"name":"DR BROWN'S MOTHER'S SEPT PAD 160G","price_per_pack":1086,"unit_cost":"1000.00","min_reorder":0,"is_saved_item":false,"shelves":["RC003"],"has_notified":false,"out_of_stock":true,"expiry_date":"01\/07\/2026","hmo_pharm_selling_price":1357.5,"hmo_pharm_buying_price":1248.9,"price":1086,"hmo_quantity_sold":0,"category":null,"manufacturer":null,"product_images":[{"id":83481,"path":null,"url":"https:\/\/cdn.remedial.health\/product_images\/UCoaTuTvXB6pw74R137xWrrwOkCryi9aTNK4TqZz55021.webp","default":1,"product_id":5502,"created_at":"2024-08-22T13:53:08.000000Z","updated_at":"2024-08-22T13:53:08.000000Z"}]},{"id":6156,"name":"SILVER CARE PLUS ALCOHOL PADS X 100","price_per_pack":1086,"unit_cost":"1000.00","min_reorder":0,"is_saved_item":false,"shelves":[],"has_notified":false,"out_of_stock":true,"expiry_date":null,"hmo_pharm_selling_price":1357.5,"hmo_pharm_buying_price":1248.9,"price":1086,"hmo_quantity_sold":0,"category":null,"manufacturer":null,"product_images":[{"id":98055,"path":null,"url":"https:\/\/cdn.remedial.health\/product_images\/3unDlUTI31nmIDD5sgIm47sRMAvZAo04BZVoN0rm61561.webp","default":1,"product_id":6156,"created_at":"2024-10-25T21:55:29.000000Z","updated_at":"2024-10-25T21:55:29.000000Z"}]},{"id":6816,"name":"PEDIFILL CHILDREN'S IBUPROFEN (STRAWBERRY) ORAL SUSPENSION  100ML","price_per_pack":402,"unit_cost":"374.00","min_reorder":0,"is_saved_item":false,"shelves":["KA003","AA005","GW004","HA015","HA015","GW004","GW004","GW004","KA001","KA002","Kc001","HA015","HA016"],"has_notified":false,"out_of_stock":true,"expiry_date":"01\/01\/2026","hmo_pharm_selling_price":502.5,"hmo_pharm_buying_price":462.3,"price":402,"hmo_quantity_sold":0,"category":null,"manufacturer":null,"product_images":[{"id":82687,"path":null,"url":"https:\/\/cdn.remedial.health\/product_images\/jBElrZCUV17Vr6Q8iGkZ2w2xOkRwuajBs3rxTFTk68161.webp","default":1,"product_id":6816,"created_at":"2024-08-22T08:52:55.000000Z","updated_at":"2024-08-22T08:52:55.000000Z"},{"id":82688,"path":null,"url":"https:\/\/cdn.remedial.health\/product_images\/JbS6oP6XGBo7mudZ2jLRT8Y75QwWrrpGVBzXXgXY68160.webp","default":0,"product_id":6816,"created_at":"2024-08-22T08:52:55.000000Z","updated_at":"2024-08-22T08:52:55.000000Z"}]}]
	};

	const searchProducts = async (query: string) => {
		if (query.length < 3) return [];
		try {
			const response = await api.get("/search_products_typeahead", {
				params: {
					q: query,
					fields: "id,name,price_per_pack,unit_cost",
					current_branch: 1,
				},
			});
			return response.data;
		} catch (error) {
			console.error("Error searching products:", error);
			return [];
		}
	};

	return {
		purchaseOrders,
		isLoading,
		totalPages,
		fetchPurchaseOrders,
		fetchAllGRNs,
		error,
		assignOrder,
		createOrder,
		deleteOrder,
		editOrder,
		fetchPurchaseOrder,
		approvePurchaseOrder,
		fetchGRNs,
		fetchActivityGroups,
		searchProducts,
	};
};
