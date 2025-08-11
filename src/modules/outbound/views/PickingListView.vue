<template>
  <div class="min-h-screen bg-gray-50">
    <!-- App Header with Navigation -->
    <AppHeader />

    <main class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Breadcrumb -->
      <div class="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <router-link to="/outbound/order-fulfilment" class="hover:text-gray-700">Order Fulfilment</router-link>
        <span>/</span>
        <span class="text-gray-900">Picking List - REF: {{ orderRef }}</span>
      </div>

      <!-- Header -->
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
            <h1 class="text-2xl font-semibold text-gray-900">Picking List</h1>
            <div class="flex items-center space-x-2 text-gray-500 mt-1">
              <img src="/src/assets/icons/info.svg" alt="Order Ref" class="w-4 h-4">
              <span class="text-sm">REF: {{ orderRef }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-3">
          <!-- Download Button -->
          <button class="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <img src="/src/assets/icons/download.svg" alt="Download" class="w-4 h-4 mr-2">
            <span class="text-sm font-medium">Download</span>
          </button>
          
          <!-- Export Button -->
          <button class="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <img src="/src/assets/icons/download.svg" alt="Export" class="w-4 h-4 mr-2">
            <span class="text-sm font-medium">Export</span>
          </button>
          
          <!-- Print Button -->
          <button class="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 8H5C4.20435 8 3.44129 8.31607 2.87868 8.87868C2.31607 9.44129 2 10.2043 2 11V17C2 17.7956 2.31607 18.5587 2.87868 19.1213C3.44129 19.6839 4.20435 20 5 20H6V16H18V20H19C19.7956 20 20.5587 19.6839 21.1213 19.1213C21.6839 18.5587 22 17.7956 22 17V11C22 10.2043 21.6839 9.44129 21.1213 8.87868C20.5587 8.31607 19.7956 8 19 8ZM8 18V14H16V18H8ZM19 6H5V2H19V6Z" fill="#44546F"/>
            </svg>
            <span class="text-sm font-medium ml-2">Print</span>
          </button>
        </div>
      </div>

      <!-- Order Summary Card -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Customer Details -->
            <div class="space-y-3">
              <h3 class="text-sm font-medium text-gray-700 mb-3">Customer Details</h3>
              <div class="flex items-center space-x-2">
                <img src="/src/assets/icons/avatar.svg" alt="Customer" class="w-4 h-4">
                <span class="text-sm text-gray-900">{{ customerDetails.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <img src="/src/assets/icons/info.svg" alt="Phone" class="w-4 h-4">
                <span class="text-sm text-gray-900">{{ customerDetails.phone }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <img src="/src/assets/icons/info.svg" alt="Store" class="w-4 h-4">
                <span class="text-sm text-gray-900">{{ customerDetails.store }}</span>
              </div>
            </div>

            <!-- Delivery Details -->
            <div class="space-y-3">
              <h3 class="text-sm font-medium text-gray-700 mb-3">Delivery Details</h3>
              <div class="flex items-center space-x-2">
                <img src="/src/assets/icons/calendar.svg" alt="Date" class="w-4 h-4">
                <span class="text-sm text-gray-900">{{ deliveryDetails.date }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <img src="/src/assets/icons/time.svg" alt="Time" class="w-4 h-4">
                <span class="text-sm text-gray-900">{{ deliveryDetails.time }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <img src="/src/assets/icons/info.svg" alt="Address" class="w-4 h-4">
                <span class="text-sm text-gray-900">{{ deliveryDetails.address }}</span>
              </div>
            </div>

            <!-- Order Details -->
            <div class="space-y-3">
              <h3 class="text-sm font-medium text-gray-700 mb-3">Order Details</h3>
              <div class="flex items-center space-x-2">
                <img src="/src/assets/icons/info.svg" alt="Order Number" class="w-4 h-4">
                <span class="text-sm text-gray-900">{{ orderDetails.orderNumber }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <img src="/src/assets/icons/info.svg" alt="Total Items" class="w-4 h-4">
                <span class="text-sm text-gray-900">{{ orderDetails.totalItems }} items</span>
              </div>
              <div class="flex items-center space-x-2">
                <img src="/src/assets/icons/info.svg" alt="Total Amount" class="w-4 h-4">
                <span class="text-sm text-gray-900">{{ orderDetails.totalAmount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="bg-white rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Order Items</h2>
          <div class="flex items-center space-x-2">
            <input
              v-model="scannerInput"
              type="text"
              placeholder="Scanner"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              @keyup.enter="handleScan"
            />
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    :checked="allItemsSelected"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S/N
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch No.
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse Shelf
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scan
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="item in items"
                :key="item.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4">
                  <input
                    type="checkbox"
                    v-model="item.selected"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.sn }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  {{ item.description }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.productName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.quantity }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.batchNo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.expiryDate }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.warehouseShelf }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                  {{ item.scanInfo }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Packaging Modal -->
    <teleport to="body">
      <transition
        enter-active-class="transition-opacity ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showPackagingModal"
          class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          @click="showPackagingModal = false"
        >
          <transition
            enter-active-class="transition-all ease-out duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all ease-in duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showPackagingModal"
              class="bg-white rounded-lg shadow-xl max-w-md w-full"
              @click.stop
            >
              <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">How was this packaged?</h3>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p class="text-sm text-blue-800">
                    Please enter the number of cartons or nylons used to package this order.
                  </p>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">No. of Cartons</label>
                    <input
                      v-model="packaging.cartons"
                      type="number"
                      placeholder="0"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">No of Nylons</label>
                    <input
                      v-model="packaging.nylons"
                      type="number"
                      placeholder="0"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div class="flex justify-end">
                  <button
                    @click="proceedWithPackaging"
                    class="px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </teleport>

    <!-- Confirm Picking List Modal -->
    <teleport to="body">
      <transition
        enter-active-class="transition-opacity ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showConfirmPickingModal"
          class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          @click="showConfirmPickingModal = false"
        >
          <transition
            enter-active-class="transition-all ease-out duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all ease-in duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showConfirmPickingModal"
              class="bg-white rounded-lg shadow-xl max-w-lg w-full"
              @click.stop
            >
              <div class="p-6">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Confirm Picking List</h3>
                    <button
                      @click="showConfirmPickingModal = false"
                      class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="text-gray-600 mt-2 mb-6">
                  You are about to confirm the picking list for order #REF: {{ orderRef }}. Please ensure all items have been properly scanned and verified.
                </p>
                <div class="flex justify-end space-x-3">
                  <button
                    @click="showConfirmPickingModal = false"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    @click="confirmPickingList"
                    class="px-4 py-2 text-sm font-medium text-white bg-yellow-500 border border-transparent rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'

interface OrderItem {
  id: string
  sn: number
  description: string
  productName: string
  quantity: number
  batchNo: string
  expiryDate: string
  warehouseShelf: string
  scanInfo: string
  selected: boolean
}

const router = useRouter()
const route = useRoute()

// Data
const orderRef = ref('1656493689-254')
const scannerInput = ref('')
const showPackagingModal = ref(false)
const showConfirmPickingModal = ref(false)

const packaging = ref({
  cartons: 0,
  nylons: 0
})

// Mock data
const seller = {
  name: 'Remedial Health',
  phone: '+234 801 234 5678',
  email: 'info@remedialhealth.com',
  address: '4, Road 56, Lagos, Nigeria'
}

const customerDetails = {
  name: 'Janet Adeajayi',
  phone: '+234 801 234 5678',
  store: 'Emeka Pharmacy'
}

const deliveryDetails = {
  date: '5/21/2024',
  time: '10:30 AM',
  address: '4, Road 56, Lagos, Nigeria Lagos State'
}

const orderDetails = {
  orderNumber: 'RHPO-1651245-215',
  totalItems: 3,
  totalAmount: '₦2,055,043.00'
}

const items = ref<OrderItem[]>([
  {
    id: '1',
    sn: 1,
    description: 'These lozenges are suitable for adults and children over 12 years old.',
    productName: 'STREPSILS INTENSIVE HONEY & LEMON LOZENGES X 16',
    quantity: 71,
    batchNo: '4C452012',
    expiryDate: '5/21/2024',
    warehouseShelf: '4C452012',
    scanInfo: 'Scan shelf for 4C452012',
    selected: false
  },
  {
    id: '2',
    sn: 2,
    description: 'These lozenges are suitable for adults and children over 12 years old.',
    productName: 'STREPSILS INTENSIVE HONEY & LEMON LOZENGES X 16',
    quantity: 59,
    batchNo: '4C452012',
    expiryDate: '5/21/2024',
    warehouseShelf: '4C452012',
    scanInfo: 'Scan shelf for 4C452012',
    selected: false
  },
  {
    id: '3',
    sn: 3,
    description: 'These lozenges are suitable for adults and children over 12 years old.',
    productName: 'STREPSILS INTENSIVE HONEY & LEMON LOZENGES X 16',
    quantity: 70,
    batchNo: '4C452012',
    expiryDate: '5/21/2024',
    warehouseShelf: '4C452012',
    scanInfo: 'Scan shelf for 4C452012',
    selected: false
  }
])

// Computed
const allItemsSelected = computed(() => {
  return items.value.length > 0 && items.value.every(item => item.selected)
})

// Methods
const goBack = () => {
  router.push('/outbound/order-fulfilment')
}

const toggleSelectAll = () => {
  const newValue = !allItemsSelected.value
  items.value.forEach(item => {
    item.selected = newValue
  })
}

const handleScan = () => {
  // Handle barcode scanning logic
  console.log('Scanning:', scannerInput.value)
  scannerInput.value = ''
}

const proceedWithPackaging = () => {
  showPackagingModal.value = false
  showConfirmPickingModal.value = true
}

const confirmPickingList = () => {
  showConfirmPickingModal.value = false
  // Navigate back to order fulfilment or show success
  router.push('/outbound/order-fulfilment')
}

// Load order data based on route params
onMounted(() => {
  const id = route.params.id as string
  if (id) {
    orderRef.value = id
  }
})
</script> 