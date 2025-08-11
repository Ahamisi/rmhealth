<script setup>
import { LucideBell, LucideMessageCircle, LucideUserCircle2 } from 'lucide-vue-next'

const branch = ref('Lagos Branch')
</script>

<template>
  <div class="bg-white shadow-md flex justify-between items-center px-6 py-4">
    <!-- Left Side -->
    <div class="flex items-center gap-4">
      <img src="/icons/remedial-icon.svg" alt="PROCUREMENT" class="w-40" />
      <select v-model="branch" class="border rounded p-2 focus:ring outline-none">
        <option>Lagos Branch</option>
        <option>Abuja Branch</option>
        <option>Port Harcourt</option>
      </select>
    </div>

    <!-- Right Side Icons -->
    <div class="flex items-center gap-6">
      <LucideBell class="cursor-pointer w-6 h-6 text-gray-600 hover:text-blue-600" />
      <LucideMessageCircle class="cursor-pointer w-6 h-6 text-gray-600 hover:text-blue-600" />
      <LucideUserCircle2 class="cursor-pointer w-8 h-8 text-gray-600" />
    </div>
  </div>
</template>
