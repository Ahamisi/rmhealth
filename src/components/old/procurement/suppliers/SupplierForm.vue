<script setup lang="ts">
import { ref, watch, computed, reactive } from "vue";
import { LucideBuilding2, LucideTrash2, LucideX } from "lucide-vue-next";
import UiSelectField from "@/Components/procurement/ui/SelectField.vue";
import UiUpload from "@/Components/procurement/ui/Upload.vue";
import DiscardModal from "@/Components/procurement/ui/DiscardModal.vue";
import { useModal } from "@/Composables/procurement/useModal";
import { useCategory } from "@/Composables/procurement/useCategory";
import { useSupplierForm } from "@/Composables/procurement/useSupplierForm";
import { Option } from "@/types";
import { banks as bankMap } from "@/helpers/banks";
import TrashIcon from "@/Components/procurement/icons/TrashIcon.vue";
import DeleteModal from "@/Components/procurement/suppliers/DeleteModal.vue";
import SuccessModal from "@/Components/procurement/ui/SuccessModal.vue";
import ErrorModal from "@/Components/procurement/ui/ErrorModal.vue";

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
const isDeleteModalOpen = ref(false);
const isSuccessModalOpen = ref(false);
const isErrorModalOpen = ref(false);
const modalTitle = ref("");
const modalMessage = ref("");
let initialSupplierForm = {};

// Close modal
const isDiscardOpen = ref(false);

const hasChanges = computed(() => {
  return JSON.stringify(initialSupplierForm) !== JSON.stringify(supplierForm);
});

const close = (discarding = true) => {
  if (discarding && hasChanges.value) {
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

const getInitialFormState = () => ({
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

// Supplier form data
const supplierForm = reactive(getInitialFormState());

// Watch selectedSupplier and populate form
watch(
  () => props.selectedSupplier,
  (newSupplier) => {
    Object.assign(supplierForm, getInitialFormState());

    if (newSupplier) {
      supplierForm.id = newSupplier.id;
      supplierForm.name = newSupplier.supplierName;
      supplierForm.contact_name = newSupplier.contactName;
      supplierForm.phone = newSupplier.phone;
      supplierForm.email = newSupplier.email || "";
      supplierForm.address = newSupplier.address || "";
      supplierForm.opening_balance = newSupplier.opening_balance || "";
      supplierForm.balance_date = newSupplier.balance_date || "";
      supplierForm.vat_reference = newSupplier.vat_reference || "";
      supplierForm.bank_code = newSupplier.bank_code || "";
      supplierForm.account_holder = newSupplier.account_holder || "";
      supplierForm.account_number = newSupplier.account_number || "";
      // Dropdowns
      supplierForm.supplier_type =
        supplierTypes.value.find((t) => t.name === newSupplier.supplier_type) ||
        null;
      supplierForm.category =
        supplierCategories.value.find((c) => c.name === newSupplier.category) ||
        null;
      supplierForm.bank_name =
        supplierBanks.value.find((b) => b.name === newSupplier.bank_name) ||
        null;
      supplierForm.status =
        [
          { id: 1, name: "Active" },
          { id: 2, name: "Inactive" },
        ].find((s) => s.name === newSupplier.status) || null;
    }
    // Store initial state for change detection
    initialSupplierForm = JSON.parse(JSON.stringify(supplierForm));
  },
  { immediate: true, deep: true }
);

watch(
  supplierCategories,
  () => {
    if (props.selectedSupplier && props.selectedSupplier.category) {
      supplierForm.category =
        supplierCategories.value.find(
          (c) => c.name === props.selectedSupplier.category
        ) || null;
      // Update initial state again after async population
      initialSupplierForm = JSON.parse(JSON.stringify(supplierForm));
    }
  },
  { deep: true }
);

watch(
  () => supplierForm.bank_name,
  (newBank) => {
    if (newBank) {
      supplierForm.bank_code = bankMap[newBank.name] || "";
    }
  },
  { immediate: true }
);

// Submit handler
const onSubmit = async () => {
  try {
    const payload = {
      name: supplierForm.name,
      supplier_type: supplierForm.supplier_type?.name || null,
      category: supplierForm.category?.name || null,
      contact_name: supplierForm.contact_name,
      phone: supplierForm.phone,
      email: supplierForm.email,
      address: supplierForm.address,
      status: supplierForm.status?.name || "",
      opening_balance: supplierForm.opening_balance || "0",
      balance_date: supplierForm.balance_date,
      vat_reference: supplierForm.vat_reference || "",
      bank_name: supplierForm.bank_name?.name || "",
      bank_code: supplierForm.bank_code,
      account_number: supplierForm.account_number,
      account_holder: supplierForm.account_holder,
    };

    if (supplierForm.id) {
      // Edit mode
      await updateSupplier(supplierForm.id, payload, 1);
      modalTitle.value = "Supplier Updated";
      modalMessage.value = `The details for "${supplierForm.name}" have been successfully updated.`;
    } else {
      // Create mode
      await createSupplier(payload, 1);
      modalTitle.value = "Supplier Created";
      modalMessage.value = "The new supplier has been added to the system.";
    }

    emit("refresh"); // Let parent know to refresh
    isSuccessModalOpen.value = true;
  } catch (error) {
    console.error("Error submitting supplier:", error);
    modalTitle.value = "Operation Failed";
    modalMessage.value =
      error.response?.data?.error || "An unexpected error occurred.";
    isErrorModalOpen.value = true;
  }
};

const handleConfirmDelete = () => {
  emit("delete:supplier", supplierForm.id);
  isDeleteModalOpen.value = false;
};

const handleDelete = () => {
  isDeleteModalOpen.value = true;
};

const handleSuccessModalClose = () => {
  isSuccessModalOpen.value = false;
  close(false); // close the main form
};
</script>

<template>
  <Transition name="slide">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      v-if="modelValue"
      @click.self="close(false)"
    >
      <div
        class="w-full sm:w-[500px] bg-white h-full flex flex-col shadow-xl overflow-hidden"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
        >
          <h2 class="header-text text-text-default">
            {{ supplierForm.id ? "Edit Supplier" : "Create New Supplier" }}
          </h2>
          <LucideX
            class="w-5 h-5 text-gray-500 cursor-pointer"
            @click="close()"
          />
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <!-- Upload Image -->
          <div>
            <UiUpload
              :imagePlaceholder="`/redesign/supplier-placeholder.png`"
            />
          </div>

          <!-- Basic Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1"
                >Supplier Name</label
              >
              <input
                v-model="supplierForm.name"
                type="text"
                placeholder="Enter supplier name"
                class="w-full border rounded-lg px-3 py-2.5 medium-text"
              />
            </div>

            <!-- <div>
              <label class="block text-sm text-gray-600 mb-1"
                >Supplier Type</label
              >
              <UiSelectField
                v-model="supplierForm.supplier_type"
                :options="supplierTypes"
                :placeholder="'Select a type'"
              />
            </div> -->

            <div>
              <label class="block text-sm text-gray-600 mb-1">Category</label>
              <UiSelectField
                v-model="supplierForm.category"
                :options="supplierCategories"
                :placeholder="'Select a category'"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1"
                >Contact Person</label
              >
              <input
                v-model="supplierForm.contact_name"
                type="text"
                placeholder="Enter contact person"
                class="w-full border rounded-lg px-3 py-2.5 medium-text"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">Address</label>
              <input
                v-model="supplierForm.address"
                type="text"
                placeholder="Enter supplier address"
                class="w-full border rounded-lg px-3 py-2.5 medium-text"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">Email</label>
              <input
                v-model="supplierForm.email"
                type="email"
                placeholder="Enter email"
                class="w-full border rounded-lg px-3 py-2.5 medium-text"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1">Phone</label>
              <input
                v-model="supplierForm.phone"
                type="tel"
                placeholder="e.g. 0801 234 5678"
                class="w-full border rounded-lg px-3 py-2.5 medium-text"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1"
                >Opening Balance</label
              >
              <input
                v-model="supplierForm.opening_balance"
                type="number"
                placeholder="₦ Enter balance"
                class="w-full border rounded-lg px-3 py-2.5 medium-text"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 mb-1"
                >Balance Date</label
              >
              <input
                v-model="supplierForm.balance_date"
                type="date"
                class="w-full border rounded-lg px-3 py-2.5 medium-text"
              />
            </div>
          </div>

          <!-- Bank Details -->
          <div>
            <h3 class="text-base font-semibold text-gray-700 mt-4 mb-2">
              Bank Details
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-600 mb-1"
                  >Bank Name</label
                >
                <UiSelectField
                  :displayIcon="LucideBuilding2"
                  v-model="supplierForm.bank_name"
                  :options="supplierBanks"
                  :placeholder="'Select bank'"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-600 mb-1"
                  >Bank Code</label
                >
                <input
                  v-model="supplierForm.bank_code"
                  type="text"
                  placeholder="--"
                  class="w-full border rounded-lg px-3 py-2.5 medium-text"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-600 mb-1"
                  >Account Number</label
                >
                <input
                  v-model="supplierForm.account_number"
                  type="text"
                  placeholder="Enter account number"
                  class="w-full border rounded-lg px-3 py-2.5 medium-text"
                />
              </div>

              <div>
                <label class="block text-sm text-gray-600 mb-1"
                  >Account Holder</label
                >
                <input
                  v-model="supplierForm.account_holder"
                  type="text"
                  placeholder="--"
                  class="w-full border rounded-lg px-3 py-2.5 medium-text"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="border-t px-6 py-4 flex items-center justify-end">
          <button
            v-if="supplierForm.id"
            @click="handleDelete"
            class="flex items-center text-white bg-red-500 hover:bg-red-600 rounded-lg px-2 py-2 text-sm disabled:opacity-50 mr-auto"
            :disabled="isSubmitting"
          >
            <!-- <LucideTrash2 class="w-4 h-4" /> -->
            <TrashIcon class="w-4 h-4 text-white" />
          </button>

          <div class="flex gap-3">
            <button
              @click="close(true)"
              class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button
              @click="onSubmit"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
              :disabled="isSubmitting"
            >
              {{ supplierForm.id ? "Update" : "Create" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <DiscardModal
    @close="isDiscardOpen = !isDiscardOpen"
    @confirm="close(false)"
    :action="'Create New Supplier'"
    :isOpen="isDiscardOpen"
  ></DiscardModal>

  <DeleteModal
    :isOpen="isDeleteModalOpen"
    :supplierName="supplierForm.name"
    @close="isDeleteModalOpen = false"
    @confirm="handleConfirmDelete"
  />

  <SuccessModal
    :modelValue="isSuccessModalOpen"
    @update:modelValue="handleSuccessModalClose"
    :title="modalTitle"
    :message="modalMessage"
  />

  <ErrorModal
    v-model="isErrorModalOpen"
    :title="modalTitle"
    :message="modalMessage"
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


