<script setup>
const props = defineProps({
  totalPages: Number,
  page: Number
})

const emit = defineEmits(['changePage'])

const next = () => {
  if (props.page < props.totalPages) emit('changePage', props.page + 1)
}

const prev = () => {
  if (props.page > 1) emit('changePage', props.page - 1)
}
</script>

<template>
  <div class="flex justify-between mt-6 items-center">
    <button
      @click="prev"
      :disabled="page === 1"
      class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:opacity-75 disabled:bg-lightBlack"
    >
      Previous
    </button>

    <span class="text-sm text-gray-600">
      Page {{ page }} of {{ totalPages }}
    </span>

    <button
      @click="next"
      :disabled="page === totalPages"
      class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:opacity-75 disabled:bg-lightBlack"
    >
      Next
    </button>
  </div>
</template>
