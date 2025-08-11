<template>

    <p class="h-[24px] text-titleColor text-[14px] leading-6">
  
        <slot></slot>
    </p>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    // header: string
    // buttonLabel?: string
    // loading?: boolean
  }>();
  
  // const emit = defineEmits(['button-click'])
  
  // const click = () => {
  //     emit('button-click')
  // }
  </script>
  