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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 3C5.239 3 2.792 4.877 1.732 7.694C1.671 7.889 1.671 8.111 1.732 8.306C2.792 11.123 5.239 13 8 13C10.761 13 13.208 11.123 14.268 8.306C14.329 8.111 14.329 7.889 14.268 7.694C13.208 4.877 10.761 3 8 3ZM8 11C6.343 11 5 9.657 5 8C5 6.343 6.343 5 8 5C9.657 5 11 6.343 11 8C11 9.657 9.657 11 8 11ZM8 7C7.448 7 7 7.448 7 8C7 8.552 7.448 9 8 9C8.552 9 9 8.552 9 8C9 7.448 8.552 7 8 7Z" fill="#626F86"/>
          </svg>
          <span>View Order</span>
        </button>

        <!-- Edit Order - Only show for Confirmed Orders -->
        <button
          v-if="order?.status === 'confirmed'"
          @click="handleAction('edit')"
          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
        >
          <!-- Edit Order Icon -->
          <svg width="16" height="16" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.02 19.73C3.98689 19.892 3.99446 20.0597 4.04204 20.218C4.08962 20.3764 4.17572 20.5205 4.29263 20.6374C4.40955 20.7543 4.55363 20.8404 4.71198 20.888C4.87033 20.9355 5.038 20.9431 5.2 20.91L9.01 20.13L4.8 15.92L4.02 19.73ZM9.941 17.11L7.821 14.99L16.306 6.5H16.308L18.429 8.621L9.94 17.111L9.941 17.11ZM19.844 7.207L17.724 5.085C17.5381 4.89908 17.3173 4.7517 17.0743 4.65131C16.8313 4.55092 16.5709 4.4995 16.308 4.5C15.796 4.5 15.284 4.695 14.893 5.085L5.136 14.843L10.086 19.793L19.843 10.035C20.2179 9.65995 20.4286 9.15133 20.4286 8.621C20.4286 8.09068 20.2179 7.58206 19.843 7.207H19.844Z" fill="#626F86"/>
          </svg>
          <span>Edit Order</span>
        </button>

       

        <!-- Download Picking List & Pick Order - Only for Processing status -->
        <template v-if="order?.status === 'processing'">
          <button
            @click="handleAction('downloadPickingList')"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <!-- Download Icon -->
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1V11M8 11L12 7M8 11L4 7" stroke="#626F86" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 12V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V12" stroke="#626F86" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>Download Picking List</span>
          </button>

          <button
            @click="handleAction('pickOrder')"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <!-- Pick Order Icon -->
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4.5L8 1L14 4.5L8 8L2 4.5Z" stroke="#626F86" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 8L8 11.5L14 8" stroke="#626F86" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 11.5L8 15L14 11.5" stroke="#626F86" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
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
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1V11M8 11L12 7M8 11L4 7" stroke="#626F86" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 12V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V12" stroke="#626F86" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>Download Invoice</span>
          </button>

          <button
            @click="handleAction('downloadWaybill')"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <!-- Download Waybill Icon -->
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1V11M8 11L12 7M8 11L4 7" stroke="#626F86" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 12V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V12" stroke="#626F86" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
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
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1V11M8 11L12 7M8 11L4 7" stroke="#626F86" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 12V13C1 13.5523 1.44772 14 2 14H14C14.5523 14 15 13.5523 15 13V12" stroke="#626F86" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>Download Invoice</span>
          </button>

          <button
            @click="handleAction('fulfilmentDetails')"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <!-- Fulfilment Details Icon -->
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1L14.928 4L8 7L1.072 4L8 1Z" stroke="#626F86" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 9L8 12L15 9" stroke="#626F86" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 6L8 9L15 6" stroke="#626F86" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Fulfilment Details</span>
          </button>

          <button
            @click="handleAction('timeTracker')"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <!-- Time Tracker Icon -->
            <svg width="16" height="16" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4.5C7.588 4.5 4 8.088 4 12.5C4 16.912 7.588 20.5 12 20.5C16.412 20.5 20 16.912 20 12.5C20 8.088 16.412 4.5 12 4.5ZM12 18.722C10.3505 18.7199 8.76911 18.0637 7.60272 16.8973C6.43633 15.7309 5.78012 14.1495 5.778 12.5C5.78012 10.8505 6.43633 9.26911 7.60272 8.10272C8.76911 6.93633 10.3505 6.28012 12 6.278C13.6495 6.28012 15.2309 6.93633 16.3973 8.10272C17.5637 9.26911 18.2199 10.8505 18.222 12.5C18.2199 14.1495 17.5637 15.7309 16.3973 16.8973C15.2309 18.0637 13.6495 18.7199 12 18.722ZM12.889 12.132V8.948C12.889 8.459 12.489 8.059 12 8.059C11.511 8.059 11.111 8.459 11.111 8.949V12.504C11.111 12.752 11.214 12.975 11.379 13.137L13.574 15.331C13.741 15.4972 13.9669 15.5904 14.2025 15.5904C14.4381 15.5904 14.664 15.4972 14.831 15.331C14.9969 15.1641 15.0899 14.9383 15.0899 14.703C15.0899 14.4677 14.9969 14.2419 14.831 14.075L12.889 12.132Z" fill="#626F86"/>
            </svg>
            <span>Time Tracker</span>
          </button>

          <button
            @click="handleAction('activityLog')"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
          >
            <!-- Activity Log Icon -->
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17 10.005V19H7V5H12.99V7.49C12.99 7.88782 13.148 8.26936 13.4293 8.55066C13.7106 8.83196 14.0922 8.99 14.49 8.99H18.99V8.468C18.99 8.171 18.858 7.89 18.631 7.7L13.557 3.464C13.197 3.164 12.744 3 12.275 3H7C6.46957 3 5.96086 3.21071 5.58579 3.58579C5.21071 3.96086 5 4.46957 5 5V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V10.005H17Z" fill="#626F86"/>
              <path d="M15 12H9C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H15C15.5523 14 16 13.5523 16 13C16 12.4477 15.5523 12 15 12Z" fill="#626F86"/>
              <path d="M11 15H9C8.44772 15 8 15.4477 8 16C8 16.5523 8.44772 17 9 17H11C11.5523 17 12 16.5523 12 16C12 15.4477 11.5523 15 11 15Z" fill="#626F86"/>
            </svg>
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