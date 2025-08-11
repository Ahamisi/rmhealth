<template>
  <div class="relative" ref="dropdownRef">
    <div 
      @click="toggleDropdown"
      class="w-full bg-white border-2 border-[#091E4224] rounded-[16px] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer min-h-[44px] flex items-center justify-between"
    >
      <span v-if="selectedItems.length === 0" class="text-gray-500">{{ placeholder }}</span>
      <div v-else class="flex flex-wrap gap-1 flex-1">
        <span 
          v-for="item in selectedItemLabels" 
          :key="item"
          class="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
        >
          {{ item }}
        </span>
      </div>
      
      <svg 
        class="w-4 h-4 text-gray-500 transition-transform ml-2 flex-shrink-0" 
        :class="{ 'rotate-180': isOpen }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    
    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen" 
      class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <div class="py-1">
        <label 
          v-for="option in options" 
          :key="option.value"
          class="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
        >
          <input
            type="checkbox"
            :value="option.value"
            :checked="selectedItems.includes(option.value)"
            @change="toggleOption(option.value)"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          >
          <span class="ml-3 text-sm text-gray-700">{{ option.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'

interface Option {
  value: string
  label: string
}

interface Props {
  modelValue: string[]
  options: Option[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select options...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const isOpen = ref(false)
const dropdownRef = ref()

const selectedItems = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedItemLabels = computed(() => {
  return props.modelValue.map(value => {
    const option = props.options.find(opt => opt.value === value)
    return option ? option.label : value
  })
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const toggleOption = (value: string) => {
  const currentSelection = [...selectedItems.value]
  const index = currentSelection.indexOf(value)
  
  if (index > -1) {
    currentSelection.splice(index, 1)
  } else {
    currentSelection.push(value)
  }
  
  selectedItems.value = currentSelection
}

onClickOutside(dropdownRef, () => {
  isOpen.value = false
})
</script> 