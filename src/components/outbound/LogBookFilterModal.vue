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
        @click="$emit('close')"
      >
        <transition
          enter-active-class="transition-all ease-out duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all ease-in duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="show"
            class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex"
            @click.stop
          >
            <!-- Left Sidebar -->
            <div class="w-48 bg-gray-50 p-4 border-r border-gray-200">
              <div class="space-y-4">
                <!-- Sort Options -->
                <div>
                  <div class="flex items-center space-x-2 mb-3">
                    <div class="w-2 h-2 rounded-full bg-gray-900"></div>
                    <span class="text-sm font-medium text-gray-900">ID</span>
                  </div>
                  <div class="text-sm text-gray-600 mb-2">Driver Name</div>
                  <div class="text-sm text-gray-600 mb-2">Order Count</div>
                  <div class="text-sm text-gray-600 mb-4">State</div>
                </div>

                <!-- Sort Direction -->
                <div>
                  <div class="flex items-center space-x-2 mb-3">
                    <div class="w-2 h-2 rounded-full bg-gray-900"></div>
                    <span class="text-sm font-medium text-gray-900">Ascending</span>
                  </div>
                  <div class="text-sm text-gray-600">Descending</div>
                </div>
              </div>
            </div>

            <!-- Main Content -->
            <div class="flex-1 p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-semibold text-gray-900">Filter</h2>
                <button
                  @click="$emit('close')"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <img src="/icons/x-icon.svg" alt="Close" class="w-5 h-5">
                </button>
              </div>

              <div class="space-y-6">
                <!-- Date Range -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">From</label>
                      <div class="relative">
                        <input
                          v-model="localFilters.dateFrom"
                          type="text"
                          placeholder="10-10-24"
                          class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <img src="/icons/calendar.svg" alt="Calendar" class="w-4 h-4">
                        </div>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">To</label>
                      <div class="relative">
                        <input
                          v-model="localFilters.dateTo"
                          type="text"
                          placeholder="11-11-24"
                          class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <img src="/icons/calendar.svg" alt="Calendar" class="w-4 h-4">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- State Dropdown -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <div class="relative">
                    <select
                      v-model="localFilters.state"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white"
                    >
                      <option value="">All States</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Kano">Kano</option>
                      <option value="Rivers">Rivers</option>
                      <option value="Ogun">Ogun</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 10L12 15L17 10" stroke="#626F86" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-between mt-8">
                <button
                  @click="handleReset"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Reset all
                </button>
                <button
                  @click="handleApply"
                  class="px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Filters {
  dateFrom: string
  dateTo: string
  state: string
}

interface Props {
  show: boolean
  filters: Filters
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'apply', 'reset'])

const localFilters = ref<Filters>({
  dateFrom: '',
  dateTo: '',
  state: ''
})

// Watch for prop changes to update local filters
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { immediate: true })

const handleApply = () => {
  emit('apply', localFilters.value)
}

const handleReset = () => {
  localFilters.value = {
    dateFrom: '',
    dateTo: '',
    state: ''
  }
  emit('reset')
}
</script> 