<template>
  <div class="min-h-screen bg-gray-50">
    <!-- App Header with Navigation -->
    <AppHeader />

    <main class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-sm font-medium text-gray-500 uppercase tracking-wide">ORDER FULFILMENT</h1>
        <button
          v-if="isCheckedIn"
          @click="showCheckOutModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Check Out
        </button>
      </div>

      <!-- Main Content Area -->
      <div class="flex items-center justify-center min-h-[60vh]">
        <!-- Empty State - Not Checked In -->
        <div v-if="!isCheckedIn" class="bg-white rounded-lg p-8 text-center max-w-md">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">No Assigned Orders</h2>
          <p class="text-gray-600 mb-6">
            You are currently checked out! Please check in to review new orders for processing.
          </p>
          <button
            @click="showCheckInModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Check In
          </button>
        </div>

        <!-- Waiting State - Checked In -->
        <div v-else-if="isCheckedIn && !hasOrders" class="bg-white rounded-lg p-8 text-center max-w-md">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">No Assigned Orders</h2>
          <p class="text-gray-600 mb-6">
            Waiting for new orders... Please stay on this page and reload the page in 5 minutes if needed.
          </p>
          <button
            @click="reloadPage"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
              <path d="M1 4V10H7M23 20V14H17M20.49 9A9 9 0 0 0 5.64 5.64L1 10M22.99 14.36A9 9 0 0 1 18.36 18.36L23 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Reload
          </button>
        </div>

        <!-- Order Available - Show Pick Order -->
        <div v-else-if="isCheckedIn && hasOrders" class="bg-white rounded-lg p-8 text-center max-w-md">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Order Assigned</h2>
          <p class="text-gray-600 mb-2">
            <strong>REF: 1656493689-254</strong>
          </p>
          <p class="text-gray-600 mb-6">
            You have been assigned a new order for processing. Click below to start picking.
          </p>
          <button
            @click="pickOrder"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Pick Order
          </button>
        </div>
      </div>
    </main>

    <!-- Check In Confirmation Modal -->
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
          v-if="showCheckInModal"
          class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          @click="showCheckInModal = false"
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
              v-if="showCheckInModal"
              class="bg-white rounded-lg shadow-xl max-w-md w-full"
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
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Check In?</h3>
                    <button
                      @click="showCheckInModal = false"
                      class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="text-gray-600 mt-2 mb-6">
                  You are about to start your shift and begin receiving orders for processing. Please ensure you're ready to start processing orders.
                </p>
                <div class="flex justify-end space-x-3">
                  <button
                    @click="showCheckInModal = false"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    @click="checkIn"
                    class="px-4 py-2 text-sm font-medium text-white bg-yellow-500 border border-transparent rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Check In
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </teleport>

    <!-- Check Out Confirmation Modal -->
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
          v-if="showCheckOutModal"
          class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          @click="showCheckOutModal = false"
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
              v-if="showCheckOutModal"
              class="bg-white rounded-lg shadow-xl max-w-md w-full"
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
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Check Out?</h3>
                    <button
                      @click="showCheckOutModal = false"
                      class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="text-gray-600 mt-2 mb-6">
                  You are about to end your shift. Any pending orders will be reassigned. Make sure all your current orders are properly completed.
                </p>
                <div class="flex justify-end space-x-3">
                  <button
                    @click="showCheckOutModal = false"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    @click="checkOut"
                    class="px-4 py-2 text-sm font-medium text-white bg-yellow-500 border border-transparent rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Check Out
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </teleport>

    <!-- Success Toasts -->
    <div v-if="showCheckInSuccess" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div class="bg-green-600 text-white px-6 py-3 rounded-full flex items-center space-x-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="font-medium">Check In Successful</span>
      </div>
    </div>

    <div v-if="showCheckOutSuccess" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div class="bg-green-600 text-white px-6 py-3 rounded-full flex items-center space-x-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="font-medium">Check Out Successful</span>
      </div>
    </div>

    <!-- Pending Order Warning -->
    <div v-if="showPendingOrderWarning" class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
      <div class="bg-yellow-100 border border-yellow-200 text-yellow-800 px-6 py-3 rounded-full flex items-center space-x-2 max-w-lg">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="font-medium">You have a pending order that must be completed before checking out</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'

const router = useRouter()

// State management
const isCheckedIn = ref(false)
const hasOrders = ref(false)
const hasPendingOrder = ref(false)

// Modal states
const showCheckInModal = ref(false)
const showCheckOutModal = ref(false)

// Toast states
const showCheckInSuccess = ref(false)
const showCheckOutSuccess = ref(false)
const showPendingOrderWarning = ref(false)

// Methods
const checkIn = () => {
  showCheckInModal.value = false
  isCheckedIn.value = true
  
  // Show success toast
  showCheckInSuccess.value = true
  setTimeout(() => {
    showCheckInSuccess.value = false
  }, 3000)

  // Start simulating order assignment
  simulateOrderAssignment()
}

const checkOut = () => {
  // Check if there are pending orders
  if (hasPendingOrder.value) {
    showCheckOutModal.value = false
    showPendingOrderWarning.value = true
    setTimeout(() => {
      showPendingOrderWarning.value = false
    }, 5000)
    return
  }

  showCheckOutModal.value = false
  isCheckedIn.value = false
  hasOrders.value = false
  
  // Show success toast
  showCheckOutSuccess.value = true
  setTimeout(() => {
    showCheckOutSuccess.value = false
  }, 3000)
}

const reloadPage = () => {
  window.location.reload()
}

const pickOrder = () => {
  // Navigate to picking list page
  router.push('/outbound/order-fulfilment/picking-list/1656493689-254')
}

// Simulate getting an order after check-in
const simulateOrderAssignment = () => {
  setTimeout(() => {
    if (isCheckedIn.value) {
      hasOrders.value = true
      hasPendingOrder.value = true
    }
  }, 3000) // 3 seconds after check-in
}
</script> 