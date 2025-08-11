<template>
  <main>
    <div class="flex justify-between items-center">
      <Search v-model:modelValue="search" />
    </div>

    <StateLoadingState v-if="fetchSupplierStatus === 'loading'" />
    <template v-else>
      <div class="mt-6">
        <div class="hidden lg:block -mx-4">
          <GrnTable :headers="headers" :data="purchaseOrders" />
        </div>

        <!-- Mobile Table (horizontal scroll) -->
        <div class="block lg:hidden">
          <div class="overflow-x-auto -mx-4">
            <GrnTable :headers="headers" :data="purchaseOrders" />
          </div>
        </div>
      </div>

      <CustomPagination v-model:currentPage="page" :totalPages="totalPages" />
    </template>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useModal } from "@/Composables/procurement/useModal";
import Search from "@/Components/procurement/Search.vue";
import { LucideEllipsisVertical } from "lucide-vue-next";
import PurchaseOrderTable from "@/Components/purchase/orderTable.vue";
import CustomPagination from "@/Components/customPagination.vue";
import CreatePurchaseOrder from "@/Components/purchase/createPurchaseOrder.vue";
import { useRouter } from "vue-router";
import { useSuppliers } from "@/Composables/useSuppliers";
import { useRoute } from "vue-router";
import GrnTable from "@/Components/purchase/grnTable.vue";
import StateLoadingState from "@/Components/state/LoadingState.vue";

const route = useRoute();
const { fetchSupplierGRNs, totalPages } = useSuppliers();

const fetchSupplierStatus = ref<"pending" | "loading" | "success" | "error">(
  "pending"
);
const purchaseOrders = ref<TableRow[]>([]);
const supplierId = route.params.id;
const search = ref("");
const page = ref(1);

watch(
  [page, search],
  async () => {
    try {
      fetchSupplierStatus.value = "loading";
      purchaseOrders.value = await fetchSupplierGRNs({
        id: supplierId as string,
        page: page.value,
        searchTerm: search.value,
      });
      fetchSupplierStatus.value = "success";
    } catch (error) {
      console.error("Error fetching supplier GRNs:", error);
      fetchSupplierStatus.value = "error";
    }
  },
  { immediate: true, deep: true }
);

const { showModal, openModal, closeModal } = useModal();
const router = useRouter();
const createPurchaseOrder = () => {
  router.push({
    name: "purchase",
    query: {
      create: "true",
      supplierId: supplierId,
    },
  });
};

interface TableHeader {
  label: string;
  value: keyof TableRow;
  sortable?: boolean;
}

interface AssignedPerson {
  name: string;
  image: string | null;
}

interface TableRow {
  orderNo: string;
  supplierName: string;
  type: string;
  date: string;
  totalAmount: number;
  assigned: AssignedPerson;
  action?: string;
}

const headers: TableHeader[] = [
  { label: "Order No.", value: "orderNo" },
  { label: "Supplier Name", value: "supplierName", sortable: true },
  { label: "Type", value: "type" },
  { label: "Date", value: "date", sortable: true },
  { label: "Total Amount", value: "totalAmount", sortable: true },
  { label: "Assigned", value: "assigned" },
  { label: "Action", value: "action" },
];

const formatCurrency = (amount: number | string): string => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return `₦${numericAmount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
</script>

<script lang="ts">
export default {
  name: "ApprovedPo",
};
</script>
