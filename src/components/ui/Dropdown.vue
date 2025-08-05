<template>
  <div class="relative" ref="dropdownRef">
    <button 
      @click="toggle" 
      class="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
      :class="{ 'text-primary-600 border-b-2 border-primary-600': isOpen }"
    >
      <slot name="trigger"></slot>
      <!-- Chevron Down Icon - follows Atlassian design -->
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        :class="{ 'rotate-180': isOpen }"
        class="transition-transform duration-200"
      >
        <path 
          d="M4 6L8 10L12 6" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        />
      </svg>
    </button>
    
    <!-- Dropdown Panel - Atlassian elevation and spacing -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95 translate-y-[-4px]"
      enter-to-class="transform opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100 translate-y-0"
      leave-to-class="transform opacity-0 scale-95 translate-y-[-4px]"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 min-w-48 bg-white rounded-lg shadow-lg border border-gray-200"
        style="box-shadow: 0 8px 24px rgba(9, 30, 66, 0.15), 0 0 1px rgba(9, 30, 66, 0.31);"
      >
        <div class="py-2">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

const isOpen = ref(false);
const dropdownRef = ref(null);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const close = () => {
  isOpen.value = false;
};

onClickOutside(dropdownRef, close);
</script> 