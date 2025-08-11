<script setup lang="ts">
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
          <img src="/redesign/successimg.svg" alt="Success" />
        </div>
        <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ title }}</h2>
        <p class="text-gray-600 mb-6">{{ message }}</p>
        <div class="flex justify-end">
          <button
            @click="closeModal"
            class="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template> 