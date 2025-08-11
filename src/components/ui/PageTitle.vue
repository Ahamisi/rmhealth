<template>
  <div 
    class="pt-2 mb-4" 
    :style="bgColor ? { background: 'white', margin: 0, paddingBottom: '16px', paddingTop: '8px' } : {}"
  >
    <h1 class="text-sm page-title">{{ title }}</h1>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  bgColor?: string
}

defineProps<Props>()
</script>

<style scoped>
.page-title {
  color: #626F86;
  font-weight: 300;
}
</style> 