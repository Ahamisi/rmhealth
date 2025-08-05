<template>
  <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in items" :key="item.id" :class="getRowClass(item)">
            <!-- Item Unavailable Banner -->
            <td v-if="item.showDeleteConfirmation && item.deleteAction === 'delete'" colspan="4" class="px-6 py-4">
              <div class="flex items-center justify-between bg-red-50 border border-red-200 rounded-md p-4">
                <div class="flex items-center space-x-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-red-500">
                    <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM9 9V5H11V9H9ZM9 13V11H11V13H9Z" fill="currentColor"/>
                  </svg>
                  <span class="text-sm text-gray-700">
                    You are about to delete without returning this item back to stock "{{ item.productName }}".
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="confirmDelete(item.id, 'delete')"
                    class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    @click="cancelDelete(item.id)"
                    class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Icon name="x" :size="16" />
                  </button>
                </div>
              </div>
            </td>

            <!-- Return to Stock Banner -->
            <td v-else-if="item.showDeleteConfirmation && item.deleteAction === 'return'" colspan="4" class="px-6 py-4">
              <div class="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-md p-4">
                <div class="flex items-center space-x-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-orange-500">
                    <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM9 9V5H11V9H9ZM9 13V11H11V13H9Z" fill="currentColor"/>
                  </svg>
                  <span class="text-sm text-gray-700">
                    You are about to delete and return this item back to stock "{{ item.productName }}".
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="confirmDelete(item.id, 'return')"
                    class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    @click="cancelDelete(item.id)"
                    class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Icon name="x" :size="16" />
                  </button>
                </div>
              </div>
            </td>

            <!-- Normal Row -->
            <template v-else>
              <!-- ID Column -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.productId }}
              </td>

              <!-- Product Name Column -->
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ item.productName }}
              </td>

              <!-- Quantity Column -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <input
                  v-if="item.isEditing"
                  v-model="item.editQuantity"
                  type="number"
                  min="1"
                  class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span v-else>{{ item.quantity }}</span>
              </td>

              <!-- Action Column -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <!-- Edit Mode Actions -->
                <div v-if="item.isEditing" class="flex items-center justify-end space-x-2">
                  <span class="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                    Edit Order Quantity
                  </span>
                  <button
                    @click="updateItem(item)"
                    class="px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    @click="$emit('cancel-edit', item.id)"
                    class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Icon name="x" :size="16" />
                  </button>
                </div>

                <!-- Normal Mode Actions -->
                <div v-else class="flex items-center justify-end space-x-2">
                  <!-- Edit Button -->
                  <button
                    @click="$emit('edit-item', item.id)"
                    class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Edit"
                  >
                    <Icon name="edit" :size="16" />
                  </button>

                  <!-- Delete Button -->
                  <button
                    @click="$emit('delete-item', item.id, 'delete')"
                    class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Icon name="x" :size="16" />
                  </button>

                  <!-- Return to Stock Button -->
                  <button
                    @click="$emit('delete-item', item.id, 'return')"
                    class="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                    title="Return to Stock"
                  >
                    <Icon name="trash" :size="16" />
                  </button>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/ui/Icon.vue'
interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  isEditing?: boolean
  editQuantity?: number
  showDeleteConfirmation?: boolean
  deleteAction?: 'delete' | 'return'
}

interface Props {
  items: OrderItem[]
}

interface Emits {
  (e: 'edit-item', itemId: string): void
  (e: 'delete-item', itemId: string, action: 'delete' | 'return'): void
  (e: 'update-item', itemId: string, quantity: number): void
  (e: 'cancel-edit', itemId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const getRowClass = (item: OrderItem) => {
  if (item.showDeleteConfirmation) {
    return item.deleteAction === 'delete' 
      ? 'bg-red-50 border-red-200' 
      : 'bg-orange-50 border-orange-200'
  }
  return item.isEditing ? 'bg-blue-50' : ''
}

const updateItem = (item: OrderItem) => {
  if (item.editQuantity && item.editQuantity > 0) {
    emit('update-item', item.id, item.editQuantity)
  }
}

const confirmDelete = (itemId: string, action: 'delete' | 'return') => {
  // TODO: Actually delete the item
  console.log(`Confirming ${action} for item:`, itemId)
  
  // For now, just hide the confirmation
  const item = props.items.find(i => i.id === itemId)
  if (item) {
    item.showDeleteConfirmation = false
    item.deleteAction = undefined
  }
}

const cancelDelete = (itemId: string) => {
  const item = props.items.find(i => i.id === itemId)
  if (item) {
    item.showDeleteConfirmation = false
    item.deleteAction = undefined
  }
}
</script> 