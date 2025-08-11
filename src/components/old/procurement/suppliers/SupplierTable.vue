<script setup lang="ts">
// import SupplierDeleteModal from "@/Components/suppliers/SupplierDeleteModal.vue";

import { computed,  onMounted, onUnmounted, ref, watch  } from "vue";
import {
  ChevronsUpDown,
  LucideEllipsisVertical,
  LucideEye,
  LucidePlus,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useStatus } from "@/Composables/procurement/useStatus";
import EditIcon from "@/Components/procurement/icons/EditIcon.vue";
import PaymentIcon from "@/Components/procurement/icons/PaymentIcon.vue";
import Tooltip from "@/Components/procurement/ui/Tooltip.vue";
import SupplierDeleteModal from "@/Components/procurement/suppliers/DeleteModal.vue";
import UpDownIcon from "@/Components/procurement/icons/UpDownIcon.vue";

type Supplier = {
  id: number;
  supplierName: string;
  contactName: string;
  phone: string;
  category: string;
  status: string;
};

const props = defineProps<{
  suppliers: Array<Supplier>;
  search: string;
  page: number;
}>();

const emit = defineEmits([
  "update:search",
  "update:page",
  "editSupplier",
  "delete:supplier",
  "sort",
]);

const router = useRouter();
const isModalOpen = ref(false);
const isViewOpen = ref(false);
const selectedSupplier = ref<Supplier | null>(null);
const selectedId = ref<number | null>(null);
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

const handleViewSupplier = () => {
  isDropdownOpen.value = false;
  if (selectedSupplier.value) {
    router.push({
      name: "supplier-details",
      params: { id: selectedSupplier.value.id },
    });
  }
};

const handleDelete = () => {
  emit("delete:supplier", selectedSupplier.value);
  isModalOpen.value = false;
};

const isDropdownOpen = ref(false);

const handleDocumentClick = (e: MouseEvent) => {
  if (!isDropdownOpen.value) return;
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
  document.addEventListener("mousedown", handleDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleDocumentClick);
  window.removeEventListener("scroll", updateDropdownPosition, true);
});

const handleEdit = () => {
  isDropdownOpen.value = false;
  emit("editSupplier", selectedSupplier.value);
};

const handleAddPurchaseOrder = () => {
  isDropdownOpen.value = false;
  router.push({
    name: "purchase",
    query: {
      create: "true",
      supplierId: selectedSupplier.value?.id.toString(),
    },
  });
};

const handleAddPayment = () => {
  isDropdownOpen.value = false;
  router.push({
    path: "/payments",
    query: {
      create: "true",
      supplierId: selectedSupplier.value?.id.toString(),
    },
  });
};

const closeSupplierView = () => {
  isViewOpen.value = false;
  selectedSupplier.value = null;
};

const selectSupplier = (supplier: Supplier, event: MouseEvent) => {
  if (selectedId.value === supplier.id && isDropdownOpen.value) {
    isDropdownOpen.value = false;
    return;
  }
  isDropdownOpen.value = true;
  selectedSupplier.value = supplier;
  selectedId.value = supplier.id;
  anchorEl.value = event.currentTarget as HTMLElement;

  updateDropdownPosition();
};
const statusClasses = {
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-red-100 text-red-800",
  Pending: "bg-yellow-100 text-yellow-800",
};
</script>
<template>
  <div
    class="bg-white border text-lightBlack border-[#091E4224] rounded-xl shadow-sm overflow-x-auto"
  >
    <table class="w-full min-w-[800px] table-auto">
      <thead>
        <tr class="bg-gray-100 text-center medium-text text-text-default">
          <th class="p-3 medium-text">ID</th>
          <th
            class="p-3 medium-text cursor-pointer"
            @click="$emit('sort', 'name')"
          >
            Supplier Name <UpDownIcon class="inline w-[12px] ml-1" />
          </th>
          <th
            class="p-3 medium-text cursor-pointer"
            @click="$emit('sort', 'contact_name')"
          >
            Contact Name <UpDownIcon class="inline w-[12px] ml-1" />
          </th>
          <th class="p-3 medium-text">Phone</th>
          <th
            class="p-3 medium-text cursor-pointer"
            @click="$emit('sort', 'category')"
          >
            Category <UpDownIcon class="inline w-[12px] ml-1" />
          </th>
          <th
            class="p-3 medium-text cursor-pointer"
            @click="$emit('sort', 'status')"
          >
            Status <UpDownIcon class="inline w-[12px] ml-1" />
          </th>
          <th class="p-3 medium-text">Action</th>
        </tr>
      </thead>
      <tbody class="medium-text">
        <tr
          v-for="supplier in suppliers"
          :key="supplier.id"
          class="border-b text-gray-500 hover:bg-gray-50 text-center relative"
        >
          <td class="p-3">
            <router-link :to="`suppliers/${supplier.id}`">
              <Tooltip :text="String(supplier.id)">
                <span class="line-clamp-2">{{ supplier.id }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`suppliers/${supplier.id}`">
              <Tooltip :text="supplier.supplierName">
                <span class="line-clamp-2">{{ supplier.supplierName }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`suppliers/${supplier.id}`">
              <Tooltip :text="supplier.contactName">
                <span class="line-clamp-2">{{ supplier.contactName }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`suppliers/${supplier.id}`">
              <Tooltip :text="supplier.phone">
                <span class="line-clamp-2">{{ supplier.phone }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`suppliers/${supplier.id}`">
              <Tooltip :text="supplier.category">
                <span class="line-clamp-2">{{ supplier.category }}</span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`suppliers/${supplier.id}`">
              <Tooltip :text="supplier.status">
                <span
                  :class="[
                    'px-2 py-1 rounded-md medium-text line-clamp-2',
                    statusClasses[supplier.status] ||
                      'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ supplier.status }}
                </span>
              </Tooltip>
            </router-link>
          </td>
          <td class="p-3 text-center">
            <slot :name="'action'" :row="supplier">
              <div class="relative flex justify-center">
                <div
                  :class="{
                    'bg-gray-200 rounded p-1.5':
                      selectedId === supplier.id && isDropdownOpen,
                  }"
                >
                  <LucideEllipsisVertical
                    class="cursor-pointer text-gray-500 h-5 w-5 hover:text-gray-800"
                    @click.stop="(e) => selectSupplier(supplier, e)"
                  />
                </div>
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- <SupplierForm
    v-model="isViewOpen"
    @close="closeSupplierView"
    :selectedSupplier="selectedSupplier"
  /> -->
  <SupplierDeleteModal
    :isOpen="isModalOpen"
    :supplierName="selectedSupplier?.supplierName"
    @close="isModalOpen = false"
    @confirm="handleDelete"
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
          @click="handleViewSupplier()"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
        >
          <LucideEye class="w-4 h-4" />
          View Supplier Detils
        </li>
        <li
          @click="handleEdit"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
        >
          <EditIcon class="h-4 w-4" />
          Edit
        </li>

        <li
          @click="handleAddPurchaseOrder"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
        >
          <!-- <img src="/redesign/plus-circle.svg" alt="" class="h-4 w-4" /> -->
          <LucidePlus class="w-4 h-4" />
          Add Purchase Order
        </li>
        <li
          @click="handleAddPayment"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
        >
          <!-- <img src="/redesign/plus-circle.svg" alt="" class="h-4 w-4" /> -->
          <!-- <LucidePlus class="w-4 h-4" /> -->
          <PaymentIcon class="h-4 w-4" />
          Add Payment
        </li>
        <li
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 medium-text"
          @click="() => (isModalOpen = true)"
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
