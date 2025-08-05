<template>
  <div class="min-h-screen bg-gray-50">
    <!-- App Header with Navigation -->
    <AppHeader />

    <main class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Log Book</h1>
        <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <Icon name="download" :size="16" className="mr-2" />
          Download Log Books
        </button>
      </div>

      <!-- Search and Actions Bar -->
      <div class="bg-white rounded-lg p-4 mb-6 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="search" :size="16" className="text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
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
            <Icon name="filter" :size="16" className="mr-2" />
            Filter
          </button>

          <!-- Sort Button -->
          <button
            @click="showSortMenu = !showSortMenu"
            class="relative inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Icon name="sort" :size="16" className="mr-2" />
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
      <div class="bg-white rounded-lg overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Count
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Timeline
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="logBook in filteredLogBooks"
                :key="logBook.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ logBook.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ logBook.driverName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ logBook.orderCount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ logBook.state }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ logBook.deliveryTimeline }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex items-center space-x-2">
                    <!-- View Button -->
                    <button
                      @click="viewLogBook(logBook)"
                      class="text-gray-400 hover:text-gray-600 transition-colors"
                      title="View Log Book"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z" fill="currentColor"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.25C7.71979 2.25 4.12229 4.92479 2.36029 8.7248C2.24629 8.97979 2.24629 9.27021 2.36029 9.5252C4.12229 13.3252 7.71979 15.75 12 15.75C16.2802 15.75 19.8777 13.0752 21.6397 9.2752C21.7537 9.02021 21.7537 8.72979 21.6397 8.4748C19.8777 4.9248 16.2802 2.25 12 2.25ZM3.76779 9C5.36779 12.1677 8.46779 14.25 12 14.25C15.5322 14.25 18.6322 12.1677 20.2322 9C18.6322 5.83229 15.5322 3.75 12 3.75C8.46779 3.75 5.36779 5.83229 3.76779 9Z" fill="currentColor"/>
                      </svg>
                    </button>

                    <!-- Edit Button -->
                    <button
                      @click="editLogBook(logBook)"
                      class="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Edit Log Book"
                    >
                      <Icon name="edit" :size="20" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
import Icon from '@/components/ui/Icon.vue'
import LogBookFilterModal from '@/components/outbound/LogBookFilterModal.vue'


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

// State
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