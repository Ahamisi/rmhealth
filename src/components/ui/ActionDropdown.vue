<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      class="p-1 hover:bg-gray-100 rounded transition-colors"
      :class="{ 'bg-gray-100': isOpen }"
    >
      <!-- Three dots menu icon -->
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" fill="#44546F"/>
        <path d="M8 4C8.55228 4 9 3.55228 9 3C9 2.44772 8.55228 2 8 2C7.44772 2 7 2.44772 7 3C7 3.55228 7.44772 4 8 4Z" fill="#44546F"/>
        <path d="M8 14C8.55228 14 9 13.5523 9 13C9 12.4477 8.55228 12 8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z" fill="#44546F"/>
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="fixed right-4 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-[9999]"
        :style="dropdownStyle"
      >
        <button
          @click="handleAction('view')"
          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
        >
          <!-- View Order Icon -->
          <img src="/src/assets/icons/eye.svg" alt="View" class="w-4 h-4">
          <span>View Order</span>
        </button>

        <!-- Edit Order - Only show for Confirmed Orders -->
        <button
          v-if="order?.status === 'confirmed'"
          @click="handleAction('edit')"
          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
        >
          <!-- Edit Order Icon -->
          <img src="/src/assets/icons/pen.svg" alt="Edit" class="w-4 h-4">
          <span>Edit Order</span>
        </button>

       

        <!-- Download Picking List & Pick Order - Only for Processing status -->
        <template v-if="order?.status === 'processing'">
          <button
            @click="handleAction('downloadPickingList')"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <!-- Download Icon -->
            <img src="/src/assets/icons/download.svg" alt="Download" class="w-4 h-4">
            <span>Download Picking List</span>
          </button>

          <button
            @click="handleAction('pickOrder')"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <!-- Pick Order Icon -->
            <img src="/src/assets/icons/pick-order.svg" alt="Pick Order" class="w-4 h-4">
            <span>Pick Order</span>
          </button>
        </template>

        <!-- Download Invoice & Download Waybill - Only for Picked status -->
        <template v-if="order?.status === 'picked'">
          <button
            @click="handleAction('downloadInvoice')"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <!-- Download Invoice Icon -->
            <img src="/src/assets/icons/download.svg" alt="Download" class="w-4 h-4">
            <span>Download Invoice</span>
          </button>

          <button
            @click="handleAction('downloadWaybill')"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <!-- Download Waybill Icon -->
            <img src="/src/assets/icons/download.svg" alt="Download" class="w-4 h-4">
            <span>Download Waybill</span>
          </button>
        </template>

        <!-- Actions for Delivered Orders -->
        <template v-if="order?.status === 'delivered'">
          <button
            @click="handleAction('downloadInvoice')"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <!-- Download Invoice Icon -->
            <img src="/src/assets/icons/download.svg" alt="Download" class="w-4 h-4">
            <span>Download Invoice</span>
          </button>

          <button
            @click="handleAction('fulfilmentDetails')"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <!-- Fulfilment Details Icon -->
            <img src="/src/assets/icons/fufillment-details.svg" alt="Fulfilment Details" class="w-4 h-4">
            <span>Fulfilment Details</span>
          </button>

          <button
            @click="handleAction('timeTracker')"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <!-- Time Tracker Icon -->
            <img src="/src/assets/icons/time.svg" alt="Time Tracker" class="w-4 h-4">
            <span>Time Tracker</span>
          </button>

          <button
            @click="handleAction('activityLog')"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <!-- Activity Log Icon -->
            <img src="/src/assets/icons/activity-log.svg" alt="Activity Log" class="w-4 h-4">
            <span>Activity Log</span>
          </button>
        </template>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { onClickOutside } from '@vueuse/core'

interface Props {
  order?: any
}

const props = defineProps<Props>()
const emit = defineEmits(['action'])

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

onClickOutside(dropdownRef, () => {
  isOpen.value = false
})

const dropdownStyle = computed(() => {
  if (!dropdownRef.value || !isOpen.value) return {}
  
  const rect = dropdownRef.value.getBoundingClientRect()
  return {
    top: `${rect.bottom + 4}px`,
    right: `${window.innerWidth - rect.right}px`
  }
})

const handleAction = (action: string) => {
  emit('action', { action, order: props.order })
  isOpen.value = false
}
</script> 