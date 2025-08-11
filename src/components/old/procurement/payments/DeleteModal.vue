<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 flex justify-center items-center z-[60]"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-lg shadow-lg w-full max-w-sm p-5">
          <!-- <div class="flex justify-center mb-4">
            <TrashIcon />
          </div> -->
          <div class="flex items-center gap-2">
            <!-- <LucideTrash class="text-red-500 w-5 h-5" /> -->
            <img src="/redesign/trash-icon.png" class="w-5 h-5" />
            <p class="dropdown-header-text">Delete Payment</p>
          </div>

          <!-- <h2 class="text-center font-semibold text-lg text-gray-800 mb-2">
            Delete Payment?
          </h2> -->

          <p class="text-center text-sm text-gray-600 mb-6">
            Are you sure you want to delete the payment for
            <span class="font-bold">{{ paymentName || "this payment" }}</span
            >? This action cannot be undone.
          </p>

          <div class="flex justify-end gap-2">
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
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">

import { LucideX, LucideTrash2 } from "lucide-vue-next";
import ErrorIcon from "@/Components/procurement/icons/ErrorIcon.vue";
import TrashIcon from "@/Components/procurement/icons/TrashIcon.vue";

defineProps<{
  isOpen: boolean;
  paymentName?: string;
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
