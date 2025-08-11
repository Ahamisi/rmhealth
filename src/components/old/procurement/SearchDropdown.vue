<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';

const props = defineProps<{
  isOpen?: boolean;
  toggle?: () => void;
  alignLeft: boolean;
}>();

const triggerRef = ref<HTMLElement | null>(null);
const dropdownPosition = ref({ top: 0, left: 0 });

const dropdownStyle = computed(() => ({
  position: "absolute" as const,
  top: `${dropdownPosition.value.top}px`,
  left: `${dropdownPosition.value.left}px`,
  zIndex: 50,
}));


const updateDropdownPosition = () => {
  if (!triggerRef.value) return;

  const rect = triggerRef.value.getBoundingClientRect();
  const dropdownWidth = 280; // Estimated dropdown width
  
    dropdownPosition.value = {
      top: rect.bottom + window.scrollY - 4, // 8px gap below
      left: props.alignLeft 
          ? rect.right + window.scrollX - dropdownWidth + 50 
          : rect.right + window.scrollX - dropdownWidth + 130 
       // aligns dropdown's right to trigger's right
    };

  // dropdownPosition.value = {
  //   top: rect.bottom + window.scrollY + 8, // 8px gap
  //   left: props.alignLeft
  //     ? rect.left + window.scrollX
  //     : rect.right + window.scrollX - dropdownWidth
  // };
};

const handleToggle = () => {
  if (props.toggle) {
    props.toggle();
    if (!props.isOpen) {
      updateDropdownPosition();
    }
  }
};

// Update position when dropdown opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    updateDropdownPosition();
    window.addEventListener("scroll", updateDropdownPosition, true);
    window.addEventListener("resize", updateDropdownPosition);
  } else {
    window.removeEventListener("scroll", updateDropdownPosition, true);
    window.removeEventListener("resize", updateDropdownPosition);
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateDropdownPosition, true);
  window.removeEventListener("resize", updateDropdownPosition);
});
</script>

<!-- <template>
  <div class="dropdown">
    <div @click="props.toggle" class="cursor-pointer">
      <slot name="trigger"></slot>
    </div>

    <div v-if="props.isOpen" class="absolute z-50 w-auto mt-2 bg-white rounded-lg shadow-lg">
      <slot></slot>
    </div>
  </div>
</template> -->
<template>
  <div class="relative dropdown">
    <div @click="handleToggle" class="cursor-pointer" ref="triggerRef">
      <slot name="trigger"></slot>
    </div>

    <!-- Use teleport for better positioning control -->
    <teleport to="body">
      <div
        v-if="props.isOpen"
        :style="dropdownStyle"
        class="absolute z-50 w-auto mt-2 bg-white border border-gray-200 rounded-lg shadow-lg top-full"
      >
        <slot></slot>
      </div>
    </teleport>
  </div>
</template>
