import { computed, ref } from "vue";

interface Named {
  supplierName: string;
}

export const useFilter = (toFilter: Ref<Named[]>) => {
  const search = ref("");
  const selectedStatus = ref("");
  

  // Combined Filter
  const filtered = computed(() =>
    toFilter.value.filter((item) => {
      // Search filter
      const matchesSearch = item.supplierName
        .toLowerCase()
        .includes(search.value.toLowerCase());

        return matchesSearch;
      // Status filter
      // const matchesStatus =
      //   !selectedStatus.value || supplier.status.toLowerCase() === selectedStatus.value.toLowerCase();
      // return matchesSearch && matchesStatus;
    })
  );

  return { search, selectedStatus, filtered };
};
