<template>
	<div>
		<div class="flex flex-wrap items-baseline justify-between gap-3">
			<div class="flex flex-wrap">
				<slot name="header_search"></slot>
				<DatatableHeader :key="childKey" v-bind="headerProps" @onSearch="onSearchWithEmit"
					@onFilterChange="onFilterChangeWithEmit" @print="handlePrint" @export="handleDownload"
					@onSortChange="onSortChangeWithEmit" />
			</div>
			<slot name="header_actions"></slot>
		</div>

		<div class="">
			<div class="">
				<!-- <div v-if="loading" class="h-[500px]">
					<LoadingState></LoadingState>
				</div> -->
				<!-- <div v-else> -->
				<div>
					<DatatableTable :items="items" :columns="columns" :server-params="serverParams" :loading="loading"
						:page-name="pageName" :table-id="`table-${_uid}`" @sort="sort">
						<template #tableHeader>
							<slot name="tableHeader" />
						</template>
						<template #tableRow="{ row }">
							<slot name="tableRow" :row="row" />
						</template>
						<template #column="slotProps">
							<slot name="column" v-bind="slotProps" />
						</template>
					</DatatableTable>
					<CustomPagination v-model:currentPage="currentPage" :totalPages="pagination.total" :key="childKey"
						@update:current-page="navigate" />
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import DatatableHeader from "./Header.vue";
import { ref, computed, PropType, onMounted, useId } from "vue";
import type { TableColumn, FilterFields, FilterField } from "@/types";
import { useToast } from "vue-toastification";
import LoadingState from "@/Components/procurement/state/LoadingState.vue";
import CustomPagination from "@/Components/procurement/customPagination.vue";
import { useDatatable } from "@/Composables/useDatatable";
import { useTableFilters } from "@/Composables/useTableFilters";
import { TableExporter } from "@/Composables/tableExporter";
import DatatableTable from "./Table.vue";

defineOptions({
	name: "Datatable"
});

const props = defineProps({
	filterByDate: {
		type: Boolean,
		default: false
	},
	searchable: {
		type: Boolean,
		default: true
	},
	printable: {
		type: Boolean,
		default: false
	},
	exportable: {
		type: Boolean,
		default: false
	},
	columns: {
		type: Array as PropType<TableColumn[]>,
		default: () => []
	},
	filterFields: {
		type: Object as PropType<FilterFields<FilterField>>,
		default: () => ({})
	},
	pageName: {
		type: String,
		default: ""
	},
	url: {
		type: String,
		required: true
	}
});

const emit = defineEmits(['loaded', 'onSearch', 'onFilter', 'onSort']);

const childKey = ref(21111);
const toast = useToast();
const _uid = useId();

// Use composables
const {
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
} = useDatatable(props.url, props.pageName);

const {
	onSearch,
	onFilterChange,
	onSortChange,
	sort
} = useTableFilters(serverParams, updateParams, loadItems);

// Computed props for header
const sortableColumns = computed(() => {
	return props.columns.filter(column => column.sortable);
});

const headerProps = computed(() => ({
	searchTerm: serverParams.value.searchTerm,
	sortBy: serverParams.value.sort.field,
	sortOrder: serverParams.value.sort.type,
	sortableColumns: sortableColumns.value,
	filterFields: props.filterFields,
	filterByDate: props.filterByDate,
	isSearchable: props.searchable,
	isPrintable: props.printable,
	isExportable: props.exportable,
	filterValues: currentFilters.value
}));

// Handlers
const handlePrint = () => {
	TableExporter.print(`table-${_uid}`);
};

const handleDownload = async () => {
	try {
		await TableExporter.downloadData(props.url, serverParams.value, props.pageName);
	} catch (error) {
		toast.error("Error downloading data! " + TableExporter.onError(error));
	}
};

// Enhanced loadItems with emit
const loadItemsWithEmit = async () => {
	try {
		await loadItems();
		childKey.value++;
		emit('loaded');
	} catch (error) {
		toast.error("Error loading data! " + TableExporter.onError(error));
	}
};

// Override the loadItems from composable to include emit
const originalOnSearch = onSearch;
const originalOnFilterChange = onFilterChange;
const originalOnSortChange = onSortChange;

const onSearchWithEmit = (value: string) => {
	originalOnSearch(value);
	emit('onSearch', value);
};

const onFilterChangeWithEmit = (filterValues: any) => {
	originalOnFilterChange(filterValues);
	emit('onFilter', filterValues);
};

const onSortChangeWithEmit = (sortParams: any) => {
	originalOnSortChange(sortParams);
	emit('onSort', sortParams);
};

onMounted(() => {
	loadFromStorage(props.filterFields, props.searchable, props.filterByDate);
	loadItemsWithEmit();
});
</script>
<style>
table.w-full.table-auto thead tr.text-center.medium-text {
	text-align: left;
}

table.w-full.table-auto tbody tr {
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	line-height: 16px;
	color: rgba(68, 84, 111, 1);
}

table.w-full.table-auto tbody tr td {
	text-align: left;
}
</style>
