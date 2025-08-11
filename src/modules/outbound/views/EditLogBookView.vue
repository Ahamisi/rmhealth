<template>
  <div class="min-h-screen bg-gray-50">
    <!-- App Header with Navigation -->
    <AppHeader />

    <main class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Breadcrumb and Header -->
      <div class="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <router-link to="/outbound/log-book" class="hover:text-gray-700">Log Book</router-link>
        <span>/</span>
        <span class="text-gray-900">{{ driverName }}</span>
      </div>

      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <button
            @click="goBack"
            class="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="ml-2 text-sm font-medium">Back</span>
          </button>
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Edit Log Book</h1>
            <div class="flex items-center space-x-2 text-gray-500 mt-1">
              <img src="/src/assets/icons/avatar.svg" alt="Driver" class="w-4 h-4">
              <span class="text-sm">{{ driverName }}</span>
            </div>
          </div>
        </div>
        <button
          @click="handleUpdate"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Update
        </button>
      </div>

      <!-- Form Section -->
      <div class="bg-white rounded-lg p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Warehouse Rep. Sign off</label>
            <input
              v-model="warehouseSignOff"
              type="text"
              placeholder="Enter your full name"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      <!-- Customer List Section -->
      <div class="bg-white rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Customer List</h2>
        
        <!-- Customer Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    :checked="allSelected"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Number
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse Rep. Sign off
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logistics Rep. Sign off
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Reg. No.
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="customer in customers"
                :key="customer.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4">
                  <input
                    type="checkbox"
                    v-model="customer.selected"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-primary-600 font-medium">
                  {{ customer.orderNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ customer.customerName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ customer.storeName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ customer.driverName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ customer.packageType }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ customer.quantity }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ customer.warehouseSignOff }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ customer.logisticsSignOff }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ customer.vehicleRegNo }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :show="showConfirmation"
      title="Update Log Book?"
      message="Are you sure you want to update this log book entry? This action cannot be undone."
      confirm-text="Update"
      cancel-text="Cancel"
      variant="primary"
      @confirm="confirmUpdate"
      @cancel="showConfirmation = false"
    />

    <!-- Success Toast -->
    <Toast
      v-model="showToast"
      message="Log Book updated successfully"
      type="success"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import Toast from '@/components/ui/Toast.vue'

interface Customer {
  id: string
  orderNumber: string
  customerName: string
  storeName: string
  driverName: string
  packageType: string
  quantity: number
  warehouseSignOff: string
  logisticsSignOff: string
  vehicleRegNo: string
  selected: boolean
}

const router = useRouter()
const route = useRoute()

// State
const driverName = ref('JANET ADEAJAYI')
const warehouseSignOff = ref('')
const showConfirmation = ref(false)
const showToast = ref(false)

// Mock customer data
const customers = ref<Customer[]>([
  {
    id: '1',
    orderNumber: 'REF: 1656493689-254',
    customerName: 'Janet Adeajayi',
    storeName: 'Emeka Pharmacy',
    driverName: 'Oluwatosin Adegboye',
    packageType: 'None',
    quantity: 71,
    warehouseSignOff: '--',
    logisticsSignOff: '--',
    vehicleRegNo: '--',
    selected: false
  },
  {
    id: '2',
    orderNumber: 'REF: 1656493689-254',
    customerName: 'Janet Adeajayi',
    storeName: 'Emeka Pharmacy',
    driverName: 'Oluwatosin Adegboye',
    packageType: 'None',
    quantity: 59,
    warehouseSignOff: '--',
    logisticsSignOff: '--',
    vehicleRegNo: '--',
    selected: false
  },
  {
    id: '3',
    orderNumber: 'REF: 1656493689-254',
    customerName: 'Janet Adeajayi',
    storeName: 'Emeka Pharmacy',
    driverName: 'No Driver Assigned',
    packageType: 'None',
    quantity: 70,
    warehouseSignOff: '--',
    logisticsSignOff: '--',
    vehicleRegNo: '--',
    selected: false
  }
])

// Computed
const allSelected = computed(() => {
  return customers.value.length > 0 && customers.value.every(customer => customer.selected)
})

// Methods
const goBack = () => {
  router.push('/outbound/log-book')
}

const toggleSelectAll = () => {
  const newValue = !allSelected.value
  customers.value.forEach(customer => {
    customer.selected = newValue
  })
}

const handleUpdate = () => {
  showConfirmation.value = true
}

const confirmUpdate = () => {
  showConfirmation.value = false
  
  // Simulate API call
  setTimeout(() => {
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
      // Optionally navigate back
      // router.push('/outbound/log-book')
    }, 3000)
  }, 500)
}

// Load data based on route params
onMounted(() => {
  const logBookId = route.params.id as string
  // Here you would typically load the log book data based on the ID
  console.log('Loading log book:', logBookId)
})
</script> 