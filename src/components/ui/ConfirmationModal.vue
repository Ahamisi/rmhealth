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
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        @click="$emit('cancel')"
      >
        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="show"
            class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-6 pb-4">
              <div class="flex items-center space-x-3">
                <!-- Warning Icon -->
                <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
              </div>
              <button
                @click="$emit('cancel')"
                class="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 5L5 15M5 5L15 15" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="px-6 pb-6">
              <p class="text-gray-600 leading-relaxed">{{ message }}</p>
            </div>

            <!-- Footer -->
            <div class="flex justify-end space-x-3 p-6 pt-0">
              <button
                @click="$emit('cancel')"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {{ cancelText }}
              </button>
              <button
                @click="$emit('confirm')"
                :class="[
                  'px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                  confirmButtonClass
                ]"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'warning' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'primary'
})

const emit = defineEmits(['confirm', 'cancel'])

const confirmButtonClass = computed(() => {
  switch (props.variant) {
    case 'warning':
      return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    default:
      return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
  }
})
</script> 