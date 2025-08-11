<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  placeholder: string;
  customStyles?: string;
}>();
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <input
    :value="props.modelValue"
    @input="
      emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
    type="text"
    :class="
      customStyles
        ? customStyles
        : 'border-2 outline-0 w-full pl-[40px] px-4 rounded-md py-2 border-2 border-[#091E4224] w-full bg-transparent'
    "
    :placeholder="placeholder"
  />
</template>
