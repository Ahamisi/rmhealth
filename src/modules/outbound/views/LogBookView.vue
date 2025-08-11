<template>
  <div class="min-h-screen bg-gray-50">
    <!-- App Header with Navigation -->
    <AppHeader />

    <main class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-md font-semibold text-[#626F86]">Log Book</h1>
        <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <img src="/src/assets/icons/download.svg" alt="Download" class="w-4 h-4 mr-2 icon-white" />
          Download Log Books
        </button>
      </div>

      <!-- Search and Actions Bar -->
      <div class="bg-white rounded-lg p-4 mb-6 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <img src="/src/assets/icons/search-icon.svg" alt="Search" class="w-4 h-4 text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search"
              class="block w-full input-search"
              @keyup.enter="handleSearch"
            />
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <!-- Filter Button -->
          <button
            @click="showFilterModal = true"
            class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <img src="/src/assets/icons/filter.svg" alt="Filter" class="w-4 h-4 mr-2" />
            Filter
          </button>

          <!-- Sort Button -->
          <button
            @click="showSortMenu = !showSortMenu"
            class="relative inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <img src="/src/assets/icons/arrow-up-down.svg" alt="Sort" class="w-4 h-4 mr-2" />
            Sort
            
            <!-- Sort Dropdown -->
            <div
              v-if="showSortMenu"
              class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
              @click.stop
            >
              <div class="py-1">
                <div class="px-3 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">Sort by</div>
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="handleSort(option.value)"
                  class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                  :class="{ 'bg-blue-50 text-blue-600': currentSort === option.value }"
                >
                  <span>{{ option.label }}</span>
                  <div v-if="currentSort === option.value" class="flex items-center">
                    <span class="text-xs text-blue-600 mr-1">{{ sortDirection === 'asc' ? 'Ascending' : 'Descending' }}</span>
                    <div class="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                </button>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Log Book Table -->
      <StaticDatatable
        :columns="logBookColumns"
        :data="filteredLogBooks"
        :searchable="true"
        :exportable="true"
        :printable="true"
        :perPage="10"
      >
        <template #column="{ props: { row, column } }">
          <div v-if="column.field === 'actions'" class="flex items-center justify-center space-x-2">
            <button 
              @click="viewLogBook(row)"
              class="p-1 text-gray-600 hover:text-blue-600 transition-colors"
              title="View Log Book"
            >
              <img src="/src/assets/icons/eye.svg" alt="View" class="w-4 h-4" />
            </button>
            <button 
              @click="editLogBook(row)"
              class="p-1 text-gray-600 hover:text-blue-600 transition-colors"
              title="Edit Log Book"
            >
              <img src="/src/assets/icons/pen.svg" alt="Edit" class="w-4 h-4" />
            </button>
          </div>
          <span v-else>{{ row[column.field] }}</span>
        </template>
      </StaticDatatable>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'

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

// Search and filter state
const searchQuery = ref('')
const showFilterModal = ref(false)
const showSortMenu = ref(false)

const currentSort = ref('id')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Filters
const filters = ref<Filters>({
  dateFrom: '',
  dateTo: '',
  state: ''
})

// Sort options
const sortOptions = [
  { label: 'ID', value: 'id' },
  { label: 'Driver Name', value: 'driverName' },
  { label: 'Order Count', value: 'orderCount' },
  { label: 'State', value: 'state' }
]

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

// Computed
const filteredLogBooks = computed(() => {
  let filtered = logBooks.value

  // Apply search filter
  if (searchQuery.value) {
    filtered = filtered.filter(logBook =>
      logBook.driverName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      logBook.id.includes(searchQuery.value) ||
      logBook.state.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Apply state filter
  if (filters.value.state) {
    filtered = filtered.filter(logBook => logBook.state === filters.value.state)
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue = a[currentSort.value as keyof LogBook]
    let bValue = b[currentSort.value as keyof LogBook]

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }

    if (sortDirection.value === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  return filtered
})

// Methods
const handleSearch = () => {
  // Search is reactive through computed property
}

const handleSort = (sortKey: string) => {
  if (currentSort.value === sortKey) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    currentSort.value = sortKey
    sortDirection.value = 'asc'
  }
  showSortMenu.value = false
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

// Click outside handler
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showSortMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script> 