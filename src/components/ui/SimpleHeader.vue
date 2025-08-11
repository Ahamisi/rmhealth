<template>
  <div class="bg-white border-b border-gray-200 pb-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <!-- Search with Filter (Segmented) -->
      <div v-if="isSearchable" class="relative flex-1 max-w-md">
        <div class="flex">
          <!-- Search Input -->
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <img src="/src/assets/icons/search-icon.svg" alt="Search" class="w-4 h-4">
            </div>
            <input 
              type="text" 
              :value="searchTerm"
              @input="onSearch"
              placeholder="Search..." 
              :class="[
                'w-full bg-white border-2 border-[#091E4224] pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                filterEnabled ? 'rounded-l-[16px] border-r-0' : 'rounded-[16px]'
              ]"
            >
          </div>
          
          <!-- Filter Button (Attached) -->
          <div v-if="filterEnabled" class="relative" ref="filterButtonContainerRef">
            <button 
              @click="toggleFilterPopover"
              :class="[
                'flex items-center justify-center w-10 h-10 text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500',
                'border-t-2 border-r-2 border-b-2 border-l-0 border-[#091E4224]',
                'rounded-tr-[16px] rounded-br-[16px] rounded-tl-0 rounded-bl-0',
                showFilterPopover ? 'bg-gray-50' : ''
              ]"
            >
              <img src="/src/assets/icons/filter.svg" alt="Filter" class="w-4 h-4">
            </button>
            
            <!-- Filter Popover -->
            <div v-if="showFilterPopover" class="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900">Filter</h3>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <div class="relative">
                      <input
                        type="date"
                        v-model="filterFromDate"
                        class="w-full bg-white border-2 border-[#091E4224] rounded-[8px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <div class="relative">
                      <input
                        type="date"
                        v-model="filterToDate"
                        class="w-full bg-white border-2 border-[#091E4224] rounded-[8px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center justify-between pt-2">
                  <button
                    @click="resetFilter"
                    class="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Reset all
                  </button>
                  <button
                    @click="applyFilter"
                    class="px-6 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-2">
        <!-- Sort Dropdown -->
        <div v-if="sortableColumns.length > 0" class="relative" ref="sortDropdownRef">
          <button 
            @click="showSortDropdown = !showSortDropdown"
            class="flex items-center justify-center w-10 h-10 text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <img src="/src/assets/icons/arrow-up-down.svg" alt="Sort" class="w-4 h-4">
          </button>
          
          <!-- Sort Dropdown Menu -->
          <div v-if="showSortDropdown" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div class="py-1">
              <button
                v-for="column in sortableColumns"
                :key="column.field"
                @click="handleSort(column)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
              >
                <span>{{ column.label }}</span>
                <div v-if="sortBy === column.field" class="flex items-center">
                  <svg v-if="sortOrder === 'asc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14L12 9L17 14H7Z"/>
                  </svg>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10L12 15L17 10H7Z"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Export Button -->
        <button 
          v-if="isExportable"
          @click="handleExport"
          class="flex items-center justify-center w-10 h-10 text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <img src="/src/assets/icons/download.svg" alt="Export" class="w-4 h-4">
        </button>

        <!-- Print Button -->
        <button 
          v-if="isPrintable"
          @click="handlePrint"
          class="flex items-center justify-center w-10 h-10 text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 8H5C4.20435 8 3.44129 8.31607 2.87868 8.87868C2.31607 9.44129 2 10.2043 2 11V17C2 17.7956 2.31607 18.5587 2.87868 19.1213C3.44129 19.6839 4.20435 20 5 20H6V16H18V20H19C19.7956 20 20.5587 19.6839 21.1213 19.1213C21.6839 18.5587 22 17.7956 22 17V11C22 10.2043 21.6839 9.44129 21.1213 8.87868C20.5587 8.31607 19.7956 8 19 8ZM8 18V14H16V18H8ZM19 6H5V2H19V6Z" fill="#44546F"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { TableColumn } from '@/types/datatable'

interface Props {
  searchTerm: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  sortableColumns: Array<{ field: string; label: string }>
  isSearchable?: boolean
  isPrintable?: boolean
  isExportable?: boolean
  filterEnabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSearchable: true,
  isPrintable: false,
  isExportable: false,
  filterEnabled: false
})

const emit = defineEmits<{
  search: [searchTerm: string]
  sort: [sort: { field: string; type: 'asc' | 'desc' }]
  export: []
  print: []
  filter: [filterData: { fromDate: string; toDate: string }]
}>()

// State
const showSortDropdown = ref(false)
const showFilterPopover = ref(false)
const filterFromDate = ref('')
const filterToDate = ref('')
const sortDropdownRef = ref()
const filterButtonContainerRef = ref()

// Close dropdowns when clicking outside
onClickOutside(sortDropdownRef, () => {
  showSortDropdown.value = false
})

onClickOutside(filterButtonContainerRef, () => {
  showFilterPopover.value = false
})

// Methods
const onSearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('search', target.value)
}

const handleSort = (column: { field: string; label: string }) => {
  const newOrder = props.sortBy === column.field && props.sortOrder === 'asc' ? 'desc' : 'asc'
  emit('sort', { field: column.field, type: newOrder })
  showSortDropdown.value = false
}

const toggleFilterPopover = () => {
  showFilterPopover.value = !showFilterPopover.value
}

const resetFilter = () => {
  filterFromDate.value = ''
  filterToDate.value = ''
}

const applyFilter = () => {
  emit('filter', {
    fromDate: filterFromDate.value,
    toDate: filterToDate.value
  })
  showFilterPopover.value = false
}

const handleExport = () => {
  emit('export')
}

const handlePrint = () => {
  emit('print')
}
</script>

<style scoped>
</style> 