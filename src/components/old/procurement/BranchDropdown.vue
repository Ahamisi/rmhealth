<script setup>
const branches = ['Lagos Branch', 'Abuja Branch', 'Port Harcourt']
const selectedBranch = ref(branches[0])
</script>

<template>
  <select v-model="selectedBranch" class="p-2 rounded border focus:ring">
    <option v-for="branch in branches" :key="branch">{{ branch }}</option>
  </select>
</template>
