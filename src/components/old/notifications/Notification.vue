<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-lg shadow-lg w-[500px] h-full overflow-y-auto p-4"
    >
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 mb-2 border-b">
        <h2 class="text-lg font-semibold text-text-default">Notification</h2>
        <button
          @click="closeModal"
          class="text-2xl text-gray-500 cursor-pointer hover:text-gray-700"
        >
          &times;
        </button>
      </div>

      <!-- Tabs: All | Unread | Mark All as Read -->
      <div class="flex items-center justify-between pb-2 mb-2 text-xs border-b">
        <div class="flex space-x-4">
          <button @click="filter = 'all'" :class="tabClass('all')">All</button>
          <button @click="filter = 'unread'" :class="tabClass('unread')">Unread</button>
        </div>
        <button @click="markAllAsRead" class="font-medium text-text-default">Mark all as read</button>
      </div>

      <!-- Notification List -->
      <div v-if="filteredNotifications.length">
        <div v-for="(group, date) in groupedNotifications" :key="date">
          <h3 class="mt-4 text-xs font-semibold capitalize text-text-subtlest">{{ date }}</h3>
          <ul>
            <li
              v-for="notification in group"
              :key="notification.id"
              class="relative flex items-start py-3 border-b"
            >
              <!-- Icon -->
              <component
                :is="getIcon(notification.type)"
                class="w-5 h-5 mr-3"
                :class="getIconColor(notification.type)"
              />

              <!-- Notification Content -->
              <div class="flex-1">
                <p class="mb-1 text-xs font-medium text-text-default">{{ notification.title }}</p>
                <p class="text-[11px] text-text-subtle mb-1 font-light">{{ notification.message }}</p>
                <p class="text-[10px] font-medium text-text-subtle">{{ notification.time }}</p>

                <span
                  v-if="notification.link"
                  class="text-xs text-blue-600 cursor-pointer"
                >
                  {{ notification.linkText }}
                </span>
              </div>

              <!-- Unread Dot -->
              <span
                v-if="!notification.read"
                class="h-1 w-1 bg-[#E56910] rounded-full absolute right-3 top-5"
              ></span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-6 text-center text-gray-500">
        No new notifications
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { CheckCircle, AlertCircle, Bell } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const closeModal = () => {
  emit('update:modelValue', false)
}

const filter = ref('all')

const notifications = ref([
  {
    id: 1,
    type: 'info',
    title: 'Upcoming Delivery',
    message: '#556789 is scheduled to arrive on October 12, 2024.',
    time: '08:20pm',
    date: 'Today',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Late Delivery',
    message: '#556789 is delayed.',
    time: '12:01pm',
    date: 'Today',
    read: false,
  },
  {
    id: 3,
    type: 'success',
    title: 'Purchase Order Approved',
    message: '#556789 was approved by @Kolade.',
    time: '05:49pm',
    date: 'Today',
    read: true,
  },
  {
    id: 4,
    type: 'error',
    title: 'Unconfirmed GRN - #556789',
    message: 'A GRN was generated without confirmation.',
    time: '07:13pm',
    date: 'Yesterday',
    read: false,
  },
])

const filteredNotifications = computed(() => {
  return filter.value === 'unread'
    ? notifications.value.filter(n => !n.read)
    : notifications.value
})

const groupedNotifications = computed(() => {
  return filteredNotifications.value.reduce((acc, n) => {
    if (!acc[n.date]) acc[n.date] = []
    acc[n.date].push(n)
    return acc
  }, {})
})

const tabClass = (type) =>
  `pb-2 border-b-2 ${
    filter.value === type
      ? 'border-blue-600 text-blue-600 font-medium'
      : 'text-gray-500'
  }`

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return CheckCircle
    case 'warning':
    case 'error':
      return AlertCircle
    default:
      return Bell
  }
}

const getIconColor = (type) => {
  switch (type) {
    case 'success':
      return 'text-green-500'
    case 'warning':
      return 'text-orange-500'
    case 'error':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => (n.read = true))
}
</script>
