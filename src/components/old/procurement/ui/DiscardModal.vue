<script setup lang="ts">

import { LucideX } from "lucide-vue-next";

defineProps<{
  isOpen: boolean;
  action: string;
}>();

const emit = defineEmits(["close", "confirm"]);

const closeModal = () => {
  emit("close");
};

const confirmDiscard = () => {
  emit("close");
  emit("confirm");
};
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <div class="flex items-center gap-2">
              <img src="/redesign/warning.svg" alt="Warning" class="w-5 h-5" />
              <p class="text-[#172B4D] font-semibold text-sm">
                Discard Changes?
              </p>
            </div>
            <button
              @click="closeModal"
              class="text-gray-500 hover:text-gray-700"
            >
              <LucideX class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body alert-text text-[#44546F]">
            You are about to leave the
            <span class="alert-bold-text text-text-default">{{ action }}</span>
            process. Any unsaved information will be lost.
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button @click="closeModal" class="btn-cancel medium-text">
              Cancel
            </button>
            <button @click="confirmDiscard" class="btn-discard medium-text">
              Discard Changes
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black/50 flex justify-center items-center z-50;
}

.modal-container {
  @apply bg-white rounded-lg shadow-lg w-full max-w-sm p-5;
}

.modal-header {
  @apply flex justify-between items-center border-b border-[#091E4224] pb-3;
}

.modal-body {
  @apply py-4 text-[#44546F];
}

.modal-footer {
  @apply flex justify-end gap-2 pt-4;
}

.btn-cancel {
  @apply px-4 py-2 text-[#344563] bg-[#F1F2F4] rounded-md hover:bg-[#DFE1E6];
}

.btn-discard {
  @apply px-4 py-2 bg-[#F5CD47] text-white rounded-md;
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
