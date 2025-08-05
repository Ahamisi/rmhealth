<template>
  <div class="relative w-full">
    <input
      :value="formattedDate"
      @input="updateValue"
      @focus="showPicker = true"
      type="text"
      :placeholder="placeholder"
      class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
    />
    <div
      class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="text-gray-400"
      >
        <path
          d="M13 2.66669H3C2.26667 2.66669 1.66667 3.26669 1.66667 4.00002V14C1.66667 14.7334 2.26667 15.3334 3 15.3334H13C13.7333 15.3334 14.3333 14.7334 14.3333 14V4.00002C14.3333 3.26669 13.7333 2.66669 13 2.66669Z"
          stroke="#97A0AF"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.6667 1.33331V3.99998"
          stroke="#97A0AF"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M5.33333 1.33331V3.99998"
          stroke="#97A0AF"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M1.66667 6.66669H14.3333"
          stroke="#97A0AF"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <input
      v-if="showPicker"
      ref="dateInput"
      type="date"
      class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      @change="handleDateChange"
      @blur="showPicker = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const dateInput = ref<HTMLInputElement | null>(null)

const formattedDate = computed(() => {
  if (!props.modelValue) return ''
  try {
    const [year, month, day] = props.modelValue.split('-')
    return `${day}/${month}/${year.slice(-2)}`
  } catch {
    return props.modelValue
  }
})

const updateValue = (event: Event) => {
  // This allows manual typing, though the date picker is preferred
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  showPicker.value = false
}

</script> 