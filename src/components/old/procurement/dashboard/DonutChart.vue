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
    default: () => ["#6C88FF", "#B8C4FF"], // Blue for used, light blue for free space
  },
  label: {
    type: String,
    default: "40%",
  },
  dashedEffect: {
    type: Boolean,
    default: true,
  },
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);

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
  const outerRadius = Math.min(centerX, centerY) - 4;
  const innerRadius = outerRadius * 0.35; // Inner cutout size

  let startAngle = 30; // Start from top
  let endAngle = 300; // Used space
  // let startAngle = - Math.PI / 2; // Start from top
  // let endAngle = startAngle + (props.data[0] / 100) * 2 * Math.PI; // Used space

  // Draw Used Space (Solid)
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
  ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
  ctx.fillStyle = props.colors[0];
  ctx.fill();

  // Draw Free Space (Dashed Effect)
  if (props.dashedEffect) {
    const numDashes = 50; // Number of radial dashes
    const dashThickness = 6; // Thickness of each dash
    const freeStartAngle = endAngle;

    for (let i = 0; i < numDashes; i++) {
      const dashAngleStart =
        freeStartAngle +
        (i / numDashes) * (2 * Math.PI * (props.data[1] / 100));
      const dashAngleEnd = dashAngleStart + (Math.PI / numDashes) * 0.9; // Slight gap between dashes

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, dashAngleStart, dashAngleEnd);
      ctx.arc(
        centerX,
        centerY,
        innerRadius,
        dashAngleEnd,
        dashAngleStart,
        true
      );
      ctx.fillStyle = props.colors[1];
      ctx.fill();
    }
  }

  // Add percentage label in center
  ctx.font = "normal 9.5px Arial";
  ctx.fillStyle = "#000";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  // Label dimensions
  const labelX = centerX - 85;
  const labelY = centerY - 10;
  const labelWidth = 30;
  const labelHeight = 20;
  const borderRadius = 8; // Rounded corner radius

  // Draw label background (with rounded corners)
  ctx.fillStyle = "white";
  drawRoundedRect(ctx, labelX, labelY, labelWidth, labelHeight, borderRadius);
  ctx.fill();

  // Draw label text
  ctx.fillStyle = "#000";
  ctx.fillText(props.label, centerX - 60, centerY);
};

const drawRoundedRect = (ctx:any, x:any, y:any, width:any, height:any, radius:any)=>{
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

}

// Function to draw a rounded rectangle



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
//   const outerRadius = Math.min(centerX, centerY) - 5;
//   const innerRadius = outerRadius * 0.55; // Inner cutout size

//   let startAngle = -Math.PI / 2; // Start from top
//   let endAngle = startAngle + (props.data[0] / 100) * 2 * Math.PI; // Used space

//   // Draw Used Space (Solid)
//   ctx.beginPath();
//   ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
//   ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
//   ctx.fillStyle = props.colors[0];
//   ctx.fill();

//   // Draw Free Space (Dashed Effect)
//   if (props.dashedEffect) {
//     const numDashes = 50; // Number of radial dashes
//     const dashThickness = 3; // Thickness of each dash
//     const freeStartAngle = endAngle;

//     for (let i = 0; i < numDashes; i++) {
//       const dashAngleStart =
//         freeStartAngle +
//         (i / numDashes) * (2 * Math.PI * (props.data[1] / 100));
//       const dashAngleEnd = dashAngleStart + (Math.PI / numDashes) * 0.8; // Slight gap between dashes

//       ctx.beginPath();
//       ctx.arc(centerX, centerY, outerRadius, dashAngleStart, dashAngleEnd);
//       ctx.arc(
//         centerX,
//         centerY,
//         innerRadius,
//         dashAngleEnd,
//         dashAngleStart,
//         true
//       );
//       ctx.fillStyle = props.colors[1];
//       ctx.fill();
//     }
//   }

//   // Add percentage label in center
//   ctx.font = "semibold 14px Arial";
//   ctx.fillStyle = "#000";
//   ctx.textAlign = "right";
//   ctx.textBaseline = "middle";

//   // Draw label background (for better visibility)
//   ctx.fillStyle = "white";
//   ctx.fillRect(centerX -85, centerY - 10, 28, 20);

//   // Draw label text
//   ctx.fillStyle = "#000";
//   ctx.fillText(props.label, centerX-60, centerY);
// };

onMounted(drawChart);
watch(() => props.data, drawChart, { deep: true });
</script>
