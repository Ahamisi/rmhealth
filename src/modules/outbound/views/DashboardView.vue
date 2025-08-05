<template>
    <div class="bg-gray-50 min-h-screen font-sans">
      <!-- App Header with Navigation -->
      <AppHeader />

          <!-- Main Content -->
      <main class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 class="text-xl font-semibold text-gray-900 mb-4">Dashboard</h1>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column (Main Content) -->
        <div class="lg:col-span-2">
          <Card>
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Daily Fulfilment Stats</h2>
                <div class="flex items-center text-sm text-gray-500">
                  <!-- AtlasKit Calendar Icon -->
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.5 1C7.32843 1 8 1.67157 8 2.5V3H16V2.5C16 1.67157 16.6716 1 17.5 1C18.3284 1 19 1.67157 19 2.5V3H19.5C20.8807 3 22 4.11929 22 5.5V19.5C22 20.8807 20.8807 22 19.5 22H4.5C3.11929 22 2 20.8807 2 19.5V5.5C2 4.11929 3.11929 3 4.5 3H5V2.5C5 1.67157 5.67157 1 6.5 1ZM16 5H19.5C19.7761 5 20 5.22386 20 5.5V8H4V5.5C4 5.22386 4.22386 5 4.5 5H5V5.5C5 6.32843 5.67157 7 6.5 7C7.32843 7 8 6.32843 8 5.5V5H16V5.5C16 6.32843 16.6716 7 17.5 7C18.3284 7 19 6.32843 19 5.5V5ZM20 10H4V19.5C4 19.7761 4.22386 20 4.5 20H19.5C19.7761 20 20 19.7761 20 19.5V10Z"/>
                  </svg>
                  <span class="ml-2">{{ currentDate }}</span>
                </div>
              </div>
            </template>
            
            <div class="space-y-4">
              <!-- Search and Filter -->
              <div class="flex items-center space-x-3">
                <!-- Search Input -->
                <div class="relative flex-1 max-w-xs">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <!-- AtlasKit Search Icon -->
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C12.3491 18 14.0393 17.3466 15.3701 16.2393L20.2197 21.0889C20.5126 21.3818 20.9874 21.3818 21.2803 21.0889C21.5732 20.796 21.5732 20.3212 21.2803 20.0283L16.4307 15.1787C17.5379 13.8479 18.1914 12.1577 18.1914 10.3086C18.1914 6.16646 14.8335 2.80859 10.6914 2.80859C6.54925 2.80859 3.19141 6.16646 3.19141 10.3086C3.19141 14.4507 6.54925 17.8086 10.6914 17.8086C12.5405 17.8086 14.2307 17.1551 15.5615 16.0479L20.411 20.8974C20.7039 21.1903 21.1787 21.1903 21.4716 20.8974C21.7645 20.6045 21.7645 20.1297 21.4716 19.8368L16.622 14.9873C17.7293 13.6565 18.3828 11.9663 18.3828 10.1172C18.3828 6.35786 15.025 3 10.8828 3H10.5Z"/>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search" 
                    class="w-full bg-white border border-gray-200 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                </div>
                
                <!-- Filter Button -->
                <button 
                  @click="openFilterModal"
                  class="flex items-center justify-center w-10 h-10 text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <!-- AtlasKit Filter Icon -->
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99999 13H17L18 11H5.99999L6.99999 13ZM3.99299 6C3.44499 6 3.20299 6.405 3.44699 6.895L3.99999 8H20L20.553 6.895C20.8 6.4 20.555 6 20.007 6H3.99299ZM10.778 17.556C10.8509 17.6861 10.9561 17.7953 11.0834 17.8731C11.2107 17.9508 11.3559 17.9945 11.505 18H12.495C12.774 18 13.1 17.8 13.222 17.556L14 16H9.99999L10.778 17.556Z" fill="#44546F"/>
                  </svg>
                </button>
                
                <!-- Selected Period Display -->
                <div v-if="selectedPeriod" class="flex items-center bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-sm text-blue-700">
                  <span>{{ selectedPeriod }}</span>
                  <button @click="clearFilter" class="ml-2 text-blue-400 hover:text-blue-600">
                    <!-- AtlasKit Cross Icon -->
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Data Table -->
              <DataTable :columns="fulfilmentColumns" :data="fulfilmentData">
                <template #cell(agentName)="{ item }">
                  <div class="flex items-center space-x-2">
                    <Avatar :src="item.avatar" size="sm" />
                    <span class="font-medium text-gray-800">{{ item.agentName }}</span>
                  </div>
                </template>
              </DataTable>
            </div>
          </Card>
        </div>

        <!-- Right Column (Sidebar) -->
        <div>
          <Card>
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Order Time Tracker</h2>
                <div class="relative">
                  <select class="text-sm bg-gray-100 border border-gray-200 rounded-md pl-3 pr-8 py-2 appearance-none focus:ring-2 focus:ring-primary-500">
                    <option>2025</option>
                    <option>2024</option>
                  </select>
                  <!-- Chevron Down Icon -->
                  <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </template>
            
            <div class="space-y-0">
              <!-- Dynamic Timeline Items -->
              <div 
                v-for="(step, index) in orderTimeTrackerData" 
                :key="step.id" 
                class="flex"
              >
                <div class="flex flex-col items-center mr-4 w-8">
                  <div 
                    class="flex items-center justify-center w-8 h-8 rounded-full" 
                    :style="{ backgroundColor: step.color }"
                  >
                    <!-- Dynamic AtlasKit Icon -->
                    <svg 
                      width="16" 
                      height="16" 
                      :viewBox="getAtlasKitIcon(step.icon).viewBox" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      v-html="getAtlasKitIcon(step.icon).path"
                    >
                    </svg>
                  </div>
                  <!-- Connector line (hide for last item) -->
                  <div 
                    v-if="index < orderTimeTrackerData.length - 1"
                    class="w-px h-16 bg-gray-200 mt-2"
                  ></div>
                </div>
                <div :class="index < orderTimeTrackerData.length - 1 ? 'pb-6 pt-1' : 'pt-1'">
                  <p class="font-medium text-gray-800">{{ step.title }}</p>
                  <p class="text-sm text-gray-500">{{ step.description }}</p>
                  <p class="text-sm font-semibold text-gray-600 mt-1">{{ step.duration }}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>

    <!-- Filter Modal -->
    <Modal v-model="showFilterModal">
      <template #header>
        Filter
      </template>
      
      <div class="space-y-6">
        <!-- Date Range -->
        <div class="grid grid-cols-2 gap-4">
          <DatePicker 
            v-model="fromDate" 
            label="From" 
            placeholder="10-10-24"
          />
          <DatePicker 
            v-model="toDate" 
            label="To" 
            placeholder="11-11-24"
          />
        </div>
      </div>

      <template #footer>
        <UiButton 
          variant="ghost" 
          @click="resetFilter"
          class="mr-3"
        >
          Reset all
        </UiButton>
        <UiButton 
          @click="applyFilter"
        >
          Apply
        </UiButton>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import Avatar from '@/components/ui/Avatar.vue';
import DataTable from '@/components/ui/DataTable.vue';

import Modal from '@/components/ui/Modal.vue';
import DatePicker from '@/components/ui/DatePicker.vue';
import UiButton from '@/components/ui/Button.vue';
import AppHeader from '@/components/layout/AppHeader.vue';

const route = useRoute();

// Columns for the Fulfilment Stats table
const fulfilmentColumns = ref([
  { key: 'id', label: 'ID', sortable: true },
  { key: 'agentName', label: 'Agent Name', sortable: true },
  { key: 'orders', label: 'No. of Orders', sortable: false },
  { key: 'items', label: 'No. of Items', sortable: false },
  { key: 'checkIn', label: 'Check In Time', sortable: false },
  { key: 'checkOut', label: 'Check Out Time', sortable: false },
  { key: 'productivity', label: 'Productivity Score', sortable: false },
]);

// Dummy data for the Fulfilment Stats table (Extended for scrolling)
const fulfilmentData = ref([
  { id: 25, agentName: 'Babajide Raji', orders: 20, items: 20, checkIn: '08:30 am', checkOut: '05:30 pm', productivity: 95, avatar: 'https://i.pravatar.cc/40?img=1' },
  { id: 24, agentName: 'Daniel Makinde', orders: 18, items: 22, checkIn: '09:00 am', checkOut: '06:00 pm', productivity: 88, avatar: 'https://i.pravatar.cc/40?img=2' },
  { id: 23, agentName: 'Esther Joel', orders: 15, items: 18, checkIn: '08:45 am', checkOut: '05:45 pm', productivity: 85, avatar: 'https://i.pravatar.cc/40?img=3' },
  { id: 22, agentName: 'Adebayo Tunde', orders: 12, items: 15, checkIn: '09:15 am', checkOut: '06:15 pm', productivity: 78, avatar: 'https://i.pravatar.cc/40?img=4' },
  { id: 21, agentName: 'Femi Babalola', orders: 14, items: 16, checkIn: '08:20 am', checkOut: '05:20 pm', productivity: 82, avatar: 'https://i.pravatar.cc/40?img=5' },
  { id: 20, agentName: 'Sarah Badmus', orders: 11, items: 13, checkIn: '09:30 am', checkOut: '06:30 pm', productivity: 75, avatar: 'https://i.pravatar.cc/40?img=6' },
  { id: 19, agentName: 'Kemi Adeyemi', orders: 16, items: 19, checkIn: '08:10 am', checkOut: '05:10 pm', productivity: 90, avatar: 'https://i.pravatar.cc/40?img=7' },
  { id: 18, agentName: 'Josh Michael', orders: 13, items: 14, checkIn: '09:45 am', checkOut: '06:45 pm', productivity: 80, avatar: 'https://i.pravatar.cc/40?img=8' },
  { id: 17, agentName: 'Tolu Fashina', orders: 17, items: 21, checkIn: '08:00 am', checkOut: '05:00 pm', productivity: 92, avatar: 'https://i.pravatar.cc/40?img=9' },
  { id: 16, agentName: 'Seun Okafor', orders: 10, items: 12, checkIn: '10:00 am', checkOut: '07:00 pm', productivity: 70, avatar: 'https://i.pravatar.cc/40?img=10' },
  { id: 15, agentName: 'Chioma Nwankwo', orders: 19, items: 23, checkIn: '07:45 am', checkOut: '04:45 pm', productivity: 98, avatar: 'https://i.pravatar.cc/40?img=11' },
  { id: 14, agentName: 'Yemi Alade', orders: 9, items: 11, checkIn: '10:30 am', checkOut: '07:30 pm', productivity: 65, avatar: 'https://i.pravatar.cc/40?img=12' },
  { id: 13, agentName: 'Ibrahim Musa', orders: 21, items: 25, checkIn: '07:30 am', checkOut: '04:30 pm', productivity: 100, avatar: 'https://i.pravatar.cc/40?img=13' },
  { id: 12, agentName: 'Grace Okoro', orders: 8, items: 10, checkIn: '11:00 am', checkOut: '08:00 pm', productivity: 60, avatar: 'https://i.pravatar.cc/40?img=14' },
  { id: 11, agentName: 'Emeka Okoye', orders: 22, items: 26, checkIn: '07:15 am', checkOut: '04:15 pm', productivity: 105, avatar: 'https://i.pravatar.cc/40?img=15' },
  { id: 10, agentName: 'Blessing Akpan', orders: 7, items: 9, checkIn: '11:30 am', checkOut: '08:30 pm', productivity: 55, avatar: 'https://i.pravatar.cc/40?img=16' },
  { id: 9, agentName: 'Kunle Adebayo', orders: 23, items: 28, checkIn: '07:00 am', checkOut: '04:00 pm', productivity: 110, avatar: 'https://i.pravatar.cc/40?img=17' },
  { id: 8, agentName: 'Folake Adeniran', orders: 6, items: 8, checkIn: '12:00 pm', checkOut: '09:00 pm', productivity: 50, avatar: 'https://i.pravatar.cc/40?img=18' },
  { id: 7, agentName: 'Chukwu Obioma', orders: 24, items: 30, checkIn: '06:45 am', checkOut: '03:45 pm', productivity: 115, avatar: 'https://i.pravatar.cc/40?img=19' },
  { id: 6, agentName: 'Aisha Bello', orders: 5, items: 7, checkIn: '12:30 pm', checkOut: '09:30 pm', productivity: 45, avatar: 'https://i.pravatar.cc/40?img=20' },
  { id: 5, agentName: 'Damilola Ogundipe', orders: 25, items: 32, checkIn: '06:30 am', checkOut: '03:30 pm', productivity: 120, avatar: 'https://i.pravatar.cc/40?img=21' },
  { id: 4, agentName: 'Fatima Aliyu', orders: 4, items: 6, checkIn: '01:00 pm', checkOut: '10:00 pm', productivity: 40, avatar: 'https://i.pravatar.cc/40?img=22' },
  { id: 3, agentName: 'Gbenga Adeleye', orders: 26, items: 35, checkIn: '06:15 am', checkOut: '03:15 pm', productivity: 125, avatar: 'https://i.pravatar.cc/40?img=23' },
  { id: 2, agentName: 'Hauwa Yakubu', orders: 3, items: 5, checkIn: '01:30 pm', checkOut: '10:30 pm', productivity: 35, avatar: 'https://i.pravatar.cc/40?img=24' },
  { id: 1, agentName: 'Ikechukwu Onwuka', orders: 27, items: 38, checkIn: '06:00 am', checkOut: '03:00 pm', productivity: 130, avatar: 'https://i.pravatar.cc/40?img=25' },
]);



// Filter modal state
const showFilterModal = ref(false);
const selectedPeriod = ref('Oct 10, 2024 - Nov 11, 2024');
const fromDate = ref('10-10-24');
const toDate = ref('11-11-24');

const openFilterModal = () => {
  showFilterModal.value = true;
};

const closeFilterModal = () => {
  showFilterModal.value = false;
};

const clearFilter = () => {
  selectedPeriod.value = '';
  fromDate.value = '';
  toDate.value = '';
};

const applyFilter = () => {
  if (fromDate.value && toDate.value) {
    selectedPeriod.value = `${fromDate.value} - ${toDate.value}`;
  }
  closeFilterModal();
};

const resetFilter = () => {
  fromDate.value = '10-10-24';
  toDate.value = '11-11-24';
};

// Current date
const currentDate = computed(() => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return `Today, ${today.toLocaleDateString('en-US', options)}`;
});



// Order Time Tracker data structure
interface TimelineStep {
  id: string;
  department: 'accounting' | 'inventory' | 'logistics';
  title: string;
  description: string;
  duration: string;
  icon: string;
  color: string;
  fromStatus: string;
  toStatus: string;
}

// Mock Order Time Tracker data (replace with API call)
const orderTimeTrackerData = ref<TimelineStep[]>([
  {
    id: 'acc_001',
    department: 'accounting',
    title: 'Accounting',
    description: 'Order Pending → Order Confirmed',
    duration: '0 hours',
    icon: 'credit-card',
    color: '#E56910',
    fromStatus: 'Order Pending',
    toStatus: 'Order Confirmed'
  },
  {
    id: 'inv_001',
    department: 'inventory',
    title: 'Inventory',
    description: 'Account Confirmed → Order Confirmed',
    duration: '1 minute',
    icon: 'document-filled',
    color: '#0C66E4',
    fromStatus: 'Account Confirmed',
    toStatus: 'Order Confirmed'
  },
  {
    id: 'inv_002',
    department: 'inventory',
    title: 'Inventory',
    description: 'Order Confirmed → Being Processed',
    duration: '1 minute',
    icon: 'document-filled',
    color: '#0C66E4',
    fromStatus: 'Order Confirmed',
    toStatus: 'Being Processed'
  },
  {
    id: 'inv_003',
    department: 'inventory',
    title: 'Inventory',
    description: 'Being Processed → Awaiting Shipment',
    duration: '2 minutes',
    icon: 'document-filled',
    color: '#0C66E4',
    fromStatus: 'Being Processed',
    toStatus: 'Awaiting Shipment'
  },
  {
    id: 'log_001',
    department: 'logistics',
    title: 'Logistics',
    description: 'Awaiting Shipment → Shipped for Delivery',
    duration: '24 seconds',
    icon: 'box',
    color: '#36B37E',
    fromStatus: 'Awaiting Shipment',
    toStatus: 'Shipped for Delivery'
  },
  {
    id: 'log_002',
    department: 'logistics',
    title: 'Logistics',
    description: 'Shipped for Delivery → Items Delivered',
    duration: '2 hours',
    icon: 'box',
    color: '#36B37E',
    fromStatus: 'Shipped for Delivery',
    toStatus: 'Items Delivered'
  }
]);

// Icon mapping for dynamic rendering
const getAtlasKitIcon = (iconName: string) => {
  const icons: Record<string, { viewBox: string; path: string }> = {
    'credit-card': {
      viewBox: "0 0 16 16",
      path: `<path fill-rule="evenodd" clip-rule="evenodd" d="M3.342 11.3333H12.6753V7.33331H3.342V11.3333ZM3.342 5.99998H12.6753V4.66665H3.342V5.99998ZM12.6667 3.33331H3.33333C2.6 3.33331 2 3.93331 2 4.66665V11.3333C2 12.0666 2.6 12.6666 3.33333 12.6666H12.6667C13.4 12.6666 14 12.0666 14 11.3333V4.66665C14 3.93331 13.4 3.33331 12.6667 3.33331Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.67533 9.99998H6.00867V8.66665H4.67533V9.99998Z" fill="white"/>`
    },
    'document-filled': {
      viewBox: "0 0 16 16",
      path: `<path d="M9.99992 3.99998H5.99992C5.63173 3.99998 5.33325 4.29846 5.33325 4.66665C5.33325 5.03484 5.63173 5.33331 5.99992 5.33331H9.99992C10.3681 5.33331 10.6666 5.03484 10.6666 4.66665C10.6666 4.29846 10.3681 3.99998 9.99992 3.99998Z" fill="white"/><path d="M9.99992 5.99998H5.99992C5.63173 5.99998 5.33325 6.29846 5.33325 6.66665C5.33325 7.03484 5.63173 7.33331 5.99992 7.33331H9.99992C10.3681 7.33331 10.6666 7.03484 10.6666 6.66665C10.6666 6.29846 10.3681 5.99998 9.99992 5.99998Z" fill="white"/><path d="M7.33325 7.99998H5.99992C5.63173 7.99998 5.33325 8.29846 5.33325 8.66665C5.33325 9.03484 5.63173 9.33331 5.99992 9.33331H7.33325C7.70144 9.33331 7.99992 9.03484 7.99992 8.66665C7.99992 8.29846 7.70144 7.99998 7.33325 7.99998Z" fill="white"/><path d="M4.66659 2.66665V13.3333H11.3333V2.66665H4.66659ZM3.33325 2.65998C3.33325 1.92798 3.93125 1.33331 4.67059 1.33331H11.3293C12.0679 1.33331 12.6666 1.93198 12.6666 2.65998V13.34C12.6666 14.0726 12.0686 14.6666 11.3293 14.6666H4.67059C4.31758 14.6672 3.97873 14.5279 3.72812 14.2793C3.47751 14.0307 3.33554 13.693 3.33325 13.34V2.65998Z" fill="white"/>`
    },
    'box': {
      viewBox: "0 0 24 24",
      path: `<path d="M12 3L2 8V16L12 21L22 16V8L12 3ZM4 9.5L12 5.5L20 9.5L12 13.5L4 9.5ZM4 11.5V15.5L11 19V15L4 11.5ZM13 15V19L20 15.5V11.5L13 15Z" fill="white"/>`
    }
  };
  
  return icons[iconName] || icons['box'];
};
</script> 