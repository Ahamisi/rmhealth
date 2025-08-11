<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { CheckCircle, AlertCircle, Bell } from "lucide-vue-next";
import { useNotificationModal } from "@/Composables/procurement/useNotificationModal";
import { useNotifications } from "@/Composables/procurement/useNotifications";

const notification = useNotificationModal();
const filter = ref("all");
const { notifications, fetchNotifications, isLoading } = useNotifications();

onMounted(async () => {
  if (notifications.value.length === 0) {
    await fetchNotifications();
  }
});

// Computed: filter notifications by read/unread
const filteredNotifications = computed(() => {
  return filter.value === "unread"
    ? notifications.value.filter((n) => !n.read)
    : notifications.value;
});

// Computed: group notifications by date
const groupedNotifications = computed(() => {
  return filteredNotifications.value.reduce((acc, notification) => {
    const date = notification.date || "Unknown Date";
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(notification);
    return acc;
  }, {} as Record<string, any[]>);
});

// Dynamic icon mapping
const getIcon = (type: string) => {
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

const getIconColor = (type: string) => {
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

const tabClass = (type: string) =>
  `pb-2 border-b-2 ${
    filter.value === type
      ? "border-blue-600 text-blue-600 font-medium"
      : "text-gray-500"
  }`;

const closeModal = () => {
  notification.value = false;
};

const markAllAsRead = () => {
  notifications.value = notifications.value.map((n) => ({ ...n, read: true }));
};
</script>

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

      <!-- Tabs -->
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

      <!-- Notifications List -->
      <div v-if="Object.keys(groupedNotifications).length > 0">
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

              <!-- Content -->
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
                  {{ notification.linkText || "View more" }}
                </span>
              </div>

              <!-- Unread dot -->
              <span
                v-if="!notification.read"
                class="h-1 w-1 bg-[#E56910] rounded-full absolute right-3 top-5"
              ></span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center text-gray-500 py-6">
        No new notifications
      </div>
    </div>
  </div>
</template>
