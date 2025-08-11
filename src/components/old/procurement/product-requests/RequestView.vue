
<script setup lang="ts">
import { ref, watch } from "vue";
import { LucideX, LucideCalendar, LucidePhone } from "lucide-vue-next";
import { useModal } from "@/Composables/procurement/useModal";
import { useCategory } from "@/Composables/procurement/useCategory";
import { useSupplierForm } from "@/Composables/procurement/useSupplierForm";
import { Option } from "@/types";
import { onClickOutside } from "@vueuse/core";

// Props and Emits
const props = defineProps<{
  modelValue: boolean;
  selectedRequest?: any; // Accepts supplier object
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
          <h2 class="dropdown-header-text text-[#172B4D]">
            Product Request Details
          </h2>
          <LucideX
            class="w-6 h-6 cursor-pointer medium text text-text-subtlest"
            @click="$emit('close')"
          />
        </div>

        <!-- Fields -->
        <div class="grid grid-cols-2 gap-y-6 gap-x-4 text-sm text-[#172B4D]">
          <div class="medium text">Item Request</div>
          <div class="text-text-subtlest">
            {{ selectedRequest.itemRequest }}
          </div>

          <div class="medium text">Requester’s Name</div>
          <div class="text-text-subtlest">
            {{ selectedRequest.requesterName }}
          </div>

          <div class="medium-text">Phone</div>
          <div class="text-[#44546F] flex items-center gap-2">
            <LucidePhone class="w-4 h-4 text-[#44546F]" />
            {{ selectedRequest.phone }}
          </div>

          <div class="medium-text">Email</div>
          <div class="text-[#44546F]">
            {{ selectedRequest.email || "Unavailable" }}
          </div>

          <div class="medium-text">Date</div>
          <div class="text-[#44546F] flex items-center gap-2">
            <LucideCalendar class="w-4 h-4 text-[#44546F]" />
            {{ selectedRequest.date }}
          </div>
        </div>

        <!-- Divider -->
        <hr class="my-6 border-t border-gray-300" />

        <!-- Request Details -->
        <div>
          <h3 class="medium-text text-[#172B4D] mb-2">Request Details</h3>
          <p class="text-[#44546F] leading-relaxed whitespace-pre-line">
            {{ selectedRequest.details || "Unavailable" }}
          </p>
        </div>
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

