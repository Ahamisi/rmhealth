<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center justify-center w-10 h-10 text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.25 5V18M8.25 18L5 14.75M8.25 18L11.5 14.75M16.375 18V5M16.375 5L13.125 8.25M16.375 5L19.625 8.25" stroke="#44546F" stroke-width="1.625" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Main Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div 
        v-if="isOpen" 
        class="absolute left-0 mt-2 w-56 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 p-2"
      >
        <div class="space-y-1">
          <a 
            v-for="item in primarySortItems" 
            :key="item.key" 
            @click="setSortBy(item.key)" 
            href="#"
            :class="['flex items-center px-3 py-2 text-sm rounded-md', 
              sortState.by === item.key ? 'text-gray-900' : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            <div class="w-5 flex-shrink-0">
              <div v-if="sortState.by === item.key" class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            </div>
            {{ item.label }}
          </a>

          <!-- More Submenu -->
          <div 
            class="relative" 
            @mouseenter="showMore = true" 
            @mouseleave="showMore = false"
          >
            <a 
              href="#" 
              :class="['flex items-center justify-between px-3 py-2 text-sm rounded-md',
                isMoreActive ? 'bg-gray-100' : 'hover:bg-gray-100 text-gray-700'
              ]"
            >
              <span class="ml-5">More</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>

            <!-- Submenu Panel -->
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div 
                v-if="showMore" 
                class="absolute left-full -top-2 ml-1 w-56 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 p-2"
              >
                <a 
                  v-for="item in moreSortItems" 
                  :key="item.key" 
                  @click="setSortBy(item.key)" 
                  href="#"
                  :class="['flex items-center px-3 py-2 text-sm rounded-md',
                    sortState.by === item.key ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                   {{ item.label }}
                </a>
              </div>
            </Transition>
          </div>
        </div>

        <div class="border-t border-gray-200 my-2"></div>

        <div class="space-y-1">
          <a 
            @click="setSortOrder('asc')" 
            href="#" 
            :class="['flex items-center px-3 py-2 text-sm rounded-md',
              sortState.order === 'asc' ? 'text-gray-900' : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            <div class="w-5 flex-shrink-0">
              <div v-if="sortState.order === 'asc'" class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            </div>
            Ascending
          </a>
          <a 
            @click="setSortOrder('desc')" 
            href="#" 
            :class="['flex items-center px-3 py-2 text-sm rounded-md',
              sortState.order === 'desc' ? 'text-gray-900' : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            <div class="w-5 flex-shrink-0">
              <div v-if="sortState.order === 'desc'" class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            </div>
            Descending
          </a>
          <a @click="resetSort" href="#" class="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
            <span class="ml-5">(Reset to default)</span>
          </a>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'

const emit = defineEmits<{
  (e: 'sort', payload: { by: string, order: 'asc' | 'desc' }): void
}>()

const isOpen = ref(false)
const showMore = ref(false)
const dropdownRef = ref()

const sortState = reactive({
  by: 'customerName',
  order: 'asc' as 'asc' | 'desc'
})

const primarySortItems = [
  { key: 'customerName', label: 'Customer Name' },
  { key: 'storeName', label: 'Store Name' },
  { key: 'orderDate', label: 'Order Date' },
]

const moreSortItems = [
  { key: 'deliveryDate', label: 'Delivery Date' },
  { key: 'totalAmount', label: 'Total Amount' },
]

const isMoreActive = computed(() => moreSortItems.some(item => item.key === sortState.by))

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
  showMore.value = false
}

const setSortBy = (key: string) => {
  sortState.by = key
  emit('sort', sortState)
  if (!moreSortItems.some(item => item.key === key)) {
    closeDropdown()
  }
}

const setSortOrder = (order: 'asc' | 'desc') => {
  sortState.order = order
  emit('sort', sortState)
  closeDropdown()
}

const resetSort = () => {
  sortState.by = 'customerName'
  sortState.order = 'asc'
  emit('sort', sortState)
  closeDropdown()
}

onClickOutside(dropdownRef, closeDropdown)
</script> 