<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-center z-50"
    @click.stop="closeModal"
  >
    <div
      class="bg-white rounded-lg shadow-lg w-[500px] h-full overflow-y-auto p-4"
      @click.stop
    >
      <!-- Header -->
      <div class="border-b pb-3 mb-2 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-text-default">Notification</h2>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
        >
          &times;
        </button>
      </div>

      <!-- Tabs: All | Unread | Mark All as Read -->
      <div class="flex items-center justify-between border-b pb-2 mb-2 text-xs">
        <div class="flex space-x-4">
          <button @click="filter = 'all'" :class="tabClass('all')">All</button>
          <button @click="filter = 'unread'" :class="tabClass('unread')">
            Unread
          </button>
        </div>
        <button @click="markAllAsRead" class="text-text-default font-medium">
          Mark all as read
        </button>
      </div>

      <!-- Notification List -->
      <div v-if="filteredNotifications.length">
        <div v-for="(group, date) in groupedNotifications" :key="date">
          <h3 class="text-xs text-text-subtlest font-semibold capitalize mt-4">
            {{ date }}
          </h3>
          <ul>
            <li
              v-for="notification in group"
              :key="notification.id"
              class="flex items-start border-b py-3 relative"
            >
              <!-- Icon -->
              <component
                :is="getIcon(notification.type)"
                class="h-5 w-5 mr-3"
                :class="getIconColor(notification.type)"
              />

              <!-- Notification Content -->
              <div class="flex-1">
                <p class="text-xs font-medium text-text-default mb-1">
                  {{ notification.title }}
                </p>
                <p class="text-[11px] text-text-subtle mb-1 font-light">
                  {{ notification.message }}
                </p>
                <p class="text-[10px] font-medium text-text-subtle">
                  {{ notification.time }}
                </p>

                <span
                  v-if="notification.link"
                  class="text-blue-600 cursor-pointer text-xs"
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
      <div v-else class="text-center text-gray-500 py-6">
        No new notifications
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { CheckCircle, AlertCircle, Bell } from "lucide-vue-next";
import { useNotificationModal } from "@/Composables/procurement/useNotificationModal";

const notification = useNotificationModal();
const filter = ref("all");

// Sample notifications with read/unread state
const notifications = ref([
  {
    id: 1,
    type: "info",
    title: "Upcoming Delivery",
    message: "#556789 is scheduled to arrive on October 12, 2024.",
    time: "08:20pm",
    date: "Today",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Late Delivery",
    message: "#556789 is scheduled to arrive on October 12, 2024.",
    time: "12:01pm",
    date: "Today",
    read: false,
  },
  {
    id: 3,
    type: "success",
    title: "Purchase Order Approval",
    message: "#556789 has been approved by @Kolade",
    time: "05:49pm",
    date: "Today",
    read: true,
  },
  {
    id: 4,
    type: "info",
    title: "Purchase Order Request - #556789",
    message: "PO raised by @jola for review",
    time: "11:23pm",
    date: "Yesterday",
    read: false,
    link: true,
    linkText: "View request",
  },
  {
    id: 5,
    type: "error",
    title: "Unconfirmed GRN Generated - #556789",
    message: "Unconfirmed GRN generated for purchase order",
    time: "07:13pm",
    date: "Yesterday",
    read: false,
  },
  {
    id: 6,
    type: "success",
    title: "Price Confirmation - #556789",
    message: "Unconfirmed GRN generated for purchase order",
    time: "06:43am",
    date: "Yesterday",
    read: false,
  },
  {
    id: 7,
    type: "success",
    title: "Completed Purchase Order - #556789",
    message: "Confirmed GRN generated for purchase order",
    time: "07:32am",
    date: "Monday",
    read: true,
  },
]);

// Computed property to filter notifications
const filteredNotifications = computed(() => {
  return filter.value === "unread"
    ? notifications.value.filter((n) => !n.read)
    : notifications.value;
});

// Group notifications by date
const groupedNotifications = computed(() => {
  return filteredNotifications.value.reduce((acc, notification) => {
    if (!acc[notification.date]) {
      acc[notification.date] = [];
    }
    acc[notification.date].push(notification);
    return acc;
  }, {});
});

// Helper functions for icons & colors
const getIcon = (type) => {
  switch (type) {
    case "success":
      return CheckCircle;
    case "warning":
      return AlertCircle;
    case "error":
      return AlertCircle;
    default:
      return Bell;
  }
};

const getIconColor = (type) => {
  switch (type) {
    case "success":
      return "text-green-500";
    case "warning":
      return "text-orange-500";
    case "error":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

// Tab class styling
const tabClass = (type) =>
  `pb-2 border-b-2 ${
    filter.value === type
      ? "border-blue-600 text-blue-600 font-medium"
      : "text-gray-500"
  }`;

// Close Modal
const closeModal = () => {
  notification.value = false;
};

// Mark All as Read
const markAllAsRead = () => {
  notifications.value.forEach((n) => (n.read = true));
};
</script>
