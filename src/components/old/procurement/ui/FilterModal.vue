<template>
  <!-- <div class="modal-overlay"></div> -->
  <!-- v-if="isOpen" -->
  <div class="" @click.stop>
    <div @click.self="closeModal" class="modal-container">
      <div class="px-6 mt-2">
        <h3 class="modal-title">Filter</h3>
      </div>

      <div class="border border-gray-200"></div>
      <div class="px-6 space-y-4 pb-4">
        <!-- Date Range Filters -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">From</label>
            <div class="input-container">
              <input
                type="date"
                v-model="localFilters.fromDate"
                class="bg-white input text-sm text-gray-500"
              />
              <!-- <LucideCalendar class="icon" /> -->
            </div>
          </div>
          <div>
            <label class="label">To</label>
            <div class="input-container">
              <input
                type="date"
                v-model="localFilters.toDate"
                class="bg-white input text-sm text-gray-500"
              />
              <!-- <LucideCalendar class="icon" /> -->
            </div>
          </div>
        </div>

        <!-- Category Dropdown -->
        <div>
          <label class="label">Category</label>
          <UiSelectField
            :model-value="localFilters.category"
            @update:modelValue="localFilters.category = $event"
            :options="supplierCategories"
            :placeholder="`All categories`"
            class="text-sm"
            :reduce="(option) => option.name"
          />
        </div>

        <!-- Status Dropdown -->
        <div>
          <label class="label">Status</label>
          <UiSelectField
            :model-value="localFilters.status"
            @update:modelValue="localFilters.status = $event"
            :options="statuses"
            :placeholder="`All statuses`"
            class="text-sm"
            :reduce="(option) => option.name"
          />
        </div>

        <!-- Buttons -->
        <div class="flex justify-between mt-4">
          <button class="btn-reset" @click="resetFilters">Reset all</button>
          <button class="btn-apply" @click="applyFilters">Apply</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { LucideCalendar } from "lucide-vue-next";
import { useCategory } from "@/Composables/procurement/useCategory";
import { useStatus } from "@/Composables/procurement/useStatus";
import UiSelectField from "@/Components/procurement/ui/SelectField.vue";

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close", "apply"]);

// Sample categories and statuses
// const categories = ["Electronics", "Furniture", "Clothing", "Food"];
// const statuses = ["Active", "Inactive", "Pending"];
const { supplierCategory, supplierCategories } = useCategory();
const { status, statuses } = useStatus();

// Filter state
const localFilters = ref({
  fromDate: "",
  toDate: "",
  category: "",
  status: "",
});

// Close modal
const closeModal = () => {
  emit("close");
};

// Reset filters
const resetFilters = () => {
  localFilters.value = { fromDate: "", toDate: "", category: "", status: "" };
};

// Apply filters and send data to parent
const applyFilters = () => {
  emit("apply", localFilters.value);
  closeModal();
};
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50;
}

.modal-container {
  @apply bg-white shadow-lg rounded-lg w-[427px] space-y-4;
}

.modal-title {
  @apply font-semibold mb-4 text-gray-600;
}

.label {
  @apply text-gray-600 text-xs font-medium block mb-1;
}

.input {
  @apply w-full px-3 py-2 border-[2px] border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300;
}

.input-container {
  @apply relative;
}

.icon {
  @apply absolute top-2 right-2 text-gray-600 w-5 h-5;
}

.btn-reset {
  @apply bg-gray-200 px-4 py-2 rounded-md text-gray-600 text-xs;
}

.btn-apply {
  @apply bg-blue-600 px-4 py-2 rounded-md text-white text-xs;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
