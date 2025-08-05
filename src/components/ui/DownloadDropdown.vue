<template>
  <div class="relative" ref="dropdownRef">
    <button @click="toggleDropdown" class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500" style="background-color: #091E420F;">
      <slot name="icon"></slot>
      <span>{{ buttonText }}</span>
    </button>
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="isOpen" class="absolute right-0 mt-2 w-80 origin-top-right bg-white rounded-lg shadow-lg border z-50">
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ title }}</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-gray-500 mb-1">From</label>
                <DatePicker v-model="form.fromDate" />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">To</label>
                <DatePicker v-model="form.toDate" />
              </div>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Status</label>
              <select v-model="form.status" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                <option value="None">None</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 flex justify-end">
          <button @click="handleDownload" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Download
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { onClickOutside } from '@vueuse/core';
import DatePicker from './DatePicker.vue';

interface Props {
  title: string;
  buttonText: string;
}
defineProps<Props>();

const emit = defineEmits<{
  (e: 'download', payload: any): void;
}>();

const isOpen = ref(false);
const dropdownRef = ref(null);
const form = reactive({
  fromDate: '',
  toDate: '',
  status: 'None',
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const handleDownload = () => {
  emit('download', { ...form });
  closeDropdown();
};

onClickOutside(dropdownRef, closeDropdown);
</script> 