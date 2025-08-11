import { ref } from "vue";
import api from "@/api";

export const usePayments = () => {
	// const payments = ref([
	// 	// {
	// 	//   id: 87,
	// 	//   paymentName: "Fidson Healthcare",
	// 	//   contactName: "Hannah Pedro",
	// 	//   phone: "0814 567 8901",
	// 	//   category: "Local",
	// 	//   status: "Active",
	// 	//   orderNo: "RHPO-1651244214",
	// 	//   docNo: "RHSP00024",
	// 	// },
	// 	// {
	// 	//   id: 54,
	// 	//   paymentName: "Emzor Pharmaceuticals",
	// 	//   contactName: "Adese Samson",
	// 	//   phone: "0812 345 6789",
	// 	//   category: "Local",
	// 	//   status: "Active",
	// 	//   orderNo: "RHPO-1651244215",
	// 	//   docNo: "RHSP00025",
	// 	// },
	// 	// {
	// 	//   id: 30,
	// 	//   paymentName: "Emzor Pharmaceuticals",
	// 	//   contactName: "Yusuf Ahmed",
	// 	//   phone: "0901 123 4567",
	// 	//   category: "Overseas",
	// 	//   status: "Inactive",
	// 	//   orderNo: "RHPO-1651244216",
	// 	//   docNo: "RHSP00026",
	// 	// },
	// 	// {
	// 	//   id: 40,
	// 	//   paymentName: "Emzor Pharmaceuticals",
	// 	//   contactName: "Yusuf Ahmed",
	// 	//   phone: "0901 123 4567",
	// 	//   category: "Overseas",
	// 	//   status: "Inactive",
	// 	//   orderNo: "RHPO-1651244217",
	// 	//   docNo: "RHSP00027",
	// 	// },
	// 	// {
	// 	//   id: 12,
	// 	//   paymentName: "GSK Pharma",
	// 	//   contactName: "Mary Johnson",
	// 	//   phone: "0803 456 7890",
	// 	//   category: "Local",
	// 	//   status: "Active",
	// 	//   orderNo: "RHPO-1651244218",
	// 	//   docNo: "RHSP00028",
	// 	// },
	// 	// {
	// 	//   id: 76,
	// 	//   paymentName: "Pfizer Inc.",
	// 	//   contactName: "David Olamide",
	// 	//   phone: "0701 234 5678",
	// 	//   category: "Overseas",
	// 	//   status: "Inactive",
	// 	//   orderNo: "RHPO-1651244219",
	// 	//   docNo: "RHSP00029",
	// 	// },
	// 	// {
	// 	//   id: 22,
	// 	//   paymentName: "Swiss Pharma",
	// 	//   contactName: "Jane Doe",
	// 	//   phone: "0802 345 6789",
	// 	//   category: "Local",
	// 	//   status: "Active",
	// 	//   orderNo: "RHPO-1651244220",
	// 	//   docNo: "RHSP00030",
	// 	// },
	// 	// {
	// 	//   id: 45,
	// 	//   paymentName: "Sanofi",
	// 	//   contactName: "Adekunle Adebayo",
	// 	//   phone: "0903 567 8901",
	// 	//   category: "Overseas",
	// 	//   status: "Inactive",
	// 	//   orderNo: "RHPO-1651244221",
	// 	//   docNo: "RHSP00031",
	// 	// },
	// 	// {
	// 	//   id: 18,
	// 	//   paymentName: "May & Baker",
	// 	//   contactName: "Ifeoma Okonkwo",
	// 	//   phone: "0810 678 9012",
	// 	//   category: "Local",
	// 	//   status: "Active",
	// 	//   orderNo: "RHPO-1651244222",
	// 	//   docNo: "RHSP00032",
	// 	// },
	// 	// {
	// 	//   id: 29,
	// 	//   paymentName: "Merck Group",
	// 	//   contactName: "Thomas Edet",
	// 	//   phone: "0805 234 6789",
	// 	//   category: "Overseas",
	// 	//   status: "Inactive",
	// 	//   orderNo: "RHPO-1651244223",
	// 	//   docNo: "RHSP00033",
	// 	// },
	// 	// {
	// 	//   id: 38,
	// 	//   paymentName: "Johnson & Johnson",
	// 	//   contactName: "Samuel Opata",
	// 	//   phone: "0702 678 1234",
	// 	//   category: "Local",
	// 	//   status: "Active",
	// 	//   orderNo: "RHPO-1651244224",
	// 	//   docNo: "RHSP00034",
	// 	// },
	// 	// {
	// 	//   id: 60,
	// 	//   paymentName: "Novartis",
	// 	//   contactName: "Tolu Fashola",
	// 	//   phone: "0904 567 2345",
	// 	//   category: "Overseas",
	// 	//   status: "Active",
	// 	//   orderNo: "RHPO-1651244225",
	// 	//   docNo: "RHSP00035",
	// 	// },
	// 	// {
	// 	//   id: 55,
	// 	//   paymentName: "Reckitt Benckiser",
	// 	//   contactName: "Amaka Ugo",
	// 	//   phone: "0816 345 6789",
	// 	//   category: "Local",
	// 	//   status: "Inactive",
	// 	//   orderNo: "RHPO-1651244226",
	// 	//   docNo: "RHSP00036",
	// 	// },
	// 	// {
	// 	//   id: 10,
	// 	//   paymentName: "Roche Pharma",
	// 	//   contactName: "James Ikede",
	// 	//   phone: "0807 890 1234",
	// 	//   category: "Overseas",
	// 	//   status: "Active",
	// 	//   orderNo: "RHPO-1651244227",
	// 	//   docNo: "RHSP00037",
	// 	// },
	// 	// {
	// 	//   id: 34,
	// 	//   paymentName: "Bayer AG",
	// 	//   contactName: "Olivia Daniels",
	// 	//   phone: "0812 345 6780",
	// 	//   category: "Local",
	// 	//   status: "Active",
	// 	//   orderNo: "RHPO-1651244228",
	// 	//   docNo: "RHSP00038",
	// 	// },
	// 	// {
	// 	//   id: 28,
	// 	//   paymentName: "AstraZeneca",
	// 	//   contactName: "Musa Ibrahim",
	// 	//   phone: "0809 567 8901",
	// 	//   category: "Overseas",
	// 	//   status: "Inactive",
	// 	//   orderNo: "RHPO-1651244229",
	// 	//   docNo: "RHSP00039",
	// 	// },
	// 	// {
	// 	//   id: 71,
	// 	//   paymentName: "GlaxoSmithKline",
	// 	//   contactName: "Esther Adepoju",
	// 	//   phone: "0705 123 4567",
	// 	//   category: "Local",
	// 	//   status: "Active",
	// 	//   orderNo: "RHPO-1651244230",
	// 	//   docNo: "RHSP00040",
	// 	// },
	// 	// {
	// 	//   id: 49,
	// 	//   paymentName: "Takeda Pharmaceuticals",
	// 	//   contactName: "Henry Osei",
	// 	//   phone: "0819 234 5678",
	// 	//   category: "Overseas",
	// 	//   status: "Inactive",
	// 	//   orderNo: "RHPO-1651244231",
	// 	//   docNo: "RHSP00041",
	// 	// },
	// 	// {
	// 	//   id: 15,
	// 	//   paymentName: "Cipla Ltd.",
	// 	//   contactName: "Adeola Olatunji",
	// 	//   phone: "0804 567 8902",
	// 	//   category: "Local",
	// 	//   status: "Active",
	// 	//   orderNo: "RHPO-1651244232",
	// 	//   docNo: "RHSP00042",
	// 	// },
	// 	// {
	// 	//   id: 63,
	// 	//   paymentName: "Eli Lilly",
	// 	//   contactName: "Nkechi Eze",
	// 	//   phone: "0908 678 1234",
	// 	//   category: "Overseas",
	// 	//   status: "Inactive",
	// 	//   orderNo: "RHPO-1651244233",
	// 	//   docNo: "RHSP00043",
	// 	// },
	// ]);
	const payments = ref([]);

	const isLoading = ref(false);
	const totalPages = ref(1);
	const error = ref<string | null>(null);

	const fetchPayments = async ({
		page = 1,
		searchTerm = "",
		fromDate = "",
		toDate = "",
		branchId = 1,
		currentBranch = 1,
	} = {}) => {
		isLoading.value = true;
		try {
			const response = await api.get("/supplier_payments", {
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
			const p = response.data.data.map((item: any) => ({
				id: item.id,
				reference: item.reference || "",
				docNo: item.doc_no || "",
				supplierName: item.supplier?.name,
				amount: item.amount,
				date: item.payment_date,
			}));
			payments.value = p;

			totalPages.value = response.data.last_page;

			return p;
		} catch (err: any) {
			console.error("Error fetching payments:", err);
			error.value = err.message || "Failed to fetch payments";
		} finally {
			isLoading.value = false;
		}
	};

	const deletePayment = async ({ id = null, currentBranch = 1 } = {}) => {
		isLoading.value = true;
		try {
			const response = await api.delete("/payments/", {
				params: {
					id: id,
					current_branch: currentBranch,
				},
			});
		} catch (err: any) {
			console.error("Error deleting payment:", err);
			error.value =
				err.response?.data?.error || err.message || "Unknown error";
		} finally {
			isLoading.value = false;
		}
	};
	const statuses = {
		Active: "bg-green-100 text-green-600",
		Inactive: "bg-red-100 text-red-600",
	};

	const search = ref("");
	const selectedStatus = ref("");

	return {
		payments,
		statuses,
		search,
		selectedStatus,
		isLoading,
		totalPages,
		fetchPayments,
		deletePayment,
		error,
	};
};
