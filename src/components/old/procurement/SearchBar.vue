<script setup lang="ts">
const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <input
    :value="props.modelValue"
    @input="
      emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
    type="text"
    placeholder="Search suppliers..."
    class="p-2 border rounded w-full outline-none focus:ring focus:ring-blue-500"
  />
</template>
