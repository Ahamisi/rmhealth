<template>
  <!-- <Teleport to="body">
    <transition name="fade">
  
    </transition>
  </Teleport> -->
  <div v-if="isOpen" class="menu-overlay" @click.self="closeDropdown">
    <div ref="menuRef" class="menu-container">
      <ul>
        <li
          v-for="item in menuItems"
          :key="item.label"
          @click="handleClick(item.action)"
        >
          <component :is="item.icon" class="icon" />
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  LucideEye,
  LucidePlus,
  LucideTrash2,
  LucideCreditCard,
  LucidePencil,
} from "lucide-vue-next";
import { onClickOutside } from "@vueuse/core"; // ✅ VueUse for handling outside clicks

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close", "select"]);

const menuRef = ref<HTMLElement | null>(null);

const menuItems = [
  { label: "View Supplier Details", icon: LucideEye, action: "view" },
  { label: "Add Purchase Order", icon: LucidePlus, action: "purchase" },
  { label: "Edit", icon: LucidePencil, action: "edit" },
  { label: "Add Payment", icon: LucideCreditCard, action: "payment" },
  { label: "Delete", icon: LucideTrash2, action: "delete" },
];

const closeDropdown = () => {
  emit("close");
};

const handleClick = (action: string) => {
  emit("select", action);
  closeDropdown();
};

// ✅ Close menu when clicking outside
onClickOutside(menuRef, closeDropdown);
</script>

<style scoped>
.menu-overlay {
  @apply absolute right-0 top-0 bg-transparent flex justify-center items-center z-50;
}

.menu-container {
  @apply bg-white shadow-lg rounded-md w-56;
}

ul {
  @apply divide-y divide-gray-200;
}

li {
  @apply flex items-center gap-3 px-4 py-3 text-gray-600 text-xs font-medium cursor-pointer hover:bg-gray-100;
}

.icon {
  @apply w-5 h-5 text-gray-600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
