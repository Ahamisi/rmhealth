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
                <img src="/src/assets/icons/x-icon.svg" alt="Close" class="w-5 h-5">
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
                      <img src="/src/assets/icons/info.svg" alt="Phone" class="w-4 h-4">
                      <span class="text-sm text-gray-900">{{ mockCustomerData.phone }}</span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Store</label>
                    <div class="flex items-center space-x-2">
                      <img src="/src/assets/icons/info.svg" alt="Store" class="w-4 h-4">
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
                      <img src="/src/assets/icons/calendar.svg" alt="Date" class="w-4 h-4">
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
                               <img v-if="activity.type === 'assign'" src="/src/assets/icons/assign.svg" alt="Assign" class="w-4 h-4 icon-white">
                               <!-- Status Change Icon -->
                               <img v-else-if="activity.type === 'status'" src="/src/assets/icons/change.svg" alt="Status Change" class="w-4 h-4 icon-white">
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