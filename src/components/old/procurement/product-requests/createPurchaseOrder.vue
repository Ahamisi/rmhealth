<template>
  <main class="bg-white px-12 py-3">
    <!-- Breadcrumb -->
    <div class="text-[#626F86] mb-3 space-x-2">
      <router-link to="/purchase">
        <span class="hover:underline cursor-pointer title-text"
          >Purchase Order</span
        >
      </router-link>

      <span>/</span>
      <router-link to="/purchase">
        <span class="hover:underline cursor-pointer title-text" @click="close"
          >Awaiting PO Approval</span
        >
      </router-link>
      <span>/</span>
      <router-link to="/">
        <span class="hover:underline cursor-pointer title-text"
          >Create Purchase Order</span
        >
      </router-link>
    </div>

    <div>
      <div class="flex items-center justify-between mb-4">
        <div
          class="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#44546F]"
          @click="close"
        >
          <ChevronLeft class="w-5 h-5" />
          <span>Cancel</span>
        </div>
        <h2 class="page-title-text text-text-default">Create Purchase Order</h2>
        <div class="text-right text-xs font-semibold">
          <button
            @click="createPurchaseOrder"
            class="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>

      <!-- Supplier's Information -->
      <div class="p-4 rounded-xl bg-[#F7F8F9]">
        <h3 class="page-title-text text-text-default mb-4">
          Supplier’s Information
        </h3>
        <div class="grid grid-cols-5 gap-4">
          <div>
            <label class="block text-xs text-[#44546F] mb-1 font-medium"
              >Supplier</label
            >
            <select
              v-model="selectedSupplier"
              class="w-full p-2 border-[2px] border-[#091E4224] rounded-lg"
            >
              <option value="" disabled>Select supplier</option>
              <option
                v-for="supplier in suppliers"
                :key="supplier.id"
                :value="supplier.id"
              >
                {{ supplier.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-[#44546F] mb-1 font-medium"
              >Purchase Date</label
            >
            <input
              type="date"
              v-model="purchaseDate"
              class="w-full p-2 border-[2px] border-[#091E4224] rounded-lg placeholder:text-[#626F86]"
            />
          </div>
          <div>
            <label class="block text-xs text-[#44546F] mb-1 font-medium"
              >Delivery Date</label
            >
            <input
              type="date"
              v-model="deliveryDate"
              class="w-full p-2 border-[2px] border-[#091E4224] rounded-lg"
            />
          </div>
          <div>
            <label class="block text-xs text-[#44546F] mb-1 font-medium"
              >Discount (%)</label
            >
            <input
              type="number"
              v-model="discount"
              class="w-full p-2 border-[2px] border-[#091E4224] rounded-lg"
            />
          </div>
          <div>
            <label class="block text-xs text-[#44546F] mb-1 font-medium"
              >Type</label
            >
            <select
              v-model="selectedType"
              class="w-full p-2 border-[2px] border-[#091E4224] rounded-lg"
            >
              <option value="" disabled>Select a trade type</option>
              <option value="Trade">Trade</option>
              <option value="Service">Service</option>
            </select>
          </div>
        </div>
      </div>

      <!-- All Items -->
      <div class="mt-6 p-4 rounded-xl bg-[#F7F8F9]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-sm text-[#172B4D]">All Items</h3>
          <button
            class="border border-[#091E4224] text-[#172B4D] text-xs font-medium px-3 py-1 rounded"
          >
            + Add Item
          </button>
        </div>

        <div
          class="px-4 py-[10rem] bg-white rounded-md border border-[#091E4224] flex justify-center text-center"
        >
          <div
            class="flex flex-col justify-center items-center shadow-[0px_0px_50px_0px_#E5E2E9] p-6 rounded-lg"
          >
            <div class="flex items-center gap-2 mb-2">
              <img
                src="../../assets/images/InfoIcon.png"
                alt="Info-icon"
                width="24px"
              />
              <p class="text-[#172B4D] font-semibold text-base">
                No Items added yet
              </p>
            </div>
            <p class="text-xs max-w-[390px] text-[#44546F]">
              You haven’t added any items to this purchase order. Add items now
              to track and manage your order details
            </p>
            <button
              class="bg-blue-600 text-white mt-5 px-3 py-1 rounded-lg flex items-center gap-1"
            >
              <span class="text-lg mb-[0.5px]">+</span>
              <span class="text-xs font-medium">Add Item</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { ChevronLeft } from "lucide-vue-next";
import { useSuppliers } from "@/Composables/procurement/useSuppliers";
import { useRoute } from "vue-router";

const selectedSupplier = ref("");
const purchaseDate = ref("");
const deliveryDate = ref("");
const discount = ref(0);
const selectedType = ref("");
const { fetchAllSuppliers } = useSuppliers();
const suppliers = ref([]);
const route = useRoute();

onMounted(async () => {
  // Fetch suppliers
  const fetchedSuppliers = await fetchAllSuppliers();
  console.log("fetched");
  console.log(fetchedSuppliers);
  suppliers.value = fetchedSuppliers.map((s) => ({
    id: s.id,
    name: s.name,
  }));

  // Preselect supplier from query param
  const supplierId = route.query.supplierId;
  if (supplierId) {
    console.log(suppliers.value);
    console.log(selectedSupplier.value);
    selectedSupplier.value = supplierId;
  }
});
const createPurchaseOrder = () => {
  console.log("Purchase order created", {
    supplier: selectedSupplier.value,
    purchaseDate: purchaseDate.value,
    deliveryDate: deliveryDate.value,
    discount: discount.value,
    type: selectedType.value,
    items: items.value,
  });
};

const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};
</script>
