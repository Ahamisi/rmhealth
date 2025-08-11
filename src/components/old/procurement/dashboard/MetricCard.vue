<template>
  <div
    class="bg-white p-6 rounded-lg shadow flex justify-between items-center text-text-default"
  >
    <div>
      <h3 class="text-sm font-semibold text-gray-500">{{ title }}</h3>
      <div class="flex items-center mt-2">
        <span
          :class="{
            'text-base': isRawValue,
            'text-xl': !isRawValue,
            'font-semibold': true,
          }"
        >
          {{ valuePrefix }}{{ value }}
        </span>
        <span
          v-if="change !== undefined"
          :class="change >= 0 ? 'text-green-600' : 'text-red-600'"
          class="ml-2 flex items-center text-sm font-medium"
        >
          <span v-if="change >= 0"><ArrowUp class="h-3 w-3" /></span>
          <span v-else><ArrowDown class="h-3 w-3" /></span>
          {{ change }}%
        </span>
      </div>
      <p v-if="comparison" class="text-xs text-gray-500 mt-1">
        {{ comparison }}
      </p>
      <p v-if="showCompared" class="text-xs text-gray-500 font-medium">Compared to last month</p>
    </div>

    <!-- Mini Chart -->
    <div class="w-16 h-10" v-if="!skipCanvas">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, onMounted } from "vue";

import { ArrowUp, ArrowDown } from "lucide-vue-next";
import Chart from "chart.js/auto";

// Props
const props = defineProps<{
  title: string;
  value: number | string;
  change?: number;
  comparison?: string;
  trend?: "up" | "down";
  valuePrefix?: string;
  chartData?: number[];
  isRawValue?: boolean;
  showCompared?: boolean;
  skipCanvas?: boolean;
}>();

// Fix: Use shallowRef for canvas element
const chartCanvas = shallowRef<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (chartCanvas.value) {
    new Chart(chartCanvas.value, {
      type: "line",
      data: {
        labels: props.chartData?.map((_, index) => index) || [1, 2, 3, 4, 5],
        datasets: [
          {
            data: props.chartData || [10, 15, 9, 20, 18],
            borderColor:
              props.change && props.change >= 0 ? "#22c55e" : "#ef4444",
            backgroundColor:
              props.change && props.change >= 0
                ? "rgba(34,197,94,0.2)"
                : "rgba(239,68,68,0.2)",
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  }
});
</script>
