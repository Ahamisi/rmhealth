<template>
  <div class="h-1 w-full bg-gray-100 rounded">
    <div
      class="h-1 rounded"
      :class="color"
      :style="{ width: `${percentage}%` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  percentage: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0 && value <= 100,
  },
  color: {
    type: String,
    default: "bg-blue-500",
  },
});
</script>
