<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
    <div v-if="$slots.header" class="px-6 pt-4 pb-0">
      <slot name="header" />
    </div>
    <div :class="noPadding ? '' : 'p-6'">
      <slot />
    </div>
    <div v-if="$slots.footer" class="p-6 border-t border-gray-200">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  noPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  noPadding: false
})
</script> 