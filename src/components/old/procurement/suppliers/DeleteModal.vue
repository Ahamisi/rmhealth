<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 flex justify-center items-center z-[60]"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-lg shadow-lg w-full max-w-sm p-5">
          <div class="flex justify-center mb-4">
            <div
              class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
            >
              <TrashIcon class="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h2 class="text-center font-semibold text-lg text-gray-800 mb-2">
            Delete Supplier?
          </h2>
          <p class="text-center text-sm text-gray-600 mb-6">
            Are you sure you want to delete supplier
            <span class="font-bold">{{ supplierName || "this supplier" }}</span
            >? This action cannot be undone.
          </p>
          <div class="flex justify-center gap-4">
            <button
              @click="closeModal"
              class="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              @click="confirmDelete"
              class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
            >
              Delete Supplier
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">

import { LucideX } from "lucide-vue-next";
import TrashIcon from "@/Components/procurement/icons/TrashIcon.vue";

defineProps<{
  isOpen: boolean;
  supplierName?: string;
}>();

const emit = defineEmits(["close", "confirm"]);

const closeModal = () => {
  emit("close");
};

const confirmDelete = () => {
  emit("confirm");
};
</script>

<script lang="ts">
export default {
  name: "DeleteModal",
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
