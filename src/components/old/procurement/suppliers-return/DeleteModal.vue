<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-header">
            <div class="flex items-center gap-2">
              <!-- <LucideTrash class="text-red-500 w-5 h-5" /> -->
               <img src="/trash-icon.png" class="w-5 h-5"/>
              <h2 class="text-lg font-semibold">Delete</h2>
            </div>
            <button
              @click="closeModal"
              class="text-gray-500 hover:text-gray-700"
            >
              <LucideX class="w-5 h-5" />
            </button>
          </div>

          <div class="modal-body">
            <p>
              You are about to delete this supplier
              <strong>"{{ 'Fidson Healthcare' }}"</strong>. This action will
              permanently remove it from the system.
            </p>
          </div>

          <div class="modal-footer text-sm">
            <button @click="closeModal" class="btn-secondary">Cancel</button>
            <button @click="confirmDelete" class="btn-danger">
              Delete Supplier
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">

import { LucideTrash2, LucideX } from "lucide-vue-next";

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

<style scoped>
/* Overlay */
.modal-overlay {
  @apply fixed inset-0 bg-black/50 flex justify-center items-center z-50;
}

/* Modal */
.modal-container {
  @apply bg-white rounded-lg shadow-lg w-full max-w-md p-5;
}

/* Header */
.modal-header {
  @apply flex justify-between items-center border-b pb-2;
}

/* Body */
.modal-body {
  @apply my-4 text-gray-600 text-sm;
}

/* Footer */
.modal-footer {
  @apply flex justify-end gap-2;
}

/* Buttons */
.btn-secondary {
  @apply px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300;
}

.btn-danger {
  @apply px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
