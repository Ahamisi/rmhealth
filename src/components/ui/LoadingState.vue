<template>
  <div class="flex flex-col items-center justify-center py-16 px-4">
    <!-- Loading Animation -->
    <div class="mb-4">
      <div class="grid grid-cols-3 gap-1">
        <div 
          v-for="i in 6" 
          :key="i"
          class="w-3 h-3 rounded-full animate-pulse"
          :class="i <= 3 ? 'bg-blue-500' : 'bg-green-500'"
          :style="{ animationDelay: `${i * 0.1}s` }"
        ></div>
      </div>
    </div>

    <!-- Loading Text -->
    <h3 class="text-lg font-semibold text-gray-900 mb-2">Loading data</h3>
    <p class="text-gray-600 text-center max-w-md">
      Please wait while we fetch your order data
    </p>
  </div>
</template>

<script setup lang="ts">
// Loading state component - no additional logic needed
</script> 