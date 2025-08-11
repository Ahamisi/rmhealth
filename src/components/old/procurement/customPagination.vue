<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-center space-x-2 mt-6"
  >
    <!-- Previous Button -->
    <button
      @click="prevPage"
      :disabled="currentPage === 1"
      class="px-3 py-1 text-gray-500 font-bold disabled:text-gray-300"
    >
      <ChevronLeft class="h-5 w-5"></ChevronLeft>
    </button>

    <!-- Page Numbers -->
    <template v-for="(page, index) in pages" :key="index">
      <span v-if="page.isEllipsis" class="text-gray-500 px-2 py-1">...</span>
      <button
        v-else
        @click="changePage(page.number)"
        :class="[
          'px-2 py-1',
          currentPage === page.number
            ? 'text-[#0C66E4] font-medium bg-gray-100 rounded px-3 py-1'
            : 'text-gray-700',
        ]"
      >
        {{ page.number }}
      </button>
    </template>

    <!-- Next Button -->
    <button
      @click="nextPage"
      :disabled="currentPage === totalPages"
      class="px-3 py-1 text-gray-500 font-bold disabled:text-gray-300"
    >
      <ChevronRight class="h-5 w-5"></ChevronRight>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps({
  totalPages: Number,
  currentPage: Number,
});
const emit = defineEmits(["update:currentPage"]);

const changePage = (page) => {
  if (page !== props.currentPage) emit("update:currentPage", page);
};

const prevPage = () => {
  if (props.currentPage > 1) emit("update:currentPage", props.currentPage - 1);
};

const nextPage = () => {
  if (props.currentPage < props.totalPages)
    emit("update:currentPage", props.currentPage + 1);
};

const pages = computed(() => {
  const range = [];
  const maxVisible = 7; // Ensure this is an odd number

  if (props.totalPages <= maxVisible) {
    for (let i = 1; i <= props.totalPages; i++) {
      range.push({ number: i });
    }
    return range;
  }

  const sideWidth = Math.floor((maxVisible - 3) / 2);
  const leftBound = props.currentPage - sideWidth;
  const rightBound = props.currentPage + sideWidth;

  // Always show first page
  range.push({ number: 1 });

  if (props.currentPage > sideWidth + 2) {
    range.push({ isEllipsis: true });
  }

  if (leftBound > 2 && rightBound < props.totalPages - 1) {
    for (let i = leftBound; i <= rightBound; i++) {
      range.push({ number: i });
    }
  } else if (leftBound <= 2) {
    for (let i = 2; i <= maxVisible - 2; i++) {
      range.push({ number: i });
    }
  } else {
    for (
      let i = props.totalPages - (maxVisible - 3);
      i < props.totalPages;
      i++
    ) {
      range.push({ number: i });
    }
  }

  if (props.currentPage < props.totalPages - (sideWidth + 1)) {
    range.push({ isEllipsis: true });
  }

  // Always show last page
  range.push({ number: props.totalPages });

  return range;
});
</script>
