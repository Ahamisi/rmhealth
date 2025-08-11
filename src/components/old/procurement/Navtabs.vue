<script setup>
import { useSidebar } from "@/Composables/procurement/useNavtabs";

const { tabs, activeTab, setActiveTab } = useSidebar();
</script>

<template>
  <div class="bg-white w-[220px] h-screen shadow-md">
    <ul>
      <li
        v-for="tab in tabs"
        :key="tab.name"
        @click="setActiveTab(tab.name)"
        :class="[
          'p-4 cursor-pointer',
          activeTab === tab.name
            ? 'bg-blue-600 text-white'
            : 'hover:bg-gray-100 text-gray-700',
        ]"
      >
        {{ tab.name }}
      </li>
    </ul>
  </div>
</template>
