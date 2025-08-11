<template>
  <div
    class="bg-white border border-[#091E4224] rounded-xl shadow-sm overflow-x-auto mx-4"
  >
    <DownloadSuccess
      :text="'Download Purchase Order Successful'"
      :visibility="downloadPO"
    />
    <DownloadSuccess :text="'Download GRN Successful'" :visibility="download" />

    <table class="w-full">
      <!-- Table Head -->
      <thead class="bg-[#F7F8F9]">
        <tr
          class="text-left border-b border-[#091E4224] text-gray-500 font-thin text-xs"
        >
          <th
            v-for="header in headers"
            :key="header.value"
            class="py-2 px-4 cursor-pointer"
            @click="header.sortable ? updateSort(header.value) : null"
          >
            <span class="flex items-center space-x-1">
              <Tooltip :text="header.label">
                <span class="line-clamp-2">
                  {{ header.label }}
                </span>
              </Tooltip>
              <UpDownIcon v-if="header.sortable" class="inline w-[12px] ml-1" />
            </span>
          </th>
        </tr>
      </thead>

      <!-- Table Body -->
      <tbody>
        <tr
          v-for="(row, index) in data"
          :key="index"
          class="border-b last:border-0 text-xs font-medium text-[#44546F]"
        >
          <td v-for="header in headers" :key="header.value" class="py-4 px-4">
            <!-- Assigned Column -->
            <slot
              :name="header.value"
              :row="row"
              v-if="header.value === 'assigned'"
            >
              <p v-if="row.assigned?.name === 'Unassigned'">
                <span class="px-2 py-1 rounded-md medium-text text-bg-danger">
                  {{ row.assigned?.name }}
                </span>
              </p>
              <div v-else class="flex items-center gap-1">
                <img
                  v-if="row.assigned?.image"
                  class="w-6 h-6 rounded-full"
                  :src="row.assigned?.image"
                  :alt="row.assigned?.name"
                />
                <span>{{ row.assigned?.name }}</span>
              </div>
            </slot>

            <!-- Action Column -->
            <slot
              :name="header.value"
              :row="row"
              v-else-if="header.value === 'action'"
            >
              <div class="relative">
                <LucideEllipsisVertical
                  class="cursor-pointer text-gray-500 h-5 w-5 hover:text-gray-800"
                  @click.stop="toggleDropdown(row.orderNo)"
                />
                <div
                  v-if="openDropdownRowId === row.orderNo"
                  class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 dropdown-menu"
                >
                  <ul class="text-sm text-gray-700 divide-y divide-gray-200">
                    <li
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
                      @click="viewOrder(row.id)"
                    >
                      <LucideEye class="w-4 h-4" />
                      View Purchase Order
                    </li>
                    <li
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
                      @click="viewGrn(row.id)"
                    >
                      <LucideEye class="w-4 h-4" />
                      View GRN
                    </li>
                    <!-- <li
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
                      @click="handleEditOrder(row.id)"
                    >
                      <img src="/redesign/edit.svg" alt="" class="h-4 w-4" />

                      Edit
                    </li> -->
                    <!-- <li
                      v-if="row.assigned == 'Unassigned'"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
                      @click="assignOrder(row.id)"
                    >
                      <img src="/redesign/assign.svg" alt="" class="h-4 w-4" />
                      Assign to Me
                    </li> -->
                    <li
                      v-if="row.assigned == 'Unassigned'"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
                      @click="handleOrderLog(row)"
                    >
                      <!-- <LucideUserPlus class="w-4 h-4" /> -->
                      <img src="/redesign/log.svg" alt="" class="h-4 w-4" />
                      Activity Log
                    </li>
                    <!-- <li
                      v-if="row.assigned == 'Unassigned'"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
                      @click="viewOrder(row.id)"
                    >
                      <img src="/redesign/approve.svg" alt="" class="h-4 w-4" />
                      Approve
                    </li> -->
                    <li
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
                      @click="handleDownloadPO"
                    >
                      <LucideCloudDownload class="w-4 h-4 text-text-default" />
                      Download Purchase Order
                    </li>
                    <li
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
                      @click="handleDownload"
                    >
                      <LucideCloudDownload class="w-4 h-4 text-text-default" />
                      Download GRN
                    </li>
                    <!-- <li
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
                      @click="handleDelete(row)"
                    >
                      <img src="/redesign/trash.svg" alt="" class="h-4 w-4" />

                      Delete
                    </li> -->
                  </ul>
                </div>
              </div>
            </slot>

            <!-- Status Column -->
            <slot
              :name="header.value"
              :row="row"
              v-else-if="header.value === 'status'"
            >
              <Tooltip :text="row.status">
                <span
                  class="px-2 py-1 rounded-md medium-text line-clamp-2"
                  :class="{
                    'bg-yellow-100 text-yellow-800': row.status === 'Pending',
                    'bg-green-100 text-green-800': row.status === 'Completed',
                  }"
                >
                  {{ row.status }}
                </span>
              </Tooltip>
            </slot>

            <!-- Default Cell -->
            <slot v-else :name="header.value" :row="row">
              <Tooltip :text="String(row[header.value])">
                <span class="line-clamp-2">
                  {{ row[header.value] }}
                </span>
              </Tooltip>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <OrderDeleteModal
    :isOpen="isDeleteOpen"
    :supplierName="'Supplier X'"
    @close="
      isDeleteOpen = false;
      selectedOrder = null;
    "
    @confirm="deleteOrder()"
  />

  <OrderLog
    v-model="hasSelectedOrder"
    @close="selectedOrder = null"
    :selectedOrder="selectedOrder"
  />
</template>

  <script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from "vue";
import { usePurchaseOrders } from "@/Composables/procurement/usePurchaseOrders";
import {
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  LucideEllipsisVertical,
  LucideEdit,
  LucideUserPlus,
  LucideTrash,
  LucideCloudDownload,
  LucideEye,
  LucideCheckCircle,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import DownloadSuccess from "@/Components/procurement/ui/DownloadSuccess.vue";
import { PurchaseOrder } from "@/types";
import OrderDeleteModal from "@/Components/procurement/purchase/DeleteModal.vue";
import OrderLog from "@/Components/procurement/purchase/OrderLog.vue";
import Tooltip from "@/Components/procurement/ui/Tooltip.vue";
import UpDownIcon from "@/Components/procurement/icons/UpDownIcon.vue";

const router = useRouter();

interface TableHeader {
  label: string;
  value: string;
  sortable?: boolean;
}

const emit = defineEmits(["orderLog"]);

const { deleteOrder: dO } = usePurchaseOrders();
const hasSelectedOrder = computed(
  () => !!selectedOrder.value && !isDeleteOpen.value
);

interface TableRow {
  [key: string]: any;
}

const props = defineProps<{
  headers: TableHeader[];
  data: TableRow[];
}>();

const selectedOrder = ref(null);
const isAscending = ref(true);
const sortKey = ref<string | undefined>(undefined);

const sortedData = computed(() => {
  if (!sortKey.value) return props.data;

  return [...props.data].sort((a, b) => {
    const key = sortKey.value as string;
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return isAscending.value ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return isAscending.value
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });
});

const updateSort = (key: string) => {
  if (sortKey.value === key) {
    isAscending.value = !isAscending.value;
  } else {
    sortKey.value = key;
    isAscending.value = true;
  }
};

const openDropdownRowId = ref<string | null>(null);

const toggleDropdown = (orderNo: string) => {
  openDropdownRowId.value =
    openDropdownRowId.value === orderNo ? null : orderNo;
};

// Document click listener to close dropdown on outside click
const handleDocumentClick = (e: MouseEvent) => {
  const dropdowns = document.querySelectorAll(".dropdown-menu");
  let clickedInsideDropdown = false;

  dropdowns.forEach((dropdown) => {
    if (dropdown.contains(e.target as Node)) {
      clickedInsideDropdown = true;
    }
  });

  if (!clickedInsideDropdown) {
    openDropdownRowId.value = null;
  }
};

document.addEventListener("click", handleDocumentClick);

onUnmounted(() => {
  document.removeEventListener("click", handleDocumentClick);
});

function viewOrder(id) {
  console.log(`Viewing order ${id}`);
  router.push({
    name: "order-details",
    params: {
      id,
    },
  });
}
function viewGrn(id) {
  console.log(`Viewing grn ${id}`);
  router.push({
    name: "grn-details",
    params: {
      id,
    },
  });
}
function handleEditOrder(id) {
  // Implement view logic here
  console.log(`Editing order ${id}`);
  router.push({
    name: "purchase",
    query: {
      create: "true",
      id,
    },
  });
}
function assignOrder(id) {
  // Implement view logic here
  console.log(`Assigning order ${id}`);
  router.push({
    name: "order-details",
    params: {
      id,
    },
    query: {
      assign: "true",
      //   id,
    },
  });
}

const download = ref(false);
const downloadPO = ref(false);

const handleDownload = () => {
  openDropdownRowId.value = null;
  download.value = true;
  setTimeout(() => {
    download.value = false;
  }, 3000);
};
const handleDownloadPO = () => {
  openDropdownRowId.value = null;
  downloadPO.value = true;
  setTimeout(() => {
    download.value = false;
  }, 3000);
};
const isDeleteOpen = ref(false);

const handleDelete = (order) => {
  selectedOrder.value = order;
  openDropdownRowId.value = null;
  isDeleteOpen.value = true;
};
const deleteOrder = async () => {
  openDropdownRowId.value = null;
  isDeleteOpen.value = false;
  try {
    await dO(selectedOrder.value.id);
    selectedOrder.value = null;
  } catch (error) {
    console.error(error);
  }
};

const handleOrderLog = (order) => {
  selectedOrder.value = order;
  emit("orderLog", order);
  console.log(order);
};
</script>

