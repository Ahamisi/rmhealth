<template>
  <div class="min-h-screen bg-gray-50">
    <!-- App Header with Navigation -->
    <AppHeader />

    <main class="px-4 sm:px-6 lg:px-8 py-6">
      <!-- Page Header -->
      <div class="mb-6">
        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-sm mb-4" style="color: #626F86; font-size: 14px;">
          <span>Log Book</span>
        </nav>
      </div>

      <!-- Search and Download Header -->
      <div class="p-0 mb-4 rounded-lg flex items-center justify-between" style="background-color: #f9fafb;">
        <!-- Search with Sort -->
        <div class="flex items-center">
          <!-- Search Input -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <img src="/icons/search-icon.svg" alt="Search" class="w-4 h-4">
            </div>
            <input 
              v-model="searchTerm"
              @input="onSearch"
              type="text" 
              placeholder="Search..." 
              class="w-80 bg-white border-2 border-[#091E4224] rounded-l-[8px] pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent border-r-0"
            >
          </div>
          
          <!-- Sort Button (Attached) -->
          <div class="relative" ref="sortDropdownRef">
            <button 
              @click="showSortDropdown = !showSortDropdown"
              class="flex items-center justify-center w-10 h-10 text-gray-600 bg-white border-2 border-[#091E4224] border-l-1 rounded-r-[8px] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <img src="/icons/arrow-up-down.svg" alt="Sort" class="w-4 h-4">
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
        </div>
        
        <!-- Download Button -->
        <button 
          @click="downloadLogBooks"
          class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <img src="/icons/download.svg" alt="Download" class="w-6 h-6 icon-white" />
          <span>Download Log Books</span>
        </button>
      </div>

      <!-- Data Table -->
      <Card class="p-0" noPadding>
        <StaticDatatable 
          :columns="logBookColumns" 
          :data="filteredData"
          :searchable="false"
          :exportable="false"
          :printable="false"
          :perPage="10"
                >
          <template #column="{ props: { row, column } }">
            <div v-if="column.field === 'actions'" class="flex items-center justify-center space-x-2">
              <button 
                @click="viewLogBook(row)"
                class="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                title="View Log Book"
              >
                <img src="/icons/eye.svg" alt="View" class="w-4 h-4" />
              </button>
              <button 
                @click="editLogBook(row)"
                class="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                title="Edit Log Book"
              >
                <img src="/icons/pen.svg" alt="Edit" class="w-4 h-4" />
              </button>
            </div>
            <span v-else>{{ row[column.field] }}</span>
          </template>
        </StaticDatatable>
      </Card>
    </main>

    <!-- Filter Modal -->
    <LogBookFilterModal
      :show="showFilterModal"
      :filters="filters"
      @close="showFilterModal = false"
      @apply="handleFilterApply"
      @reset="handleFilterReset"
    />


  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import AppHeader from '@/components/layout/AppHeader.vue'
import Card from '@/components/ui/Card.vue'
import LogBookFilterModal from '@/components/outbound/LogBookFilterModal.vue'
import StaticDatatable from '@/components/ui/StaticDatatable.vue'

interface LogBook {
  id: string
  driverName: string
  orderCount: number
  state: string
  deliveryTimeline: string
}

interface Filters {
  dateFrom: string
  dateTo: string
  state: string
}

const router = useRouter()

// Table columns for log books
const logBookColumns = ref([
  { field: 'id', label: 'ID', sortable: true },
  { field: 'driverName', label: 'Driver Name', sortable: true },
  { field: 'orderCount', label: 'Order Count', sortable: true },
  { field: 'state', label: 'State', sortable: true },
  { field: 'deliveryTimeline', label: 'Delivery Timeline', sortable: true },
  { field: 'actions', label: 'Actions', sortable: false },
])

// Search and sort state
const searchTerm = ref('')
const sortBy = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const showSortDropdown = ref(false)
const sortDropdownRef = ref()
const showFilterModal = ref(false)

// Sortable columns
const sortableColumns = logBookColumns.value.filter(col => col.sortable)

// Filters
const filters = ref<Filters>({
  dateFrom: '',
  dateTo: '',
  state: ''
})

// Mock data
const logBooks = ref<LogBook[]>([
  { id: '15', driverName: 'Oluwatosin Adegboye', orderCount: 0, state: 'Lagos', deliveryTimeline: '16/01/2025 - 16:34:54s' },
  { id: '14', driverName: 'Janet Adeajayi', orderCount: 1, state: 'Lagos', deliveryTimeline: '16/01/2025 - 16:34:54s' },
  { id: '13', driverName: 'Henry Christopher', orderCount: 0, state: 'Lagos', deliveryTimeline: '16/01/2025 - 16:34:54s' },
  { id: '12', driverName: 'Oluwatosin Adegboye', orderCount: 0, state: 'Lagos', deliveryTimeline: '16/01/2025 - 16:34:54s' },
  { id: '11', driverName: 'Janet Adeajayi', orderCount: 0, state: 'Lagos', deliveryTimeline: '16/01/2025 - 16:34:54s' },
  { id: '10', driverName: 'Henry Christopher', orderCount: 0, state: 'Lagos', deliveryTimeline: '16/01/2025 - 16:34:54s' },
  { id: '09', driverName: 'Oluwatosin Adegboye', orderCount: 0, state: 'Lagos', deliveryTimeline: '16/01/2025 - 16:34:54s' },
  { id: '08', driverName: 'Janet Adeajayi', orderCount: 1, state: 'Lagos', deliveryTimeline: '16/01/2025 - 16:34:54s' },
  { id: '07', driverName: 'Henry Christopher', orderCount: 0, state: 'Lagos', deliveryTimeline: '16/01/2025 - 16:34:54s' },
  { id: '06', driverName: 'Oluwatosin Adegboye', orderCount: 1, state: 'Lagos', deliveryTimeline: '16/01/2025 - 16:34:54s' },
  { id: '05', driverName: 'Janet Adeajayi', orderCount: 0, state: 'Lagos', deliveryTimeline: '16/01/2025 - 16:34:54s' },
  { id: '04', driverName: 'Henry Christopher', orderCount: 1, state: 'Lagos', deliveryTimeline: '16/01/2025 - 16:34:54s' },
  { id: '03', driverName: 'Oluwatosin Adegboye', orderCount: 0, state: 'Lagos', deliveryTimeline: '16/01/2025 - 16:34:54s' },
  { id: '02', driverName: 'Janet Adeajayi', orderCount: 1, state: 'Lagos', deliveryTimeline: '16/01/2025 - 16:34:54s' },
  { id: '01', driverName: 'Henry Christopher', orderCount: 0, state: 'Lagos', deliveryTimeline: '16/01/2025 - 16:34:54s' }
])

// Click outside to close sort dropdown
onClickOutside(sortDropdownRef, () => {
  showSortDropdown.value = false
})

// Filtered data
const filteredData = computed(() => {
  let result = [...logBooks.value]
  
  // Apply search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    result = result.filter(item => {
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(search)
      )
    })
  }

  // Apply state filter
  if (filters.value.state) {
    result = result.filter(logBook => logBook.state === filters.value.state)
  }
  
  // Apply sorting
  if (sortBy.value) {
    result.sort((a, b) => {
      const aValue = a[sortBy.value as keyof LogBook]
      const bValue = b[sortBy.value as keyof LogBook]
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortOrder.value === 'asc' ? comparison : -comparison
      }
      
      return 0
    })
  }
  
  return result
})

// Methods
const onSearch = () => {
  // Search is handled by the computed filteredData
}

const handleSort = (column: { field: string; label: string }) => {
  const newOrder = sortBy.value === column.field && sortOrder.value === 'asc' ? 'desc' : 'asc'
  sortBy.value = column.field
  sortOrder.value = newOrder
  showSortDropdown.value = false
}

const downloadLogBooks = () => {
  // Simulate download functionality
  console.log('Downloading log books...')
}

const handleFilterApply = (newFilters: Filters) => {
  filters.value = { ...newFilters }
  showFilterModal.value = false
}

const handleFilterReset = () => {
  filters.value = {
    dateFrom: '',
    dateTo: '',
    state: ''
  }
  showFilterModal.value = false
}

const viewLogBook = (logBook: LogBook) => {
  router.push(`/outbound/log-book/${logBook.id}/view`)
}

const editLogBook = (logBook: LogBook) => {
  router.push(`/outbound/log-book/${logBook.id}/edit`)
}
</script> 