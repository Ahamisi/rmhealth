<template>
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left Section -->
        <div class="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          <!-- App Switcher Icon -->
          <button class="text-gray-500 hover:text-gray-600 flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H8V8H6V6ZM11 6H13V8H11V6ZM16 6H18V8H16V6ZM6 11H8V13H6V11ZM11 11H13V13H11V11ZM16 11H18V13H16V11ZM6 16H8V18H6V16ZM11 16H13V18H11V16ZM16 16H18V18H16V16Z" fill="currentColor"/>
            </svg>
          </button>
          <div class="w-px h-6 bg-gray-200 hidden sm:block"></div>
          <!-- Logo and Module Name -->
          <div class="flex items-center space-x-2 min-w-0">
            <img src="/src/assets/icons/remedial-icon.svg" alt="Remedial ERP" class="w-8 h-8 flex-shrink-0" />
            <span class="text-base sm:text-lg font-semibold text-[#2C48AF] truncate">OUTBOUND</span>
          </div>
          <!-- Branch Selector - Hidden on small screens -->
          <div class="relative hidden lg:block">
            <select class="text-sm font-medium bg-gray-100 border-none rounded-md pl-3 pr-8 py-2 appearance-none focus:ring-2 focus:ring-primary-500">
              <option>Lagos branch</option>
              <option>Abuja branch</option>
            </select>
            <!-- Chevron Down Icon -->
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Right Section -->
        <div class="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <!-- Search Input - Responsive width -->
          <div class="relative hidden md:block">
            <!-- Search Icon -->
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.6967 12.5708L16.98 15.9125C17.1271 16.0715 17.2065 16.2815 17.2015 16.498C17.1964 16.7145 17.1072 16.9206 16.9528 17.0725C16.7984 17.2244 16.5909 17.3102 16.3744 17.3117C16.1578 17.3133 15.9491 17.2305 15.7925 17.0808L12.5109 13.7425C11.2447 14.6964 9.66328 15.1334 8.08694 14.9652C6.51059 14.7969 5.05708 14.036 4.02072 12.8363C2.98436 11.6367 2.44259 10.0881 2.50511 8.50399C2.56763 6.91993 3.22978 5.41881 4.35747 4.3046C5.48516 3.19038 6.99412 2.54632 8.57883 2.50284C10.1635 2.45936 11.7055 3.0197 12.8926 4.07041C14.0797 5.12111 14.8232 6.58366 14.9725 8.16192C15.1218 9.74017 14.6657 11.3162 13.6967 12.5708ZM8.75004 13.3333C9.96562 13.3333 11.1314 12.8505 11.9909 11.9909C12.8505 11.1314 13.3334 9.96558 13.3334 8.75C13.3334 7.53443 12.8505 6.36864 11.9909 5.5091C11.1314 4.64956 9.96562 4.16667 8.75004 4.16667C7.53446 4.16667 6.36868 4.64956 5.50913 5.5091C4.64959 6.36864 4.16671 7.53443 4.16671 8.75C4.16671 9.96558 4.64959 11.1314 5.50913 11.9909C6.36868 12.8505 7.53446 13.3333 8.75004 13.3333Z" fill="#626F86"/>
              </svg>
            </div>
            <input type="text" placeholder="Search pages, customers..." class="w-48 lg:w-80 bg-white border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          </div>
          
          <!-- Search Icon (Mobile) -->
          <button class="md:hidden text-gray-500 hover:text-gray-600">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M13.6967 12.5708L16.98 15.9125C17.1271 16.0715 17.2065 16.2815 17.2015 16.498C17.1964 16.7145 17.1072 16.9206 16.9528 17.0725C16.7984 17.2244 16.5909 17.3102 16.3744 17.3117C16.1578 17.3133 15.9491 17.2305 15.7925 17.0808L12.5109 13.7425C11.2447 14.6964 9.66328 15.1334 8.08694 14.9652C6.51059 14.7969 5.05708 14.036 4.02072 12.8363C2.98436 11.6367 2.44259 10.0881 2.50511 8.50399C2.56763 6.91993 3.22978 5.41881 4.35747 4.3046C5.48516 3.19038 6.99412 2.54632 8.57883 2.50284C10.1635 2.45936 11.7055 3.0197 12.8926 4.07041C14.0797 5.12111 14.8232 6.58366 14.9725 8.16192C15.1218 9.74017 14.6657 11.3162 13.6967 12.5708ZM8.75004 13.3333C9.96562 13.3333 11.1314 12.8505 11.9909 11.9909C12.8505 11.1314 13.3334 9.96558 13.3334 8.75C13.3334 7.53443 12.8505 6.36864 11.9909 5.5091C11.1314 4.64956 9.96562 4.16667 8.75004 4.16667C7.53446 4.16667 6.36868 4.64956 5.50913 5.5091C4.64959 6.36864 4.16671 7.53443 4.16671 8.75C4.16671 9.96558 4.64959 11.1314 5.50913 11.9909C6.36868 12.8505 7.53446 13.3333 8.75004 13.3333Z" fill="#626F86"/>
            </svg>
          </button>
          
          <!-- Notifications Icon -->
          <button class="relative text-gray-500 hover:text-gray-600">
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">9+</div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 16.5V11.383C18 8.337 15.918 5.786 13 5.108V5C13 3.895 12.105 3 11 3C9.895 3 9 3.895 9 5V5.108C6.082 5.786 4 8.337 4 11.383V16.5L2 18H20L18 16.5Z" stroke="#44546F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M11.5 21C12.0133 21 12.511 20.8443 12.8994 20.5598C13.2878 20.2753 13.543 19.879 13.623 19.43" stroke="#44546F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <!-- Profile Avatar -->
          <button class="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <circle cx="8.66663" cy="8" r="8" fill="url(#pattern0_9508_43572)"/>
              <defs>
                <pattern id="pattern0_9508_43572" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlink:href="#image0_9508_43572" transform="scale(0.0078125)"/>
                </pattern>
                <image id="image0_9508_43572" width="128" height="128" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
              </defs>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Outbound Navigation - Only show on outbound pages -->
  <div v-if="isOutboundPage" class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
    <OutboundNavigation />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import OutboundNavigation from '@/components/layout/OutboundNavigation.vue'

const route = useRoute()

// Check if current page is an outbound page
const isOutboundPage = computed(() => {
  return route.path.startsWith('/outbound')
})
</script> 