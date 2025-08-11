
<script setup lang="ts">
import { ref, watch } from "vue";
import { LucideTrash2, LucideX } from "lucide-vue-next";
import UiSelectField from "@/Components/ui/SelectField.vue";
import UiUpload from "@/Components/ui/Upload.vue";
import DiscardModal from "@/Components/ui/DiscardModal.vue";
import { useModal } from "@/Composables/procurement/useModal";
import { useCategory } from "@/Composables/procurement/useCategory";
import { useSupplierForm } from "@/Composables/procurement/useSupplierForm";
import { Option } from "@/types";
import { banks as bankMap } from "@/helpers/banks";

// Props and Emits
const props = defineProps<{
  modelValue: boolean;
  selectedSupplier?: any; // Accepts supplier object
}>();
const emit = defineEmits(["update:modelValue", "refresh", "delete:supplier"]);

// Composables
const { closeModal } = useModal();
const { createSupplier, updateSupplier, isSubmitting } = useSupplierForm();
const { supplierCategory, supplierCategories } = useCategory();

// Close modal
const isDiscardOpen = ref(false);
const close = (discarding = true) => {
  if (discarding) {
    isDiscardOpen.value = true;
    return;
  }
  emit("update:modelValue", false);
};

// Supplier dropdown data
const supplierTypes = ref<Option[]>([
  { id: 1, name: "Local" },
  { id: 2, name: "Overseas" },
]);

// const supplierBanks = ref<Option[]>([
//   { id: 1, name: "UBA" },
//   { id: 2, name: "Access Bank" },
//   { id: 3, name: "Zenith Bank" },
// ]);

const supplierBanks = ref<Option[]>(
  Object.entries(bankMap).map(([name, code], index) => ({
    id: index + 1,
    name,
  }))
);

// Supplier form data
const supplierForm = ref({
  id: null as number | null,
  name: "",
  supplier_type: null as Option | null,
  category: null as Option | null,
  contact_name: "",
  phone: "",
  email: "",
  address: "",
  bank_name: null as Option | null,
  bank_code: "",
  account_holder: "",
  account_number: "",
  opening_balance: "",
  balance_date: "",
  vat_reference: "",
  status: null as Option | null,
});

// Watch selectedSupplier and populate form
watch(
  () => props.selectedSupplier,
  (newSupplier) => {
    if (newSupplier) {
      supplierForm.value.id = newSupplier.id;
      supplierForm.value.name = newSupplier.supplierName;
      supplierForm.value.contact_name = newSupplier.contactName;
      supplierForm.value.phone = newSupplier.phone;
      supplierForm.value.email = newSupplier.email || "";
      supplierForm.value.address = newSupplier.address || "";
      supplierForm.value.opening_balance = newSupplier.opening_balance || "";
      supplierForm.value.balance_date = newSupplier.balance_date || "";
      supplierForm.value.vat_reference = newSupplier.vat_reference || "";
      supplierForm.value.bank_code = newSupplier.bank_code || "";
      supplierForm.value.account_holder = newSupplier.account_holder || "";
      supplierForm.value.account_number = newSupplier.account_number || "";
      // Dropdowns
      supplierForm.value.supplier_type =
        supplierTypes.value.find((t) => t.name === newSupplier.supplier_type) ||
        null;
      supplierForm.value.category =
        supplierCategories.value.find((c) => c.name === newSupplier.category) ||
        null;
      supplierForm.value.bank_name =
        supplierBanks.value.find((b) => b.name === newSupplier.bank_name) ||
        null;
      supplierForm.value.status =
        [
          { id: 1, name: "Active" },
          { id: 2, name: "Inactive" },
        ].find((s) => s.name === newSupplier.status) || null;
    } else {
      // Reset form if no supplier is selected
      Object.keys(supplierForm.value).forEach((key) => {
        supplierForm.value[key] = "";
      });
    }
  },
  { immediate: true }
);
watch(
  () => supplierForm.value.bank_name,
  (newBank) => {
    if (newBank) {
      supplierForm.value.bank_code = bankMap[newBank.name] || "";
    }
  },
  { immediate: true }
);

// Submit handler
const onSubmit = async () => {
  try {
    const payload = {
      ...supplierForm.value,
      supplier_type: supplierForm.value.supplier_type?.name || "",
      category: supplierForm.value.category?.name || "",
      bank_name: supplierForm.value.bank_name?.name || "",
      status: supplierForm.value.status?.name || "",
      opening_balance: supplierForm.value.opening_balance || "0",
      balance_date: supplierForm.value.balance_date || "",
      vat_reference: supplierForm.value.vat_reference || "",
    };

    if (supplierForm.value.id) {
      // Edit mode
      await updateSupplier(supplierForm.value.id, payload, 1);
      console.log("Supplier updated successfully!");
    } else {
      // Create mode
      await createSupplier(payload, 1);
      console.log("Supplier created successfully!");
    }

    emit("refresh"); // Let parent know to refresh
    close();
  } catch (error) {
    console.error("Error submitting supplier:", error);
  }
};
</script>

<template>
  <Transition name="slide">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50"
      v-if="modelValue"
      @click.self="close(false)"
    >
      <div
        class="bg-white w-full sm:w-1/2 h-full shadow-lg overflow-y-auto transition-transform p-6"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="header-text text-text-default">Create Supplier</h2>
          <LucideX
            class="w-6 h-6 cursor-pointer text-gray-600"
            @click="close"
          />
        </div>

        <UiUpload :imagePlaceholder="`/redesign/supplier-placeholder.png`" />

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="medium-text text-text-subtle mb-1 block"
              >Supplier Name</label
            >
            <input
              v-model="supplierForm.name"
              type="text"
              placeholder="Enter supplier name"
              class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3"
            />
          </div>

          <div>
            <label class="medium-text text-text-subtle mb-1 block"
              >Supplier Type</label
            >
            <UiSelectField
              v-model="supplierForm.supplier_type"
              :options="supplierTypes"
              :placeholder="'Select a type'"
            />
          </div>

          <div>
            <label class="medium-text text-text-subtle mb-1 block"
              >Category</label
            >
            <UiSelectField
              v-model="supplierForm.category"
              :options="supplierCategories"
              :placeholder="'Select a category'"
            />
          </div>

          <div>
            <label class="medium-text text-text-subtle mb-1 block"
              >Contact Person</label
            >
            <input
              v-model="supplierForm.contact_name"
              type="text"
              placeholder="Enter contact person"
              class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3"
            />
          </div>

          <div>
            <label class="medium-text text-text-subtle mb-1 block">
              Address
            </label>
            <input
              v-model="supplierForm.address"
              type="text"
              placeholder="Enter supplier address"
              class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3"
            />
          </div>

          <div>
            <label class="medium-text text-text-subtle mb-1 block">Email</label>
            <input
              v-model="supplierForm.email"
              type="email"
              placeholder="Enter email"
              class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3"
            />
          </div>

          <div>
            <label class="medium-text text-text-subtle mb-1 block">Phone</label>
            <input
              v-model="supplierForm.phone"
              type="tel"
              placeholder="e.g. 0801 234 5678"
              class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3"
            />
          </div>

          <div>
            <label class="medium-text text-text-subtle mb-1 block"
              >Opening Balance</label
            >
            <input
              v-model="supplierForm.opening_balance"
              type="number"
              placeholder="₦ Enter balance"
              class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3"
            />
          </div>

          <div>
            <label class="medium-text text-text-subtle mb-1 block"
              >Balance Date</label
            >
            <input
              v-model="supplierForm.balance_date"
              type="date"
              class="w-full border-2 border-gray-300 rounded-lg placeholder-text-subtlest placeholder-text py-1.5 px-3"
            />
          </div>
        </div>

        <h3 class="header-text text-text-default mt-6">Bank Details</h3>
        <div class="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label class="medium-text text-text-subtle mb-1 block"
              >Bank Name</label
            >
            <UiSelectField
              v-model="supplierForm.bank_name"
              :options="supplierBanks"
              :placeholder="'Select bank'"
            />
          </div>
          <div>
            <label class="medium-text text-text-subtle mb-1 block"
              >Bank Code</label
            >
            <input
              v-model="supplierForm.bank_code"
              type="text"
              placeholder="--"
              class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3"
            />
          </div>
          <div>
            <label class="medium-text text-text-subtle mb-1 block"
              >Account Number</label
            >
            <input
              v-model="supplierForm.account_number"
              type="text"
              placeholder="Enter account number"
              class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3"
            />
          </div>
          <div>
            <label class="medium-text text-text-subtle mb-1 block"
              >Account Holder</label
            >
            <input
              v-model="supplierForm.account_holder"
              type="text"
              placeholder="--"
              class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3"
            />
          </div>
        </div>
      </div>
      <div class="border-t sm:w-1/2 my-4 flex justify-between items-center">
        <button
          @click="$emit('delete:supplier')"
          class="bg-bg-danger px-6 py-2 medium-text rounded-lg"
          :disabled="isSubmitting"
        >
          <LucideTrash2 class="text-white h-4 w-4"></LucideTrash2>
        </button>
        <div class="flex justify-end mt-6 gap-4">
          <button
            @click="close(true)"
            class="bg-gray-200 px-6 py-2 medium-text rounded-lg"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
          <button
            @click="onSubmit"
            class="bg-blue-600 text-white medium-text px-6 py-2 rounded-lg"
            :disabled="isSubmitting"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <DiscardModal
    @close="isDiscardOpen = !isDiscardOpen"
    @confirm="close"
    :action="'Create New Supplier'"
    :isOpen="isDiscardOpen"
  ></DiscardModal>
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

