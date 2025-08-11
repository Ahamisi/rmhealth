<template>
  <div class="relative inline-block h-full text-left" ref="dropdownRef">
    <!-- Dropdown Button -->
    <button @click="handleButtonClick"
      class="inline-flex items-center justify-between w-full h-full py-2 text-xs font-semibold focus:outline-none navbar_dropdown_title"
      :class="{ 'dropdown-active': isActiveDropdown }">
      {{ title }}
      <svg v-if="useThreeDots" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 12.5C13.5 12.697 13.4612 12.892 13.3858 13.074C13.3104 13.256 13.1999 13.4214 13.0607 13.5607C12.9214 13.6999 12.756 13.8104 12.574 13.8858C12.392 13.9612 12.197 14 12 14C11.803 14 11.608 13.9612 11.426 13.8858C11.244 13.8104 11.0786 13.6999 10.9393 13.5607C10.8001 13.4214 10.6896 13.256 10.6142 13.074C10.5388 12.892 10.5 12.697 10.5 12.5C10.5 12.1022 10.658 11.7206 10.9393 11.4393C11.2206 11.158 11.6022 11 12 11C12.3978 11 12.7794 11.158 13.0607 11.4393C13.342 11.7206 13.5 12.1022 13.5 12.5ZM13.5 17C13.5 17.197 13.4612 17.392 13.3858 17.574C13.3104 17.756 13.1999 17.9214 13.0607 18.0607C12.9214 18.1999 12.756 18.3104 12.574 18.3858C12.392 18.4612 12.197 18.5 12 18.5C11.803 18.5 11.608 18.4612 11.426 18.3858C11.244 18.3104 11.0786 18.1999 10.9393 18.0607C10.8001 17.9214 10.6896 17.756 10.6142 17.574C10.5388 17.392 10.5 17.197 10.5 17C10.5 16.6022 10.658 16.2206 10.9393 15.9393C11.2206 15.658 11.6022 15.5 12 15.5C12.3978 15.5 12.7794 15.658 13.0607 15.9393C13.342 16.2206 13.5 16.6022 13.5 17ZM13.5 8C13.5 8.19698 13.4612 8.39204 13.3858 8.57403C13.3104 8.75601 13.1999 8.92137 13.0607 9.06066C12.9214 9.19995 12.756 9.31044 12.574 9.38582C12.392 9.4612 12.197 9.5 12 9.5C11.803 9.5 11.608 9.4612 11.426 9.38582C11.244 9.31044 11.0786 9.19995 10.9393 9.06066C10.8001 8.92137 10.6896 8.75601 10.6142 8.57403C10.5388 8.39204 10.5 8.19698 10.5 8C10.5 7.60218 10.658 7.22064 10.9393 6.93934C11.2206 6.65804 11.6022 6.5 12 6.5C12.3978 6.5 12.7794 6.65804 13.0607 6.93934C13.342 7.22064 13.5 7.60218 13.5 8Z" fill="#44546F"/>
      </svg>
      <svg v-else class="w-3 h-3 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Items -->
    <transition name="fade">
      <div v-if="isOpen"
        class="absolute z-50 pt-1 origin-top-right bg-white border border-gray-200 rounded-md shadow-sm w-max">
        <div v-for="(item, index) in items" :key="index" class="border-gray-100"
          :class="{ 'border-b': item.has_bottom_rule }">
          <a href="#" @click.prevent="navigateTo(item.route)"
            class="block hover:pl-4 nav_dropdown_menu_item" :class="{ 'active': route.name === item.route.name }">
            {{ item.title }}
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useGlobalStore } from "@/stores/global";

const dropdownRef = ref(null);

interface DropdownItem {
  title: string;
  route: {
    name: string
  };
  has_bottom_rule?: boolean;
}

const props = withDefaults(defineProps<{
  title: string;
  items: DropdownItem[];
  useThreeDots?: boolean;
}>(), {});

const router = useRouter();
const route = useRoute();
const globalStore = useGlobalStore();

const dropdownId = computed(() => props.title?.trim().toLowerCase());
const isOpen = computed(() => globalStore.openDropdownId === dropdownId.value);

const handleButtonClick = (event: Event) => {
  event.stopPropagation();
  globalStore.toggleDropdown(dropdownId.value);
};

// Handle clicks outside - more controlled approach
const handleDocumentClick = (event: Event) => {
  if (!dropdownRef.value) return;
  
  const target = event.target as Element;
  const dropdownElement = dropdownRef.value as HTMLElement;
  
  // Check if click is outside this specific dropdown
  if (!dropdownElement.contains(target) && globalStore.openDropdownId === dropdownId.value) {
    globalStore.closeDropdown();
  }
};

// When clicking a route item
const navigateTo = (targetRoute: { name: string }) => {
  globalStore.closeDropdown();
  router.push(targetRoute);
};

// Determine if any item matches the route
const isActiveDropdown = computed(() => {
  return props.items.some(item => route.name === item.route.name);
});

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.app_navigation .navbar_menu .navbar_dropdown_title {
  color: rgba(68, 84, 111, 1);
  font-weight: 500;
  transition: border-bottom 0.2s ease;
}

.app_navigation .navbar_menu .navbar_dropdown_title:hover {
  border-bottom: 2px solid rgba(9, 30, 66, 0.06);
}

.app_navigation .navbar_menu .navbar_dropdown_title.dropdown-active {
  color: rgba(12, 102, 228, 1);
  border-bottom: 2px solid rgba(12, 102, 228, 1);
}

.app_navigation .navbar_menu .nav_dropdown_menu_item {
  color: rgba(23, 43, 77, 1);
  font-size: 11px;
  font-style: normal;
  font-weight: 450;
  line-height: 16px;
  padding: 9px 16px;
}

.app_navigation .navbar_menu .nav_dropdown_menu_item:hover {
  background: rgba(9, 30, 66, 0.06);
}

.app_navigation .navbar_menu .nav_dropdown_menu_item.active{
  background: rgba(233, 242, 255, 1);
  color: rgba(12, 102, 228, 1);
  border-left: 2px solid rgba(12, 102, 228, 1);
}
</style>