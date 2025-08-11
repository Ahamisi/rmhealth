<template>
  <!-- Mobile Header -->
  <header
    class="relative z-50 flex items-center justify-between px-4 py-2 bg-white border-b shadow-sm md:hidden">
    <!-- Left: Logo -->
    <div class="flex items-center space-x-2">
      <img src="/src/assets/icons/remedial-icon.svg" alt="Logo" class="w-6 h-6" />
      <!-- <img src="/src/assets/icons/remedial-icon.svg" alt="Logo" class="w-6 h-6" /> -->
      <span class="text-sm font-semibold text-blue-700 uppercase">{{ selectedApp }}</span>
    </div>

    <!-- Right: Icons -->
    <div class="flex items-center space-x-4">
      <!-- Search Icon -->
      <button @click="openMobileSearch">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-4.35-4.35M9 17a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
      </button>

      <!-- Notification Bell -->
      <div class="relative cursor-pointer">
        <div @click="openModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 16.5V11.383C18 8.337 15.918 5.786 13 5.108V5C13 3.895 12.105 3 11 3C9.895 3 9 3.895 9 5V5.108C6.082 5.786 4 8.337 4 11.383V16.5L2 18H20L18 16.5Z" stroke="#44546F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.5 21C12.0133 21 12.511 20.8443 12.8994 20.5598C13.2878 20.2753 13.543 19.879 13.623 19.43" stroke="#44546F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div
            class="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
            {{ notificationCount > 9 ? "9+" : notificationCount }}
          </div>
        </div>
      </div>

      <!-- Mobile Menu Toggle -->
      <button @click="toggleMobileMenu">
        <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </header>

  <!-- Slide-In Mobile Menu -->
  <Transition name="slide">
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 flex sm:hidden">
      <!-- Overlay background -->
      <div class="flex-1 bg-black bg-opacity-25" @click.self="isMobileMenuOpen = false"></div>

      <!-- Slide-in menu -->
      <div class="relative w-64 h-full px-4 py-4 bg-white border-l border-gray-200 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute w-5 h-5 cursor-pointer top-2 right-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" @click="toggleMobileMenu">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        
        <!-- Branch Switch -->
        <div class="mb-4">
          <label class="text-xs font-medium text-gray-500">Branch</label>
          <select v-model="selectedBranchId"
            class="w-full px-3 py-1 mt-1 text-sm text-gray-700 border border-gray-300 rounded">
            <option v-for="branch in branches" :key="branch.id" :value="branch.id">
              {{ branch.name }}
            </option>
          </select>
        </div>

        <!-- User Info -->
        <div class="flex items-center mb-4 space-x-2">
          <div class="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.66663" cy="8" r="8" fill="#E5E7EB"/>
              <path d="M8.66663 7C9.77119 7 10.6666 6.10457 10.6666 5S9.77119 3 8.66663 3C7.56206 3 6.66663 3.89543 6.66663 5C6.66663 6.10457 7.56206 7 8.66663 7Z" fill="#6B7280"/>
              <path d="M8.66663 8.5C6.82573 8.5 5.33329 9.99244 5.33329 11.8333V13H11.9999V11.8333C11.9999 9.99244 10.5075 8.5 8.66663 8.5Z" fill="#6B7280"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-800">John Doe</p>
            <p class="text-xs text-gray-500">john@example.com</p>
          </div>
        </div>

        <!-- Menu Options -->
        <div class="space-y-2">
          <button class="flex items-center w-full px-2 py-1 text-sm text-left text-gray-700 rounded hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Feature Request
          </button>

          <router-link to="/profile"
            class="flex items-center w-full px-2 py-1 text-sm text-gray-700 rounded hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Profile Settings
          </router-link>

          <button @click="logout"
            class="flex items-center w-full px-2 py-1 text-sm text-left text-red-600 rounded hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Desktop Header -->
  <header class="relative z-50 hidden px-6 bg-white border-b md:flex md:justify-between app-header w-full">
    <div class="flex items-center justify-between py-3 mr-auto w-full">
      <!-- Left Side: Logo & Branch Dropdown -->
      <div class="flex items-center">
        <!-- Logo -->
        <div class="relative flex items-center gap-2 mr-6">
          <div class="p-1" :class="{ 'bg-gray-200 rounded-full': isAppMenuOpen }" @click="toggleAppMenu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="cursor-pointer w-7 h-7">
              <path d="M6 6H8V8H6V6ZM11 6H13V8H11V6ZM16 6H18V8H16V6ZM6 11H8V13H6V11ZM11 11H13V13H11V11ZM16 11H18V13H16V11ZM6 16H8V18H6V16ZM11 16H13V18H11V16ZM16 16H18V18H16V16Z" fill="currentColor"/>
            </svg>
          </div>

          <!-- App Menu Dropdown -->
          <div v-if="isAppMenuOpen"
            class="absolute z-50 w-64 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-full">
            <ul>
              <li v-for="app in applications" :key="app.name" @click="selectApp(app.name)"
                class="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100">
                <div class="flex items-center">
                  <img :src="app.icon" :alt="app.name" class="w-6 h-6 mr-3" />
                  <span class="capitalize medium-text text-text-subtle">{{ app.name }}</span>
                </div>
                <svg v-if="selectedApp === app.name" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" fill="#22C55E"/>
                </svg>
              </li>
            </ul>
          </div>

          <img src="/src/assets/icons/remedial-icon.svg" alt="Remedial Logo" class="w-5 h-5" />
          <span class="text-xl font-bold text-blue-700 uppercase department-title">{{ selectedApp }}</span>
        </div>

        <!-- Branch Dropdown -->
        <div class="relative">
          <button ref="branchButton" @click="toggleBranchDropdown"
            class="flex items-center capitalize border-gray-300 rounded px-3 py-1.5 text-gray-700 font-semibold focus:outline-none bg-gray-100">
            <p class="text-xs font-normal">
              {{ selectedBranch + " branch" }}
            </p>
            <svg class="ml-2 mt-[2px] h-4 w-4 text-gray-700" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div v-if="isBranchDropdownOpen"
            class="absolute left-0 z-50 py-1 bg-white border border-gray-300 rounded-md shadow-xl min-w-32">
            <a v-for="branch in branches" :key="branch.name + branch.id" @click="selectBranch(branch)"
              class="block p-2 capitalize cursor-pointer medium-text text-gray-700 hover:bg-gray-100">
              {{ branch.name.toLowerCase() + " branch" }}
            </a>
          </div>
        </div>
      </div>

      <!-- Right Side: Search, Notifications, Profile -->
      <div class="flex items-center space-x-4 ml-auto">
        <!-- Search Input -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <img src="/src/assets/icons/search-icon.svg" alt="Search" class="w-5 h-5">
          </div>
          <input 
            v-model="searchTerm" 
            type="text" 
            placeholder="Search pages, customers..." 
            class="w-48 lg:w-80 input-search"
          >
        </div>
        
        <!-- Notifications -->
        <div class="relative cursor-pointer" @click="openModal">
          <img src="/src/assets/icons/notification.svg" alt="Notifications" class="w-6 h-6">
          <div
            class="absolute flex items-center justify-center w-4 h-4 px-3 text-xs font-semibold rounded-full -top-2 -right-2 bg-rose-600 text-gray-50">
            {{ notificationCount > 9 ? "9+" : notificationCount }}
          </div>
        </div>

        <!-- User Profile -->
        <div class="relative cursor-pointer" @click="toggleProfileMenu">
          <div class="flex items-center justify-center w-8 h-8"
            :class="{ 'bg-gray-200 rounded-full': isProfileMenuOpen }">
            <img src="/src/assets/icons/avatar.svg" alt="Profile" class="w-8 h-8 rounded-full">
          </div>
          <div v-if="isProfileMenuOpen"
            class="absolute right-0 z-50 w-64 py-3 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <div class="flex items-center px-4 py-2 border-b border-gray-200">
              <div class="relative w-10 h-10">
                <img src="/src/assets/icons/avatar.svg" alt="Profile" class="w-10 h-10 rounded-full">
                <!-- Green Status Dot -->
                <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-800">John Doe</p>
                <p class="text-xs text-gray-500">john@example.com</p>
              </div>
            </div>

            <!-- Menu Options -->
            <div class="mt-2">
              <button class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Feature Request
              </button>

              <router-link to="/profile"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Profile Settings
              </router-link>

              <button @click="logout" class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Outbound Navigation - Only show on outbound pages -->
  <div v-if="isOutboundPage" class="bg-white w-full">
    <OutboundNavigation />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import OutboundNavigation from '@/components/layout/OutboundNavigation.vue'

const route = useRoute()
const router = useRouter()

// App state
const selectedApp = ref('OUTBOUND')
const selectedBranch = ref('Lagos')
const searchTerm = ref('')
const notificationCount = ref(9)

// Dropdown states
const isAppMenuOpen = ref(false)
const isBranchDropdownOpen = ref(false)
const isProfileMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)

// Mock data
const applications = [
  { name: 'Procurement', icon: '/src/assets/icons/remedial-icon.svg' },
  { name: 'Inbound', icon: '/src/assets/icons/remedial-icon.svg' },
  { name: 'Customer Success', icon: '/src/assets/icons/remedial-icon.svg' },
  { name: 'Outbound', icon: '/src/assets/icons/remedial-icon.svg' },
  { name: 'Logistics', icon: '/src/assets/icons/remedial-icon.svg' },
]

const branches = [
  { id: 1, name: 'Lagos' },
  { id: 2, name: 'Abuja' },
  { id: 3, name: 'Port Harcourt' },
]

const selectedBranchId = computed({
  get: () => branches.find(b => b.name === selectedBranch.value)?.id,
  set: (id) => {
    const branch = branches.find(b => b.id === id)
    if (branch) selectedBranch.value = branch.name
  }
})

// Check if current page is an outbound page
const isOutboundPage = computed(() => {
  return route.path.startsWith('/outbound')
})

// Methods
const toggleAppMenu = () => {
  isAppMenuOpen.value = !isAppMenuOpen.value
  isBranchDropdownOpen.value = false
  isProfileMenuOpen.value = false
}

const toggleBranchDropdown = () => {
  isBranchDropdownOpen.value = !isBranchDropdownOpen.value
  isAppMenuOpen.value = false
  isProfileMenuOpen.value = false
}

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
  isAppMenuOpen.value = false
  isBranchDropdownOpen.value = false
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const selectApp = (appName: string) => {
  selectedApp.value = appName.toUpperCase()
  isAppMenuOpen.value = false
  // Handle app navigation here
}

const selectBranch = (branch: { id: number; name: string }) => {
  selectedBranch.value = branch.name
  isBranchDropdownOpen.value = false
}

const openModal = () => {
  console.log('Opening notifications...')
}

const openMobileSearch = () => {
  console.log('Opening mobile search...')
}

const logout = () => {
  console.log('Logging out...')
  router.push('/auth/login')
}

// Close dropdowns when clicking outside
const closeDropdownsOnOutsideClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isAppMenuOpen.value = false
    isBranchDropdownOpen.value = false
    isProfileMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdownsOnOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownsOnOutsideClick)
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.app-header {
  border-bottom: 0.5px solid rgba(9, 30, 66, 0.14);
}

.department-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 21.213px;
  letter-spacing: 0.1px;
}

.medium-text {
  font-weight: 500;
}
</style> 