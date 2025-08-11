<template>
  <button
    type="button"
    class="h-[32px] text-white pt-0.5 pr-2 pb-0.5 pl-1 rounded-md"
  >
  <p class="text-xs font-medium leading-4">

      <slot></slot>
  </p>
  </button>
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
