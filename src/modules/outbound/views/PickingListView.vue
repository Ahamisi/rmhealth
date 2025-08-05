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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-sm">REF: {{ orderRef }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="showConfirmPickingModal = true"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Confirm Picking List
          </button>
          <button
            @click="showPackagingModal = true"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Confirm Picking List & CheckOut
          </button>
        </div>
      </div>

      <!-- Order Information Cards -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <!-- Seller -->
        <div class="bg-white rounded-lg p-6">
          <h3 class="text-sm font-medium text-gray-500 mb-4">Seller</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-sm text-gray-900">{{ seller.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92V13.04C22 13.04 22 13.04 22 13.04C21.99 13.01 21.99 12.99 21.98 12.96C21.96 12.86 21.93 12.77 21.88 12.69C21.86 12.65 21.84 12.62 21.81 12.58L16.5 2.58C16.46 2.5 16.4 2.44 16.34 2.39C16.27 2.33 16.19 2.29 16.1 2.27C16.06 2.26 16.03 2.25 15.99 2.25H8.01C7.97 2.25 7.94 2.26 7.9 2.27C7.81 2.29 7.73 2.33 7.66 2.39C7.6 2.44 7.54 2.5 7.5 2.58L2.19 12.58C2.16 12.62 2.14 12.65 2.12 12.69C2.07 12.77 2.04 12.86 2.02 12.96C2.01 12.99 2.01 13.01 2 13.04V16.92C2 18.01 2.89 18.9 3.98 18.9H20.02C21.11 18.9 22 18.01 22 16.92V16.92Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-sm text-gray-900">{{ seller.phone }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-sm text-gray-900">{{ seller.email }}</span>
            </div>
            <div class="flex items-start space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mt-0.5">
                <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-sm text-gray-900">{{ seller.address }}</span>
            </div>
          </div>
        </div>

        <!-- Buyer -->
        <div class="bg-white rounded-lg p-6">
          <h3 class="text-sm font-medium text-gray-500 mb-4">Buyer</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-sm text-gray-900">{{ buyer.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92V13.04C22 13.04 22 13.04 22 13.04C21.99 13.01 21.99 12.99 21.98 12.96C21.96 12.86 21.93 12.77 21.88 12.69C21.86 12.65 21.84 12.62 21.81 12.58L16.5 2.58C16.46 2.5 16.4 2.44 16.34 2.39C16.27 2.33 16.19 2.29 16.1 2.27C16.06 2.26 16.03 2.25 15.99 2.25H8.01C7.97 2.25 7.94 2.26 7.9 2.27C7.81 2.29 7.73 2.33 7.66 2.39C7.6 2.44 7.54 2.5 7.5 2.58L2.19 12.58C2.16 12.62 2.14 12.65 2.12 12.69C2.07 12.77 2.04 12.86 2.02 12.96C2.01 12.99 2.01 13.01 2 13.04V16.92C2 18.01 2.89 18.9 3.98 18.9H20.02C21.11 18.9 22 18.01 22 16.92V16.92Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-sm text-gray-900">{{ buyer.phone }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-sm text-gray-900">{{ buyer.store }}</span>
            </div>
            <div class="flex items-start space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mt-0.5">
                <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-sm text-gray-900">{{ buyer.address }}</span>
            </div>
          </div>
        </div>

        <!-- Order -->
        <div class="bg-white rounded-lg p-6">
          <h3 class="text-sm font-medium text-gray-500 mb-4">Order</h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-sm text-gray-900">REF: {{ orderRef }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-sm text-gray-900">{{ order.date }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-sm text-gray-900">{{ order.agent }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92V13.04C22 13.04 22 13.04 22 13.04C21.99 13.01 21.99 12.99 21.98 12.96C21.96 12.86 21.93 12.77 21.88 12.69C21.86 12.65 21.84 12.62 21.81 12.58L16.5 2.58C16.46 2.5 16.4 2.44 16.34 2.39C16.27 2.33 16.19 2.29 16.1 2.27C16.06 2.26 16.03 2.25 15.99 2.25H8.01C7.97 2.25 7.94 2.26 7.9 2.27C7.81 2.29 7.73 2.33 7.66 2.39C7.6 2.44 7.54 2.5 7.5 2.58L2.19 12.58C2.16 12.62 2.14 12.65 2.12 12.69C2.07 12.77 2.04 12.86 2.02 12.96C2.01 12.99 2.01 13.01 2 13.04V16.92C2 18.01 2.89 18.9 3.98 18.9H20.02C21.11 18.9 22 18.01 22 16.92V16.92Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-sm text-gray-900">{{ order.phone }}</span>
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

const buyer = {
  name: 'Janet Adeajayi',
  phone: '+234 801 234 5678',
  store: 'Emeka Pharmacy',
  address: '4, Road 56, Lagos, Nigeria Lagos State'
}

const order = {
  date: '5/21/2024',
  agent: 'Agent Oreva',
  phone: '+234 801 234 5678'
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