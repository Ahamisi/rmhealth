<template>
  <!-- Desktop Navigation -->
  <nav class="relative z-40 hidden px-6 bg-white border-b sm:block app-navigation">
    <div class="mx-auto">
      <ul class="flex gap-x-6 navbar-menu">
        <li v-for="(item, index) in navItems" :key="`nav_dropdown_${index}`" class="text-center">
          <!-- Dropdown items -->
          <NavDropDown 
            v-if="item.dropdown" 
            :title="item.label" 
            :items="item.dropdown"
            :isOpen="openDropdownIndex === index" 
            @toggle="toggleDropdown(index)" 
            @close="closeDropdown"
            :useThreeDots="item.useThreeDots" 
          />
          <!-- Regular links -->
          <router-link 
            v-else 
            :to="item.url"
            class="block py-3 text-xs border-b-2 border-transparent nav-link navigation-text text-text-subtle hover:border-gray-200"
            :class="{
              '!border-blue-600 !text-blue-600': isActive(item.url),
            }"
          >
            {{ item.label }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>

  <!-- Mobile Navigation -->
  <nav class="block px-4 bg-white border-b border-gray-200 sm:hidden">
    <div class="mx-auto">
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
            v-for="item in navItems.filter(item => !item.dropdown)"
            :key="item.url"
            :to="item.url" 
            :class="isActive(item.url) ? 'block px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 border-l-4 border-blue-600' : 'block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50'"
            @click="showMobileMenu = false"
          >
            {{ item.label }}
          </router-link>
          
          <!-- Mobile Dropdown Sections -->
          <div v-for="item in navItems.filter(item => item.dropdown)" :key="item.label" class="border-t border-gray-200">
            <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
              {{ item.label }}
            </div>
            <a 
              v-for="dropdownItem in item.dropdown" 
              :key="dropdownItem.title"
              href="#" 
              class="block px-6 py-2 text-sm text-gray-700 hover:bg-gray-50" 
              @click="showMobileMenu = false"
            >
              {{ dropdownItem.title }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavDropDown from '@/components/ui/NavDropDown.vue'

const route = useRoute()
const showMobileMenu = ref(false)
const openDropdownIndex = ref<number | null>(null)

// Navigation items following the old design system structure
const navItems = [
  { label: "Dashboard", url: "/outbound/dashboard" },
  { label: "All Orders", url: "/outbound/orders" },
  { label: "Delivered Orders", url: "/outbound/delivered-orders" },
  { label: "Log Book", url: "/outbound/log-book" },
  { label: "Order Fulfilment", url: "/outbound/order-fulfilment" },
  {
    label: "Stock Count", 
    dropdown: [
      { title: "Stock Count Teams", route: "#", has_bottom_rule: true },
      { title: "Product Stock Count", route: "#" },
    ]
  },
  {
    label: "HMO - Pharm", 
    dropdown: [
      { title: "All HMO Products", route: "#", has_bottom_rule: true },
      { title: "Damaged HMO Products", route: "#" },
      { title: "HMO Product Returns", route: "#", has_bottom_rule: true },
      { title: "RH Orders", route: "#" },
    ]
  },
]

// Check if route is active
const isActive = (url: string) => {
  return route.path === url
}

// Get current page name for mobile menu
const currentPageName = computed(() => {
  const currentItem = navItems.find(item => item.url && isActive(item.url))
  if (currentItem) return currentItem.label
  
  // Handle dynamic routes
  if (route.path.startsWith('/outbound/edit-order/')) {
    return 'Edit Order'
  }
  return 'Dashboard'
})

// Dropdown management
const toggleDropdown = (index: number) => {
  openDropdownIndex.value = openDropdownIndex.value === index ? null : index
}

const closeDropdown = () => {
  openDropdownIndex.value = null
}
</script>

<style scoped>
.app-navigation {
  border-bottom: 0.5px solid rgba(9, 30, 66, 0.14);
}

.app-navigation .navbar-menu .navigation-text {
  color: rgba(68, 84, 111, 1);
  font-weight: 500;
}

.app-navigation .navbar-menu .navigation-text.router-link-active.router-link-exact-active {
  color: rgba(12, 102, 228, 1);
  border-bottom: 2px solid rgba(12, 102, 228, 1);
}

.text-text-subtle {
  color: rgba(68, 84, 111, 1);
}
</style> 