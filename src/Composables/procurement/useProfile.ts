import { ref } from "vue";
import api from "@/api"; // Axios wrapper

const statusMap: Record<number, string> = {
	// 1: "Pending",
	1: "Active",
	2: "Inactive",
};

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

export const useUsers = () => {
	const users = ref<any[]>([]);
	const roles = ref<any[]>([]);
	const isLoading = ref(false);
	const error = ref<string | null>(null);
	const totalUsers = ref<number>(0);
	const totalPages = ref<number>(0);

	const fetchUsers = async ({
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
			const response = await api.get("/admins", {
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

			totalUsers.value = response.data.total || 0;
			totalPages.value = response.data.last_page || 0; // ✅ Use last_page for total pages
			const u = (response.data.data || []).map((item: any) => ({
				id: item.id,
				name: item.name,
				email: item.email || "email unavailale",
				role: item.roles?.[0]?.name || 0,
				// status: statusMap[item.status] || "Unknown",
				status: statusMap[1] || "Unknown",
				...item,
			}));
			users.value = u;
			return u;
		} catch (err: any) {
			console.error("Error fetching users:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
		} finally {
			isLoading.value = false;
		}
	};
	const fetchActivityGroups = async ({
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
			const response = await api.get("/logs", {
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
	const fetchAllRoles = async ({
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
		type = "all",
	} = {}) => {
		isLoading.value = true;
		try {
			const response = await api.get("/roles", {
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

			totalUsers.value = response.data.total || 0;
			totalPages.value = response.data.last_page || 0; // ✅ Use last_page for total pages
			const r = (response.data || []).map((item: any) => ({
				...item,
			}));
			roles.value = r;
			return r;
		} catch (err: any) {
			console.error("Error fetching users:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
		} finally {
			isLoading.value = false;
		}
	};
	const deleteUsers = async ({ id = null, currentBranch = 1 } = {}) => {
		isLoading.value = true;
		try {
			const response = await api.delete("/users/", {
				params: {
					id: id,
					current_branch: currentBranch,
				},
			});
		} catch (err: any) {
			console.error("Error deleting users:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
		} finally {
			isLoading.value = false;
		}
	};

	// const fetchAllUsers = async (currentBranch = 1) => {
	// 	isLoading.value = true;
	// 	try {
	// 		const response = await api.get("/admins", {
	// 			params: {
	// 				fields: "id,name",
	// 				current_branch: currentBranch,
	// 			},
	// 		});
	// 		users.value = response.data || [];
	// 		return users.value;
	// 	} catch (err: any) {
	// 		console.error("Error fetching users:", err);
	// 		error.value =
	// 			err.response?.data?.error || err.message || "Unknown error";
	// 		return [];
	// 	} finally {
	// 		isLoading.value = false;
	// 	}
	// };
	const fetchAllUsers = async (currentBranch = 1) => {
		isLoading.value = true;
		try {
			const response = await api.get("/admins", {
				params: {
					fields: "id,name",
					current_branch: currentBranch,
				},
			});
			users.value = response.data || [];
			return users.value;
		} catch (err: any) {
			console.error("Error fetching users:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
			return [];
		} finally {
			isLoading.value = false;
		}
	};
	const updateProfile = async (payload: any) => {
		isLoading.value = true;
		try {
			const response = await api.patch(`/users/${payload.id}`, payload);
			return response.data;
		} catch (err: any) {
			console.error("Error updating profile:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
			throw error.value;
		} finally {
			isLoading.value = false;
		}
	};
	const fetchProfile = async () => {
		isLoading.value = true;
		try {
			const response = await api.get(`/profile`);
			return response.data;
		} catch (err: any) {
			console.error("Error fetching profile:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
			throw error.value;
		} finally {
			isLoading.value = false;
		}
	};
	const updateSecurity = async ({
		currentBranch = 1,
		id = null,
		current_password = null,
		new_password = null,
		retype_password = null,
	} = {}) => {
		isLoading.value = true;
		try {
			const response = await api.patch(`/users/password/${id}`, {
				current_branch: currentBranch,
				current_password,
				new_password,
				retype_password,
			});
			// users.value = response.data || [];
			return response.data;
		} catch (err: any) {
			console.error("Error fetching users:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
			return err.response?.data?.error || err.message || "Unknown error";
		} finally {
			isLoading.value = false;
		}
	};

	return {
		users,
		isLoading,
		error,
		totalUsers,
		totalPages, // Expose this in your component
		fetchUsers,
		fetchActivityGroups,
		deleteUsers,
		fetchAllUsers,
		fetchAllRoles,
		updateProfile,
		updateSecurity,
	};
};
