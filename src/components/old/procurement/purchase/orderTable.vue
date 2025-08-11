<template>
  <div
    class="bg-white border border-[#091E4224] rounded-xl shadow-sm overflow-x-auto mx-4"
  >
    <DownloadSuccess
      :text="'Download Purchase Order Successful'"
      :visibility="download"
    />

    <table class="min-w-[800px] w-full table-auto">
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
            <span class="flex items-center justify-center space-x-1">
              {{ header.label }}
              <UpDownIcon
                v-if="header.sortable"
                :sortKey="sortKey"
                :isAscending="isAscending"
                :headerValue="header.value"
              />
            </span>
          </th>
        </tr>
      </thead>

      <!-- Table Body -->
      <tbody>
        <tr
          v-for="(row, index) in sortedData"
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
              <p v-if="row.assigned === 'Unassigned'">
                <Tooltip :text="row.assigned">
                  <span
                    class="px-2 py-1 rounded-md medium-text bg-yellow-100 text-yellow-800 line-clamp-2"
                  >
                    {{ row.assigned }}
                  </span>
                </Tooltip>
              </p>
              <div v-else class="flex justify-center space-x-1">
                <img
                  class="w-6 h-6 rounded-full"
                  :src="row.assigned.image || '/redesign/silhouette.svg'"
                  :alt="row.assigned"
                />
                <Tooltip :text="row.assigned">
                  <span class="px-2 py-1 rounded-md medium-text line-clamp-2">
                    {{ row.assigned }}
                  </span>
                </Tooltip>
              </div>
            </slot>

            <!-- Action Column -->
            <slot
              :name="header.value"
              :row="row"
              v-else-if="header.value === 'action'"
            >
              <div class="relative flex justify-center">
                <div
                  :class="{
                    'bg-gray-200 rounded w-fit p-1 ':
                      selectedOrder?.id === row.id,
                  }"
                >
                  <LucideEllipsisVertical
                    class="cursor-pointer text-gray-500 h-5 w-5 hover:text-gray-800"
                    @click.stop="toggleDropdown(row, $event)"
                  />
                </div>
              </div>
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
    <teleport to="body">
      <div
        v-if="isDropdownOpen"
        :style="dropdownStyle"
        class="absolute w-48 bg-white border border-gray-200 rounded shadow-lg z-50 dropdown-menu"
      >
        <ul
          v-if="selectedOrder"
          class="text-sm text-gray-700 divide-y divide-gray-200"
        >
          <li
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
            @click="viewOrder(selectedOrder.id)"
          >
            <LucideEye class="w-4 h-4" />
            View Purchase Order
          </li>
          <li
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
            @click="handleEditOrder(selectedOrder.id)"
          >
            <!-- <LucideEdit class="w-4 h-4" /> -->
            <img src="/redesign/edit.svg" alt="" class="h-4 w-4" />

            Edit
          </li>
          <li
            v-if="selectedOrder.assigned == 'Unassigned'"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
            @click="assignOrder(selectedOrder.id)"
          >
            <!-- <LucideUserPlus class="w-4 h-4" /> -->
            <img src="/redesign/assign.svg" alt="" class="h-4 w-4" />
            Assign to Me
          </li>
          <li
            v-else
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
            @click="assignOrder(selectedOrder.id)"
          >
            <!-- <LucideUserPlus class="w-4 h-4" /> -->
            <img src="/redesign/assign.svg" alt="" class="h-4 w-4" />
            Unassign
          </li>
          <!-- v-if="row.assigned == 'Unassigned'" -->
          <li
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
            @click="handleOrderLog()"
          >
            <!-- <LucideUserPlus class="w-4 h-4" /> -->
            <img src="/redesign/log.svg" alt="" class="h-4 w-4" />
            Activity Log
          </li>
          <!-- v-if="row.assigned == 'Unassigned'" -->
          <li
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
            @click="viewOrder(selectedOrder.id)"
          >
            <!-- <LucideUserPlus class="w-4 h-4" /> -->
            <img src="/redesign/approve.svg" alt="" class="h-4 w-4" />
            Approve
          </li>
          <li
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
            @click="beginDownload"
          >
            <LucideCloudDownload class="w-4 h-4 text-text-default" />
            Download Purchase Order
          </li>
          <li
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
            @click="handleDelete"
          >
            <!-- <LucideTrash class="w-4 h-4 text-red-500" /> -->
            <img src="/redesign/trash.svg" alt="" class="h-4 w-4" />

            Delete
          </li>
        </ul>
      </div>
    </teleport>
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
    v-model="isOpenLog"
    @close="isOpenLog = !isOpenLog"
    :selectedOrder="selectedOrder"
  />
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from "vue";
import { usePurchaseOrders } from "@/Composables/procurement/usePurchaseOrders";
import {
  LucideEllipsisVertical,
  LucideEdit,
  LucideUserPlus,
  LucideTrash,
  LucideCloudDownload,
  LucideEye,
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
const isOpenLog = ref(false);
const sortKey = ref<string | undefined>(undefined);
const isDropdownOpen = computed(
  () => !!selectedOrder.value && !isDeleteOpen.value && !isOpenLog.value
);
const dropdownPosition = ref({ top: 0, left: 0 });
const anchorEl = ref<HTMLElement | null>(null);

const dropdownStyle = computed(() => ({
  position: "absolute" as const,
  top: `${dropdownPosition.value.top + 7}px`,
  left: `${dropdownPosition.value.left - 40}px`,
  zIndex: 20,
}));

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

const updateDropdownPosition = () => {
  if (!anchorEl.value) return;
  const rect = anchorEl.value.getBoundingClientRect();
  dropdownPosition.value = {
    top: rect.bottom + window.scrollY,
    left: rect.left - 150 + window.scrollX,
  };
};

const toggleDropdown = (order, event) => {
  if (selectedOrder.value?.id === order.id) {
    selectedOrder.value = null;
    anchorEl.value = null;
  } else {
    selectedOrder.value = order;
    anchorEl.value = event.currentTarget as HTMLElement;
    updateDropdownPosition();
  }
};

watch(isDropdownOpen, (isOpen) => {
  if (isOpen) {
    window.addEventListener("scroll", updateDropdownPosition, true);
  } else {
    window.removeEventListener("scroll", updateDropdownPosition, true);
    anchorEl.value = null;
  }
});

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
    selectedOrder.value = null;
  }
};

document.addEventListener("click", handleDocumentClick);

onUnmounted(() => {
  document.removeEventListener("click", handleDocumentClick);
  window.removeEventListener("scroll", updateDropdownPosition, true);
});

function viewOrder(id) {
  // Implement view logic here
  console.log(`Viewing order ${id}`);
  selectedOrder.value = null;
  router.push({
    name: "order-details",
    params: {
      id,
    },
  });
}
function handleEditOrder(id) {
  // Implement view logic here
  console.log(`Editing order ${id}`);
  selectedOrder.value = null;
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
  selectedOrder.value = null;
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

const beginDownload = () => {
  selectedOrder.value = null;
  download.value = true;
  setTimeout(() => {
    download.value = false;
  }, 3000);
};
const isDeleteOpen = ref(false);

const handleDelete = () => {
  isDeleteOpen.value = true;
};
const deleteOrder = async () => {
  isDeleteOpen.value = false;
  try {
    if (selectedOrder.value) {
      await dO(selectedOrder.value.id);
    }
    selectedOrder.value = null;
  } catch (error) {
    console.error(error);
  }
};
const close = () => {
  isOpenLog.value = false;
  selectedOrder.value = null;
};

const handleOrderLog = () => {
  isOpenLog.value = true;
  emit("orderLog", selectedOrder);
  console.log(selectedOrder);
};
</script>

