<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center justify-center w-10 h-10 text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99999 13H17L18 11H5.99999L6.99999 13ZM3.99299 6C3.44499 6 3.20299 6.405 3.44699 6.895L3.99999 8H20L20.553 6.895C20.8 6.4 20.555 6 20.007 6H3.99299ZM10.778 17.556C10.8509 17.6861 10.9561 17.7953 11.0834 17.8731C11.2107 17.9508 11.3559 17.9945 11.505 18H12.495C12.774 18 13.1 17.8 13.222 17.556L14 16H9.99999L10.778 17.556Z" fill="#44546F"/>
      </svg>
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      >
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Filter</h3>
          
          <div class="space-y-4">
            <!-- Date Range -->
            <div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="text"
                    placeholder="10-10-24"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="text"
                    placeholder="11-11-24"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                </div>
              </div>
            </div>

            <!-- Amount Range -->
            <div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Lowest Amount</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                    <input
                      type="text"
                      placeholder="--"
                      class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                  </div>
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Highest Amount</label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                    <input
                      type="text"
                      placeholder="--"
                      class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Type -->
            <div>
              <label class="block text-xs text-gray-500 mb-1">Order Type</label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>All Order Types</option>
                <option>Trade</option>
                <option>Cash</option>
                <option>Credit</option>
              </select>
            </div>

            <!-- State -->
            <div>
              <label class="block text-xs text-gray-500 mb-1">State</label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>All States</option>
                <option>Lagos</option>
                <option>Abuja</option>
                <option>Kano</option>
              </select>
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-xs text-gray-500 mb-1">Tags</label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>All Tags</option>
                <option>Cash and Carry</option>
                <option>Controlled</option>
                <option>Hospital</option>
              </select>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-between pt-4 mt-4 border-t border-gray-200">
            <button
              @click="resetAll"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Reset all
            </button>
            <button
              @click="apply"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const emit = defineEmits<{
  apply: [filters?: any]
}>()

const isOpen = ref(false)
const dropdownRef = ref()

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const resetAll = () => {
  // TODO: Reset all form fields
  console.log('Reset all filters')
}

const apply = () => {
  // TODO: Apply filters
  console.log('Apply filters')
  emit('apply', {})
  closeDropdown()
}

onClickOutside(dropdownRef, closeDropdown)
</script> 