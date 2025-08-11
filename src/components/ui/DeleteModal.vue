<template>
  <Teleport to="body">
    <div 
      v-if="modelValue" 
      class="fixed inset-0 z-[100] flex items-center justify-center"
      @click.self="$emit('update:modelValue', false)"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-[101]">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <img src="/src/assets/icons/trash.svg" alt="Delete" class="w-6 h-6 text-red-600" />
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Delete</h2>
          </div>
          <button 
            @click="$emit('update:modelValue', false)"
            class="text-gray-400 hover:text-gray-600"
          >
            <img src="/src/assets/icons/x-icon.svg" alt="Close" class="w-6 h-6" />
          </button>
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <p class="text-gray-700">
            {{ message }}
          </p>
        </div>
        
        <!-- Footer -->
        <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button 
            @click="$emit('update:modelValue', false)"
            class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="$emit('confirm')"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            {{ confirmText || 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  message: string
  confirmText?: string
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
}>()
</script> 