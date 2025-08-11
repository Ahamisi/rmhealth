<!-- Payment view -->
<script setup lang="ts">
import { ref, watch } from "vue";
import {
  LucideX,
  LucideCalendar,
  LucideUser,
  LucideFileText,
  LucideHash,
  LucideCircleDollarSign,
} from "lucide-vue-next";
import { useModal } from "@/Composables/procurement/useModal";
import { useCategory } from "@/Composables/procurement/useCategory";
import { useSupplierForm } from "@/Composables/procurement/useSupplierForm";
import { Option } from "@/types";
import { onClickOutside } from "@vueuse/core";

// Props and Emits
const props = defineProps<{
  modelValue: boolean;
  selectedPayment?: any; // Accepts supplier object
}>();
const emit = defineEmits(["close"]);

// Supplier dropdown data
const supplierTypes = ref<Option[]>([
  { id: 1, name: "Local" },
  { id: 2, name: "Overseas" },
]);

const closeDropdown = () => {
  emit("close");
};
</script>

<template>
  <Transition name="slide">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50"
      v-if="modelValue"
      @click.self="$emit('close')"
    >
      <div
        class="bg-white w-full sm:w-1/2 h-full shadow-lg overflow-y-auto transition-transform p-6"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="dropdown-header-text text-[#172B4D]">Payment Details</h2>
          <LucideX
            class="w-6 h-6 cursor-pointer medium text text-text-subtlest"
            @click="$emit('close')"
          />
        </div>

        <!-- Fields -->
        <div
          class="grid grid-cols-2 gap-y-6 gap-x-4 text-sm text-[#172B4D]"
          v-if="selectedPayment"
        >
          <div class="medium text">Document No</div>
          <div class="text-text-subtlest flex items-center gap-2">
            <LucideFileText class="w-4 h-4 text-[#44546F]" />
            {{ selectedPayment.docNo }}
          </div>

          <div class="medium text">Supplier's Name</div>
          <div class="text-text-subtlest flex items-center gap-2">
            <LucideUser class="w-4 h-4 text-[#44546F]" />
            {{ selectedPayment.supplierName }}
          </div>

          <div class="medium-text">Reference</div>
          <div class="text-text-subtlest flex items-center gap-2">
            <LucideHash class="w-4 h-4 text-[#44546F]" />
            {{ selectedPayment.reference }}
          </div>

          <div class="medium-text">Date</div>
          <div class="text-[#44546F] flex items-center gap-2">
            <LucideCalendar class="w-4 h-4 text-[#44546F]" />
            {{ selectedPayment.date }}
          </div>
          <div class="medium-text">Amount</div>
          <div class="text-[#44546F] flex items-center gap-2">
            <LucideCircleDollarSign class="w-4 h-4 text-[#44546F]" />
            {{ selectedPayment.amount }}
          </div>
        </div>

        <!-- Divider -->
        <hr class="my-6 border-t border-gray-300" />
      </div>
    </div>
  </Transition>
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

