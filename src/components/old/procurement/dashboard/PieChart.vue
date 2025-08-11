<template>
  <div class="w-48 h-48 relative">
    <canvas ref="chartCanvas" width="200" height="200"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  data: {
    type: Array as () => number[],
    required: true,
  },
  colors: {
    type: Array as () => string[],
    default: () => ["#6C88FF", "#FD9891"],
  },
  borderColor: {
    type: String,
    default: "#fff", // Purple border
  },
  borderWidth: {
    type: Number,
    default: 5, // Thickness of the border
  },
  gapSize: {
    type: Number,
    default: 2, // Small gap between slices
  },
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);

// const drawChart = () => {
//   const canvas = chartCanvas.value;
//   if (!canvas) return;

//   const ctx = canvas.getContext("2d");
//   if (!ctx) return;

//   // Clear canvas
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   // Chart settings
//   const centerX = canvas.width / 2;
//   const centerY = canvas.height / 2;
//   const radius = Math.min(centerX, centerY) - 10;

//   let startAngle = 0;
//   let endAngle = 0;

//   const total = props.data.reduce((sum, value) => sum + value, 0);

//   props.data.forEach((value, index) => {
//     const sliceAngle = (value / total) * 2 * Math.PI;
//     endAngle = startAngle + sliceAngle;

//     // Draw the slice with a small gap effect
//     ctx.beginPath();
//     ctx.moveTo(centerX, centerY);
//     ctx.arc(
//       centerX,
//       centerY,
//       radius,
//       startAngle + props.gapSize * 0.01,
//       endAngle - props.gapSize * 0.01
//     );
//     ctx.closePath();
//     ctx.fillStyle = props.colors[index % props.colors.length];
//     ctx.fill();

//     // Draw border around slice
//     ctx.lineWidth = props.borderWidth;
//     ctx.strokeStyle = props.borderColor;
//     ctx.stroke();

//     startAngle = endAngle;
//   });

// };

const drawChart = () => {
  const canvas = chartCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Chart settings
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const baseRadius = Math.min(centerX, centerY) - 10; // Base radius

  let startAngle = 90;
  let endAngle = 180;

  const total = props.data.reduce((sum, value) => sum + value, 0);
  const minValue = Math.min(...props.data);
  const maxValue = Math.max(...props.data);

  props.data.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    endAngle = startAngle + sliceAngle;

    // Calculate dynamic radius: bigger value → slightly bigger radius
    const radiusVariation = 7; // Max radius variation
    const radius =
      baseRadius + ((value - minValue) / (maxValue - minValue)) * radiusVariation;

    // Draw the slice with a small gap effect
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(
      centerX,
      centerY,
      radius,
      startAngle + props.gapSize * 0.01,
      endAngle - props.gapSize * 0.01
    );
    ctx.closePath();
    ctx.fillStyle = props.colors[index % props.colors.length];
    ctx.fill();

    // Draw border around slice
    ctx.lineWidth = props.borderWidth;
    ctx.strokeStyle = props.borderColor;
    ctx.stroke();

    startAngle = endAngle;
  });
};






onMounted(drawChart);
watch(() => props.data, drawChart, { deep: true });
</script>
