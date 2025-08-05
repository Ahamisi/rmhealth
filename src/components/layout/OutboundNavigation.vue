<template>
  <!-- Navigation Tabs - Desktop -->
  <nav class="hidden lg:flex items-center space-x-1 mb-6 border-b border-gray-200">
    <router-link 
      to="/outbound/dashboard" 
      :class="isActiveRoute('/outbound/dashboard') ? 'px-3 py-2 text-sm font-medium text-primary-600 border-b-2 border-primary-600' : 'px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700'"
    >
      Dashboard
    </router-link>
    <router-link 
      to="/outbound/orders" 
      :class="isActiveRoute('/outbound/orders') ? 'px-3 py-2 text-sm font-medium text-primary-600 border-b-2 border-primary-600' : 'px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700'"
    >
      All Orders
    </router-link>
              <router-link 
            to="/outbound/delivered-orders" 
            :class="isActiveRoute('/outbound/delivered-orders') ? 'px-3 py-2 text-sm font-medium text-primary-600 border-b-2 border-primary-600' : 'px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700'"
          >
            Delivered Orders
          </router-link>
                    <router-link 
            to="/outbound/log-book" 
            :class="isActiveRoute('/outbound/log-book') ? 'px-3 py-2 text-sm font-medium text-primary-600 border-b-2 border-primary-600' : 'px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700'"
          >
            Log Book
          </router-link>
              <router-link 
            to="/outbound/order-fulfilment" 
            :class="isActiveRoute('/outbound/order-fulfilment') ? 'px-3 py-2 text-sm font-medium text-primary-600 border-b-2 border-primary-600' : 'px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700'"
          >
            Order Fulfilment
          </router-link>
    
    <!-- Stock Count Dropdown -->
    <Dropdown>
      <template #trigger>
        <span>Stock Count</span>
      </template>
      <DropdownItem label="Stock Count Teams" @click="handleStockCountTeams" />
      <DropdownItem label="Product Stock Count" @click="handleProductStockCount" />
    </Dropdown>

    <!-- HMO - Pharm Dropdown -->
    <Dropdown>
      <template #trigger>
        <span>HMO - Pharm</span>
      </template>
      <DropdownItem label="All HMO Products" @click="handleAllHMOProducts" />
      <DropdownItem label="Damaged HMO Products" @click="handleDamagedHMOProducts" />
      <DropdownItem label="HMO Product Returns" @click="handleHMOProductReturns" />
      <DropdownItem label="RH Orders" @click="handleRHOrders" />
    </Dropdown>
  </nav>

  <!-- Mobile Navigation Menu -->
  <div class="lg:hidden mb-6">
    <div class="relative">
      <button 
        @click="showMobileMenu = !showMobileMenu"
        class="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span>{{ currentPageName }}</span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
          :class="{ 'rotate-180': showMobileMenu }"
          class="transition-transform duration-200"
        >
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </button>
      
      <!-- Mobile Menu Dropdown -->
      <div 
        v-if="showMobileMenu" 
        class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
      >
        <router-link 
          to="/outbound/dashboard" 
          :class="isActiveRoute('/outbound/dashboard') ? 'block px-4 py-3 text-sm font-medium text-primary-600 bg-primary-50 border-l-4 border-primary-600' : 'block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50'"
          @click="showMobileMenu = false"
        >
          Dashboard
        </router-link>
        <router-link 
          to="/outbound/orders" 
          :class="isActiveRoute('/outbound/orders') ? 'block px-4 py-3 text-sm font-medium text-primary-600 bg-primary-50 border-l-4 border-primary-600' : 'block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50'"
          @click="showMobileMenu = false"
        >
          All Orders
        </router-link>
        <router-link 
          to="/outbound/delivered-orders" 
          :class="isActiveRoute('/outbound/delivered-orders') ? 'block px-4 py-3 text-sm font-medium text-primary-600 bg-primary-50 border-l-4 border-primary-600' : 'block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50'"
          @click="showMobileMenu = false"
        >
          Delivered Orders
        </router-link>
        <router-link 
          to="/outbound/log-book" 
          :class="isActiveRoute('/outbound/log-book') ? 'block px-4 py-3 text-sm font-medium text-primary-600 bg-primary-50 border-l-4 border-primary-600' : 'block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50'"
          @click="showMobileMenu = false"
        >
          Log Book
        </router-link>
        <router-link 
          to="/outbound/order-fulfilment" 
          :class="isActiveRoute('/outbound/order-fulfilment') ? 'block px-4 py-3 text-sm font-medium text-primary-600 bg-primary-50 border-l-4 border-primary-600' : 'block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50'"
          @click="showMobileMenu = false"
        >
          Order Fulfilment
        </router-link>
        
        <!-- Mobile Stock Count Section -->
        <div class="border-t border-gray-200">
          <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">Stock Count</div>
          <a href="#" class="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50" @click="showMobileMenu = false">Stock Count Teams</a>
          <a href="#" class="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50" @click="showMobileMenu = false">Product Stock Count</a>
        </div>
        
        <!-- Mobile HMO - Pharm Section -->
        <div class="border-t border-gray-200">
          <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">HMO - Pharm</div>
          <a href="#" class="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50" @click="showMobileMenu = false">All HMO Products</a>
          <a href="#" class="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50" @click="showMobileMenu = false">Damaged HMO Products</a>
          <a href="#" class="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50" @click="showMobileMenu = false">HMO Product Returns</a>
          <a href="#" class="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50" @click="showMobileMenu = false">RH Orders</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Dropdown from '@/components/ui/Dropdown.vue'
import DropdownItem from '@/components/ui/DropdownItem.vue'

const route = useRoute()
const showMobileMenu = ref(false)

// Check if route is active
const isActiveRoute = (path: string) => {
  return route.path === path
}

// Get current page name for mobile menu
const currentPageName = computed(() => {
  switch (route.path) {
    case '/outbound/dashboard':
      return 'Dashboard'
    case '/outbound/orders':
      return 'All Orders'
    case '/outbound/delivered-orders':
      return 'Delivered Orders'
    case '/outbound/log-book':
      return 'Log Book'
    case '/outbound/order-fulfilment':
      return 'Order Fulfilment'
    default:
      if (route.path.startsWith('/outbound/edit-order/')) {
        return 'Edit Order'
      }
      return 'Dashboard'
  }
})

// Dropdown handlers
const handleStockCountTeams = () => {
  console.log('Stock Count Teams clicked')
}

const handleProductStockCount = () => {
  console.log('Product Stock Count clicked')
}

const handleAllHMOProducts = () => {
  console.log('All HMO Products clicked')
}

const handleDamagedHMOProducts = () => {
  console.log('Damaged HMO Products clicked')
}

const handleHMOProductReturns = () => {
  console.log('HMO Product Returns clicked')
}

const handleRHOrders = () => {
  console.log('RH Orders clicked')
}
</script> 