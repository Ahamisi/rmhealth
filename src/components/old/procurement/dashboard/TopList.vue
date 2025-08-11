<template>
  <div class="bg-white">
    <!-- Section Title -->
    <h3 class="text-text-default text-base font-semibold mb-6">{{ title }}</h3>

    <div class="space-y-4 text-xs">
      <div
        v-for="(item, index) in items"
        :key="index"
        class=" gap-x-4 flex flex-col items-center gap-y-2"
      >
        <div class="w-full flex justify-between items-center gap-y-2">
          <!-- Item Name -->
          <div class="font-semibold text-xs text-text-default break-words text-balance">{{ item.name }}</div>

          <div class="w-24 h-1 bg-gray-200 rounded-full mr-3 relative">
            <div
              class="h-1 bg-[#44546F] rounded-full"
              :style="{ width: `${item.percentage}%` }"
            ></div>
          </div>

          <div class="text-right text-text-default text-xs font-medium">
            {{ valuePrefix }}{{ formatValue(item.value) }}
          </div>
        </div>
        <div v-if="index + 1 != items.length" class="border-b-[2px] border-light-500 w-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TopListItem {
  name: string;
  value: number;
  percentage: number;
}

defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array as () => TopListItem[],
    required: true,
  },
  valuePrefix: {
    type: String,
    default: "",
  },
});

const formatValue = (value: number): string => {
  return value.toLocaleString();
};
</script>
