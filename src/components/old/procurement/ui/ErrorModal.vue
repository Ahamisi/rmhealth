<script setup lang="ts">
import ErrorIcon from "@/Components/procurement/icons/ErrorIcon.vue";

defineProps<{
  modelValue: boolean;
  title: string;
  message: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const closeModal = () => {
  emit("update:modelValue", false);
};
</script>

<template>
  <teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center"
      >
        <div class="flex justify-center mb-4">
          <ErrorIcon />
        </div>
        <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ title }}</h2>
        <p class="text-gray-600 mb-6">{{ message }}</p>
        <div class="flex justify-end">
          <button
            @click="closeModal"
            class="bg-[#F5CD47] text-white px-8 py-2 rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template> 