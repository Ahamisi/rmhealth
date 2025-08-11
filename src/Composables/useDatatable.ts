import { ref, type Ref } from 'vue';
import type { ServerParams, FilterParams } from '@/types';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export function useDatatable (url: string, pageName: string) {
  const loading = ref(false);
  const items = ref([]);
  const currentPage = ref(1);
  const pagination = ref({
    links: [],
    from: 0,
    to: 0,
    total: 0,
    current_page: 1
  });

  const serverParams = ref<ServerParams>({
    searchTerm: "",
    sort: {
      field: "",
      type: "asc"
    },
    filter: {} as FilterParams,
    perPage: 10,
    from_date: "",
    to_date: "",
  });

  const currentFilters = ref({});
  const authStore = useAuthStore();

  const loadItems = async () => {
    loading.value = true;
    try {
      const response = await axios.get(url, {
        params: {
          ...serverParams.value,
          page: currentPage.value,
          current_branch: authStore.selectedBranch?.id || 1
        }
      });

      if (response.data.meta != undefined) {
        pagination.value = {
          ...response.data.meta,
        };
      } else {
        pagination.value.links = response.data.links;
        pagination.value.from = response.data.from;
        pagination.value.to = response.data.to;
        pagination.value.total = response.data.total;
        pagination.value.current_page = response.data.current_page;
      }

      items.value = response.data.data;

      // Update current filters
      for (const key in serverParams.value.filter) {
        currentFilters.value[key] = serverParams.value.filter[key];
      }
      currentFilters.value['to_date'] = serverParams.value.to_date;
      currentFilters.value['from_date'] = serverParams.value.from_date;

      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateParams = (newProps: Partial<ServerParams>) => {
    serverParams.value = Object.assign({}, serverParams.value, newProps);
    localStorage.setItem(`${pageName}Params`, JSON.stringify(serverParams.value));
  };

  const loadFromStorage = (filterFields: any = {}, searchable: boolean = true, filterByDate: boolean = false) => {
    const savedParamsString = localStorage.getItem(`${pageName}Params`);
    if (savedParamsString) {
      const savedParams = JSON.parse(savedParamsString) ?? {};
      serverParams.value = {
        ...serverParams.value,
        ...savedParams
      };

      if (!searchable) serverParams.value.searchTerm = "";

      if (filterByDate) {
        serverParams.value.from_date = savedParams.from_date || "";
        serverParams.value.to_date = savedParams.to_date || "";
      }

      if (Object.keys(filterFields).length > 0) {
        for (const key in filterFields) {
          if (serverParams.value.filter[key] == undefined) {
            serverParams.value.filter[key] = ["multi-select", "date-range"].includes(filterFields[key].type) ? [] : "";
          }
        }
      }
    }
  };

  const navigate = (page: number) => {
    currentPage.value = page;
    loadItems();
  };

  return {
    loading,
    items,
    pagination,
    currentPage,
    serverParams,
    currentFilters,
    loadItems,
    updateParams,
    loadFromStorage,
    navigate
  };
}
