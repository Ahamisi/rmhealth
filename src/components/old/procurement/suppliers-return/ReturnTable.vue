<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import SuppliersReturnDeleteModal from "@/Components/procurement/suppliers-return/DeleteModal.vue";
import SuppliersReturnDropdownMenu from "@/Components/procurement/suppliers-return/DropdownMenu.vue";
import { Return } from "@/types";
import Search from "@/Components/procurement/Search.vue";
import {
  LucideEllipsisVertical,
  ChevronsUpDown,
  LucideUserPlus2,
  LucideCloudDownload,
  LucideEye,
  LucideArrowUpDown,
} from "lucide-vue-next";
import ReturnLog from "@/Components/procurement/suppliers-return/ReturnLog.vue";
import DownloadSuccess from "@/Components/procurement/ui/DownloadSuccess.vue";
import Tooltip from "@/Components/procurement/ui/Tooltip.vue";
import UpDownIcon from "@/Components/procurement/icons/UpDownIcon.vue";

const props = defineProps<{
  returns: Array<Return>;
  search: string;
  //   selectedStatus: string;
  page: number;
  isLoading: boolean;
}>();

const emit = defineEmits([
  "update:search",
  "update:selectedStatus",
  "update:page",
  "sort",
  "view-return",
]);

const router = useRouter();

const isModalOpen = ref(false);
const selectedReturn = ref<Return | undefined>();
const isLogOpen = ref(false);

const isDropdownOpen = computed(
  () => !!selectedReturn.value && !isLogOpen.value
);
const dropdownPosition = ref({ top: 0, left: 0, zIndex: 0 });
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

const selectReturn = (ret: Return, event: MouseEvent) => {
  if (selectedReturn.value?.id === ret.id) {
    selectedReturn.value = undefined;
    return;
  }
  selectedReturn.value = ret;
  anchorEl.value = event.currentTarget as HTMLElement;
  updateDropdownPosition();
};

const handleViewReturn = () => {
  if (selectedReturn.value) {
    emit("view-return", selectedReturn.value);
    selectedReturn.value = undefined;
  }
};
const download = ref(false);

const handleDownload = () => {
  download.value = true;
  setTimeout(() => {
    download.value = false;
  }, 3000);
  selectedReturn.value = undefined;
};

const handleReturnLog = () => {
  isLogOpen.value = true;
};

const handleDocumentClick = (e: MouseEvent) => {
  if (!isDropdownOpen.value) return;
  const dropdownElement = document.querySelector(".dropdown-menu");
  if (dropdownElement && !dropdownElement.contains(e.target as Node)) {
    selectedReturn.value = undefined;
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

document.addEventListener("click", handleDocumentClick);

onUnmounted(() => {
  document.removeEventListener("click", handleDocumentClick);
  window.removeEventListener("scroll", updateDropdownPosition, true);
});

const isFilterModalOpen = ref(false);

const handleFilterApply = (filters: any) => {
  console.log("Filters Applied:", filters);
};
</script>

<template>
  <div
    class="bg-white border text-lightBlack border-[#091E4224] rounded-xl shadow-sm overflow-x-auto"
  >
    <DownloadSuccess
      :text="`Download Supplier's Return Successful`"
      :visibility="download"
    />
    <table class="w-full min-w-[800px] table-auto">
      <thead>
        <tr class="bg-gray-100 text-center text-xs font-semibold text-gray-600">
          <!-- <th class="p-3 font-semibold">ID</th> -->
          <th
            class="p-3 medium-text cursor-pointer"
            @click="$emit('sort', 'id')"
          >
            <div class="flex items-center justify-center">
              <span class="line-clamp-2">Return ID</span>
              <UpDownIcon class="inline w-[12px] ml-1" />
            </div>
          </th>
          <th
            class="p-3 medium-text cursor-pointer"
            @click="$emit('sort', 'supplier_name')"
          >
            <div class="flex items-center justify-center">
              <span class="line-clamp-2">Supplier Name</span>
              <UpDownIcon class="inline w-[12px] ml-1" />
            </div>
          </th>
          <th
            class="p-3 medium-text cursor-pointer"
            @click="$emit('sort', 'invoice_no')"
          >
            <div class="flex items-center justify-center">
              <span class="line-clamp-2">Invoice No</span>
              <UpDownIcon class="inline w-[12px] ml-1" />

              <!-- <LucideArrowUpDown class="inline w-[12px] ml-1" /> -->
            </div>
          </th>
          <th
            class="p-3 medium-text cursor-pointer"
            @click="$emit('sort', 'date')"
          >
            <div class="flex items-center justify-center">
              <span class="line-clamp-2">Date</span>
              <UpDownIcon class="inline w-[12px] ml-1" />
            </div>
          </th>
          <th
            class="p-3 medium-text cursor-pointer"
            @click="$emit('sort', 'total')"
          >
            <div class="flex items-center justify-center">
              <span class="line-clamp-2">Total Amount</span>
              <UpDownIcon class="inline w-[12px] ml-1" />
            </div>
          </th>
          <th
            class="p-3 medium-text cursor-pointer"
            @click="$emit('sort', 'admin_name')"
          >
            <div class="flex items-center justify-center">
              <span class="line-clamp-2">Admin</span>
              <UpDownIcon class="inline w-[12px] ml-1" />
            </div>
          </th>
          <th class="p-3 medium-text">Action</th>
        </tr>
      </thead>
      <tbody class="medium-text">
        <tr
          v-for="ret in returns"
          :key="ret.id"
          class="border-b text-gray-500 hover:bg-gray-50 text-center relative"
        >
          <td class="p-3">
            <router-link :to="`suppliers-return/${ret.id}`">
              <Tooltip :text="String(ret.id)">
                <span class="line-clamp-2">{{ ret.id }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`suppliers-return/${ret.id}`">
              <Tooltip :text="ret.supplierName">
                <span class="line-clamp-2">{{ ret.supplierName }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`suppliers-return/${ret.id}`">
              <Tooltip :text="String(ret.invoiceNo)">
                <span class="line-clamp-2">{{ ret.invoiceNo }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`suppliers-return/${ret.id}`">
              <Tooltip :text="ret.date">
                <span class="line-clamp-2">{{ ret.date }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`suppliers-return/${ret.id}`">
              <Tooltip :text="String(ret.total)">
                <span class="line-clamp-2">{{ ret.total }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`suppliers-return/${ret.id}`">
              <Tooltip :text="ret.adminName">
                <span class="line-clamp-2">{{ ret.adminName }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3 text-center">
            <slot :name="'action'" :row="ret">
              <div class="relative flex justify-center">
                <div
                  :class="{
                    'bg-gray-200 rounded p-1.5': selectedReturn?.id === ret.id,
                  }"
                >
                  <LucideEllipsisVertical
                    class="cursor-pointer text-gray-500 h-5 w-5 hover:text-gray-800"
                    @click.stop="(e) => selectReturn(ret, e)"
                  />
                </div>
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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
      <ul class="text-sm text-gray-700 divide-y divide-gray-200">
        <li
          @click="handleViewReturn"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
        >
          <LucideEye class="w-4 h-4" />
          View Supplier's Return
        </li>

        <li
          @click="handleReturnLog"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
        >
          <img src="/redesign/log.svg" alt="" class="h-4 w-4" />
          Activity Log
        </li>
        <li
          class="px-4 py-2 hover:bg-gray-100 text-nowrap cursor-pointer flex items-center gap-1 medium-text"
          @click="handleDownload"
        >
          <LucideCloudDownload class="h-4 w-4"></LucideCloudDownload>
          Download Supplier's Return
        </li>
      </ul>
    </div>
  </teleport>

  <ReturnLog
    v-model="isLogOpen"
    @close="isLogOpen = false"
    :selectedReturn="selectedReturn"
  />
</template>

<style>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: "";
  outline: none;
}
</style>
