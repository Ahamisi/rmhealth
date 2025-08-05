<template>
  <div class="overflow-x-auto border border-gray-200 rounded-lg">
    <table class="w-full text-sm text-left">
      <thead class="text-gray-600" style="background-color: #F7F8F9;">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-4 py-3 font-medium border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors select-none"
            :class="{ 'bg-gray-100': sortBy === column.key }"
            @click="handleSort(column.key)"
          >
            <div class="flex items-center justify-between">
              <span>{{ column.label }}</span>
              <div v-if="column.sortable === true" class="ml-2 flex flex-col">
                <!-- Sort Icons -->
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  xmlns="http://www.w3.org/2000/svg"
                  :class="getSortIconClass(column.key, 'asc')"
                >
                  <path d="M7 14L12 9L17 14H7Z"/>
                </svg>
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  xmlns="http://www.w3.org/2000/svg"
                  :class="getSortIconClass(column.key, 'desc')"
                  style="margin-top: -2px;"
                >
                  <path d="M7 10L12 15L17 10H7Z"/>
                </svg>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-for="(item, index) in sortedData" :key="index" class="hover:bg-gray-50">
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-4 py-3 text-gray-700"
          >
            <slot :name="`cell(${column.key})`" :value="item[column.key]" :item="item">
              {{ item[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
}

const props = defineProps<DataTableProps>();

const sortBy = ref<string>('');
const sortOrder = ref<'asc' | 'desc'>('asc');

const handleSort = (columnKey: string) => {
  if (sortBy.value === columnKey) {
    // Toggle sort order
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Set new sort column
    sortBy.value = columnKey;
    sortOrder.value = 'asc';
  }
};

const getSortIconClass = (columnKey: string, direction: 'asc' | 'desc') => {
  if (sortBy.value === columnKey && sortOrder.value === direction) {
    return 'text-primary-600';
  }
  return 'text-gray-400';
};

const sortedData = computed(() => {
  if (!sortBy.value) return props.data;
  
  return [...props.data].sort((a, b) => {
    let aValue = a[sortBy.value];
    let bValue = b[sortBy.value];
    
    // Handle numeric values
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // Handle string values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
      
      if (sortOrder.value === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    }
    
    return 0;
  });
});
</script> 