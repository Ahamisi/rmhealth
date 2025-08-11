<script setup lang="ts">
import { ref, watch, reactive, computed } from "vue";
import { LucideX, LucideTrash2 } from "lucide-vue-next";
import SelectWithSearchField from "@/Components/procurement/ui/SelectWithSearchField.vue";
import UiSelectField from "@/Components/procurement/ui/SelectField.vue";
import DiscardModal from "@/Components/procurement/ui/DiscardModal.vue";
import DeleteModal from "@/Components/procurement/payments/DeleteModal.vue";
import TrashIcon from "@/Components/procurement/icons/TrashIcon.vue";
import { usePurchaseOrders } from "@/Composables/procurement/usePurchaseOrders";
import { useSuppliers } from "@/Composables/procurement/useSuppliers";
import { banks as bankMap } from "@/helpers/banks";

const props = defineProps<{
  modelValue: boolean;
  selectedPayment?: any;
}>();
const emit = defineEmits(["update:modelValue", "save", "delete"]);

// Data fetching
const { searchProducts: searchPOs } = usePurchaseOrders();
const { fetchAllSuppliers } = useSuppliers();

const purchaseOrders = ref<any[]>([]);
const suppliers = ref<any[]>([]);
const isSearching = ref(false);

// Form state
const getInitialFormState = () => ({
  id: null,
  purchase_order: null,
  supplier: null,
  bank_name: null,
  payment_method: null,
  payment_date: "",
  total_amount: "",
  reference: "",
});
const form = reactive(getInitialFormState());
let initialForm = {};

// Watcher for pre-filling form for editing
watch(
  () => props.selectedPayment,
  async (newItem) => {
    Object.assign(form, getInitialFormState());

    if (newItem && suppliers.value.length === 0) {
      const data = await fetchAllSuppliers();
      suppliers.value = data.map((s) => ({
        id: s.id,
        name: s.name,
      }));
    }

    if (newItem) {
      form.id = newItem.id;
      form.total_amount = newItem.amount;
      form.payment_date = newItem.date;
      form.reference = newItem.reference;

      if (newItem.supplierName) {
        form.supplier =
          suppliers.value.find((s) => s.name === newItem.supplierName) || null;
      }
      if (newItem.paymentMethod) {
        form.payment_method =
          paymentMethods.value.find(
            (pm) => pm.name === newItem.paymentMethod
          ) || null;
      }
      if (newItem.bankName) {
        form.bank_name =
          banks.value.find((b) => b.name === newItem.bankName) || null;
      }
      if (newItem.docNo) {
        form.purchase_order = { id: newItem.docNo, name: newItem.docNo };
        purchaseOrders.value = [form.purchase_order];
      }
      if (newItem.supplierId) {
        form.supplier =
          suppliers.value.find((s) => s.id == newItem.supplierId) || null;
      }
    }
    initialForm = JSON.parse(JSON.stringify(form));
  },
  { immediate: true, deep: true }
);

// Fetch suppliers on mount
watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen && !props.selectedPayment && suppliers.value.length === 0) {
      const data = await fetchAllSuppliers();
      suppliers.value = data.map((s) => ({ id: s.id, name: s.supplierName }));
    }
  },
  { immediate: true }
);

// Static data
const paymentMethods = ref([
  { id: 1, name: "Cash" },
  { id: 2, name: "Bank Transfer" },
  { id: 3, name: "Cheque" },
]);
const banks = ref(
  Object.keys(bankMap).map((name, index) => ({ id: index, name: name }))
);

// Close/Discard logic
const isDiscardOpen = ref(false);
const hasChanges = computed(
  () => JSON.stringify(initialForm) !== JSON.stringify(form)
);
const close = (discarding = true) => {
  if (discarding && hasChanges.value) {
    isDiscardOpen.value = true;
    return;
  }
  emit("update:modelValue", false);
};

// Search handler for Purchase Orders
const handlePOSearch = async (query: string) => {
  if (query) {
    isSearching.value = true;
    // This should ideally search purchase orders, not products
    // Placeholder until a PO search is available
    purchaseOrders.value = (await searchPOs(query)).map((p) => ({
      ...p,
      name: `${p.name} (PO a placeholder)`,
    }));
    isSearching.value = false;
  }
};

// Delete logic
const isDeleteModalOpen = ref(false);
const handleConfirmDelete = () => {
  emit("delete", form.id);
  isDeleteModalOpen.value = false;
  close(false);
};

// Submit
const onSubmit = () => {
  emit("save", form);
  close(false);
};
</script>

<template>
  <Transition name="slide">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      v-if="modelValue"
      @click.self="close(true)"
    >
      <div
        class="w-full sm:w-[500px] bg-white h-full flex flex-col shadow-xl overflow-hidden"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
        >
          <h2 class="header-text text-text-default">
            {{ form.id ? "Edit Payment" : "Create New Payment" }}
          </h2>
          <LucideX
            class="w-5 h-5 text-gray-500 cursor-pointer"
            @click="close(true)"
          />
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1"
                >Purchase Order</label
              >
              <SelectWithSearchField
                v-model="form.purchase_order"
                :options="purchaseOrders"
                @search="handlePOSearch"
                :is-searching="isSearching"
                placeholder="Type to search for purchase order"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Supplier</label>
              <UiSelectField
                v-model="form.supplier"
                :options="suppliers"
                placeholder="Select a supplier"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Bank Name</label>
              <UiSelectField
                v-model="form.bank_name"
                :options="banks"
                placeholder="Select an institution"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1"
                >Payment Method</label
              >
              <UiSelectField
                v-model="form.payment_method"
                :options="paymentMethods"
                placeholder="Select a payment method"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1"
                >Payment Date</label
              >
              <input
                type="date"
                v-model="form.payment_date"
                class="w-full border rounded-lg px-3 py-2.5 medium-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1"
                >Total Amount</label
              >
              <div class="relative">
                <span
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"
                  >₦</span
                >
                <input
                  v-model="form.total_amount"
                  type="text"
                  placeholder="Enter an amount"
                  class="w-full border rounded-lg pl-8 pr-3 py-2.5 medium-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Reference</label>
            <textarea
              v-model="form.reference"
              rows="4"
              placeholder="Add a reference or note for this payment"
              class="w-full border rounded-lg px-3 py-2.5 medium-text focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t px-6 py-4 flex items-center justify-end">
          <button
            v-if="form.id"
            @click="isDeleteModalOpen = true"
            class="flex items-center text-white bg-red-500 hover:bg-red-600 rounded-lg px-2 py-2 text-sm mr-auto"
          >
            <TrashIcon class="w-4 h-4 text-white" />
          </button>
          <div class="flex gap-3">
            <button
              @click="close(true)"
              class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              @click="onSubmit"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              {{ form.id ? "Update" : "Create" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <DiscardModal
    @close="isDiscardOpen = !isDiscardOpen"
    @confirm="close(false)"
    :action="form.id ? 'Edit Payment' : 'Create New Payment'"
    :isOpen="isDiscardOpen"
  />
  <DeleteModal
    :isOpen="isDeleteModalOpen"
    @close="isDeleteModalOpen = false"
    @confirm="handleConfirmDelete"
    :paymentName="form.supplier?.name"
  />
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>

<script lang="ts">
export default {
  name: "PaymentModal",
};
</script>
