<script setup lang="ts">
const props = defineProps<{ modelValue: number | string, defaultValue:string, values:string[], status?:boolean, variant?:string, isOpen?:boolean }>();

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
    <select :class="props.variant ? props.variant : 'bg-ashGray'" 
        :value="props.modelValue"
        class="cursor-pointer w-full font-semibold flex items-center gap-[10px] px-2 py-2 rounded-md"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
        <option selected value="" disabled>{{props.defaultValue}}</option>
        <option v-for="value in props.values" :key="value" :value="value">
            {{!props.status ? 'Page No' +' ' + value : value}}
        </option>
    </select>
</template>