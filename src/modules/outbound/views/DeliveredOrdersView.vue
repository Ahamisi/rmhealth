<template>
  <div class="bg-gray-50 min-h-screen font-sans">
    <!-- App Header with Navigation -->
    <AppHeader />

    <!-- Main Content -->
    <main class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 class="text-md font-semibold text-[#626F86]">All Orders</h1>

      <!-- Search Section (only show when no search has been performed) -->
      <div v-if="!hasSearched" class="bg-white rounded-lg p-8 mb-6 text-center">
        <img src="/icons/search-icon.svg" alt="Search Orders" class="w-16 h-16 mx-auto mb-4 text-blue-600" />
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Let's Find Your Orders</h2>
        <p class="text-gray-600 mb-6">
          Please search by Order Ref No, Customer Name or Store Name<br />
          to load delivered orders
        </p>

        <!-- Search Form -->
        <div class="flex items-center justify-center space-x-4 max-w-md mx-auto">
          <!-- Search Type Dropdown -->
          <SearchDropdown 
            v-model="searchType" 
            :options="searchOptions"
            placeholder="Order Ref No."
            className="w-40"
          />

          <!-- Search Input -->
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <img src="/icons/search-icon.svg" alt="Search" class="w-5 h-5" />
            </div>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search..." 
              class="w-full input-search"
              @keyup.enter="handleSearch"
            >
          </div>

          <!-- Search Button -->
          <button 
            @click="handleSearch"
            :disabled="!searchQuery.trim()"
            class="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      <!-- Results Section (only show when search has been performed) -->
      <div v-if="hasSearched" class="bg-white rounded-lg">
        <!-- Search Results Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Delivered Orders</h3>
            <div class="flex items-center space-x-4">
              <!-- Search By Dropdown -->
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600">Search By</span>
                <SearchDropdown 
                  v-model="searchType" 
                  :options="searchOptions"
                  className="w-36"
                />
              </div>

              <!-- Search Input (Header) -->
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <img src="/icons/search-icon.svg" alt="Search" class="w-4 h-4" />
                </div>
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Search" 
                  class="w-64 input-search"
                  @keyup.enter="handleSearch"
                >
              </div>

              <!-- Filter and Sort -->
              <button class="p-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <img src="/icons/filter.svg" alt="Filter" class="w-4 h-4" />
              </button>

              <button class="p-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <img src="/icons/arrow-up-down.svg" alt="Sort" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <LoadingState v-if="isLoading" />

        <!-- Data Content -->
        <div v-if="hasSearched">
          <!-- No Results State -->
          <NoResultsState 
            v-if="!isLoading && orders.length === 0"
            :search-term="searchQuery"
          />

          <!-- Orders Table -->
          <StaticDatatable
            v-else-if="orders.length > 0"
            :columns="orderColumns"
            :data="orders"
            :searchable="true"
            :exportable="true"
            :printable="true"
            :perPage="10"
          >
            <template #column="{ props: { row, column } }">
              <div v-if="column.field === 'actions'" class="flex items-center justify-center">
                <ActionDropdown :order="row" @action="handleOrderAction" />
              </div>
              <span v-else>{{ row[column.field] }}</span>
            </template>
          </StaticDatatable>
        </div>
      </div>
    </main>

    <!-- Order Details Modal -->
    <OrderDetailsModal 
      :show="showOrderDetails"
      :order="selectedOrder"
      @close="showOrderDetails = false"
    />

    <!-- Time Tracker Sheet -->
    <TimeTrackerSheet 
      :show="showTimeTracker"
      :order="selectedOrder"
      @close="showTimeTracker = false"
    />

    <!-- Activity Log Sheet -->
    <ActivityLogSheet 
      :show="showActivityLog"
      :order="selectedOrder"
      @close="showActivityLog = false"
    />

    <!-- Success Toast -->
    <Toast
      v-model="showToast"
      :message="toastMessage"
      type="success"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'

import SearchDropdown from '@/components/ui/SearchDropdown.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import NoResultsState from '@/components/ui/NoResultsState.vue'
import NoDataState from '@/components/ui/NoDataState.vue'
import ActionDropdown from '@/components/ui/ActionDropdown.vue'
import OrderDetailsModal from '@/components/outbound/OrderDetailsModal.vue'
import TimeTrackerSheet from '@/components/ui/TimeTrackerSheet.vue'
import ActivityLogSheet from '@/components/ui/ActivityLogSheet.vue'
import Toast from '@/components/ui/Toast.vue'
import StaticDatatable from '@/components/ui/StaticDatatable.vue'

// Order type definition
interface Order {
  id: string
  orderNo: string
  orderNoSuffix?: string
  customerName: string
  storeName: string
  state: string
  payment: string
  orderDate: string
  deliveryDate: string
  totalAmount: string
  status: string
}

const router = useRouter()

// Table columns for orders
const orderColumns = ref([
  { field: 'orderNo', label: 'Order No.', sortable: true },
  { field: 'customerName', label: 'Customer Name', sortable: true },
  { field: 'storeName', label: 'Store Name', sortable: true },
  { field: 'state', label: 'State', sortable: false },
  { field: 'payment', label: 'Payment', sortable: false },
  { field: 'orderDate', label: 'Order Date', sortable: true },
  { field: 'deliveryDate', label: 'Delivery Date', sortable: true },
  { field: 'totalAmount', label: 'Total Amount', sortable: true },
  { field: 'actions', label: 'Actions', sortable: false },
])

// Search and filter state
const searchType = ref('orderRefNo')
const searchQuery = ref('')
const isLoading = ref(false)
const hasSearched = ref(false)
const orders = ref<Order[]>([])

// Modal/Sheet state
const showOrderDetails = ref(false)
const showTimeTracker = ref(false)
const showActivityLog = ref(false)
const selectedOrder = ref<Order | null>(null)

// Toast state
const showToast = ref(false)
const toastMessage = ref('')

// Search options
const searchOptions = [
  { value: 'orderRefNo', label: 'Order Ref No.' },
  { value: 'customerName', label: 'Customer Name' },
  { value: 'storeName', label: 'Store Name' }
]

// Mock delivered orders data
const mockDeliveredOrders = [
  {
    id: '87',
    orderNo: 'RHPO-1651087',
    customerName: 'Oluwatoisin Adegboye',
    storeName: 'Emeka Pharmacy',
    state: 'Lagos',
    payment: 'Cheque',
    orderDate: '16/01/2025',
    deliveryDate: '16/01/2025',
    totalAmount: '₦47,400.00',
    status: 'delivered'
  },
  {
    id: '1656493689-254',
    orderNo: 'RHPO-1656493689',
    orderNoSuffix: '254',
    customerName: 'Janet Adejayi',
    storeName: 'Emeka Pharmacy',
    state: 'Lagos',
    payment: 'Cheque',
    orderDate: '16/01/2025',
    deliveryDate: '16/01/2025',
    totalAmount: '₦47,400.00',
    status: 'delivered'
  },
  {
    id: '25',
    orderNo: 'RHPO-1651025',
    customerName: 'Henry Christopher',
    storeName: 'Emeka Pharmacy',
    state: 'Lagos',
    payment: 'Cheque',
    orderDate: '16/01/2025',
    deliveryDate: '16/01/2025',
    totalAmount: '₦47,400.00',
    status: 'delivered'
  },
  {
    id: '30',
    orderNo: 'RHPO-1651030',
    customerName: 'Oluwatoisin Adegboye',
    storeName: 'Emma Bros Pharmacy',
    state: 'Lagos',
    payment: 'Cheque',
    orderDate: '16/01/2025',
    deliveryDate: '16/01/2025',
    totalAmount: '₦47,400.00',
    status: 'delivered'
  },
  {
    id: '51',
    orderNo: 'RHPO-1651051',
    customerName: 'Janet Adejayi',
    storeName: 'Xela Pharmacy',
    state: 'Lagos',
    payment: 'Cheque',
    orderDate: '16/01/2025',
    deliveryDate: '16/01/2025',
    totalAmount: '₦47,400.00',
    status: 'delivered'
  }
]

// Search functionality
const handleSearch = async () => {
  if (!searchQuery.value.trim()) return

  isLoading.value = true
  hasSearched.value = true

  // Simulate API call
  setTimeout(() => {
    // Mock search logic
    const filteredOrders = mockDeliveredOrders.filter(order => {
      const searchTerm = searchQuery.value.toLowerCase()
      
      switch (searchType.value) {
        case 'orderRefNo':
          return order.orderNo.toLowerCase().includes(searchTerm)
        case 'customerName':
          return order.customerName.toLowerCase().includes(searchTerm)
        case 'storeName':
          return order.storeName.toLowerCase().includes(searchTerm)
        default:
          return false
      }
    })

    orders.value = filteredOrders
    isLoading.value = false
  }, 1500) // Simulate loading time
}

// Handle order actions
const handleOrderAction = (event: any) => {
  const { action, order } = event
  selectedOrder.value = order
  
  switch (action) {
    case 'view':
      showOrderDetails.value = true
      break
    case 'downloadInvoice':
      // Show success message for download
      showSuccessToast('Invoice downloaded successfully')
      break
    case 'fulfilmentDetails':
      // For delivered orders, show order details modal (same as view)
      showOrderDetails.value = true
      break
    case 'timeTracker':
      showTimeTracker.value = true
      break
    case 'activityLog':
      showActivityLog.value = true
      break
    default:
      console.log('Unknown action:', action)
  }
}

// Auto-hide toast after 3 seconds
const showSuccessToast = (message: string) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script> 