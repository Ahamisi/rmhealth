<template>
  <button
    @click="$emit('click')"
    :class="[
      bgColor,
      textColor,
      padding,
      rounded,
      'flex items-center gap-1 transition duration-200',
      { 'opacity-50 cursor-not-allowed': disabled },
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

  <script setup>
defineProps({
  bgColor: {
    type: String,
    default: "bg-red-500",
  },
  textColor: {
    type: String,
    default: "text-white",
  },
  padding: {
    type: String,
    default: "px-[12px] py-2",
  },
  rounded: {
    type: String,
    default: "rounded-[6px]",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);
</script>
