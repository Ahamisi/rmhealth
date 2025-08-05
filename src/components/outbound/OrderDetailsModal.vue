<template>
  <teleport to="body">
    <transition
      enter-active-class="transition-opacity ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 bg-black bg-opacity-50 z-50"
        @click="$emit('close')"
      >
        <transition
          enter-active-class="transition-transform ease-out duration-300"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition-transform ease-in duration-200"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div
            v-if="show"
            class="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl flex flex-col"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <div class="flex items-center space-x-3">
                <h2 class="text-lg font-semibold text-gray-900">Order Details</h2>
                <span class="text-sm text-gray-500"># REF: {{ order?.id }}</span>
              </div>
              <button
                @click="$emit('close')"
                class="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 5L5 15M5 5L15 15" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <!-- Tabs -->
            <div class="border-b border-gray-200">
              <nav class="flex space-x-8 px-6">
                <button
                  @click="activeTab = 'details'"
                  :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'details'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  Details
                </button>
                <button
                  @click="activeTab = 'activities'"
                  :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'activities'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  Activities
                </button>
              </nav>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto">
              <!-- Details Tab -->
              <div v-if="activeTab === 'details'" class="p-6 space-y-6">
                <!-- Customer Information -->
                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Customer's Name</label>
                    <p class="text-sm text-gray-900">{{ mockCustomerData.name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Customer Type</label>
                    <p class="text-sm text-gray-900">{{ mockCustomerData.type }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Order By</label>
                    <p class="text-sm text-gray-900">{{ mockCustomerData.orderBy }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                    <p class="text-sm text-gray-900">{{ mockCustomerData.agentName }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div class="flex items-center space-x-2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.6667 11.22V13.22C14.6667 13.58 14.5267 13.92 14.2801 14.1667C14.0334 14.4133 13.6934 14.5533 13.3334 14.5533H12.6667C5.4 14.5533 0.666672 9.82 0.666672 2.55333V1.88666C0.666672 1.52666 0.806672 1.18666 1.05334 0.939996C1.3 0.693329 1.64 0.553329 2 0.553329H4C4.18 0.553329 4.35334 0.626663 4.48 0.753329C4.60667 0.879996 4.68 1.05333 4.68 1.23333L5.1 3.62C5.13334 3.78 5.11334 3.94666 5.04 4.09333C4.96667 4.24 4.84667 4.36 4.69334 4.43333L3.33334 5.11333C4.22667 7.29333 6.37334 9.44 8.55334 10.3333L9.23334 8.97333C9.30667 8.82 9.42667 8.7 9.57334 8.62666C9.72 8.55333 9.88667 8.53333 10.0467 8.56666L12.4333 8.98666C12.6133 9.00666 12.7867 9.08 12.9133 9.20666C13.04 9.33333 13.1133 9.50666 13.1133 9.68666L14.6667 11.22Z" fill="#97A0AF"/>
                      </svg>
                      <span class="text-sm text-gray-900">{{ mockCustomerData.phone }}</span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Store</label>
                    <div class="flex items-center space-x-2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3333 6.66667V12.6667C13.3333 13.0203 13.1928 13.3594 12.9428 13.6095C12.6927 13.8595 12.3536 14 12 14H4C3.64638 14 3.30724 13.8595 3.05719 13.6095C2.80714 13.3594 2.66667 13.0203 2.66667 12.6667V6.66667M14.6667 4.66667L12 1.33333H4L1.33333 4.66667V6C1.33333 6.70724 1.61429 7.38552 2.11438 7.88562C2.61448 8.38571 3.29276 8.66667 4 8.66667C4.70724 8.66667 5.38552 8.38571 5.88562 7.88562C6.38571 7.38552 6.66667 6.70724 6.66667 6V5.33333H9.33333V6C9.33333 6.70724 9.61429 7.38552 10.1144 7.88562C10.6145 8.38571 11.2928 8.66667 12 8.66667C12.7072 8.66667 13.3855 8.38571 13.8856 7.88562C14.3857 7.38552 14.6667 6.70724 14.6667 6V4.66667Z" stroke="#97A0AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span class="text-sm text-gray-900">{{ mockCustomerData.store }}</span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Loan Limit</label>
                    <p class="text-sm text-gray-900">{{ mockCustomerData.loanLimit }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Amount to Reach Loan Limit</label>
                    <p class="text-sm text-gray-900">{{ mockCustomerData.amountToReachLimit }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Outstanding Loan</label>
                    <p class="text-sm text-gray-900">{{ mockCustomerData.outstandingLoan }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div class="flex items-center space-x-2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2.66669H3C2.26667 2.66669 1.66667 3.26669 1.66667 4.00002V14C1.66667 14.7334 2.26667 15.3334 3 15.3334H13C13.7333 15.3334 14.3333 14.7334 14.3333 14V4.00002C14.3333 3.26669 13.7333 2.66669 13 2.66669Z" stroke="#97A0AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.6667 1.33331V3.99998" stroke="#97A0AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5.33333 1.33331V3.99998" stroke="#97A0AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M1.66667 6.66669H14.3333" stroke="#97A0AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span class="text-sm text-gray-900">{{ mockCustomerData.date }}</span>
                    </div>
                  </div>
                </div>

                <!-- Order Summary -->
                <div class="border-t pt-6">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                  
                  <!-- Products Table -->
                  <div class="overflow-x-auto">
                    <table class="min-w-full">
                      <thead>
                        <tr class="border-b border-gray-200">
                          <th class="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                          <th class="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                          <th class="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th class="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                          <th class="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-for="item in order?.summary?.items" :key="item.name">
                          <td class="py-3 text-sm text-gray-900">{{ item.name }}</td>
                          <td class="py-3">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {{ item.tag }}
                            </span>
                          </td>
                          <td class="py-3 text-sm text-gray-900">{{ item.quantity }}</td>
                          <td class="py-3 text-sm text-gray-900">{{ item.unitPrice }}</td>
                          <td class="py-3 text-sm text-gray-900">{{ item.totalPrice }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Summary Totals -->
                  <div class="mt-6 space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Sub Total</span>
                      <span class="text-gray-900">{{ order?.summary?.subTotal }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Delivery Fee</span>
                      <span class="text-gray-900">{{ order?.summary?.deliveryFee }}</span>
                    </div>
                    <div class="flex justify-between text-lg font-semibold pt-2 border-t">
                      <span class="text-gray-900">Total</span>
                      <span class="text-gray-900">{{ order?.summary?.total }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Activities Tab -->
              <div v-else-if="activeTab === 'activities'" class="p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Order Activities</h3>
                
                <div class="flow-root">
                  <ul class="-mb-8">
                    <li v-for="(activity, index) in mockActivities" :key="index">
                      <div class="relative pb-8">
                        <span v-if="index !== mockActivities.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                                                 <div class="relative flex space-x-3">
                           <div>
                             <span :class="[activity.iconBg, 'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white']">
                               <!-- Assign Icon -->
                               <svg v-if="activity.type === 'assign'" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-white">
                                 <path d="M8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8ZM8 10C5.79086 10 4 11.7909 4 14H12C12 11.7909 10.2091 10 8 10Z" fill="currentColor"/>
                               </svg>
                               <!-- Status Change Icon -->
                               <svg v-else-if="activity.type === 'status'" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-white">
                                 <path d="M8 1C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8C1 4.134 4.134 1 8 1ZM8 2.5C4.96244 2.5 2.5 4.96244 2.5 8C2.5 11.0376 4.96244 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.96244 11.0376 2.5 8 2.5ZM8 4C8.41421 4 8.75 4.33579 8.75 4.75V7.25H11.25C11.6642 7.25 12 7.58579 12 8C12 8.41421 11.6642 8.75 11.25 8.75H8.75V11.25C8.75 11.6642 8.41421 12 8 12C7.58579 12 7.25 11.6642 7.25 11.25V8.75H4.75C4.33579 8.75 4 8.41421 4 8C4 7.58579 4.33579 7.25 4.75 7.25H7.25V4.75C7.25 4.33579 7.58579 4 8 4Z" fill="currentColor"/>
                               </svg>
                             </span>
                           </div>
                          <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p class="text-sm text-gray-900">{{ activity.content }}</p>
                              <p class="text-xs text-gray-500">{{ activity.user }}</p>
                            </div>
                            <div class="text-right text-xs text-gray-500 whitespace-nowrap">
                              {{ activity.time }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  show: boolean;
  order: any;
}>();

const emit = defineEmits(['close']);

const activeTab = ref('details');

const close = () => {
  emit('close');
};

// Mock data
const mockCustomerData = {
  name: 'Janet Adeajayi',
  type: 'Pharmacy',
  orderBy: 'Janet Adeajayi',
  agentName: 'Agent Oreva',
  phone: '+234 809 123 4567',
  store: 'Emeka Pharmacy',
  loanLimit: '₦2,000,000.00',
  amountToReachLimit: '₦0.00',
  outstandingLoan: '₦0.00',
  date: '5/21/2024 - 11:13 AM',
};

const mockActivities = [
  {
    content: 'New order assigned',
    user: '@Oreva Emamoro',
    time: 'Yesterday 10:45pm',
    type: 'assign',
    iconBg: 'bg-orange-500',
  },
  {
    content: 'New order status changed',
    user: '@Oreva Emamoro',
    time: 'Today 10:45pm',
    type: 'status',
    iconBg: 'bg-orange-500',
  },
  {
    content: 'Confirmed order assigned',
    user: '@Oreva Emamoro',
    time: 'Today 12:45pm',
    type: 'assign',
    iconBg: 'bg-blue-500',
  },
  {
    content: 'Confirmed order status changed',
    user: '@Oreva Emamoro',
    time: 'Today 12:45pm',
    type: 'status',
    iconBg: 'bg-blue-500',
  },
  {
    content: 'Order being processed assigned',
    user: '@Oreva Emamoro',
    time: 'Today 10:45pm',
    type: 'assign',
    iconBg: 'bg-blue-500',
  },
  {
    content: 'Order being processed status changed',
    user: '@Oreva Emamoro',
    time: 'Today 12:45pm',
    type: 'status',
    iconBg: 'bg-blue-500',
  },
  {
    content: 'Order has been picked and packed assigned',
    user: '@Oreva Emamoro',
    time: 'Today 10:45pm',
    type: 'assign',
    iconBg: 'bg-blue-500',
  },
  {
    content: 'Order has been picked and packed status changed',
    user: '@Oreva Emamoro',
    time: 'Today 12:45pm',
    type: 'status',
    iconBg: 'bg-blue-500',
  },
];
</script> 