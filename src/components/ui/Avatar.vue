<template>
  <span
    class="inline-flex items-center justify-center rounded-full"
    :class="[sizeClasses]"
    :style="{ backgroundColor: 'transparent' }"
  >
    <img
      v-if="src"
      :src="src"
      alt="Avatar"
      class="rounded-full object-cover w-full h-full"
    >
    <span
      v-else
      class="text-sm font-medium leading-none"
      :style="{ color: '#fff' }"
    >
      {{ fallback }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  src?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fallback: 'U'
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 w-8';
    case 'lg':
      return 'h-12 w-12';
    default:
      return 'h-10 w-10';
  }
});
</script> 