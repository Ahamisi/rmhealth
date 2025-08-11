<template>
    <div class="bg-gray-50 min-h-screen font-sans">
      <!-- App Header with Navigation -->
      <AppHeader />

          <!-- Main Content -->
      <main class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 class="text-lg font-semibold text-[#626F86] mb-4">Dashboard</h1>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column (Main Content) -->
        <div class="lg:col-span-2">
          <Card>
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Daily Fulfilment Stats</h2>
                <div class="flex items-center text-sm text-gray-500">
                  <img src="/icons/calendar.svg" alt="Calendar" class="w-4 h-4">
                  <span class="ml-2">{{ currentDate }}</span>
                </div>
              </div>
            </template>
            
            <!-- Data Table -->
            <StaticDatatable 
              :columns="fulfilmentColumns" 
              :data="fulfilmentData"
              :searchable="true"
              :exportable="false"
              :printable="false"
              :filterEnabled="true"
              :perPage="10"
              @onFilter="openFilterModal"
            >
              <template #column="{ props: { row, column } }">
                <div v-if="column.field === 'agentName'" class="flex items-center space-x-2">
                  <Avatar :src="row.avatar" size="sm" />
                  <span class="font-medium text-gray-800">{{ row.agentName }}</span>
                </div>
                <span v-else>{{ row[column.field] }}</span>
              </template>
            </StaticDatatable>
          </Card>
        </div>

        <!-- Right Column (Sidebar) -->
        <div>
          <Card>
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">Order Time Tracker</h2>
                <div class="relative year-dropdown">
                  <button 
                    @click="isYearDropdownOpen = !isYearDropdownOpen"
                    class="text-sm bg-gray-100 border border-gray-200 rounded-md pl-3 pr-8 py-2 flex items-center focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  >
                    {{ selectedYear }}
                    <!-- Chevron Down Icon -->
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      xmlns="http://www.w3.org/2000/svg"
                      class="ml-2 text-gray-500"
                      :class="{ 'rotate-180': isYearDropdownOpen }"
                    >
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </button>
                  
                  <!-- Dropdown Menu -->
                  <div
                    v-if="isYearDropdownOpen"
                    class="absolute right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-24"
                  >
                    <button
                      v-for="year in availableYears"
                      :key="year"
                      @click="selectYear(year)"
                      class="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      :class="{ 'bg-gray-50 font-medium': selectedYear === year }"
                    >
                      {{ year }}
                    </button>
                  </div>
                </div>
              </div>
            </template>
            
            <div class="space-y-0">
              <!-- Dynamic Timeline Items -->
              <div 
                v-for="(step, index) in orderTimeTrackerData" 
                :key="step.id" 
                class="flex items-start"
              >
                <!-- Icon Column -->
                <div class="flex flex-col items-center mr-4 w-8">
                  <div 
                    class="flex items-center justify-center w-8 h-8 rounded-full" 
                    :style="{ backgroundColor: step.color }"
                  >
                    <!-- Dynamic AtlasKit Icon -->
                    <img 
                      :src="getAtlasKitIcon(step.icon)" 
                      alt="Icon" 
                      class="w-4 h-4"
                    />
                  </div>
                  <!-- Connector line (hide for last item) -->
                  <div 
                    v-if="index < orderTimeTrackerData.length - 1"
                    class="w-px bg-gray-200 my-3"
                    :style="{ height: '50px' }"
                  ></div>
                </div>
                
                <!-- Content Column with flex for time alignment -->
                <div class="flex-1 flex justify-between items-start" :class="index < orderTimeTrackerData.length - 1 ? 'pb-6' : ''">
                  <div class="flex-1">
                    <p class="font-medium text-gray-800">{{ step.title }}</p>
                    <p class="text-sm text-gray-500">{{ step.description }}</p>
                  </div>
                  <div class="text-sm font-semibold text-gray-600 ml-4">
                    {{ step.duration }}
                  </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import Avatar from '@/components/ui/Avatar.vue';
import StaticDatatable from '@/components/ui/StaticDatatable.vue';

import Modal from '@/components/ui/Modal.vue';
import DatePicker from '@/components/ui/DatePicker.vue';
import UiButton from '@/components/ui/Button.vue';
import AppHeader from '@/components/layout/AppHeader.vue';

const route = useRoute();

// Columns for the Fulfilment Stats table (Old Datatable format)
const fulfilmentColumns = ref([
  { field: 'id', label: 'ID', sortable: true },
  { field: 'agentName', label: 'Agent Name', sortable: true },
  { field: 'orders', label: 'No. of Orders', sortable: false },
  { field: 'items', label: 'No. of Items', sortable: false },
  { field: 'checkIn', label: 'Check In Time', sortable: false },
  { field: 'checkOut', label: 'Check Out Time', sortable: false },
  { field: 'productivity', label: 'Productivity Score', sortable: false },
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

const openFilterModal = (filterData?: { fromDate: string; toDate: string }) => {
  if (filterData) {
    // Handle filter data from the datatable
    console.log('Filter applied:', filterData)
    // You can implement actual filtering logic here
  } else {
    // Show filter modal if needed
    showFilterModal.value = true
  }
}

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

// Year dropdown state
const isYearDropdownOpen = ref(false);
const selectedYear = ref(2025);
const availableYears = ref([2025, 2024, 2023, 2022]);

const selectYear = (year: number) => {
  selectedYear.value = year;
  isYearDropdownOpen.value = false;
  // Here you could fetch new data based on selected year
};

// Close dropdown on outside click
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Element;
  if (!target.closest('.year-dropdown')) {
    isYearDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

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
  const icons: Record<string, string> = {
    'credit-card': '/icons/accounting.svg',
    'document-filled': '/icons/inventory.svg',
    'box': '/icons/logistics.svg'
  };
  
  return icons[iconName] || icons['box'];
};
</script>

<style scoped>
</style> 