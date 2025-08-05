<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <AppHeader />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <router-link to="/outbound/orders" class="hover:text-blue-600">All Orders</router-link>
        <span>/</span>
        <router-link to="/outbound/orders" class="hover:text-blue-600">Confirmed Orders</router-link>
        <span>/</span>
        <span class="text-gray-900">{{ orderId }}</span>
      </nav>

      <!-- Page Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
          <button 
            @click="handleBack"
            class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-medium">Back</span>
          </button>
        </div>
        
        <div class="flex items-center space-x-2">
          <h1 class="text-xl font-semibold text-gray-900">Edit Order</h1>
          <div class="flex items-center space-x-2 text-gray-500">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1C8.55228 1 9 1.44772 9 2V3H13C13.5523 3 14 3.44772 14 4C14 4.55228 13.5523 5 13 5H12V13C12 14.1046 11.1046 15 10 15H6C4.89543 15 4 14.1046 4 13V5H3C2.44772 5 2 4.55228 2 4C2 3.44772 2.44772 3 3 3H7V2C7 1.44772 7.44772 1 8 1ZM6 5V13H10V5H6Z" fill="currentColor"/>
            </svg>
            <span class="text-sm">{{ orderId }}</span>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <button 
            @click="handleCancel"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="handleUpdate"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Update
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="space-y-6">
        <!-- Delivery Price Section -->
        <DeliveryPriceInput 
          v-model="deliveryPrice" 
          @add-batch="handleAddBatch"
          @reset-price="handleResetPrice"
          @set-zero="handleSetZero"
        />

        <!-- Order Items Table -->
        <OrderItemsTable 
          :items="orderItems"
          @edit-item="handleEditItem"
          @delete-item="handleDeleteItem"
          @update-item="handleUpdateItem"
          @cancel-edit="handleCancelEdit"
        />
      </div>
    </div>



    <!-- Edit Order Confirmation Modal -->
    <ConfirmationModal
      :show="showEditConfirmation"
      title="Edit Order?"
      :message="`You are about to edit the order &quot;#REF: ${orderId}&quot;. This update will permanently modify the customer's order and the inventory levels will be adjusted accordingly.`"
      confirm-text="Update"
      cancel-text="Cancel"
      variant="warning"
      @confirm="handleEditConfirm"
      @cancel="showEditConfirmation = false"
    />

    <!-- Discard Changes Confirmation Modal -->
    <ConfirmationModal
      :show="showDiscardConfirmation"
      title="Discard Changes?"
      message='You are about to leave the "Edit Order" process. Any unsaved information will be lost.'
      confirm-text="Discard Changes"
      cancel-text="Cancel"
      variant="warning"
      @confirm="handleDiscardConfirm"
      @cancel="showDiscardConfirmation = false"
    />

    <!-- Success Toast -->
    <Toast 
      :show="showToast"
      :type="toastType"
      :message="toastMessage"
      @close="showToast = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import DeliveryPriceInput from '@/components/ui/DeliveryPriceInput.vue'
import OrderItemsTable from '@/components/ui/OrderItemsTable.vue'

import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import Toast from '@/components/ui/Toast.vue'

interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  isEditing?: boolean
  editQuantity?: number
  showDeleteConfirmation?: boolean
  deleteAction?: 'delete' | 'return'
}

const route = useRoute()
const router = useRouter()

// Reactive state
const orderId = ref(route.params.id as string)
const deliveryPrice = ref('0.00')

const showEditConfirmation = ref(false)
const showDiscardConfirmation = ref(false)
const showToast = ref(false)
const toastType = ref<'success' | 'error'>('success')
const toastMessage = ref('')

// Mock order items data
const orderItems = ref<OrderItem[]>([
  {
    id: '1',
    productId: '1678158',
    productName: 'STREPSILS INTENSIVE HONEY & LEMON LOZENGES X 16',
    quantity: 71
  }
])

// Handlers
const handleBack = () => {
  if (hasUnsavedChanges()) {
    showDiscardConfirmation.value = true
  } else {
    router.push('/outbound/orders')
  }
}

const handleCancel = () => {
  if (hasUnsavedChanges()) {
    showDiscardConfirmation.value = true
  } else {
    router.push('/outbound/orders')
  }
}

const handleUpdate = () => {
  showEditConfirmation.value = true
}

const handleEditConfirm = () => {
  showEditConfirmation.value = false
  // TODO: Call API to update order
  console.log('Updating order...', {
    orderId: orderId.value,
    deliveryPrice: deliveryPrice.value,
    items: orderItems.value
  })
  
  // Show success message
  toastMessage.value = 'Order updated successfully!'
  toastType.value = 'success'
  showToast.value = true
  
  // Navigate back after a short delay
  setTimeout(() => {
    router.push('/outbound/orders')
  }, 2000)
}

const handleDiscardConfirm = () => {
  showDiscardConfirmation.value = false
  router.push('/outbound/orders')
}

const handleAddBatch = () => {
  // TODO: Implement add batch functionality
  console.log('Add batch clicked')
}

const handleResetPrice = () => {
  deliveryPrice.value = '0.00'
  toastMessage.value = 'Reset Delivery Price Successful'
  toastType.value = 'success'
  showToast.value = true
}

const handleSetZero = () => {
  deliveryPrice.value = '0.00'
  toastMessage.value = 'Set Delivery Price to Zero Successful'
  toastType.value = 'success'
  showToast.value = true
}

const handleEditItem = (itemId: string) => {
  const item = orderItems.value.find(i => i.id === itemId)
  if (item) {
    item.isEditing = true
    item.editQuantity = item.quantity
  }
}

const handleDeleteItem = (itemId: string, action: 'delete' | 'return') => {
  const item = orderItems.value.find(i => i.id === itemId)
  if (item) {
    item.showDeleteConfirmation = true
    item.deleteAction = action
  }
}

const handleUpdateItem = (itemId: string, newQuantity: number) => {
  const item = orderItems.value.find(i => i.id === itemId)
  if (item) {
    item.quantity = newQuantity
    item.isEditing = false
    item.editQuantity = undefined
    
    toastMessage.value = 'Update Order Item Successful'
    toastType.value = 'success'
    showToast.value = true
  }
}

const handleCancelEdit = (itemId: string) => {
  const item = orderItems.value.find(i => i.id === itemId)
  if (item) {
    item.isEditing = false
    item.editQuantity = undefined
  }
}



const hasUnsavedChanges = () => {
  // TODO: Implement proper change detection
  return deliveryPrice.value !== '0.00' || orderItems.value.some(item => item.isEditing)
}

onMounted(() => {
  // TODO: Load order data based on orderId
  console.log('Loading order:', orderId.value)
})
</script> 