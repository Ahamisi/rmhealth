<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      :class="[
        'flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        className
      ]"
    >
      <span class="text-gray-700">{{ selectedLabel }}</span>
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        :class="{ 'rotate-180': isOpen }"
        class="transition-transform duration-200 text-gray-400"
      >
        <path d="M7 10l5 5 5-5z"/>
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50"
    >
      <div 
        v-for="option in options" 
        :key="option.value"
        @click="selectOption(option)"
        class="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer first:rounded-t-md last:rounded-b-md"
        :class="{ 'bg-blue-50 text-blue-700': modelValue === option.value }"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Option {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: Option[]
  placeholder?: string
  className?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select...',
  className: ''
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

// Computed selected label
const selectedLabel = computed(() => {
  const selectedOption = props.options.find(option => option.value === props.modelValue)
  return selectedOption?.label || props.placeholder
})

// Toggle dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// Select option
const selectOption = (option: Option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script> 