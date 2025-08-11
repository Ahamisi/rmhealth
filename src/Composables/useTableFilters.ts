import type { Ref } from 'vue';
import type { ServerParams, SortParams, FilterParams, TableColumn } from '@/types';

export function useTableFilters (
  serverParams: Ref<ServerParams>,
  updateParams: (newProps: Partial<ServerParams>) => void,
  loadItems: () => Promise<any>
) {
  const onSearch = (value: string) => {
    updateParams({ searchTerm: value });
    loadItems();
  };

  const onFilterChange = (filterValues: FilterParams) => {
    const filters = { ...filterValues };

    if (filters.from_date != undefined) {
      updateParams({ from_date: filters.from_date });
      delete filters.from_date;
    }
    if (filters.to_date != undefined) {
      updateParams({ to_date: filters.to_date });
      delete filters.to_date;
    }
    updateParams({ filter: filters });
    loadItems();
  };

  const onSortChange = (sort: SortParams) => {
    updateParams({ sort: { field: sort.field, type: sort.type } });
    loadItems();
  };

  const sort = (column: TableColumn) => {
    if (column.sortable) {
      onSortChange({
        field: column.field,
        type: serverParams.value.sort.type === 'asc' ? 'desc' : 'asc'
      });
    }
  };

  return {
    onSearch,
    onFilterChange,
    onSortChange,
    sort
  };
}
