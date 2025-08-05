<template>
  <div class="min-h-screen bg-gray-50">
    <!-- App Header with Navigation -->
    <AppHeader />

    <main class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Breadcrumb and Header -->
      <div class="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <router-link to="/outbound/log-book" class="hover:text-gray-700">Log Book</router-link>
        <span>/</span>
        <span class="text-gray-900">{{ logBook?.driverName || 'Janet Adeajayi' }}</span>
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
            <h1 class="text-2xl font-semibold text-gray-900">Log Book</h1>
            <div class="flex items-center space-x-2 text-gray-500 mt-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>
              <span class="text-sm">{{ logBook?.driverName || 'JANET ADEAJAYI' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Driver Details -->
      <div class="bg-white rounded-lg p-6 mb-6">
        <div class="grid grid-cols-3 gap-8">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Driver</label>
            <p class="text-sm text-gray-900">{{ logBook?.driverName || 'Janet Adeajayi' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
            <p class="text-sm text-gray-900">{{ logBook?.state || 'Lagos State' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Timeline</label>
            <p class="text-sm text-gray-900">{{ logBook?.deliveryTimeline || '16/01/2025 - 16:34:54s' }}</p>
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Number
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
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
                v-for="customer in customerList"
                :key="customer.orderNumber"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-primary-600 font-medium">
                  {{ customer.orderNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ customer.customerName }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'

interface LogBook {
  id: string
  driverName: string
  orderCount: number
  state: string
  deliveryTimeline: string
}

interface Customer {
  orderNumber: string
  customerName: string
  packageType: string
  quantity: number
  warehouseSignOff: string
  logisticsSignOff: string
  vehicleRegNo: string
}

const router = useRouter()
const route = useRoute()

const logBook = ref<LogBook | null>(null)

// Mock customer data
const customerList: Customer[] = [
  {
    orderNumber: 'REF: 1656493689-254',
    customerName: 'Janet Adeajayi',
    packageType: 'None',
    quantity: 71,
    warehouseSignOff: '--',
    logisticsSignOff: '--',
    vehicleRegNo: '--'
  },
  {
    orderNumber: 'REF: 1656493689-254',
    customerName: 'Janet Adeajayi',
    packageType: 'None',
    quantity: 59,
    warehouseSignOff: '--',
    logisticsSignOff: '--',
    vehicleRegNo: '--'
  },
  {
    orderNumber: 'REF: 1656493689-254',
    customerName: 'Janet Adeajayi',
    packageType: 'None',
    quantity: 70,
    warehouseSignOff: '--',
    logisticsSignOff: '--',
    vehicleRegNo: '--'
  }
]

const goBack = () => {
  router.push('/outbound/log-book')
}

// Load data based on route params
onMounted(() => {
  const logBookId = route.params.id as string
  // Mock data based on ID
  logBook.value = {
    id: logBookId,
    driverName: 'Janet Adeajayi',
    orderCount: 1,
    state: 'Lagos',
    deliveryTimeline: '16/01/2025 - 16:34:54s'
  }
  console.log('Loading log book:', logBookId)
})
</script> 