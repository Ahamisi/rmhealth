<!-- Tooltip.vue -->
<template>
  <div ref="wrapperRef" class="relative inline-block group tooltip-wrapper">
    <slot></slot>

    <div
      ref="tooltipRef"
      class="fixed hidden px-4 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg pointer-events-none group-hover:block"
      :style="tooltipStyle"
    >
      {{ text }}
      <div class="absolute w-0 h-0 transform -translate-x-1/2 border-t-8 border-l-8 border-r-8 left-1/2 top-full border-l-transparent border-r-transparent border-t-gray-800"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  text: string;
}>();

const tooltipRef = ref<HTMLElement | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);
const tooltipStyle = ref({});

let mouseEnterHandler: (() => void) | null = null;
let mouseLeaveHandler: (() => void) | null = null;

const updateTooltipPosition = () => {
  if (!tooltipRef.value || !wrapperRef.value) return;
  
  const triggerRect = wrapperRef.value.getBoundingClientRect();
  
  // Show tooltip temporarily to get its dimensions
  tooltipRef.value.style.display = 'block';
  tooltipRef.value.style.visibility = 'hidden';
  const tooltipRect = tooltipRef.value.getBoundingClientRect();
  tooltipRef.value.style.display = '';
  tooltipRef.value.style.visibility = '';
  
  // Calculate position above the trigger element
  let top = triggerRect.top - tooltipRect.height - 8; // 8px gap
  let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
  
  // Ensure tooltip doesn't go off-screen horizontally
  if (left < 8) {
    left = 8;
  } else if (left + tooltipRect.width > window.innerWidth - 8) {
    left = window.innerWidth - tooltipRect.width - 8;
  }
  
  // If tooltip would go above viewport, show it below instead
  if (top < 8) {
    top = triggerRect.bottom + 8;
  }
  
  tooltipStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    zIndex: '99999'
  };
};

onMounted(() => {
  if (wrapperRef.value) {
    mouseEnterHandler = () => {
      updateTooltipPosition();
    };
    
    mouseLeaveHandler = () => {
      tooltipStyle.value = {};
    };
    
    wrapperRef.value.addEventListener('mouseenter', mouseEnterHandler);
    wrapperRef.value.addEventListener('mouseleave', mouseLeaveHandler);
    
    // Update position on scroll/resize
    window.addEventListener('scroll', updateTooltipPosition);
    window.addEventListener('resize', updateTooltipPosition);
  }
});

onUnmounted(() => {
  if (wrapperRef.value && mouseEnterHandler && mouseLeaveHandler) {
    wrapperRef.value.removeEventListener('mouseenter', mouseEnterHandler);
    wrapperRef.value.removeEventListener('mouseleave', mouseLeaveHandler);
  }
  
  window.removeEventListener('scroll', updateTooltipPosition);
  window.removeEventListener('resize', updateTooltipPosition);
});
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
}

.tooltip-wrapper:hover .fixed {
  display: block !important;
}
</style>