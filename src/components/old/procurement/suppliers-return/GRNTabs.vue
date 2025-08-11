<script setup lang="ts">
import { ref } from "vue";

const tabs = ref([
  "Awaiting PO Approval",
  "Approved PO",
  "Unconfirmed GRN",
  "Confirmed GRN",
  "Price Confirmation",
  "Completed PO",
  "Payments",
]);
const activeSlot = computed(() => activeTab.value.toLowerCase().replace(/\s+/g, "-"));

const activeTab = ref(tabs.value[0]);
</script>

<template>
  <div>
    <!-- Tabs Navigation -->
    <div class="flex border-b border-gray-300">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        class="px-4 py-2 text-gray-700 transition-colors"
        :class="{
          'border-t border-l border-r rounded-t-lg font-semibold text-black bg-white -mb-[2px]':
            activeTab === tab,
          'text-gray-500 border-b-1 border-gray-300': activeTab !== tab,
        }"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Tab Content (Using Slot) -->
    <div class="p-6 bg-white border rounded-b-lg">
      <slot :name="activeSlot"></slot>
    </div>
  </div>
</template>
