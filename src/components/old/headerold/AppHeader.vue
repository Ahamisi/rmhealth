<template>
  <header
    class="relative z-50 flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm md:hidden"
  >
    <!-- Left: Logo -->
    <div class="flex items-center space-x-2">
      <img src="/redesign/app.svg" alt="Logo" class="w-6 h-6" />
      <img src="/redesign/logo.svg" alt="Logo" class="w-6 h-6" />
      <span class="text-sm font-semibold text-blue-700 uppercase">{{
        selectedApp
      }}</span>
    </div>

    <!-- Right: Icons -->
    <div class="flex items-center space-x-4">
      <!-- Search Icon (optional) -->
      <button @click="openMobileSearch">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-4.35-4.35M9 17a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
      </button>

      <!-- Notification Bell with Panel -->
      <div class="relative cursor-pointer">
        <div @click="openModal">
          <Bell
            class="w-5 h-5 rotate-45 stroke-2 fill-gray-500 stroke-gray-500"
          />
          <div
            class="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center"
          >
            {{ notificationCount > 9 ? "9+" : notificationCount }}
          </div>
        </div>
        <Transition name="slide">
          <Notification v-if="notification" />
        </Transition>
      </div>

      <!-- Mobile Menu Toggle -->
      <button @click="toggleMobileMenu">
        <svg
          v-if="!isMobileMenuOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <LucideX v-else class="w-5 h-5" @click="toggleMobileMenu"></LucideX>
      </button>
    </div>
  </header>

  <!-- Slide-In Mobile Menu -->
  <Transition name="slide">
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 flex sm:hidden">
      <!-- Overlay background (optional dimming) -->
      <div
        class="flex-1 bg-black bg-opacity-25"
        @click.self="isMobileMenuOpen = false"
      ></div>

      <!-- Slide-in menu -->

      <div
        class="relative w-64 h-full px-4 py-4 bg-white border-l border-gray-200 shadow-lg"
      >
        <LucideX
          class="absolute w-5 h-5 cursor-pointer top-2 right-2"
          @click="toggleMobileMenu"
        ></LucideX>
        <!-- Branch Switch -->
        <div class="mb-4">
          <label class="text-xs font-medium text-gray-500">Branch</label>
          <select
            v-model="selectedBranchId"
            class="w-full px-3 py-1 mt-1 text-sm text-gray-700 border border-gray-300 rounded"
          >
            <option
              v-for="branch in branches"
              :key="branch.id"
              :value="branch.id"
            >
              {{ branch.name }}
            </option>
          </select>
        </div>

        <!-- User Info -->
        <div class="flex items-center mb-4 space-x-2">
          <div
            class="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full"
          >
            <img src="/redesign/avatarImage.svg" class="w-6 h-6" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-800">
              {{ authStore?.user?.name || "Unavailable" }}
            </p>
            <p class="text-xs text-gray-500">
              {{ authStore?.user?.email || "Unavailable" }}
            </p>
          </div>
        </div>

        <!-- Menu Options -->
        <div class="space-y-2">
          <button
            class="flex items-center w-full px-2 py-1 text-sm text-left text-gray-700 rounded hover:bg-gray-100"
          >
            <Lightbulb class="w-4 h-4 mr-2 text-gray-500" />
            Feature Request
          </button>

          <router-link
            to="/profile"
            class="flex items-center w-full px-2 py-1 text-sm text-gray-700 rounded hover:bg-gray-100"
          >
            <Settings class="w-4 h-4 mr-2 text-gray-500" />
            Profile Settings
          </router-link>

          <button
            @click="logout"
            class="flex items-center w-full px-2 py-1 text-sm text-left text-red-600 rounded hover:bg-gray-100"
          >
            <LogOut class="w-4 h-4 mr-2 text-red-500" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <header
    class="relative z-50 hidden px-6 bg-white border-b border-gray-200 shadow-sm md:block"
  >
    <div class="flex items-center justify-between px-4 py-3 mx-auto">
      <!-- Left Side: Logo & Branch Dropdown -->
      <div class="flex items-center">
        <!-- Logo -->
        <div class="relative flex items-center gap-2 mr-6">
          <div
            class="p-1"
            :class="{ 'bg-gray-200 rounded-full': isAppMenuOpen }"
            @click="toggleAppMenu"
          >
            <img
              src="/redesign/app.svg"
              alt="Logo"
              class="cursor-pointer w-7 h-7"
            />
          </div>

          <div
            v-if="isAppMenuOpen"
            class="absolute z-50 w-64 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-full"
          >
            <ul>
              <li
                v-for="app in applications"
                :key="app.name"
                @click="selectApp(app.name)"
                class="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                <div class="flex items-center">
                  <img :src="app.icon" :alt="app.name" class="w-6 h-6 mr-3" />
                  <span class="capitalize medium-text text-text-subtle">{{
                    app.name
                  }}</span>
                </div>
                <img
                  v-if="selectedApp === app.name"
                  src="/redesign/check-circle.svg"
                  alt="Selected"
                />
              </li>
            </ul>
          </div>

          <img
            src="/redesign/logo.svg"
            alt="Procurement Logo"
            class="w-6 h-6"
          />
          <span class="ml-2 text-xl font-bold text-blue-700 uppercase">{{
            selectedApp
          }}</span>
        </div>
      </div>

      <!-- Branch Dropdown -->

      <div class="relative">
        <button
          ref="branchButton"
          @click="toggleBranchDropdown"
          class="flex items-center border capitalize border-gray-300 rounded px-3 py-1.5 text-gray-700 font-semibold focus:outline-none bg-bg-neutral"
        >
          <p class="medium-text">
            {{ authStore.selectedBranch?.name.toLocaleLowerCase() + " branch" }}
          </p>
          <ChevronDown class="ml-2 mt-[2px] h-4 w-4 text-gray-700 stroke-2" />
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="isBranchDropdownOpen"
          class="absolute left-0 z-50 px-2 py-1 mt-2 bg-white border border-gray-300 rounded-md shadow-lg"
        >
          <a
            v-for="branch in branches"
            :key="branch.name + branch.id"
            @click="selectBranch(branch)"
            class="block px-4 py-2 capitalize cursor-pointer medium-text text-text-default hover:bg-gray-100"
          >
            {{ branch.name.toLocaleLowerCase() + " branch" }}
          </a>
        </div>
      </div>
    </div>

    <!-- Right Side: Notifications, Messages, User Profile -->
    <div class="flex items-center space-x-4">
      <div class="flex items-center">
        <GlobalSearch
          v-model="searchTerm"
          @change="editSearchTerm"
        ></GlobalSearch>
      </div>
      <!-- Notifications -->
      <div class="relative cursor-pointer" @click="openModal">
        <Bell
          class="w-5 h-5 rotate-45 stroke-2 fill-gray-500 stroke-gray-500"
        />
        <div
          class="absolute flex items-center justify-center w-4 h-4 px-3 text-xs font-semibold rounded-full -top-2 -right-2 bg-rose-600 text-gray-50"
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
          class="flex items-center justify-center w-8 h-8"
          :class="{ 'bg-gray-200 rounded-full': isProfileMenuOpen }"
        >
          <img src="/redesign/silhouette.svg" class="w-6 h-6 rounded-full" />
        </div>
        <div
          v-if="isProfileMenuOpen"
          class="absolute right-0 z-50 w-64 py-3 mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
        >
          <div class="flex items-center px-4 py-2 border-b border-gray-200">
            <div class="relative w-10 h-10">
              <div
                class="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full"
              >
                <img
                  src="/redesign/avatarImage.svg"
                  class="w-8 h-8 text-gray-500"
                />
              </div>
              <!-- Green Status Dot OVERLAYED on Profile Image -->
              <span
                class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
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
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, watch, computed } from "vue";
import { useRouter } from "vue-router";
import {
  ChevronDown,
  Bell,
  MessageSquareText,
  User,
  Lightbulb,
  Settings,
  LogOut,
  LucideX,
  LogIn,
} from "lucide-vue-next";

import { useNotificationModal } from "@/Composables/procurement/useNotificationModal";
import Notification from "@/Components/procurement/notifications/Notification.vue";
import { useAuthStore } from "@/stores/auth";
import { useGlobalStore } from "@/stores/global";
import GlobalSearch from "@/Components/procurement/search/GlobalSearch.vue";
import { useDashboard } from "@/Composables/procurement/useDashboard";
import { Branch } from "@/types";
import { useNotifications } from "@/Composables/procurement/useNotifications";

const authStore = useAuthStore();
const router = useRouter();

// Branch dropdown state
const isBranchDropdownOpen = ref(false);
const { fetchBranches, fetchDashboardStats } = useDashboard();
const branches = ref<Branch[] | []>([]);
const branchButton = ref<HTMLElement | null>(null);
const isAppMenuOpen = ref(false);
const selectedApp = ref("");

const applications = authStore.departments;
// the route is the name in the route file
const department_base_routes = [
  { name: "inbound", route: "inbound.dashboard" },
  { name: "procurement", route: "dashboard" },
  // inbound.dashboard
];

const hasRoute = (name: string): boolean => {
  return department_base_routes.some(
    (route) => route.name.toLowerCase() === name.toLowerCase()
  );
};

const getRoute = (name: string): string | undefined => {
  const route = department_base_routes.find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );
  return route?.route;
};

// const applications = [
//   { name: "Procurement", icon: "/redesign/ProcurementIcon.svg" },
//   { name: "Inbound", icon: "/redesign/InboundIcon.svg" },
//   { name: "Customer success", icon: "/redesign/CustomerSuccessIcon.svg" },
//   { name: "Outbound", icon: "/redesign/OutboundIcon.svg" },
//   { name: "Logistics", icon: "/redesign/LogisticsIcon.svg" },
// ];

const selectedBranchId = computed({
  get: () => authStore.selectedBranch?.id,
  set: (id) => {
    if (id === undefined) return;
    const branch = branches.value.find((b) => b.id === id);
    if (branch) {
      authStore.setSelectedBranch(branch);
    }
  },
});

// Notifications & messages state
const { notifications, fetchNotifications, startPolling } = useNotifications();
const notificationCount = computed(
  () => notifications.value.filter((n) => !n.read).length
);
const isProfileMenuOpen = ref(false);
const notification = useNotificationModal();
const store = useGlobalStore();

const openModal = () => {
  notification.value = true;
};

// Toggle Branch Dropdown
const toggleBranchDropdown = () => {
  isBranchDropdownOpen.value = !isBranchDropdownOpen.value;
};

const toggleAppMenu = () => {
  isAppMenuOpen.value = !isAppMenuOpen.value;
};

const selectApp = (appName: string) => {
  selectedApp.value = appName;
  isAppMenuOpen.value = false;

  if (hasRoute(appName)) {
    const routeName = getRoute(appName);
    if (routeName) {
      router.push({ name: routeName });
      localStorage.setItem("selected_department", appName);
      return;
    }
  }

  // Fallback: find the first application that exists in department_base_routes
  const fallbackApp = applications?.find((app) =>
    department_base_routes.some(
      (route) => route.name.toLowerCase() === app.name.toLowerCase()
    )
  );

  if (fallbackApp) {
    selectedApp.value = fallbackApp.name;
    const fallbackRoute = getRoute(fallbackApp.name);
    if (fallbackRoute) {
      router.push({ name: fallbackRoute });
      localStorage.setItem("selected_department", fallbackApp.name);
    } else {
      console.warn("No route found for fallback application.");
    }
  } else {
    console.warn("No matching application found in department_base_routes.");
  }
};

// Select a Branch
const selectBranch = (branch: Branch) => {
  authStore.setSelectedBranch(branch);
  isBranchDropdownOpen.value = false;
  window.location.reload();
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
    (isBranchDropdownOpen.value ||
      isProfileMenuOpen.value ||
      isAppMenuOpen.value)
  ) {
    isBranchDropdownOpen.value = false;
    isProfileMenuOpen.value = false;
    isAppMenuOpen.value = false;
  }
};
const dashboardStats = reactive({
  revenue: 0,
  receivedProductsQuantity: 0,
  orderPendingArrival: 0,
});

onMounted(async () => {
  document.addEventListener("click", closeDropdownsOnOutsideClick);
  let department =
    localStorage.getItem("selected_department") || "no department";
  if (department) {
    selectApp(department);
  }
  // Fetch branches from the API and store them in the branches variable
  branches.value = await fetchBranches();
  await fetchNotifications();
  startPolling();

  // Set initial selected branch from store or first in list
  if (!authStore.selectedBranch && branches.value.length > 0) {
    authStore.setSelectedBranch(branches.value[0]);
  }

  const stats = await fetchDashboardStats();
  //   dashboardStats.revenue stats.revenue
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdownsOnOutsideClick);
});

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const openMobileSearch = () => {
  console.log("Open mobile search (you can hook modal here)");
};
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
