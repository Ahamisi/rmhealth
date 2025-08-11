<template>
  <div>
    <DownloadSuccess :text="'Notification Sent'" :visibility="notify" />
    <div
      class="bg-white border border-[#091E4224] rounded-xl shadow-sm overflow-x-auto mx-4"
    >
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
              @click="header.sortable ? $emit('sort', header.value) : null"
            >
              <span class="flex items-center space-x-1">
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
            v-for="(row, id) in sortedData"
            :key="id"
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
                  <span
                    class="px-2 py-1 rounded-md medium-text bg-yellow-100 text-yellow-800"
                  >
                    {{ row.assigned }}
                  </span>
                </p>
                <img
                  v-else
                  class="w-6 h-6 rounded-full"
                  :src="row.assigned.image"
                  :alt="row.assigned"
                />
              </slot>

              <!-- Action Column -->
              <slot
                :name="header.value"
                :row="row"
                v-else-if="header.value === 'action'"
              >
                <div class="flex justify-center">
                  <div
                    :class="{
                      'bg-gray-200 rounded p-1.5':
                        selectedRequest?.id === row.id && isDropdownOpen,
                    }"
                  >
                    <LucideEllipsisVertical
                      class="cursor-pointer text-gray-500 h-5 w-5 hover:text-gray-800"
                      @click.stop="selectRequest(row, $event)"
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
    </div>
    <RequestView
      v-model="isViewOpen"
      @close="closeView"
      :selectedRequest="selectedRequest"
    />
    <RequestDeleteModal
      :isOpen="isDeleteOpen"
      :requestDesc="selectedRequest?.requestDesc"
      @close="close"
      @confirm="$emit('delete:request', selectedRequest)"
    />
    <teleport to="body">
      <div
        v-if="isDropdownOpen"
        :style="{
          position: 'absolute',
          top: dropdownPosition.top + 'px',
          left: dropdownPosition.left + 'px',
          zIndex: dropdownPosition.zIndex,
        }"
        class="w-48 bg-white border border-gray-200 rounded shadow-lg dropdown-menu"
      >
        <ul
          v-if="selectedRequest"
          class="text-sm text-gray-700 divide-y divide-gray-200"
        >
          <li
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
            @click="handleViewRequest(selectedRequest)"
          >
            <LucideEye class="w-4 h-4" />
            View Request
          </li>
          <li
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
            @click="handleNotify(selectedRequest)"
          >
            <!-- <LucideEdit class="w-4 h-4" /> -->
            <img src="/redesign/notify.svg" alt="" class="h-4 w-4" />

            Notify Requester
          </li>
          <li
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
            @click="handleDelete(selectedRequest)"
          >
            <!-- <LucideTrash class="w-4 h-4 text-red-500" /> -->
            <img src="/redesign/trash.svg" alt="" class="h-4 w-4" />

            Delete
          </li>
        </ul>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from "vue";
import {
  LucideEllipsisVertical,
  LucideEdit,
  LucideUserPlus,
  LucideTrash,
  LucideCloudDownload,
  LucideEye,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useproductRequests } from "@/Composables/procurement/useProductRequests";
import RequestView from "@/Components/procurement/product-requests/RequestView.vue";
import RequestDeleteModal from "@/Components/procurement/product-requests/DeleteModal.vue";
import DownloadSuccess from "@/Components/procurement/ui/DownloadSuccess.vue";
import Tooltip from "@/Components/procurement/ui/Tooltip.vue";
import UpDownIcon from "@/Components/procurement/icons/UpDownIcon.vue";

const isViewOpen = ref(false);

const router = useRouter();

interface TableHeader {
  label: string;
  value: string;
  sortable?: boolean;
}

const { deleteRequest, notifyRequester, viewRequest } = useproductRequests();
const emit = defineEmits(["viewRequest", "delete:request", "sort"]);

interface TableRow {
  [key: string]: any;
}

const props = defineProps<{
  headers: TableHeader[];
  data: TableRow[];
}>();

const isAscending = ref(true);
const sortKey = ref<string | undefined>(undefined);
const dropdownPosition = ref({ top: 0, left: 0, zIndex: 20 });
const anchorEl = ref<HTMLElement | null>(null);

const updateDropdownPosition = () => {
  if (!anchorEl.value) return;
  const rect = anchorEl.value.getBoundingClientRect();
  dropdownPosition.value = {
    top: rect.bottom + 5 + window.scrollY,
    left: rect.left - 190 + window.scrollX,
    zIndex: 20,
  };
};

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

const selectedId = ref<number>();

const isDropdownOpen = ref(false);

const selectRequest = (request: TableRow, event: MouseEvent) => {
  if (selectedRequest.value?.id === request.id && isDropdownOpen.value) {
    isDropdownOpen.value = false;
    return;
  }
  isDropdownOpen.value = true;
  selectedRequest.value = request;
  selectedId.value = request.id;
  anchorEl.value = event.currentTarget as HTMLElement;
  updateDropdownPosition();
};
const selectedRequest = ref(null);

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
  if (!isDropdownOpen.value) return;
  const dropdownElement = document.querySelector(".dropdown-menu");
  if (dropdownElement && !dropdownElement.contains(e.target as Node)) {
    isDropdownOpen.value = false;
  }
};

document.addEventListener("mousedown", handleDocumentClick);
//
onUnmounted(() => {
  document.removeEventListener("mousedown", handleDocumentClick);
  window.removeEventListener("scroll", updateDropdownPosition, true);
});

const handleViewRequest = (request) => {
  isDropdownOpen.value = false;
  isViewOpen.value = true;
  console.log(request);
};
const isDeleteOpen = ref(false);

const handleDelete = (request) => {
  isDeleteOpen.value = true;
  isDropdownOpen.value = false;
  console.log(request);
};
const notify = ref(false);
const handleNotify = (request) => {
  notify.value = true;
  setTimeout(() => {
    notify.value = false;
  }, 3000);
  selectedRequest.value = null;
  isDropdownOpen.value = false;
};
const close = () => {
  isDeleteOpen.value = false;
  selectedRequest.value = null;
};
const closeView = () => {
  isViewOpen.value = false;
  selectedRequest.value = null;
};
</script>

