 <template>
  <main>
    <div class="flex justify-between items-center">
      <Search
        v-model:modelValue="search"
        v-model:isAscending="isAscending"
        v-model:selectedStatus="selectedStatus"
      />

      <button
        @click="createPurchaseOrder"
        class="bg-blue-600 text-white flex !items-center justify-center gap-2 text-xs font-semibold px-4 py-1 rounded hover:bg-blue-700"
      >
        <span class="text-lg mb-[2px]">+</span>
        <span>Create Purchase Order</span>
      </button>
    </div>

    <div class="mt-6">
      <PurchaseOrderTable :headers="headers" :data="paginatedItems">
        <template #assigned="{ row }">
          <div class="flex items-center space-x-2">
            <img
              v-if="row.assigned.image"
              :src="row.assigned.image || defaultAvatar"
              alt="User Avatar"
              class="w-6 h-6 rounded-full"
            />
            <span
              :class="
                row.assigned.name === 'Unassigned'
                  ? 'text-red-500'
                  : 'text-gray-700'
              "
            >
              {{ row.assigned.name }}
            </span>
          </div>
        </template>
        <template #totalAmount="{ row }">
          {{ formatCurrency(Number(row.totalAmount)) }}
        </template>
        <template #action>
          <LucideEllipsisVertical
            class="cursor-pointer text-gray-500 hover:text-gray-800 ml-2"
          />
        </template>
      </PurchaseOrderTable>
    </div>

    <CustomPagination v-model:currentPage="page" :totalPages="totalPages" />
  </main>
</template>

<script setup lang="ts">
import defaultAvatar from "@/assets/images/avatarImage.png";
import femiAvater from "@/assets/images/femiImg.png";
import joshAvater from "@/assets/images/joshImg.png";
import janeAvater from "@/assets/images/janeImg.png";
import { ref, computed } from "vue";
import { useModal } from "@/Composables/procurement/useModal";
import { usePagination } from "@/Composables/procurement/usePagination";
import Search from "@/Components/procurement/Search.vue";
import { LucideEllipsisVertical } from "lucide-vue-next";
import PurchaseOrderTable from "@/Components/purchase/orderTable.vue";
import CustomPagination from "@/Components/customPagination.vue";
import CreatePurchaseOrder from "@/Components/purchase/createPurchaseOrder.vue";
import { useRouter } from "vue-router";

const { showModal, openModal, closeModal } = useModal();
const search = ref("");
const isAscending = ref(false);
const selectedStatus = ref("");
const router = useRouter();
const createPurchaseOrder = () => {
  router.push({
    name: "purchase",
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

const tableData: TableRow[] = [
  {
    orderNo: "RHPO-1651244214",
    supplierName: "Fidson Healthcare",
    type: "Trade",
    date: "5/21/2024",
    totalAmount: 2055043,
    assigned: { name: "Unassigned", image: null },
  },
  {
    orderNo: "RHPO-1651244214",
    supplierName: "EVANS THERAPEUTICS LTD",
    type: "Trade",
    date: "5/21/2024",
    totalAmount: 2055043,
    assigned: { name: "Femi Babalola", image: defaultAvatar },
  },
  {
    orderNo: "RHPO-1651244214",
    supplierName: "EVANS THERAPEUTICS LTD",
    type: "Trade",
    date: "5/21/2024",
    totalAmount: 2055043,
    assigned: { name: "Esther Joel", image: defaultAvatar },
  },
  {
    orderNo: "RHPO-1651244214",
    supplierName: "Fidson Healthcare",
    type: "Trade",
    date: "5/21/2024",
    totalAmount: 2055043,
    assigned: { name: "Esther Joel", image: defaultAvatar },
  },
  {
    orderNo: "RHPO-1651244214",
    supplierName: "Emzor Pharmaceuticals",
    type: "Trade",
    date: "5/21/2024",
    totalAmount: 2055043,
    assigned: { name: "Esther Joel", image: defaultAvatar },
  },
  {
    orderNo: "RHPO-1651244214",
    supplierName: "Fidson Healthcare",
    type: "Trade",
    date: "5/21/2024",
    totalAmount: 2055043,
    assigned: { name: "Femi Babalola", image: femiAvater },
  },
  {
    orderNo: "RHPO-1651244214",
    supplierName: "Emzor Pharmaceuticals",
    type: "Trade",
    date: "5/21/2024",
    totalAmount: 2055043,
    assigned: { name: "Femi Babalola", image: femiAvater },
  },
  {
    orderNo: "RHPO-1651244214",
    supplierName: "Fidson Healthcare",
    type: "Trade",
    date: "5/21/2024",
    totalAmount: 2055043,
    assigned: { name: "Sarah Badmus", image: janeAvater },
  },
  {
    orderNo: "RHPO-1651244214",
    supplierName: "Emzor Pharmaceuticals",
    type: "Trade",
    date: "5/21/2024",
    totalAmount: 2055043,
    assigned: { name: "Sarah Badmus", image: janeAvater },
  },
  {
    orderNo: "RHPO-1651244214",
    supplierName: "Fidson Healthcare",
    type: "Trade",
    date: "5/21/2024",
    totalAmount: 2055043,
    assigned: { name: "Josh Michael", image: joshAvater },
  },
];

const filteredData = computed(() => {
  if (!search.value) return tableData;
  return tableData.filter((row) =>
    row.supplierName.toLowerCase().includes(search.value.toLowerCase())
  );
});

const formatCurrency = (amount: number | string): string => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return `₦${numericAmount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const { page, paginatedItems, totalPages } = usePagination(filteredData, 10);
</script>
