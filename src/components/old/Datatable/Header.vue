<template>
	<div class="flex items-center justify-between py-4" v-show="isSearchable || isFilterable || isSortable">
		<div class="flex border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm w-[281px] h-[34px]">
			<!-- Search Input -->
			<div class="flex items-center w-full gap-2 px-4 py-2 bg-gray-50" v-show="isSearchable">
				<LucideSearch class="w-4 h-4 text-gray-600" />
				<InputBox :model-value="filters.searchTerm" @update:modelValue="emit('onSearch', $event)"
					placeholder="Search"
					custom-styles="bg-transparent outline-none w-full text-sm text-gray-700 dataTableSearch border-2 border-[#091E4224]" />
			</div>

			<!-- Filter Dropdown -->
			<SearchDropdown :isOpen="modalTypeOpen == 'filter' && filterModalOpen" :toggle="() => toggleModal(`filter`)"
				:alignLeft="true" v-if="isFilterable">
				<template #trigger>
					<div class="flex items-center px-4 py-2 border-l-2 border-gray-300 bg-gray-50" title="Filter">
						<LucideListFilter class="w-4 h-4 text-gray-600" @click="filterModalOpen = true" />
					</div>
				</template>
				<div class="" @click.stop>
					<div @click.self="filterModalOpen = false" class="modal-container">
						<div class="px-6 mt-2">
							<h3 class="modal-title">Filter</h3>
						</div>

						<div class="border border-gray-200"></div>
						<div class="px-6 pb-4 space-y-4">
							<template v-if="filterByDate">
								<!-- Date Range Filters -->
								<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<label class="label">From</label>
										<div class="input-container">
											<input type="date" v-model="filters.filterValues.from_date"
												class="text-sm text-gray-500 bg-white input" ref="fromDateInputRef"
												@click="() => $refs.fromDateInputRef.showPicker ? $refs.fromDateInputRef.showPicker() : $refs.fromDateInputRef.focus()" />
										</div>
									</div>
									<div>
										<label class="label">To</label>
										<div class="input-container">
											<input type="date" v-model="filters.filterValues.to_date"
												class="text-sm text-gray-500 bg-white input" ref="toDateInputRef"
												@click="() => $refs.toDateInputRef.showPicker ? $refs.toDateInputRef.showPicker() : $refs.toDateInputRef.focus()" />
										</div>
									</div>
								</div>
							</template>
							<template v-for="filter in filterFields" :key="filter.field">
								<div>
									<label class="label">{{ filter.label }}</label>
									<div class="input-container" v-if="filter.type === 'text'">
										<input type="text" v-model="filters.filterValues[filter.field]"
											class="text-sm text-gray-500 bg-white input" />
									</div>
									<div class="input-container" v-if="filter.type === 'number'">
										<input type="number" v-model="filters.filterValues[filter.field]"
											class="text-sm text-gray-500 bg-white input" />
									</div>
									<div class="input-container" v-if="filter.type === 'date'">
										<input type="date" v-model="filters.filterValues[filter.field]"
											class="text-sm text-gray-500 bg-white input" />
									</div>
									<div class="input-container" v-if="filter.type === 'select'">
										<UiSelectField :model-value="filters.filterValues[filter.field]"
											@update:modelValue="filters.filterValues[filter.field] = $event"
											:options="filter.options"
											:placeholder="filter.placeholder ?? `All ${filter.label}`" class="text-sm"
											:reduce="(option) => option.id" />
									</div>
									<div class="input-container" v-if="filter.type === 'multi-select'">
										<v-select :options="filter.options" :multiple="true" label="name"
											:reduce="(option) => option.id"
											:placeholder="filter.placeholder ?? `All ${filter.label}`" />
									</div>
									<div class="input-container" v-if="filter.type === 'date-range'">
										<div class="grid grid-cols-2 gap-4">
											<div>
												<label class="label">From</label>
												<input type="date" v-model="filters.filterValues[filter.field][0]"
													class="text-sm text-gray-500 bg-white input" />
											</div>
											<div>
												<label class="label">To</label>
												<input type="date" v-model="filters.filterValues[filter.field][1]"
													class="text-sm text-gray-500 bg-white input" />
											</div>
										</div>
									</div>
								</div>
							</template>


							<!-- Buttons -->
							<div class="flex flex-wrap justify-between mt-4">
								<button class="btn-reset" @click="resetFilters">Reset all</button>
								<button class="btn-apply" @click="applyFilters">Apply</button>
							</div>
						</div>
					</div>
				</div>
			</SearchDropdown>

			<!-- Sort Dropdown -->
			<SearchDropdown :isOpen="modalTypeOpen == 'sort' && sortModalOpen" :toggle="() => toggleModal(`sort`)"
				:alignLeft="false" v-if="isSortable">
				<template #trigger>
					<div class="flex items-center px-4 py-2 border-l-2 border-gray-300 bg-gray-50">
						<LucideArrowUpDown class="w-4 h-4 text-gray-600" @click="sortModalOpen = true" />
					</div>
				</template>
				<div ref="sortRef" class="text-xs menu-container">
					<div v-for="(group, index) in filterGroups" :key="index" class="group"
						:class="index == 0 ? 'border-b' : ''">
						<ul class="sort-menu">
							<li v-for="item in group.items" class="flex items-center" :key="item.value"
								@click="selectOption(item.value)">
								<span class="group-title">
									<svg :style="{
										visibility:
											group.label === 'Sort Order'
												? item.value === sortOrder
													? 'visible'
													: 'hidden'
												: item.value === sortBy
													? 'visible'
													: 'hidden'
									}" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
										<circle cx="12" cy="12.5" r="2" fill="#626F86" />
									</svg>
								</span>
								<span class="medium-text text-text-subtle" :class="item.value !== 'name' &&
									item.value !== 'asc' &&
									item.value !== 'desc'
									? ''
									: ''
									">
									{{ item.label }}
								</span>
							</li>
						</ul>
					</div>
				</div>
			</SearchDropdown>

			<!-- Print Button -->
			<button type="button" class="flex items-center px-4 py-2 border-l-2 border-gray-300 bg-gray-50"
				@click="emit('print')" v-if="isPrintable">
				<LucidePrinter class="w-4 h-4 text-gray-600" />
			</button>

			<!-- Export Button -->
			<button type="button" class="flex items-center px-4 py-2 border-l-2 border-gray-300 bg-gray-50"
				@click="emit('export')" v-if="isExportable">
				<LucideDownload class="w-4 h-4 text-gray-600" />
			</button>

		</div>
		<div class="flex items-center gap-2 mx-2 filter_item_display_container">
			<template v-for="(objKey, index) in Object.keys(getAllFiltersApplied)">
				<!-- Show first 2 filters -->
				<div v-if="index < 2" :key="`filter_${objKey}`" class="w-fit">
					<section class="flex items-center py-[7px] h-full rounded-lg px-2 w-fit filter_item">
						<span class="label" v-if="objKey !== 'date_period'">{{ getLabel(objKey) }}:</span>
						<span class="flex-1 ml-1 mr-2">{{ getAppliedFilterValue(objKey, getAllFiltersApplied[objKey])
							}}</span>
						<button @click="resetFilterValue(objKey)">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M8.00027 7.05739L4.4716 3.52872C4.34587 3.40728 4.17747 3.34009 4.00267 3.3416C3.82787 3.34312 3.66066 3.41324 3.53706 3.53684C3.41345 3.66045 3.34334 3.82766 3.34182 4.00245C3.3403 4.17725 3.4075 4.34565 3.52894 4.47139L7.05761 8.00005L3.52894 11.5287C3.4075 11.6545 3.3403 11.8229 3.34182 11.9977C3.34334 12.1725 3.41345 12.3397 3.53706 12.4633C3.66066 12.5869 3.82787 12.657 4.00267 12.6585C4.17747 12.66 4.34587 12.5928 4.4716 12.4714L8.00027 8.94272L11.5289 12.4714C11.6547 12.5928 11.8231 12.66 11.9979 12.6585C12.1727 12.657 12.3399 12.5869 12.4635 12.4633C12.5871 12.3397 12.6572 12.1725 12.6587 11.9977C12.6602 11.8229 12.593 11.6545 12.4716 11.5287L8.94294 8.00005L12.4716 4.47139C12.5353 4.40989 12.5861 4.33633 12.621 4.25499C12.6559 4.17365 12.6743 4.08617 12.6751 3.99766C12.6759 3.90914 12.659 3.82135 12.6255 3.73942C12.592 3.65749 12.5425 3.58305 12.4799 3.52046C12.4173 3.45786 12.3428 3.40836 12.2609 3.37484C12.179 3.34132 12.0912 3.32445 12.0027 3.32522C11.9142 3.32599 11.8267 3.34438 11.7453 3.37932C11.664 3.41426 11.5904 3.46505 11.5289 3.52872L8.00027 7.05739Z"
								fill="#44546F" />
						</svg>
						</button>
					</section>
				</div>

				<!-- Show "+N more" as a third chip -->
				<div v-else-if="index === 2" :key="'filter_more'" class="w-fit">
					<section
						class="flex items-center py-[7px] h-full rounded-lg px-2 w-fit filter_item">
						+{{ Object.keys(getAllFiltersApplied).length - 2 }} more
					</section>
				</div>
			</template>
		</div>
		<!-- Button placeholder -->
		<slot name="header-button"></slot>
	</div>
</template>

<script setup lang="ts">
import {
	LucideSearch,
	LucideFilter,
	LucideArrowUpDown,
	LucideListFilter,
	LucidePrinter,
	LucideDownload
} from "lucide-vue-next";
import {  ref, computed, PropType  } from "vue";
import { useDropdown } from "@/Composables/procurement/useDropdown";
import InputBox from "@/components/old/procurement/InputBox.vue";
import { useFilterModal } from "@/Composables/procurement/useFilterModal";
import SearchDropdown from "@/components/old/procurement/SearchDropdown.vue";
import UiSelectField from "@/components/old/procurement/ui/SelectField.vue";
import vSelect from "vue-select";
import { onClickOutside } from "@vueuse/core";
import dayjs from "dayjs";
import type { TableColumn, FilterFields, FilterField, SortParams } from "@/types";

defineOptions({
	name: "DatatableHeader"
});

const props = defineProps({
	searchTerm: {
		type: String,
		default: ""
	},
	sortBy: {
		type: String,
		default: ""
	},
	sortOrder: {
		type: String,
		default: ""
	},
	sortableColumns: {
		type: Array as PropType<TableColumn[]>,
		default: []
	},
	filterFields: {
		type: Object as PropType<FilterFields<FilterField>>,
		default: () => ({})
	},
	filterByDate: {
		type: Boolean,
		default: false
	},
	isSearchable: {
		type: Boolean,
		default: true
	},
	isPrintable: {
		type: Boolean,
		default: false
	},
	isExportable: {
		type: Boolean,
		default: false
	},
	filterValues: {
		type: Object as PropType<Record<string, any>>,
		default: () => ({})
	}
});

const emit = defineEmits([
	"onSearch",
	"onFilterChange",
	"print",
	"export",
	"onSortChange"
]);

const filters = ref({
	searchTerm: props.searchTerm,
	sortBy: props.sortBy,
	sortOrder: props.sortOrder || "asc",
	filterValues: props.filterValues as Record<string, any>
});
const appliedFilters = ref<Record<string, any>>({});

const { isOpen, toggle } = useDropdown();
const { modalTypeOpen, toggleModal, ModalTypes } = useFilterModal();

const isFilterable = computed<boolean>(() => {
	return props.filterByDate || Object.keys(props.filterFields).length > 0;
});

const isSortable = computed<boolean>(() => {
	return props.sortableColumns.length > 0;
});

const filterModalOpen = ref<boolean>(false);
const sortModalOpen = ref<boolean>(false);

const resetFilters = (): void => {
	filters.value.filterValues = {};
	appliedFilters.value = {};
	for (const key in props.filterFields) {
		filters.value.filterValues[key] = ["multi-select", "date-range"].includes(props.filterFields[key].type) ? [] : "";
	}
	emit("onFilterChange", filters.value.filterValues);
}

const applyFilters = (): void => {
	const filterData = { ...filters.value.filterValues };
	appliedFilters.value = filterData; // <- Track applied filters
	emit("onFilterChange", filterData);
};

const sortRef = ref<HTMLElement | null>(null);

const filterGroups = [
	{
		label: "Sort By",
		items: props.sortableColumns.map(column => ({ label: column.label, value: column.field })),
	},
	{
		label: "Sort Order",
		items: [
			{ label: "Ascending", value: "asc" },
			{ label: "Descending", value: "desc" },
		],
	},
];

const selectOption = (value: string): void => {
	if (value === "asc" || value === "desc") {
		filters.value.sortOrder = value;
	} else {
		filters.value.sortBy = value;
	}
	emit('onSortChange', {
		field: filters.value.sortBy,
		type: filters.value.sortOrder
	} as SortParams)
};

onClickOutside(sortRef, (): void => {
	sortModalOpen.value = false;
});

const getLabel = (filter_key: string): string => {
	const field = props.filterFields[filter_key];
	if (field) {
		return field.label || filter_key.charAt(0).toUpperCase() + filter_key.slice(1);
	}
	return filter_key.charAt(0).toUpperCase() + filter_key.slice(1);
};

const getAllFiltersApplied = computed(() => {
	const applied = Object.fromEntries(
		Object.entries(appliedFilters.value).filter(
			([_, value]) => value !== undefined && value !== null && value !== ''
		)
	);

	if (applied.from_date || applied.to_date) {
		applied.date_period = {
			from: applied.from_date,
			to: applied.to_date
		};
		delete applied.from_date;
		delete applied.to_date;
	}

	return applied;
});

const getAppliedFilterValue = (key, value) => {
	if (key === 'date_period') {
		if (value.from && value.to) {
			return `Date Period: ${dayjs(value.from).format('DD MMM, YYYY')} to ${dayjs(value.to).format('DD MMM, YYYY')}`;
		} else if (value.from) {
			return `Start Date: ${dayjs(value.from).format('DD MMM, YYYY')}`;
		} else if (value.to) {
			return `End Date: ${dayjs(value.to).format('DD MMM, YYYY')}`;
		}
		return '';
	}

	if (props.filterFields[key]) {
		return props.filterFields[key]?.options?.find(opt => opt.id == value)?.name ?? value;
	}

	return value;
};

const resetFilterValue = (key) => {
	const updated = { ...filters.value.filterValues };

	if (key === 'date_period') {
		updated.from_date = '';
		updated.to_date = '';

		// Remove from appliedFilters as well
		const { from_date, to_date, ...rest } = appliedFilters.value;
		appliedFilters.value = rest;
	} else {
		delete updated[key];

		// Remove key from appliedFilters
		const { [key]: removed, ...rest } = appliedFilters.value;
		appliedFilters.value = rest;
	}

	filters.value.filterValues = updated;

	emit("onFilterChange", { ...updated });
};

</script>

<style scoped>
.modal-overlay {
	@apply fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50;
}

.modal-container {
	@apply bg-white shadow-lg rounded-lg md:w-[427px] w-[76vw] space-y-4;
}

.modal-title {
	@apply font-semibold mb-4 text-gray-600;
}

.label {
	@apply block mb-1;
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	color: rgba(68, 84, 111, 1);
	line-height: 16px;
}

.input {
	@apply w-full px-3 py-2 border-[2px] border-gray-300 rounded-md;
}

.input:focus {
	border-color: rgba(12, 102, 228, 1);
	color: rgba(23, 43, 77, 1)
}

.input-container {
	@apply relative;
}

.icon {
	@apply absolute top-2 right-2 text-gray-600 w-5 h-5;
}

.btn-reset {
	@apply bg-gray-200 px-4 py-2 rounded-md text-gray-600 text-xs;
}

.btn-apply {
	@apply bg-blue-600 px-4 py-2 rounded-md text-white text-xs;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.menu-container {
	@apply bg-white shadow-lg rounded-md w-fit py-0.5 border border-gray-200;
	min-width: 12.5em;
}

.group {
	/* @apply py-2; */
}

.group-title {
	@apply text-gray-500 font-medium;
}

ul.sort-menu {
	@apply divide-gray-100;
}

.sort-menu li {
	@apply py-2 pr-4 cursor-pointer hover:bg-gray-100;
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: 18px;
	color: rgba(23, 43, 77, 1);
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}


/* .multi_select_item {
    
} */

/* .filter_item_display_container .filter_item .label{
	} */
.filter_item_display_container .filter_item .label {
	color: rgba(23, 43, 77, 1);
	margin-bottom: 0;
}

.filter_item_display_container .filter_item {
	border: 2px solid rgba(9, 30, 66, 0.14);
	font-size: 12px;
	font-style: normal;
	font-weight: 590;
	line-height: 16px;
	letter-spacing: -0.25px;
	color: rgba(98, 111, 134, 1);
}
</style>
