<script setup lang="ts">
import { usePayments } from "@/Composables/procurement/usePayments";
import PaymentsDeleteModal from "@/Components/procurement/payments/DeleteModal.vue";
import DownloadSuccess from "@/Components/procurement/ui/DownloadSuccess.vue";
import PaymentView from "@/Components/procurement/payments/PaymentView.vue";

import { computed,  onMounted, onUnmounted, ref, watch  } from "vue";
import {
  LucideSearch,
  ListFilter,
  ArrowDownUp,
  AlignJustify,
  LayoutGrid,
  ChevronDown,
  ChevronsUpDown,
  LucideEllipsisVertical,
  LucideCloudDownload,
  LucideEye,
  LucideTrash,
} from "lucide-vue-next";
import Search from "@/Components/procurement/Search.vue";
import { useRouter } from "vue-router";
import { Payment } from "@/types";
import EditIcon from "@/Components/procurement/icons/EditIcon.vue";
import Tooltip from "@/Components/procurement/ui/Tooltip.vue";
import UpDownIcon from "@/Components/procurement/icons/UpDownIcon.vue";

const headers = [
  { label: "ID", value: "id", sortable: true },
  { label: "Doc No", value: "docNo", sortable: true },
  { label: "Supplier Name", value: "supplierName", sortable: true },
  { label: "Reference", value: "reference", sortable: false },
  { label: "Date", value: "date", sortable: true },
  { label: "Amount Paid", value: "amount", sortable: true },
  { label: "Action", value: "action", sortable: false },
];

const { statuses } = usePayments();

const props = defineProps<{
  payments: Array<Payment>;
  search: string;
  //   selectedStatus: string;
  page: number;
}>();

const emit = defineEmits([
  "update:search",
  "update:selectedStatus",
  "update:page",
  "delete:payment",
  "sort",
  "editPayment",
]);

const router = useRouter();

const isModalOpen = ref(false);
const isViewOpen = ref(false);
const selectedPayment = ref<Payment | null>(null); // Allow null
const selectedId = ref<number | null>(null); // Allow null

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

const handleViewPayment = () => {
  isDropdownOpen.value = false;
  isViewOpen.value = true;
};
const isDeleteOpen = ref(false);

const handleDelete = () => {
  isModalOpen.value = true;
};

const handleEdit = () => {
  emit("editPayment", selectedPayment.value);
  isDropdownOpen.value = false;
};

const confirmDelete = () => {
  emit("delete:payment", selectedPayment.value);
  isDeleteOpen.value = false;
};

const isDropdownOpen = ref(false);

// Document click listener to close dropdown on outside click
const handleDocumentClick = (e: MouseEvent) => {
  if (!isDropdownOpen.value) return; // Quick exit if dropdown is already closed

  const dropdownElement = document.querySelector(".dropdown-menu");
  if (dropdownElement && !dropdownElement.contains(e.target as Node)) {
    isDropdownOpen.value = false;
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

onMounted(() => {
  document.addEventListener("mousedown", handleDocumentClick); // Changed to mousedown
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleDocumentClick); // Changed to mousedown
  window.removeEventListener("scroll", updateDropdownPosition, true);
});

const handleFilterApply = (filters: any) => {
  console.log("Filters Applied:", filters);
};

const closePaymentView = () => {
  isViewOpen.value = false;
  selectedPayment.value = null;
};

const selectPayment = (id: number, payment: Payment, event: MouseEvent) => {
  if (selectedId.value === id && isDropdownOpen.value) {
    isDropdownOpen.value = false;
    return;
  }
  isDropdownOpen.value = true;
  selectedPayment.value = payment;
  selectedId.value = id;
  anchorEl.value = event.currentTarget as HTMLElement;

  updateDropdownPosition();
};

const download = ref(false);
const handleDownload = () => {
  download.value = true;
  setTimeout(() => {
    download.value = false;
  }, 3000);
  selectedPayment.value = null;
};
</script>

<template>
  <div
    class="bg-white border text-lightBlack border-[#091E4224] rounded-xl shadow-sm overflow-x-auto"
  >
    <DownloadSuccess
      :text="'Payment Downloaded Successfully'"
      :visibility="download"
    />

    <table class="min-w-[800px] w-full table-auto">
      <thead class="bg-[#F7F8F9]">
        <tr
          class="text-center border-b border-[#091E4224] text-gray-500 font-thin text-xs"
        >
          <th
            v-for="header in headers"
            :key="header.value"
            class="py-2 px-4 cursor-pointer"
            @click="header.sortable ? $emit('sort', header.value) : null"
          >
            <span class="flex items-center justify-center space-x-1">
              {{ header.label }}
              <UpDownIcon v-if="header.sortable" class="w-[12px] ml-1" />
            </span>
          </th>
        </tr>
      </thead>
      <tbody class="text-xs font-medium">
        <tr
          v-for="(payment, id) in payments"
          :key="payment.id"
          class="border-b text-gray-500 hover:bg-gray-50 text-center relative"
        >
          <td class="p-3">
            <router-link :to="`/payments/${payment.id}`">
              <Tooltip :text="String(payment.id)">
                <span class="line-clamp-2">{{ payment.id }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`/payments/${payment.id}`">
              <Tooltip :text="payment.docNo">
                <span class="line-clamp-2">{{ payment.docNo }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`/payments/${payment.id}`">
              <Tooltip :text="payment.supplierName">
                <span class="line-clamp-2">{{ payment.supplierName }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`/payments/${payment.id}`">
              <Tooltip :text="payment.reference">
                <span class="line-clamp-2">{{ payment.reference }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`/payments/${payment.id}`">
              <Tooltip :text="payment.date">
                <span class="line-clamp-2">{{ payment.date }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`/payments/${payment.id}`">
              <Tooltip :text="String(payment.amount)">
                <span class="line-clamp-2">{{ payment.amount }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3 flex justify-center">
            <slot :name="'action'" :row="payment">
              <div class="relative flex justify-center">
                <div
                  :class="{
                    'bg-gray-200 rounded p-1.5':
                      selectedId === id && isDropdownOpen,
                  }"
                >
                  <LucideEllipsisVertical
                    class="cursor-pointer text-gray-500 h-5 w-5 hover:text-gray-800"
                    @click.stop="(e) => selectPayment(id, payment, e)"
                  />
                </div>
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <PaymentView
    v-model="isViewOpen"
    @close="closePaymentView"
    :selectedPayment="selectedPayment"
  />
  <PaymentsDeleteModal
    :isOpen="isModalOpen"
    :paymentName="selectedPayment?.supplierName"
    @close="isModalOpen = false"
    @confirm="confirmDelete"
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
      <ul class="text-sm text-gray-700 divide-y divide-gray-200">
        <li
          @click="handleViewPayment()"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
        >
          <LucideEye class="w-4 h-4" />
          View Payment
        </li>
        <li
          @click="handleEdit"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
        >
          <EditIcon class="h-4 w-4" />
          Edit
        </li>
        <li
          @click="handleDownload"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
        >
          <LucideCloudDownload class="w-4 h-4 text-text-default" />
          Download Payment
        </li>
        <li
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
          @click="handleDelete"
        >
          <img src="/redesign/trash.svg" alt="" class="h-4 w-4" />
          Delete
        </li>
      </ul>
    </div>
  </teleport>
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
