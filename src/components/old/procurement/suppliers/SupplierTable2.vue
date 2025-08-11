<script setup lang="ts">
import { useSuppliers } from "@/Composables/procurement/useSuppliers";
import { computed,  ref  } from "vue";
import {
  LucideSearch,
  ListFilter,
  ArrowDownUp,
  AlignJustify,
  LayoutGrid,
  ChevronDown,
  ChevronsUpDown,
  LucideEllipsisVertical,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import SuppliersDeleteModal from "@/Components/suppliers/DeleteModal.vue";
import SuppliersDropdownMenu from "@/Components/suppliers/DropdownMenu.vue";
import Search from "@/Components/procurement/Search.vue";
import { useStatus } from "@/Composables/procurement/useStatus";

const { statuses } = useStatus();
type Supplier = {
  id: number;
  supplierName: string;
  contactName: string;
  phone: string;
  category: string;
  status: string;
};
const { deleteSuppliers } = useSuppliers();

const props = defineProps<{
  suppliers: Array<Supplier>;
  search: string;
  //   selectedStatus: string;
  page: number;
}>();

const emit = defineEmits([
  "update:search",
  //   "update:selectedStatus",
  "update:page",
  "editSupplier",
]);

const listStyle = ref("list");
const isAscending = ref(true);
const specificSort = ref<keyof typeof props.suppliers | null>(null);
const router = useRouter();

// Methods
const handleListStyleChanges = (name: string) => {
  listStyle.value = name;
};

const toggleSortOrder = () => {
  isAscending.value = !isAscending.value;
};

const updateSpecificSort = (name: any | null) => {
  toggleSortOrder();
  specificSort.value = name;
};

const sortedSuppliers = computed(() => {
  return [...props.suppliers].sort((a: any, b: any) => {
    const key = specificSort.value as keyof typeof props.suppliers;

    const aValue = a[key];
    const bValue = b[key];
    if (key) {
      return isAscending.value
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return isAscending.value ? a.id - b.id : b.id - a.id;
  });
});
const isModalOpen = ref(false);
const selectedSupplier = ref<Supplier>();
const selectedId = ref<number>();

const openModal = (id?: number) => {
  if (id) {
    selectedSupplier.value = sortedSuppliers.value[id];
    isModalOpen.value = true;
  }
};

const handleDelete = async () => {
  console.log("Deleting", selectedSupplier.value);
  await deleteSuppliers(selectedSupplier.value);
  isModalOpen.value = false;
};

const selectedSupplierData = ref<any>(null);

const handleEdit = () => {
  emit("editSupplier", selectedSupplier.value);
  //   selectedSupplierData.value = supplier;
  //   showModal.value = true;
};

const handleAddPurchaseOrder = () => {
  router.push({
    name: "purchase", // the route name for /purchase
    query: {
      create: "true",
      supplierId: selectedSupplier.value.id.toString(),
    },
  });
};

const isDropdownOpen = ref(false);

const handleSelection = () => {
  router.push({
    name: "supplier-details",
    params: {
      id: selectedSupplier.value?.id,
    },
  });
};

const isFilterModalOpen = ref(false);

const handleFilterApply = (filters: any) => {
  console.log("Filters Applied:", filters);
};
const selectSupplier = (id: number, supplierId: number) => {
  isDropdownOpen.value = true;
  selectedSupplier.value = sortedSuppliers.value[id];
  selectedId.value = id;
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
    v-if="listStyle === 'list'"
  >
    <table class="w-full">
      <thead>
        <tr class="bg-gray-100 text-center medium-text text-text-default">
          <th class="p-3 medium-text">ID</th>
          <th
            class="p-3 medium-text"
            @click="updateSpecificSort('supplierName')"
          >
            Supplier Name <ChevronsUpDown class="inline w-[12px]" />
          </th>
          <th
            class="p-3 medium-text"
            @click="updateSpecificSort('contactName')"
          >
            Contact Name <ChevronsUpDown class="inline w-[12px]" />
          </th>
          <th class="p-3 medium-text">Phone</th>
          <th class="p-3 medium-text" @click="updateSpecificSort('category')">
            Category <ChevronsUpDown class="inline w-[12px]" />
          </th>
          <th class="p-3 medium-text" @click="updateSpecificSort('status')">
            Status <ChevronsUpDown class="inline w-[12px]" />
          </th>
          <th class="p-3 medium-text">Action</th>
        </tr>
      </thead>
      <tbody class="medium-text">
        <tr
          v-for="(supplier, id) in sortedSuppliers"
          :key="supplier.id"
          class="border-b text-gray-500 hover:bg-gray-50 text-center relative"
        >
          <td class="p-3">
            <router-link :to="`suppliers/${supplier.id}`">
              {{ supplier.id }}
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`suppliers/${supplier.id}`">
              {{ supplier.supplierName }}
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`suppliers/${supplier.id}`">
              {{ supplier.contactName }}
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`suppliers/${supplier.id}`">
              {{ supplier.phone }}
            </router-link>
          </td>

          <td class="p-3">
            <router-link :to="`suppliers/${supplier.id}`">
              {{ supplier.category }}
            </router-link>
          </td>
          <td class="p-3">
            <router-link :to="`suppliers/${supplier.id}`">
              <span
                :class="[
                  'px-2 py-1 rounded-md medium-text',
                  statusClasses[supplier.status] || 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ supplier.status }}
              </span>
            </router-link>
          </td>
          <td class="p-3 flex justify-center">
            <LucideEllipsisVertical
              @click="selectSupplier(id, supplier.id)"
              class="cursor-pointer text-gray-500 h-5 w-5 hover:text-gray-800"
            />
          </td>
          <!-- <td class="p-3 text-center">
            <LucideEllipsisVertical
              class="cursor-pointer text-gray-500 text-sm text-center hover:text-gray-800"
            />
          </td> -->

          <!-- v-if="id" -->
          <!-- @select="handleSelection" -->
          <SuppliersDropdownMenu
            v-if="selectedSupplier?.id == supplier.id"
            :isOpen="isDropdownOpen"
            @view="handleSelection"
            @close="isDropdownOpen = false"
            @purchase="handleAddPurchaseOrder"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </tr>
      </tbody>
    </table>
  </div>
  <!-- <div v-else class="grid sm:grid-cols-2 lg:grid-cols-4 gap-[30px] h-auto">
    <div v-for="supplier in props.suppliers" :key="supplier.id">
      <div
        class="bg-white rounded-md shadow-md p-6 hover:scale-[1.05] hover:border-lightBlue border h-full transition-all"
      >
        <p class="font-semibold">Name: {{ supplier.supplierName }}</p>
        <p>Contact: {{ supplier.contactName }}</p>
        <p>Phone: {{ supplier.phone }}</p>
        <p
          :class="['mt-2 px-2 max-w-[200px] w-[40%] text-center py-1 rounded-full text-xs', statuses[supplier.status as keyof typeof statuses]]"
        >
          {{ supplier.status }}
        </p>
      </div>
    </div>
  </div> -->
  <!-- <button @click="openModal(1)" class="btn-delete">Open Delete Modal</button> -->

  <SuppliersDeleteModal
    :isOpen="isModalOpen"
    :supplierName="selectedSupplier?.contactName"
    @close="isModalOpen = false"
    @confirm="handleDelete"
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
