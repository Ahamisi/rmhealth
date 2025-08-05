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

            <!-- Single Tab - Activities -->
            <div class="border-b border-gray-200">
              <nav class="flex px-6">
                <div class="py-4 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
                  Activities
                </div>
              </nav>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Recent</h3>
              
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
                            <p class="text-sm text-gray-500 mt-1">
                              REF: {{ order?.id }} has been {{ activity.action }} 
                              <span v-if="activity.assignee" class="text-blue-600 font-medium">{{ activity.assignee }}</span>
                              <span v-if="activity.newStatus" class="font-medium">"{{ activity.newStatus }}"</span>
                              <span v-if="activity.user" class="text-blue-600">{{ activity.user }}</span>
                            </p>
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

            <!-- Footer -->
            <div class="p-6 border-t border-gray-200">
              <button
                @click="$emit('close')"
                class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  order?: any
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const mockActivities = [
  {
    content: 'New order assigned',
    action: 'assigned to',
    assignee: '@Oreva Emamoro',
    time: 'Yesterday 10:45pm',
    type: 'assign',
    iconBg: 'bg-orange-500',
  },
  {
    content: 'New order status changed',
    action: 'updated to',
    newStatus: 'Order Confirmed',
    user: '@Oreva Emamoro',
    time: 'Today 10:45pm',
    type: 'status',
    iconBg: 'bg-orange-500',
  },
  {
    content: 'Confirmed order assigned',
    action: 'assigned to',
    assignee: '@Oreva Emamoro',
    time: 'Today 12:45pm',
    type: 'assign',
    iconBg: 'bg-blue-500',
  },
  {
    content: 'Confirmed order status changed',
    action: 'updated to',
    newStatus: 'Being Processed',
    user: '@Oreva Emamoro',
    time: 'Today 12:45pm',
    type: 'status',
    iconBg: 'bg-blue-500',
  },
  {
    content: 'Order being processed assigned',
    action: 'assigned to',
    assignee: '@Oreva Emamoro',
    time: 'Today 10:45pm',
    type: 'assign',
    iconBg: 'bg-blue-500',
  },
  {
    content: 'Order being processed status changed',
    action: 'updated to',
    newStatus: 'Picked and Packed',
    user: '@Oreva Emamoro',
    time: 'Today 12:45pm',
    type: 'status',
    iconBg: 'bg-blue-500',
  },
  {
    content: 'Order has been picked and packed assigned',
    action: 'assigned to',
    assignee: '@Oreva Emamoro',
    time: 'Today 10:45pm',
    type: 'assign',
    iconBg: 'bg-blue-500',
  },
  {
    content: 'Order has been picked and packed status changed',
    action: 'updated to',
    newStatus: 'Awaiting Shipment',
    user: '@Oreva Emamoro',
    time: 'Today 12:45pm',
    type: 'status',
    iconBg: 'bg-blue-500',
  },
]
</script> 