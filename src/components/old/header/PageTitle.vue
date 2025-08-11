<template>
    <div class="pt-2 mb-4" :style="bgColor ? {background: 'white', margin: 0, paddingBottom: '16px', paddingTop: '8px' } : {}">
      <h1 class="text-sm page-title" >{{ title }}</h1>
    </div>
</template>

<script setup lang="ts">
    // defineProps is automatically available, no need to import
    const props = defineProps<{
        title: string,
        bgColor?: string
    }>()
</script>

<style scoped>
    .page-title{
        color: rgba(98, 111, 134, 1);
        font-weight: 300;
    }
</style>