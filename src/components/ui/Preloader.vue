<template>
  <div class="min-h-screen flex items-center justify-center relative" style="background-color: #f7f8f9;">
    <!-- Gradient at bottom -->
    <div class="absolute bottom-0 left-0 right-0 h-64" style="background: 
      radial-gradient(ellipse 800px 300px at 20% 100%, rgba(12, 102, 228, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 700px 300px at 90% 100%, rgba(163, 249, 78, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 400px 200px at 50% 100%, rgba(12, 102, 228, 0.1) 0%, transparent 50%)
    "></div>
    
    <!-- Preloader icon -->
    <div class="relative z-10">
      <img src="/icons/preloader.svg" alt="Loading..." class="w-16 h-16 animate-spin" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Preloader component for auth and other loading states
</script>

<style scoped>
@keyframes pulse {
  0%, 70%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  35% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.animate-pulse {
  animation: pulse 1.4s infinite ease-in-out both;
}
</style> 