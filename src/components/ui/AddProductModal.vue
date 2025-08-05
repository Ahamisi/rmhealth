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
              <h2 class="text-lg font-semibold text-gray-900">Add Product to Order</h2>
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
            <div class="px-6 pb-6 space-y-4">
              <!-- Select Product -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Select Product
                </label>
                <div class="relative">
                  <select
                    v-model="selectedProduct"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Type to search for product</option>
                    <option
                      v-for="product in availableProducts"
                      :key="product.id"
                      :value="product.id"
                    >
                      {{ product.name }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-gray-400">
                      <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Quantity -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  v-model="quantity"
                  type="number"
                  min="1"
                  placeholder="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end space-x-3 p-6 pt-0">
              <button
                @click="$emit('close')"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="handleAdd"
                :disabled="!canAdd"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Product {
  id: string
  name: string
  price?: string
}

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'add', product: { productId: string; productName: string; quantity: number }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Reactive state
const selectedProduct = ref('')
const quantity = ref<number | ''>('')

// Mock available products
const availableProducts = ref<Product[]>([
  { id: '1678159', name: 'PANADOL EXTRA TABLETS' },
  { id: '1678160', name: 'VITAMIN C TABLETS 500MG' },
  { id: '1678161', name: 'ANTIBIOTICS CAPSULES 250MG' },
  { id: '1678162', name: 'PAIN RELIEF TABLETS' },
  { id: '1678163', name: 'COUGH SYRUP 100ML' },
  { id: '1678164', name: 'INSULIN PENS 10ML' },
  { id: '1678165', name: 'EYE DROPS 15ML' },
  { id: '1678166', name: 'SURGICAL MASKS (PACK OF 50)' },
  { id: '1678167', name: 'HAND SANITIZER 500ML' },
  { id: '1678168', name: 'BLOOD PRESSURE TABLETS' }
])

// Computed properties
const canAdd = computed(() => {
  return selectedProduct.value && quantity.value && Number(quantity.value) > 0
})

const selectedProductName = computed(() => {
  const product = availableProducts.value.find(p => p.id === selectedProduct.value)
  return product?.name || ''
})

// Methods
const handleAdd = () => {
  if (canAdd.value) {
    emit('add', {
      productId: selectedProduct.value,
      productName: selectedProductName.value,
      quantity: Number(quantity.value)
    })
    
    // Reset form
    selectedProduct.value = ''
    quantity.value = ''
  }
}

// Watch for modal show/hide to reset form
watch(() => props.show, (newShow) => {
  if (!newShow) {
    selectedProduct.value = ''
    quantity.value = ''
  }
})
</script> 