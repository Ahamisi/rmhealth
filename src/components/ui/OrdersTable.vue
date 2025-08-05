<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <!-- Table Header -->
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Order No
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Customer Name
            <svg class="inline ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 8l5-5 5 5H5z"/>
            </svg>
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Store Name
            <svg class="inline ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 8l5-5 5 5H5z"/>
            </svg>
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            State
            <svg class="inline ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 8l5-5 5 5H5z"/>
            </svg>
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Payment
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Order Date
            <svg class="inline ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 8l5-5 5 5H5z"/>
            </svg>
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Delivery Date
            <svg class="inline ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 8l5-5 5 5H5z"/>
            </svg>
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Amount
            <svg class="inline ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 8l5-5 5 5H5z"/>
            </svg>
          </th>
          <th v-if="showActions" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Action
          </th>
        </tr>
      </thead>

      <!-- Table Body -->
      <tbody class="bg-white divide-y divide-gray-200">
        <tr 
          v-for="order in orders" 
          :key="order.id"
          class="hover:bg-gray-50 text-sm"
        >
          <!-- Order No -->
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">
            {{ order.orderNo }}{{ order.orderNoSuffix ? `-${order.orderNoSuffix}` : '' }}
          </td>

          <!-- Customer Name -->
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">
            {{ order.customerName }}
          </td>

          <!-- Store Name -->
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">
            {{ order.storeName }}
          </td>

          <!-- State -->
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">
            {{ order.state }}
          </td>

          <!-- Payment -->
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">
            {{ order.payment }}
          </td>

          <!-- Order Date -->
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">
            {{ order.orderDate }}
          </td>

          <!-- Delivery Date -->
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">
            {{ order.deliveryDate }}
          </td>

          <!-- Total Amount -->
          <td class="px-6 py-4 whitespace-nowrap text-gray-900">
            {{ order.totalAmount }}
          </td>

          <!-- Actions (if enabled) -->
          <td v-if="showActions" class="px-6 py-4 whitespace-nowrap text-gray-900">
            <ActionDropdown :order="order" @action="$emit('orderAction', $event)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import ActionDropdown from '@/components/ui/ActionDropdown.vue'

interface Order {
  id: string
  orderNo: string
  orderNoSuffix?: string
  customerName: string
  storeName: string
  state: string
  payment: string
  orderDate: string
  deliveryDate: string
  totalAmount: string
  status: string
}

interface Props {
  orders: Order[]
  showActions?: boolean
}

interface Emits {
  (e: 'orderAction', action: any): void
}

withDefaults(defineProps<Props>(), {
  showActions: true
})

defineEmits<Emits>()
</script> 