<template>
  <header class="bg-white border-b border-gray-200 shadow-sm px-6">
    <div class="mx-auto px-4 py-3 flex items-center justify-between">
      <!-- Left Side: Logo & Branch Dropdown -->
      <div class="flex items-center">
        <!-- Logo -->
        <div class="flex items-center mr-6">
          <img
            src="/redesign/logo.svg"
            alt="Procurement Logo"
            class="w-8 h-8"
          />
          <span class="text-blue-700 font-bold text-lg ml-2">PROCUREMENT</span>
        </div>

        <!-- Branch Dropdown -->

        <div class="relative">
          <button
            @click="toggleBranchDropdown"
            class="flex items-center border border-gray-300 rounded px-3 py-1.5 text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-bg-neutral"
          >
            <p class="medium-text">
              {{ selectedBranch?.name }}
            </p>
            <ChevronDown class="ml-2 mt-[2px] h-4 w-4 text-gray-700 stroke-2" />
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="isBranchDropdownOpen"
            class="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg py-1 z-50"
          >
            <a
              v-for="branch in branches"
              :key="branch.name + branch.id"
              @click="selectBranch(branch)"
              class="block px-4 py-2 text-xs medium-text text-text-default hover:bg-gray-100 cursor-pointer"
            >
              {{ branch.name }}
            </a>
          </div>
        </div>
      </div>

      <!-- Right Side: Notifications, Messages, User Profile -->
      <div class="flex items-center space-x-6">
        <div class="flex items-center">
          <GlobalSearch
            v-model="searchTerm"
            @change="editSearchTerm"
          ></GlobalSearch>
        </div>
        <!-- Notifications -->
        <div class="relative cursor-pointer" @click="openModal">
          <Bell
            class="h-5 w-5 fill-gray-500 stroke-gray-500 stroke-2 rotate-45"
          />
          <div
            v-if="notificationCount > 0"
            class="absolute -top-2 -right-2 bg-rose-600 text-gray-50 text-xs font-semibold rounded-full h-4 w-4 px-3 flex items-center justify-center"
          >
            {{ notificationCount > 9 ? "9+" : notificationCount }}
          </div>
          <Transition name="slide">
            <Notification v-if="notification" />
          </Transition>
        </div>

        <!-- Messages -->
        <!-- <div class="cursor-pointer" @click="openMessages">

          <img src="/message-circle-text.png" class="" />
        </div> -->

        <!-- User Profile -->
        <div class="relative cursor-pointer" @click="toggleProfileMenu">
          <div
            class="h-7 w-7 bg-gray-500 rounded-full flex items-center justify-center"
          >
            <User class="h-5 w-5 fill-white stroke-white stroke-2" />
          </div>

          <!-- Profile Dropdown -->
          <!-- <div
            v-if="isProfileMenuOpen"
            class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg py-1 z-50"
          >
            <router-link to="/profile">
              <span
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </span>
            </router-link>

            <a
              href="/settings"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Settings
            </a>
            <a
              @click="logout"
              class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
            >
              Logout
            </a>
          </div> -->
          <div
            v-if="isProfileMenuOpen"
            class="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg py-3 z-50"
          >
            <div class="flex items-center px-4 py-2 border-b border-gray-200">
              <div class="relative w-10 h-10">
                <div
                  class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
                >
                  <img
                    src="/redesign/avatarImage.svg"
                    class="w-8 h-8 text-gray-500"
                  />
                </div>
                <!-- Green Status Dot OVERLAYED on Profile Image -->
                <span
                  class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                ></span>
              </div>
              <div class="ml-3">
                <p class="text-text-default dropdown-header-text">
                  {{ authStore?.user?.name || "Unavailable" }}
                </p>
                <p class="dropdown-normal-text text-text-subtlest">
                  {{ authStore?.user?.email || "Unavailable" }}
                </p>
              </div>
            </div>

            <!-- Menu Options -->
            <div class="mt-2">
              <button
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <img
                  src="/redesign/feature-request.svg"
                  class="w-5 h-5 mr-2 text-gray-500"
                />
                Feature Request
              </button>

              <router-link
                to="/profile"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings class="w-5 h-5 mr-2 text-gray-500" />
                Profile Settings
              </router-link>

              <button
                @click="logout"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <img
                  src="/redesign/SignOutIcon.svg"
                  class="w-5 h-5 mr-2 text-gray-500"
                />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from "vue";
import {
  ChevronDown,
  Bell,
  MessageSquareText,
  User,
  Lightbulb,
  Settings,
  LogOut,
  LogIn,
} from "lucide-vue-next";

import { useNotificationModal } from "@/Composables/procurement/useNotificationModal";
import Notification from "@/Components/notifications/Notification.vue";
import { useAuthStore } from "@/stores/auth";
import { useGlobalStore } from "@/stores/global";
import GlobalSearch from "@/Components/procurement/GlobalSearch.vue";
import { useDashboard } from "@/Composables/procurement/useDashboard";
import { Branch } from "@/types";

// Branch dropdown state
const isBranchDropdownOpen = ref(false);
const selectedBranch = ref<Branch | undefined>(null);
const { fetchBranches, fetchDashboardStats } = useDashboard();
const branches = ref<Branch[] | []>([]);

// const branches = [
//   "Lagos branch",
//   // "Abuja branch",
//   // "Port Harcourt branch",
//   "Kano branch",
//   // "Ibadan branch",
// ];

// Notifications & messages state
const notificationCount = ref(12);
const isProfileMenuOpen = ref(false);
const notification = useNotificationModal();
const authStore = useAuthStore();
const store = useGlobalStore();

const openModal = () => {
  notification.value = true;
};

// Toggle Branch Dropdown
const toggleBranchDropdown = () => {
  isBranchDropdownOpen.value = !isBranchDropdownOpen.value;
};

// Select a Branch
const selectBranch = (branch) => {
  selectedBranch.value = branch;
  isBranchDropdownOpen.value = false;
};

// Toggle Profile Menu
const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

// Open Messages (Define it properly now)
const openMessages = () => {
  console.log("Opening messages...");
};

// Logout
const logout = async () => {
  console.log("Logging out...");
  await authStore.logout();
};
const searchTerm = ref(store.searchTerm);

const editSearchTerm = async () => {
  store.$patch({ searchTerm: searchTerm.value });
};

// Close dropdowns when clicking outside
const closeDropdownsOnOutsideClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (
    !target.closest(".relative") &&
    (isBranchDropdownOpen.value || isProfileMenuOpen.value)
  ) {
    isBranchDropdownOpen.value = false;
    isProfileMenuOpen.value = false;
  }
};
const dashboardStats = reactive({
  revenue: 0,
  receivedProductsQuantity: 0,
  orderPendingArrival: 0,
});

onMounted(async () => {
  document.addEventListener("click", closeDropdownsOnOutsideClick);
  branches.value = await fetchBranches();
  console.log("branches");
  console.log(branches.value);
  selectedBranch.value = branches.value[0];

  const stats = await fetchDashboardStats();
  //   dashboardStats.revenue stats.revenue
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdownsOnOutsideClick);
});
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
</style>
