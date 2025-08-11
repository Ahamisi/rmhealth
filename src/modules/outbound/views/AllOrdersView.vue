<template>
  <div class="bg-gray-50 min-h-screen font-sans">
    <AppHeader />

    <!-- Main Content -->
    <main class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <h1 class="text-md font-semibold text-[#626F86]">All Orders</h1>
          <span class="ml-2 text-sm text-[#626F86]">/</span>
          <span class="ml-2 text-sm font-medium text-[#626F86]">New</span>
        </div>
      </div>
      
      <!-- Status Tabs -->
      <div class="mb-6">
        <Tabs
          :tabs="tabsWithCounts"
          :defaultTab="selectedStatus"
          @tabChanged="handleTabChange"
        />
      </div>

      <!-- Actions Bar -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <!-- Search -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <img src="/src/assets/icons/search-icon.svg" alt="Search" class="w-5 h-5">
            </div>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Order Ref No, Customer Name, Store Name" 
              class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors input-search"
            />
          </div>

          <!-- Filter Dropdown -->
          <FilterDropdown @apply="handleFilterApply" />

          <!-- Sort Dropdown -->
          <SortDropdown />
        </div>

        <!-- Download Buttons -->
        <div class="flex items-center space-x-3">
          <DownloadDropdown
            title="Download Time Tracker Report"
            button-text="Download Time Tracker Report"
            @download="handleDownload($event, 'Time Tracker Report')"
          >
            <template #icon>
              <img src="/src/assets/icons/download.svg" alt="Download" class="w-3.5 h-3.5 flex-shrink-0">
            </template>
          </DownloadDropdown>
          
          <DownloadDropdown
            title="Download Order Report"
            button-text="Download Report"
            @download="handleDownload($event, 'Order Report')"
          >
            <template #icon>
              <img src="/src/assets/icons/download.svg" alt="Download" class="w-3.5 h-3.5 flex-shrink-0">
            </template>
          </DownloadDropdown>
        </div>
      </div>

            <!-- Orders Table -->
      <StaticDatatable
        :columns="orderColumns"
        :data="filteredOrders"
        :searchable="true"
        :exportable="true"
        :printable="true"
        :perPage="10"
      >
        <template #column="{ props: { row, column } }">
          <div v-if="column.field === 'orderNo'" class="font-medium">
            <div>{{ row.orderNo }}</div>
            <div class="text-xs text-gray-500">{{ row.orderNoSuffix }}</div>
          </div>
          <div v-else-if="column.field === 'tags'" class="flex flex-wrap gap-1">
            <span 
              v-for="tag in row.tags" 
              :key="tag.name"
              :class="['px-2 py-1 text-xs rounded-full font-medium', getTagClass(tag.type)]"
            >
              {{ tag.name }}
            </span>
          </div>
          <div v-else-if="column.field === 'assignedTo'">
            <div v-if="row.assignedTo" class="flex items-center space-x-2">
              <Avatar :src="row.assignedTo.avatar" size="sm" />
              <span class="text-sm font-medium text-gray-800">{{ row.assignedTo.name }}</span>
            </div>
            <span v-else class="text-sm text-red-600 font-medium">Unassigned</span>
          </div>
          <div v-else-if="column.field === 'actions'" class="flex items-center justify-center">
            <button v-if="row.status === 'new'" @click.stop="handleOrderAction(row)" class="text-gray-400 hover:text-gray-600">
              <img src="/src/assets/icons/eye.svg" alt="View Order" class="w-6 h-6">
            </button>
            <ActionDropdown v-else :order="row" @action="handleOrderMenuAction" />
          </div>
          <span v-else>{{ row[column.field] }}</span>
        </template>
      </StaticDatatable>
    </main>

    <!-- Toast Messages -->
    <Toast v-if="showToast" :message="toastMessage" :type="toastType" @close="showToast = false" />

    <!-- Order Details Modal -->
    <OrderDetailsModal v-if="selectedOrder" :show="showOrderDetails" :order="selectedOrder" @close="showOrderDetails = false" />

    <!-- Status Change Modal -->
    <StatusChangeModal :show="showStatusChangeModal" :order="selectedOrder" @close="showStatusChangeModal = false" @update="handleStatusUpdate" />

    <!-- Time Tracker Sheet -->
    <TimeTrackerSheet :show="showTimeTrackerSheet" :order="selectedOrder" @close="showTimeTrackerSheet = false" />

    <!-- Activity Log Sheet -->
    <ActivityLogSheet :show="showActivityLogSheet" :order="selectedOrder" @close="showActivityLogSheet = false" />

    <!-- Edit Confirmation Modal -->
    <ConfirmationModal 
      :show="showEditConfirmation" 
      title="Edit Order?" 
      :message="`You are about to edit the order &quot;#REF: ${selectedOrder?.id}&quot;. This update will permanently modify the customer's order and the inventory levels will be adjusted accordingly.`"
      confirm-text="Update"
      cancel-text="Cancel"
      variant="warning"
      @confirm="handleEditConfirm"
      @cancel="showEditConfirmation = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import Avatar from '@/components/ui/Avatar.vue';
import UiButton from '@/components/ui/Button.vue';
import Dropdown from '@/components/ui/Dropdown.vue';
import DropdownItem from '@/components/ui/DropdownItem.vue';
import Toast from '@/components/ui/Toast.vue';
import FilterDropdown from '@/components/ui/FilterDropdown.vue';
import SortDropdown from '@/components/ui/SortDropdown.vue';
import DownloadDropdown from '@/components/ui/DownloadDropdown.vue';
import OrderDetailsModal from '@/components/outbound/OrderDetailsModal.vue'
import ActionDropdown from '@/components/ui/ActionDropdown.vue'
import StatusChangeModal from '@/components/ui/StatusChangeModal.vue'
import TimeTrackerSheet from '@/components/ui/TimeTrackerSheet.vue'
import ActivityLogSheet from '@/components/ui/ActivityLogSheet.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import Tabs from '@/components/ui/Tabs.vue';
import StaticDatatable from '@/components/ui/StaticDatatable.vue';
import type { TabItem } from '@/types/datatable';

const route = useRoute();
const router = useRouter();

// Check if route is active
const isActiveRoute = computed(() => (routePath: string) => {
  return route.path === routePath;
});

// Mobile menu state
const showMobileMenu = ref(false);

// Search and filter state
const searchQuery = ref('');
const selectedStatus = ref('new');
const sortBy = ref('');
const sortOrder = ref<'asc' | 'desc'>('asc');

// Modal states
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref<'success' | 'error'>('success');
const showOrderDetails = ref(false);
const selectedOrder = ref<any | null>(null);
const showStatusChangeModal = ref(false);
const showTimeTrackerSheet = ref(false);
const showActivityLogSheet = ref(false);
const showEditConfirmation = ref(false);

// Order data structure
interface OrderTag {
  name: string;
  type: 'status' | 'payment' | 'category' | 'priority';
}

interface AssignedAgent {
  id: string;
  name: string;
  avatar: string;
}

interface OrderSummaryItem {
  name: string;
  tag: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

interface OrderSummary {
  items: OrderSummaryItem[];
  subTotal: string;
  deliveryFee: string;
  total: string;
}

interface Order {
  id: string;
  orderNo: string;
  orderNoSuffix: string;
  customerName: string;
  storeName: string;
  state: string;
  payment: string;
  orderDate: string;
  deliveryDate: string;
  totalAmount: string;
  tags: OrderTag[];
  assignedTo?: AssignedAgent | null;
  status: 'new' | 'confirmed' | 'processing' | 'picked';
  summary: OrderSummary;
}

// Order statuses for tabs
const orderStatuses = computed(() => [
  { key: 'new', label: 'New', count: ordersData.value.filter(o => o.status === 'new').length },
  { key: 'confirmed', label: 'Confirmed Orders', count: ordersData.value.filter(o => o.status === 'confirmed').length },
  { key: 'processing', label: 'Being Processed', count: ordersData.value.filter(o => o.status === 'processing').length },
  { key: 'picked', label: 'Picked & Packed', count: ordersData.value.filter(o => o.status === 'picked').length },
]);

// Transform order statuses to tabs format
const tabsWithCounts = computed(() => {
  return orderStatuses.value.map(status => ({
    name: status.label,
    count: status.count
  }));
});

// Table columns
const orderColumns = ref([
  { field: 'orderNo', label: 'Order No.', sortable: true },
  { field: 'customerName', label: 'Customer Name', sortable: true },
  { field: 'storeName', label: 'Store Name', sortable: true },
  { field: 'state', label: 'State', sortable: false },
  { field: 'payment', label: 'Payment', sortable: false },
  { field: 'orderDate', label: 'Order Date', sortable: true },
  { field: 'deliveryDate', label: 'Delivery Date', sortable: true },
  { field: 'totalAmount', label: 'Total Amount', sortable: true },
  { field: 'tags', label: 'Tags', sortable: false },
  { field: 'assignedTo', label: 'Assigned', sortable: false },
  { field: 'actions', label: 'Actions', sortable: false },
]);

// Mock orders data (replace with API call)
const ordersData = ref<Order[]>([
  // New Orders
  {
    id: '1',
    orderNo: 'RHPO-1651244',
    orderNoSuffix: '214',
    customerName: 'Fidson Healthcare',
    storeName: 'Emeka Pharmacy',
    state: 'Lagos',
    payment: 'Pending',
    orderDate: '5/21/2024',
    deliveryDate: '5/23/2024',
    totalAmount: '₦2,055,043.00',
    status: 'new',
    tags: [
      { name: 'Express', type: 'priority' },
      { name: 'Controlled', type: 'status' }
    ],
    assignedTo: null,
    summary: {
      items: [
        { name: 'STREPSILS INTENSIVE HONEY & LEMON LOZENGES X 16', tag: 'Controlled', quantity: 20, unitPrice: '₦47,400.00', totalPrice: '₦948,000.00' },
        { name: 'PANADOL EXTRA TABLETS', tag: 'Hospital', quantity: 10, unitPrice: '₦47,400.00', totalPrice: '₦474,000.00' }
      ],
      subTotal: '₦1,422,000.00',
      deliveryFee: '₦633,043.00',
      total: '₦2,055,043.00'
    }
  },
  {
    id: '2',
    orderNo: 'RHPO-1651245',
    orderNoSuffix: '215',
    customerName: 'May & Baker Nigeria',
    storeName: 'Healthplus Pharmacy',
    state: 'Abuja',
    payment: 'Pending',
    orderDate: '5/20/2024',
    deliveryDate: '5/22/2024',
    totalAmount: '₦1,890,250.00',
    status: 'new',
    tags: [
      { name: 'Standard', type: 'priority' },
      { name: 'Hospital', type: 'category' }
    ],
    assignedTo: null,
    summary: {
      items: [
        { name: 'VITAMIN C TABLETS', tag: 'Hospital', quantity: 15, unitPrice: '₦65,000.00', totalPrice: '₦975,000.00' },
        { name: 'ANTIBIOTICS CAPSULES', tag: 'Controlled', quantity: 10, unitPrice: '₦91,525.00', totalPrice: '₦915,250.00' }
      ],
      subTotal: '₦1,890,250.00',
      deliveryFee: '₦0.00',
      total: '₦1,890,250.00'
    }
  },
  // Confirmed Orders
  {
    id: '3',
    orderNo: 'RHPO-1651246',
    orderNoSuffix: '216',
    customerName: 'GSK Nigeria',
    storeName: 'Medplus Pharmacy',
    state: 'Lagos',
    payment: 'Paid',
    orderDate: '5/19/2024',
    deliveryDate: '5/21/2024',
    totalAmount: '₦3,124,780.00',
    status: 'confirmed',
    tags: [
      { name: 'Express', type: 'priority' },
      { name: 'Controlled', type: 'status' }
    ],
    assignedTo: {
      id: 'agent_1',
      name: 'Esther Joel',
      avatar: 'https://i.pravatar.cc/40?img=1'
    },
    summary: {
      items: [
        { name: 'PAIN RELIEF TABLETS', tag: 'Controlled', quantity: 30, unitPrice: '₦82,201.00', totalPrice: '₦2,466,030.00' },
        { name: 'COUGH SYRUP', tag: 'Hospital', quantity: 20, unitPrice: '₦32,937.50', totalPrice: '₦658,750.00' }
      ],
      subTotal: '₦3,124,780.00',
      deliveryFee: '₦0.00',
      total: '₦3,124,780.00'
    }
  },
  {
    id: '4',
    orderNo: 'RHPO-1651247',
    orderNoSuffix: '217',
    customerName: 'Pfizer Nigeria',
    storeName: 'Alpha Pharmacy',
    state: 'Kano',
    payment: 'Paid',
    orderDate: '5/18/2024',
    deliveryDate: '5/20/2024',
    totalAmount: '₦2,789,156.00',
    status: 'confirmed',
    tags: [
      { name: 'Standard', type: 'priority' },
      { name: 'Hospital', type: 'category' }
    ],
    assignedTo: {
      id: 'agent_2',
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/40?img=2'
    },
    summary: {
      items: [
        { name: 'BLOOD PRESSURE TABLETS', tag: 'Hospital', quantity: 25, unitPrice: '₦111,566.24', totalPrice: '₦2,789,156.00' }
      ],
      subTotal: '₦2,789,156.00',
      deliveryFee: '₦0.00',
      total: '₦2,789,156.00'
    }
  },
  // Processing Orders
  {
    id: '5',
    orderNo: 'RHPO-1651248',
    orderNoSuffix: '218',
    customerName: 'Dangote Pharma',
    storeName: 'City Pharmacy',
    state: 'Rivers',
    payment: 'Paid',
    orderDate: '5/17/2024',
    deliveryDate: '5/19/2024',
    totalAmount: '₦1,456,890.00',
    status: 'processing',
    tags: [
      { name: 'Express', type: 'priority' },
      { name: 'Controlled', type: 'status' }
    ],
    assignedTo: {
      id: 'agent_3',
      name: 'Sarah Williams',
      avatar: 'https://i.pravatar.cc/40?img=3'
    },
    summary: {
      items: [
        { name: 'INSULIN PENS', tag: 'Controlled', quantity: 18, unitPrice: '₦80,938.33', totalPrice: '₦1,456,890.00' }
      ],
      subTotal: '₦1,456,890.00',
      deliveryFee: '₦0.00',
      total: '₦1,456,890.00'
    }
  },
  {
    id: '6',
    orderNo: 'RHPO-1651249',
    orderNoSuffix: '219',
    customerName: 'Emzor Pharmaceutical',
    storeName: 'Wellness Pharmacy',
    state: 'Ogun',
    payment: 'Paid',
    orderDate: '5/16/2024',
    deliveryDate: '5/18/2024',
    totalAmount: '₦987,432.00',
    status: 'processing',
    tags: [
      { name: 'Standard', type: 'priority' },
      { name: 'Hospital', type: 'category' }
    ],
    assignedTo: {
      id: 'agent_4',
      name: 'James Rodriguez',
      avatar: 'https://i.pravatar.cc/40?img=4'
    },
    summary: {
      items: [
        { name: 'MULTIVITAMINS', tag: 'Hospital', quantity: 40, unitPrice: '₦24,685.80', totalPrice: '₦987,432.00' }
      ],
      subTotal: '₦987,432.00',
      deliveryFee: '₦0.00',
      total: '₦987,432.00'
    }
  },
  // Picked Orders
  {
    id: '7',
    orderNo: 'RHPO-1651250',
    orderNoSuffix: '220',
    customerName: 'Chi Pharmaceuticals',
    storeName: 'Prime Pharmacy',
    state: 'Enugu',
    payment: 'Paid',
    orderDate: '5/15/2024',
    deliveryDate: '5/17/2024',
    totalAmount: '₦745,623.00',
    status: 'picked',
    tags: [
      { name: 'Express', type: 'priority' },
      { name: 'Controlled', type: 'status' }
    ],
    assignedTo: {
      id: 'agent_5',
      name: 'Lisa Thompson',
      avatar: 'https://i.pravatar.cc/40?img=5'
    },
    summary: {
      items: [
        { name: 'EYE DROPS', tag: 'Controlled', quantity: 25, unitPrice: '₦29,824.92', totalPrice: '₦745,623.00' }
      ],
      subTotal: '₦745,623.00',
      deliveryFee: '₦0.00',
      total: '₦745,623.00'
    }
  },
  {
    id: '8',
    orderNo: 'RHPO-1651251',
    orderNoSuffix: '221',
    customerName: 'Swipha Pharmaceuticals',
    storeName: 'Care Pharmacy',
    state: 'Kaduna',
    payment: 'Paid',
    orderDate: '5/14/2024',
    deliveryDate: '5/16/2024',
    totalAmount: '₦1,234,567.00',
    status: 'picked',
    tags: [
      { name: 'Standard', type: 'priority' },
      { name: 'Hospital', type: 'category' }
    ],
    assignedTo: {
      id: 'agent_6',
      name: 'Robert Kim',
      avatar: 'https://i.pravatar.cc/40?img=6'
    },
    summary: {
      items: [
        { name: 'SURGICAL MASKS', tag: 'Hospital', quantity: 100, unitPrice: '₦12,345.67', totalPrice: '₦1,234,567.00' }
      ],
      subTotal: '₦1,234,567.00',
      deliveryFee: '₦0.00',
      total: '₦1,234,567.00'
    }
  }
]);

// Computed properties
const filteredOrders = computed(() => {
  let filtered = ordersData.value.filter(order => order.status === selectedStatus.value);
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(order => 
      order.orderNo.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.storeName.toLowerCase().includes(query)
    );
  }
  
  if (sortBy.value) {
    filtered.sort((a, b) => {
      const aValue = a[sortBy.value as keyof Order];
      const bValue = b[sortBy.value as keyof Order];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder.value === 'asc' ? comparison : -comparison;
      }
      
      return 0;
    });
  }
  
  return filtered;
});

// Methods
const handleSort = (columnKey: string) => {
  const column = orderColumns.value.find(c => c.field === columnKey);
  if (!column?.sortable) return;
  
  if (sortBy.value === columnKey) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = columnKey;
    sortOrder.value = 'asc';
  }
};

const getSortIconClass = (columnKey: string, direction: 'asc' | 'desc') => {
  if (sortBy.value === columnKey && sortOrder.value === direction) {
    return 'text-primary-600';
  }
  return 'text-gray-400';
};

const getTagClass = (type: string) => {
  switch (type) {
    case 'payment':
      return 'bg-green-100 text-green-800';
    case 'status':
      return 'bg-blue-100 text-blue-800';
    case 'category':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const handleOrderClick = (order: Order) => {
  console.log('Order clicked:', order);
  // TODO: Navigate to order details or open modal
};

const handleOrderAction = (order: any) => {
  selectedOrder.value = order;
  showOrderDetails.value = true;
};

const handleOrderMenuAction = (payload: { action: string; order: any }) => {
  console.log('Order menu action:', payload.action, payload.order);
  selectedOrder.value = payload.order;
  
  switch (payload.action) {
    case 'view':
      showOrderDetails.value = true;
      break;
    case 'edit':
      handleEditOrder(payload.order);
      break;
    case 'assignToMe':
      handleAssignToMe(payload.order);
      break;
    case 'unassign':
      handleUnassign(payload.order);
      break;
    case 'changeStatus':
      showStatusChangeModal.value = true;
      break;
    case 'timeTracker':
      showTimeTrackerSheet.value = true;
      break;
    case 'activityLog':
      showActivityLogSheet.value = true;
      break;
    case 'downloadPickingList':
      handlePickingListDownload();
      break;
    case 'downloadInvoice':
      handleDownloadInvoice();
      break;
    case 'downloadWaybill':
      handleDownloadWaybill();
      break;
    case 'pickOrder':
      // TODO: Handle pick order - we'll come back to this
      console.log('Pick order:', payload.order.id);
      break;
  }
};

// Dropdown handlers
const handleStockCountTeams = () => console.log('Navigate to Stock Count Teams');
const handleProductStockCount = () => console.log('Navigate to Product Stock Count');
const handleAllHMOProducts = () => console.log('Navigate to All HMO Products');
const handleDamagedHMOProducts = () => console.log('Navigate to Damaged HMO Products');
const handleHMOProductReturns = () => console.log('Navigate to HMO Product Returns');
const handleRHOrders = () => console.log('Navigate to RH Orders');

// Filter functionality
const handleFilterApply = (filters: any) => {
  console.log('Filters applied:', filters);
  showToast.value = true;
  toastMessage.value = 'Filters applied successfully';
  toastType.value = 'success';
};

// Download functionality
const handleDownload = (payload: any, reportType: string) => {
  console.log(`Downloading ${reportType} with payload:`, payload);
  showToast.value = true;
  toastMessage.value = `${reportType} Download Successful`;
  toastType.value = 'success';
};

// Additional action handlers
const handleStatusUpdate = (payload: { order: any; status: string }) => {
  console.log('Status update:', payload);
  // TODO: Update order status via API
  toastMessage.value = 'Order status updated successfully!';
  toastType.value = 'success';
  showToast.value = true;
  showStatusChangeModal.value = false;
};

const handlePickingListDownload = () => {
  toastMessage.value = 'Picking list downloaded successfully!';
  toastType.value = 'success';
  showToast.value = true;
};

const handleDownloadInvoice = () => {
  toastMessage.value = 'Invoice downloaded successfully!';
  toastType.value = 'success';
  showToast.value = true;
};

const handleDownloadWaybill = () => {
  toastMessage.value = 'Waybill downloaded successfully!';
  toastType.value = 'success';
  showToast.value = true;
};

const handleEditOrder = (order: any) => {
  router.push(`/outbound/edit-order/${order.id}`);
};

const handleEditConfirm = () => {
  // TODO: Navigate to edit page
  console.log('Navigating to edit page for order:', selectedOrder.value?.id);
  toastMessage.value = 'Order updated successfully!';
  toastType.value = 'success';
  showToast.value = true;
  showEditConfirmation.value = false;
};

const handleTabChange = (tab: TabItem, index: number) => {
  const tabName = typeof tab === 'string' ? tab : tab.name;
  const statusKey = orderStatuses.value.find(status => status.label === tabName)?.key || 'new';
  selectedStatus.value = statusKey;
};

const handleAssignToMe = (order: any) => {
  // TODO: Call API to assign order to current user
  console.log('Assigning order to me:', order.id);
  
  // Update the order in the local data (simulate API response)
  const orderIndex = ordersData.value.findIndex(o => o.id === order.id);
  if (orderIndex !== -1) {
    ordersData.value[orderIndex].assignedTo = {
      id: 'current_user',
      name: 'Current User',
      avatar: 'https://i.pravatar.cc/40?img=1'
    };
  }
  
  toastMessage.value = 'Order successfully assigned to you!';
  toastType.value = 'success';
  showToast.value = true;
};

const handleUnassign = (order: any) => {
  // TODO: Call API to unassign order
  console.log('Unassigning order:', order.id);
  
  // Update the order in the local data (simulate API response)
  const orderIndex = ordersData.value.findIndex(o => o.id === order.id);
  if (orderIndex !== -1) {
    ordersData.value[orderIndex].assignedTo = null;
  }
  
  toastMessage.value = 'Order successfully unassigned!';
  toastType.value = 'success';
  showToast.value = true;
};
</script> 