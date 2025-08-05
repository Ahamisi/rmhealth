<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <!-- Delivery Price Input -->
      <div class="flex-1 max-w-sm">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Delivery Price
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-gray-400">
              <path d="M8 1C8.55228 1 9 1.44772 9 2V3H10C11.1046 3 12 3.89543 12 5V11C12 12.1046 11.1046 13 10 13H6C4.89543 13 4 12.1046 4 11V5C4 3.89543 4.89543 3 6 3H7V2C7 1.44772 7.44772 1 8 1ZM6 5V11H10V5H6ZM7.5 6.5C7.77614 6.5 8 6.72386 8 7V8.5H9.5C9.77614 8.5 10 8.72386 10 9C10 9.27614 9.77614 9.5 9.5 9.5H8V11C8 11.2761 7.77614 11.5 7.5 11.5C7.22386 11.5 7 11.2761 7 11V9.5H5.5C5.22386 9.5 5 9.27614 5 9C5 8.72386 5.22386 8.5 5.5 8.5H7V7C7 6.72386 7.22386 6.5 7.5 6.5Z" fill="currentColor"/>
            </svg>
          </div>
          <input
            :value="modelValue"
            @input="handleInput"
            type="text"
            placeholder="0.00"
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-3">
        <button
          @click="$emit('add-batch')"
          class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Add Batch</span>
        </button>

        <button
          @click="$emit('reset-price')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Reset Delivery Price
        </button>

        <button
          @click="$emit('set-zero')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Set Delivery Price to Zero
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'add-batch'): void
  (e: 'reset-price'): void
  (e: 'set-zero'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script> 