<template>
  <div class="bg-gray-50 min-h-screen font-sans">
    <AppHeader />

    <!-- Main Content -->
    <main class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <h1 class="text-xl font-semibold text-gray-900">All Orders</h1>
          <span class="ml-2 text-sm text-gray-500">/</span>
          <span class="ml-2 text-sm font-medium text-gray-500">New</span>
        </div>
      </div>
      
      <!-- Status Tabs -->
      <div class="flex flex-wrap items-center gap-2 mb-6">
        <button 
          v-for="status in orderStatuses" 
          :key="status.key"
          @click="selectedStatus = status.key"
          :class="[
            'px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap',
            selectedStatus === status.key 
              ? 'bg-blue-100 text-blue-700 border border-blue-200' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          ]"
        >
          {{ status.label }} {{ status.count }}
        </button>
      </div>

      <!-- Actions Bar -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <!-- Search -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.6967 12.5708L16.98 15.9125C17.1271 16.0715 17.2065 16.2815 17.2015 16.498C17.1964 16.7145 17.1072 16.9206 16.9528 17.0725C16.7984 17.2244 16.5909 17.3102 16.3744 17.3117C16.1578 17.3133 15.9491 17.2305 15.7925 17.0808L12.5109 13.7425C11.2447 14.6964 9.66328 15.1334 8.08694 14.9652C6.51059 14.7969 5.05708 14.036 4.02072 12.8363C2.98436 11.6367 2.44259 10.0881 2.50511 8.50399C2.56763 6.91993 3.22978 5.41881 4.35747 4.3046C5.48516 3.19038 6.99412 2.54632 8.57883 2.50284C10.1635 2.45936 11.7055 3.0197 12.8926 4.07041C14.0797 5.12111 14.8232 6.58366 14.9725 8.16192C15.1218 9.74017 14.6657 11.3162 13.6967 12.5708ZM8.75004 13.3333C9.96562 13.3333 11.1314 12.8505 11.9909 11.9909C12.8505 11.1314 13.3334 9.96558 13.3334 8.75C13.3334 7.53443 12.8505 6.36864 11.9909 5.5091C11.1314 4.64956 9.96562 4.16667 8.75004 4.16667C7.53446 4.16667 6.36868 4.64956 5.50913 5.5091C4.64959 6.36864 4.16671 7.53443 4.16671 8.75C4.16671 9.96558 4.64959 11.1314 5.50913 11.9909C6.36868 12.8505 7.53446 13.3333 8.75004 13.3333Z" fill="#626F86"/>
              </svg>
            </div>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search" 
              class="w-full sm:w-64 bg-white border border-gray-200 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
                <path d="M10.687 17.292C10.5956 17.1997 10.4868 17.1264 10.3669 17.0764C10.247 17.0264 10.1184 17.0007 9.9885 17.0007C9.8586 17.0007 9.72998 17.0264 9.61009 17.0764C9.49019 17.1264 9.3814 17.1997 9.29 17.292C9.10466 17.4792 9.0007 17.732 9.0007 17.9955C9.0007 18.259 9.10466 18.5118 9.29 18.699L11.254 20.679C11.3546 20.7807 11.4744 20.8613 11.6064 20.9164C11.7384 20.9715 11.88 20.9998 12.023 20.9998C12.166 20.9998 12.3076 20.9715 12.4396 20.9164C12.5716 20.8613 12.6914 20.7807 12.792 20.679L14.711 18.746C14.8966 18.5587 15.0008 18.3057 15.0008 18.042C15.0008 17.7783 14.8966 17.5253 14.711 17.338C14.6196 17.2455 14.5107 17.1721 14.3907 17.122C14.2708 17.0719 14.142 17.0462 14.012 17.0462C13.882 17.0462 13.7532 17.0719 13.6333 17.122C13.5133 17.1721 13.4044 17.2455 13.313 17.338L12.023 18.638L10.687 17.292Z" fill="#44546F"/>
                <path d="M13.001 19.993L13 10.006C13 9.451 12.552 9 12 9C11.448 9 11 9.45 11 10.007L11.001 19.994C11.001 20.549 11.449 21 12.001 21C12.553 21 13.001 20.55 13.001 19.993Z" fill="#44546F"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.938 5.48C7.68111 5.4383 7.42125 5.41757 7.161 5.418C4.356 5.418 2 7.62 2 10.498C2 13.409 4.385 16 7.1 16H9.981V14.007H7.1C5.443 14.007 3.985 12.344 3.985 10.499C3.985 8.721 5.454 7.412 7.089 7.412H7.101C7.49 7.412 7.787 7.462 8.071 7.562L8.241 7.625C8.846 7.873 9.116 7.379 9.116 7.379L9.266 7.112C9.996 5.765 11.467 5.016 12.982 4.992C13.9871 5.00203 14.9543 5.37742 15.703 6.04812C16.4517 6.71882 16.9309 7.63901 17.051 8.637L17.097 8.977C17.097 8.977 17.168 9.502 17.762 9.502C17.775 9.502 17.774 9.507 17.785 9.507H18.039C19.175 9.507 20.015 10.466 20.015 11.665C20.015 12.872 19.028 14.007 17.945 14.007H13.981V16H17.945C20.105 16 22 13.955 22 11.665C22 9.665 20.688 8.002 18.862 7.591C18.155 4.884 15.809 3.039 12.976 3C11.001 3.02 9.075 3.9 7.938 5.48Z" fill="#44546F"/>
              </svg>
            </template>
          </DownloadDropdown>
          
          <DownloadDropdown
            title="Download Order Report"
            button-text="Download Report"
            @download="handleDownload($event, 'Order Report')"
          >
            <template #icon>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
                <path d="M10.687 17.292C10.5956 17.1997 10.4868 17.1264 10.3669 17.0764C10.247 17.0264 10.1184 17.0007 9.9885 17.0007C9.8586 17.0007 9.72998 17.0264 9.61009 17.0764C9.49019 17.1264 9.3814 17.1997 9.29 17.292C9.10466 17.4792 9.0007 17.732 9.0007 17.9955C9.0007 18.259 9.10466 18.5118 9.29 18.699L11.254 20.679C11.3546 20.7807 11.4744 20.8613 11.6064 20.9164C11.7384 20.9715 11.88 20.9998 12.023 20.9998C12.166 20.9998 12.3076 20.9715 12.4396 20.9164C12.5716 20.8613 12.6914 20.7807 12.792 20.679L14.711 18.746C14.8966 18.5587 15.0008 18.3057 15.0008 18.042C15.0008 17.7783 14.8966 17.5253 14.711 17.338C14.6196 17.2455 14.5107 17.1721 14.3907 17.122C14.2708 17.0719 14.142 17.0462 14.012 17.0462C13.882 17.0462 13.7532 17.0719 13.6333 17.122C13.5133 17.1721 13.4044 17.2455 13.313 17.338L12.023 18.638L10.687 17.292Z" fill="#44546F"/>
                <path d="M13.001 19.993L13 10.006C13 9.451 12.552 9 12 9C11.448 9 11 9.45 11 10.007L11.001 19.994C11.001 20.549 11.449 21 12.001 21C12.553 21 13.001 20.55 13.001 19.993Z" fill="#44546F"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.938 5.48C7.68111 5.4383 7.42125 5.41757 7.161 5.418C4.356 5.418 2 7.62 2 10.498C2 13.409 4.385 16 7.1 16H9.981V14.007H7.1C5.443 14.007 3.985 12.344 3.985 10.499C3.985 8.721 5.454 7.412 7.089 7.412H7.101C7.49 7.412 7.787 7.462 8.071 7.562L8.241 7.625C8.846 7.873 9.116 7.379 9.116 7.379L9.266 7.112C9.996 5.765 11.467 5.016 12.982 4.992C13.9871 5.00203 14.9543 5.37742 15.703 6.04812C16.4517 6.71882 16.9309 7.63901 17.051 8.637L17.097 8.977C17.097 8.977 17.168 9.502 17.762 9.502C17.775 9.502 17.774 9.507 17.785 9.507H18.039C19.175 9.507 20.015 10.466 20.015 11.665C20.015 12.872 19.028 14.007 17.945 14.007H13.981V16H17.945C20.105 16 22 13.955 22 11.665C22 9.665 20.688 8.002 18.862 7.591C18.155 4.884 15.809 3.039 12.976 3C11.001 3.02 9.075 3.9 7.938 5.48Z" fill="#44546F"/>
              </svg>
            </template>
          </DownloadDropdown>
        </div>
      </div>

      <!-- Orders Table -->
      <Card class="bg-white" :no-padding="true">
        <div class="overflow-x-auto">
          <table class="w-full text-left" style="font-size: 12px;">
            <thead class="text-gray-600" style="background-color: #F7F8F9;">
              <tr>
                <th 
                  v-for="column in orderColumns" 
                  :key="column.key"
                  class="px-4 py-3 font-medium border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  :class="{ 'bg-gray-100': sortBy === column.key }"
                  @click="handleSort(column.key)"
                >
                  <div class="flex items-center justify-between">
                    <span>{{ column.label }}</span>
                    <div v-if="column.sortable" class="ml-2 flex flex-col">
                      <!-- Sort Icons -->
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        xmlns="http://www.w3.org/2000/svg"
                        :class="getSortIconClass(column.key, 'asc')"
                      >
                        <path d="M7 14L12 9L17 14H7Z"/>
                      </svg>
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        xmlns="http://www.w3.org/2000/svg"
                        :class="getSortIconClass(column.key, 'desc')"
                        style="margin-top: -2px;"
                      >
                        <path d="M7 10L12 15L17 10H7Z"/>
                      </svg>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr 
                v-for="(order, index) in filteredOrders" 
                :key="order.id"
                :class="[
                  'transition-colors cursor-pointer',
                  order.assignedTo ? 'bg-blue-50' : 'hover:bg-gray-50'
                ]"
                :style="!order.assignedTo ? { backgroundColor: 'rgba(9, 30, 66, 0.02)' } : {}"
                @click="handleOrderClick(order)"
              >
                <td class="px-4 py-3 text-gray-700">
                  <div class="font-medium">{{ order.orderNo }}</div>
                  <div class="text-xs text-gray-500">{{ order.orderNoSuffix }}</div>
                </td>
                <td class="px-4 py-3 text-gray-700">{{ order.customerName }}</td>
                <td class="px-4 py-3 text-gray-700">{{ order.storeName }}</td>
                <td class="px-4 py-3 text-gray-700">{{ order.state }}</td>
                <td class="px-4 py-3 text-gray-700">{{ order.payment }}</td>
                <td class="px-4 py-3 text-gray-700">{{ order.orderDate }}</td>
                <td class="px-4 py-3 text-gray-700">{{ order.deliveryDate }}</td>
                <td class="px-4 py-3 text-gray-700">{{ order.totalAmount }}</td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="tag in order.tags" 
                      :key="tag.name"
                      :class="[
                        'px-2 py-1 text-xs rounded-full font-medium',
                        getTagClass(tag.type)
                      ]"
                    >
                      {{ tag.name }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div v-if="order.assignedTo" class="flex items-center space-x-2">
                    <Avatar :src="order.assignedTo.avatar" size="sm" />
                    <span class="text-sm font-medium text-gray-800">{{ order.assignedTo.name }}</span>
                  </div>
                  <span v-else class="text-sm text-red-600 font-medium">Unassigned</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
            <!-- Show eye icon only for New status -->
            <button v-if="order.status === 'new'" @click.stop="handleOrderAction(order)" class="text-gray-400 hover:text-gray-600">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 18C7.464 18 4.001 13.74 4.001 12C4.001 9.999 7.46 6 12.001 6C16.377 6 19.999 9.973 19.999 12C19.999 13.74 16.537 18 12.001 18H12ZM12.001 4C6.48 4 2 8.841 2 12C2 15.086 6.576 20 12 20C17.423 20 22 15.086 22 12C22 8.841 17.52 4 12 4" fill="#44546F"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.977 13.984C10.874 13.984 9.977 13.087 9.977 11.984C9.977 10.881 10.874 9.984 11.977 9.984C13.081 9.984 13.977 10.881 13.977 11.984C13.977 13.087 13.081 13.984 11.977 13.984ZM11.977 7.984C9.771 7.984 7.977 9.778 7.977 11.984C7.977 14.19 9.771 15.984 11.977 15.984C14.184 15.984 15.977 14.19 15.977 11.984C15.977 9.778 14.184 7.984 11.977 7.984Z" fill="#44546F"/>
              </svg>
            </button>
            <!-- Show action dropdown for all other statuses -->
            <ActionDropdown v-else :order="order" @action="handleOrderMenuAction" />
          </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
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

// Table columns
const orderColumns = ref([
  { key: 'orderNo', label: 'Order No.', sortable: true },
  { key: 'customerName', label: 'Customer Name', sortable: true },
  { key: 'storeName', label: 'Store Name', sortable: true },
  { key: 'state', label: 'State', sortable: false },
  { key: 'payment', label: 'Payment', sortable: false },
  { key: 'orderDate', label: 'Order Date', sortable: true },
  { key: 'deliveryDate', label: 'Delivery Date', sortable: true },
  { key: 'totalAmount', label: 'Total Amount', sortable: true },
  { key: 'tags', label: 'Tags', sortable: false },
  { key: 'assignedTo', label: 'Assigned', sortable: false },
  { key: 'action', label: 'Action', sortable: false },
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
  const column = orderColumns.value.find(c => c.key === columnKey);
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