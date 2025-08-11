<template>
  <div>
    <!-- <SimpleHeader
      :searchTerm="searchTerm"
      :sortBy="sortBy"
      :sortOrder="sortOrder"
      :sortableColumns="props.columns.filter(col => col.sortable)"
      :isSearchable="props.searchable"
      :isPrintable="props.printable"
      :isExportable="props.exportable"
      :filterEnabled="props.filterEnabled"
      @search="onSearch"
      @sort="onSortChange"
      @export="handleExport"
      @print="handlePrint"
      @filter="handleFilter"

    /> -->
    <Table
      :columns="columns"
      :items="paginatedItems"
      :loading="loading"
      :serverParams="serverParams"
      :pageName="'dashboard'"
      :tableId="'dashboard-table'"
      @sort="onSortChange"
    >
      <template v-for="(_, slot) in $slots" v-slot:[slot]="slotProps">
        <slot :name="slot" v-bind="slotProps" />
      </template>
    </Table>
    <customPagination
      v-if="pagination.total > 0"
      :pagination="pagination"
      @navigate="navigate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SimpleHeader from '@/components/ui/SimpleHeader.vue'
import Table from '@/components/old/Datatable/Table.vue'
import customPagination from '@/components/old/procurement/customPagination.vue'
import type { TableColumn, FilterField, FilterFields, PaginationData, ServerParams } from '@/types/datatable'

interface Props {
  data: any[]
  columns: TableColumn[]
  searchable?: boolean
  printable?: boolean
  exportable?: boolean
  filterEnabled?: boolean
  filterByDate?: boolean
  filterFields?: FilterFields<FilterField>
  perPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  searchable: true,
  printable: false,
  exportable: false,
  filterEnabled: false,
  filterByDate: false,
  filterFields: () => ({}),
  perPage: 10
})

const emit = defineEmits<{
  loaded: []
  onSearch: [searchTerm: string]
  onFilter: [filters: any]
  onSort: [sort: { field: string; type: 'asc' | 'desc' }]
}>()

// State
const loading = ref(false)
const searchTerm = ref('')
const sortBy = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const filterValues = ref<Record<string, any>>({})

// Computed filtered and sorted data
const filteredData = computed(() => {
  let result = [...props.data]

  // Apply search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    result = result.filter(item => {
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(search)
      )
    })
  }

  // Apply custom filters (you can extend this based on filterFields)
  Object.entries(filterValues.value).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      result = result.filter(item => {
        // Add custom filter logic here based on field types
        return String(item[key]).toLowerCase().includes(String(value).toLowerCase())
      })
    }
  })

  // Apply sorting
  if (sortBy.value) {
    result.sort((a, b) => {
      const aValue = a[sortBy.value]
      const bValue = b[sortBy.value]
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortOrder.value === 'asc' ? comparison : -comparison
      }
      
      return 0
    })
  }

  return result
})

// Pagination
const pagination = computed((): PaginationData => {
  const total = filteredData.value.length
  const lastPage = Math.ceil(total / props.perPage)
  const from = (currentPage.value - 1) * props.perPage + 1
  const to = Math.min(currentPage.value * props.perPage, total)

  return {
    current_page: currentPage.value,
    last_page: lastPage,
    per_page: props.perPage,
    total,
    from: total > 0 ? from : 0,
    to: total > 0 ? to : 0
  }
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * props.perPage
  const end = start + props.perPage
  return filteredData.value.slice(start, end)
})

// ServerParams for the old table component
const serverParams = computed((): ServerParams => ({
  searchTerm: searchTerm.value,
  sort: {
    field: sortBy.value,
    type: sortOrder.value
  },
  filterValues: filterValues.value,
  page: currentPage.value,
  perPage: props.perPage
}))

// Note: Using SimpleHeader instead of complex old header

// Event handlers
const onSearch = (term: string) => {
  searchTerm.value = term
  currentPage.value = 1 // Reset to first page on search
  emit('onSearch', term)
}

const onFilterChange = (filters: any) => {
  filterValues.value = filters
  currentPage.value = 1 // Reset to first page on filter
  emit('onFilter', filters)
}

const onSortChange = (sort: { field: string; type: 'asc' | 'desc' }) => {
  sortBy.value = sort.field
  sortOrder.value = sort.type
  emit('onSort', sort)
}

const navigate = (page: number) => {
  currentPage.value = page
}

const handleExport = () => {
  // Simple CSV export
  const csvContent = [
    // Header row
    props.columns.map(col => col.label).join(','),
    // Data rows
    ...filteredData.value.map(row => 
      props.columns.map(col => row[col.field] || '').join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'export.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handlePrint = () => {
  window.print()
}

const handleFilter = () => {
  // Emit filter event for parent to handle
  emit('onFilter', {})
}

// Watch for data changes and emit loaded
watch(() => props.data, () => {
  emit('loaded')
}, { immediate: true })
</script> 