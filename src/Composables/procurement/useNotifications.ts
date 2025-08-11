import type { Branch } from "@/types";
import { reactive, ref } from "vue";
import api from "@/api";

const notifications = ref<any[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const fetchBranches = async (
	page = 1,
	perPage = 20
): Promise<[] | Branch[]> => {
	isLoading.value = true;
	try {
		const response = await api.get("/branches", {
			params: {
				type: "all^",
				current_branch: 1,
				page,
				per_page: perPage,
			},
		});

		return response.data.data.map(
			(branch: any): Branch => ({
				id: branch.id,
				name: branch.name,
				address: branch.address,
				has_barcode: !!branch.has_barcode,
				created_at: branch.created_at,
				updated_at: branch.updated_at,
				use_order_fulfilment: !!branch.use_order_fulfilment,
			})
		);
		// if (!!branches.value) {
		// 	branches.value.push({
		// 		id: 1,
		// 		name: "LAGOS",
		// 		address: null,
		// 		has_barcode: 1,
		// 		created_at: "2024-02-26T14:04:30.000000Z",
		// 		updated_at: "2024-05-27T07:07:54.000000Z",
		// 		use_order_fulfilment: 1,
		// 	});
		// }
	} catch (err: any) {
		console.error("Error fetching branches:", err);
		error.value =
			err.response?.data?.error || err.message || "Unknown error";
	} finally {
		isLoading.value = false;
	}
};
export const useNotifications = () => {
	const fetchNotifications = async (
		fromDate = "",
		toDate = "",
		branch = 1,
		type = "orders"
	) => {
		isLoading.value = true;
		try {
			const response = await api.get("/notifications", {
				params: {
					from_date: fromDate,
					to_date: toDate,
					branch,
					type,
					current_branch: 1,
				},
			});
			const data = response.data.data;
			if (Array.isArray(data)) {
				notifications.value = data.map((item: any) => ({
					...item,
					supplierName: item.name,
					contactName: item.contact_name,
				}));
			} else {
				notifications.value = [];
			}
			return notifications.value;
		} catch (err: any) {
			error.value =
				err.response?.data?.error ||
				err.message ||
				"Unknown error occurred";
			notifications.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const startPolling = () => {
		setInterval(fetchNotifications, 60000); // Poll every 60 seconds
	};

	return {
		notifications,
		fetchNotifications,
		isLoading,
		error,
		startPolling,
	};
};
