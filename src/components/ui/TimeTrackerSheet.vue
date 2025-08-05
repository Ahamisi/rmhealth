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
            class="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl flex flex-col"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <div class="flex items-center space-x-3">
                <h2 class="text-lg font-semibold text-gray-900">Time Tracker</h2>
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

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6">
              <!-- Time Tracking Items -->
              <div v-for="(item, index) in timeTrackingData" :key="index" class="space-y-4">
                <div class="flex items-start space-x-4">
                  <!-- Department Icon -->
                  <div :class="[item.iconBg, 'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0']">
                    <!-- Accounting Icon -->
                    <svg v-if="item.department === 'Accounting'" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 3.5C2 2.67157 2.67157 2 3.5 2H16.5C17.3284 2 18 2.67157 18 3.5V16.5C18 17.3284 17.3284 18 16.5 18H3.5C2.67157 18 2 17.3284 2 16.5V3.5Z" stroke="white" stroke-width="1.5"/>
                      <path d="M6 7H14M6 10H14M6 13H10" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <!-- Inventory Icon -->
                    <svg v-else-if="item.department === 'Inventory'" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 4.5C3 3.67157 3.67157 3 4.5 3H15.5C16.3284 3 17 3.67157 17 4.5V15.5C17 16.3284 16.3284 17 15.5 17H4.5C3.67157 17 3 16.3284 3 15.5V4.5Z" stroke="white" stroke-width="1.5"/>
                      <path d="M7 7H13M7 10H13M7 13H10" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M3 7H17" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </div>

                  <!-- Content -->
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <h3 class="text-sm font-medium text-gray-900">{{ item.department }}</h3>
                      <span class="text-sm font-medium text-gray-900">Time Taken: {{ item.timeTaken }}</span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">{{ item.description }}</p>
                    
                    <!-- Progress Line -->
                    <div class="mt-4">
                      <div class="w-full bg-gray-200 rounded-full h-1">
                        <div class="bg-blue-600 h-1 rounded-full" :style="{ width: item.progress + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Connector Line (except for last item) -->
                <div v-if="index < timeTrackingData.length - 1" class="ml-5 w-0.5 h-8 bg-gray-200"></div>
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

const timeTrackingData = [
  {
    department: 'Accounting',
    description: 'New Order → Order Confirmed',
    timeTaken: '1-2 hours',
    iconBg: 'bg-orange-500',
    progress: 100
  },
  {
    department: 'Inventory', 
    description: 'Order Confirmed → Being Processed',
    timeTaken: '1 minute',
    iconBg: 'bg-blue-500',
    progress: 100
  }
]
</script> 