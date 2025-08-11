import { computed, ref, watch, Ref } from "vue"

export const usePagination = (items: Ref<any[]>, perPage = 10) => {
    const page = ref(1)
  
    const paginatedItems = computed(() =>
      items.value.slice((page.value - 1) * perPage, page.value * perPage)
    )
  
    const totalPages = computed(() => Math.ceil(items.value.length / perPage))

    watch(
  ()=>page.value,
  ()=>console.log(paginatedItems)
)
  
    return { page, paginatedItems, totalPages }
  }
  