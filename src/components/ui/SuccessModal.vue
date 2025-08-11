<template>
  <Teleport to="body">
    <div 
      v-if="modelValue" 
      class="fixed inset-0 z-[100] flex items-center justify-center"
      @click.self="$emit('update:modelValue', false)"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-[101]">
        <!-- Success Icon -->
        <div class="flex justify-center pt-8 pb-4">
          <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>
        
        <!-- Content -->
        <div class="px-6 pb-8 text-center">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ title }}</h2>
          <p class="text-gray-600 leading-relaxed">{{ message }}</p>
        </div>
        
        <!-- Footer -->
        <div class="flex justify-center pb-8">
          <button 
            @click="$emit('update:modelValue', false)"
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title: string
  message: string
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script> 