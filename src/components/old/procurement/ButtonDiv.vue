<script setup lang="ts">
const props = defineProps<{ 
    name: string,
    handleClick: ()=>void,
    moreStylings?:string
 }>();
</script>

<template>
    <button :class=[moreStylings,] class="font-semibold flex items-center gap-[10px] px-4 py-2 rounded-md" v-on:click="props.handleClick">
        <slot />
        <span>{{props.name}}</span>
    </button>
</template>
