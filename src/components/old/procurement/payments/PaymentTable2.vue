<script setup lang="ts">
import { usePayments } from "@/Composables/procurement/usePayments";
import PaymentsDropdownMenu from "@/Components/payments/DropdownMenu.vue";
import PaymentsDeleteModal from "@/Components/payments/DeleteModal.vue";
import DownloadSuccess from "@/Components/ui/DownloadSuccess.vue";
import PaymentView from "@/Components/payments/PaymentView.vue";

import { computed,  onMounted, onUnmounted, ref  } from "vue";
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
} from "lucide-vue-next";
import Search from "@/Components/procurement/Search.vue";
import { useRouter } from "vue-router";
import { Payment } from "@/types";
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
]);

const router = useRouter();

const isModalOpen = ref(false);
const isViewOpen = ref(false);
const selectedPayment = ref<Payment>();
const selectedId = ref<number>();

const dropdownPosition = ref({ top: 0, left: 0 });

const handleViewPayment = () => {
  isDropdownOpen.value = false;
  isViewOpen.value = true;
  console.log();
};
const isDeleteOpen = ref(false);

const handleDelete = () => {
  console.log("Deleting", selectedPayment.value);
  isModalOpen.value = false;
};

const isDropdownOpen = ref(false);

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
    isDropdownOpen.value = false;
    isViewOpen.value = false;
    // selectedPayment.value = null;
    // selectedId.value = null;
  }
};

document.addEventListener("click", handleDocumentClick);

onUnmounted(() => {
  document.removeEventListener("click", handleDocumentClick);
});

const handleFilterApply = (filters: any) => {
  console.log("Filters Applied:", filters);
};
const selectPayment = (id: number, payment, event) => {
  isDropdownOpen.value = true;
  selectedPayment.value = payment;
  selectedId.value = id;
  // Get the button's position
  const rect = event.target.getBoundingClientRect();
  dropdownPosition.value = {
    top: rect.bottom + window.scrollY,
    left: rect.left - 180 + window.scrollX,
  };
};

const download = ref(false);
const handleDownload = (request) => {
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
      <thead>
        <tr class="bg-gray-100 text-center text-xs font-semibold text-gray-600">
          <th class="p-3 font-semibold">ID</th>
          <th class="p-3 font-semibold">Doc No</th>
          <!-- <th class="p-3 font-semibold">Order No</th> -->
          <th class="p-3 font-semibold">
            Supplier's Name <ChevronsUpDown class="inline w-[12px]" />
          </th>
          <th class="p-3 font-semibold">
            Reference <ChevronsUpDown class="inline w-[12px]" />
          </th>
          <th class="p-3 font-semibold">
            Date <ChevronsUpDown class="inline w-[12px]" />
          </th>
          <th class="p-3 font-semibold">
            Amount <ChevronsUpDown class="inline w-[12px]" />
          </th>
          <th class="p-3 font-semibold">
            Action
            <ChevronsUpDown class="inline w-[12px]" />
          </th>
        </tr>
      </thead>
      <!-- {{
        payments
      }} -->
      <tbody class="text-xs font-medium">
        <tr
          v-for="(payment, id) in payments"
          :key="payment.id"
          class="border-b text-gray-500 hover:bg-gray-50 text-center relative"
        >
          <td class="p-3">
            <router-link :to="`payments/${payment.id}`">
              {{ payment.id }}
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`payments/${payment.id}`">
              {{ payment.docNo }}
            </router-link>
          </td>
          <!-- <td class="p-3">
            <router-link :to="`payments/${payment.id}`">
              {{ payment.orderNo }}
            </router-link>
          </td> -->
          <td class="p-3">
            <router-link :to="`payments/${payment.id}`">
              {{ payment.supplierName }}
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`payments/${payment.id}`">
              {{ payment.reference }}
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`payments/${payment.id}`">
              {{ payment.date }}
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`payments/${payment.id}`">
              {{ payment.amount }}
            </router-link>
          </td>

          <!-- <td class="p-3">
            <router-link :to="`payments/${payment.id}`">
              {{ payment.category }}
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`payments/${payment.id}`">
              <span
                :class="['px-2 py-1 rounded-md font-semibold text-xs', statuses[payment.status as keyof typeof statuses]]"
              >
                {{ payment.status }}
              </span>
            </router-link>
          </td> -->
          <td class="p-3 flex justify-center">
            <!-- <LucideEllipsisVertical
              @click="selectPayment(id, payment.id)"
              class="cursor-pointer text-gray-500 h-5 w-5 hover:text-gray-800"
            /> -->
            <slot :name="'action'" :row="payment">
              <div class="relative">
                <LucideEllipsisVertical
                  class="cursor-pointer text-gray-500 h-5 w-5 hover:text-gray-800"
                  @click.stop="(e) => selectPayment(id, payment, e)"
                />
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <PaymentView
    v-model="isViewOpen"
    @close="selectedPayment = null"
    :selectedPayment="selectedPayment"
  />
  <PaymentsDeleteModal
    :isOpen="isModalOpen"
    :paymentName="selectedPayment?.contactName"
    @close="isModalOpen = false"
    @confirm="handleDelete"
  />

  <teleport to="body">
    <div
      v-if="isDropdownOpen && selectedPayment?.id === payments[selectedId]?.id"
      :style="{
        position: 'absolute',
        top: dropdownPosition.top + 'px',
        left: dropdownPosition.left + 'px',
        zIndex: 1000,
      }"
      class="w-48 bg-white border border-gray-200 rounded shadow-lg dropdown-menu"
    >
      <ul class="text-sm text-gray-700 divide-y divide-gray-200">
        <!-- @click="viewOrder(payment.id)" -->
        <li
          @click="handleViewPayment"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
        >
          <LucideEye class="w-4 h-4" />
          View Payment
        </li>
        <!-- @click="editOrder(payment.id)" -->
        <li
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
        >
          <!-- <LucideEdit class="w-4 h-4" /> -->
          <img src="/redesign/edit.svg" alt="" class="h-4 w-4" />

          Edit
        </li>

        <li
          @click="handleDownload"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
        >
          <LucideCloudDownload class="w-4 h-4 text-text-default" />
          Download Payment
        </li>
        <!-- @click="deleteOrder(payment.id)" -->
        <li
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
        >
          <!-- <LucideTrash class="w-4 h-4 text-red-500" /> -->
          <img src="/redesign/trash.svg" alt="" class="h-4 w-4" />

          Delete
        </li>
      </ul>
      <!-- ...dropdown content... -->
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
