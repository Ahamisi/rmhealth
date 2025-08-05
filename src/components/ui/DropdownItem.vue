<template>
  <component 
    :is="href ? 'a' : 'button'"
    :href="href"
    @click="handleClick"
    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:bg-gray-50 focus:text-gray-900 transition-colors duration-150"
    :class="{ 'cursor-not-allowed opacity-50': disabled }"
    :disabled="disabled"
  >
    <div class="flex items-center space-x-3">
      <slot name="icon" v-if="$slots.icon"></slot>
      <span>{{ label }}</span>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  href?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent]
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script> 