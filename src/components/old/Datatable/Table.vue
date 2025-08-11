<template>
	<div class="bg-white border text-lightBlack border-[#091E4224] rounded-xl shadow-sm overflow-x-auto">
		<table class="w-full table-auto" :id="tableId">
			<thead>
				<tr class="text-left bg-gray-100" style="font-size: 12px; color: #172B4D; font-weight: 500;">
					<slot name="tableHeader">
						<template v-for="column in columns" :key="`th-${column.field}-${pageName}`">
							<!-- :class="{ 'cursor-pointer': column.sortable, 'p-2': true }" -->
							<th @click="handleSort(column)" :class="[
								'p-3 text-left',
								column.sortable ? 'cursor-pointer' : '',
								column.field === 'action' || column.field === 'actions' ? 'w-[100px] text-center' : ''
							]">
								<span class="inline-flex items-center text-left">
									{{ column.label }}
									<svg v-if="column.sortable && serverParams.sort.field != column.field" class="inline w-[12px] ml-1" viewBox="0 0 24 24" fill="none">
										<path d="M7 14L12 9L17 14H7Z" fill="#091E42" fill-opacity="0.31"/>
										<path d="M7 10L12 15L17 10H7Z" fill="#091E42" fill-opacity="0.31"/>
									</svg>
									<span class="inline ml-1"
										v-else-if="column.sortable && serverParams.sort.field == column.field && serverParams.sort.type == 'asc'">
										<svg width="11" height="16" viewBox="0 0 11 16" fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path d="M8.19922 7H2.19922L5.19922 4L8.19922 7Z" fill="#091E42"
												fill-opacity="0.31" />
										</svg>
									</span>
									<span class="inline w-[12px] ml-1"
										v-else-if="column.sortable && serverParams.sort.field == column.field && serverParams.sort.type == 'desc'">
										<svg width="11" height="16" viewBox="0 0 11 16" fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path d="M8.19922 9H2.19922L5.19922 12L8.19922 9Z" fill="#091E42"
												fill-opacity="0.31" />
										</svg>
									</span>
								</span>
							</th>
						</template>
					</slot>
				</tr>
			</thead>
			<!-- <tbody class="medium-text">
				<tr v-for="row in items" :key="`${row.id}-${pageName}`"
					class="relative text-left text-gray-500 border-b hover:bg-gray-50">
					<slot name="tableRow" :row="row">
						<td v-for="column in columns" :key="`td-${column.field}-${pageName}`" class="p-3">
							<slot name="column" :props="{ row, column, formattedRow: formattedRow(row, columns) }">
								{{ getColumnValue(row, column) }}
							</slot>
						</td>
					</slot>
				</tr>
			</tbody> -->
			<tbody class="medium-text">
				<!-- Show loader if loading -->
				<tr v-if="loading">
					<td :colspan="columns.length" class="py-20 text-center">
						<slot name="loading">
							<div class="flex flex-col items-center justify-center space-y-2 min-h-[40vh]">
								<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
								<p class="font-medium text-gray-600">Loading data</p>
								<p class="text-sm text-gray-400">Please wait while we fetch your data</p>
							</div>
						</slot>
					</td>
				</tr>
				<!-- show for empty data -->
				<tr v-if="!loading && items.length == 0">
					<td :colspan="columns.length" class="py-20 text-center">
						<slot name="loading">
							<div class="flex flex-col items-center justify-center h-[30vh] space-y-2"
								v-if="!serverParams.searchTerm">
								<svg width="36" height="36" viewBox="0 0 36 36" fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M4 32H32V4H4V32ZM0 3.99C0 1.786 1.786 0 3.99 0H32.01C34.214 0 36 1.786 36 3.99V32.01C36 33.0682 35.5796 34.0831 34.8314 34.8314C34.0831 35.5796 33.0682 36 32.01 36H3.99C2.93179 36 1.91691 35.5796 1.16864 34.8314C0.420374 34.0831 0 33.0682 0 32.01V3.99Z"
										fill="#44546F" />
									<path fill-rule="evenodd" clip-rule="evenodd"
										d="M12.34 28H2V31C2 31.3948 2.07792 31.7857 2.22931 32.1504C2.3807 32.515 2.60258 32.8462 2.88221 33.1249C3.16185 33.4036 3.49375 33.6243 3.85888 33.7745C4.22401 33.9247 4.61519 34.0013 5.01 34H30.99C32.666 34 34 32.656 34 31V28H23.66C23.2468 29.1711 22.4805 30.1851 21.4668 30.9024C20.4531 31.6197 19.2418 32.0049 18 32.0049C16.7582 32.0049 15.5469 31.6197 14.5332 30.9024C13.5195 30.1851 12.7532 29.1711 12.34 28ZM8 18H28V22H8V18ZM8 10H28V14H8V10Z"
										fill="#44546F" />
								</svg>

								<p class="font-medium text-gray-600">No data available</p>
								<!-- <p class="text-sm text-gray-400">Please wait while we fetch your data</p> -->
							</div>
							<div class="flex flex-col items-center justify-center h-[30vh] space-y-2" v-else>
								<svg width="36" height="48" viewBox="0 0 36 48" fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M14.5639 21.438C14.4244 21.2985 14.2589 21.1879 14.0766 21.1124C13.8944 21.037 13.6991 20.9981 13.5019 20.9981C13.3047 20.9981 13.1094 21.037 12.9271 21.1124C12.7449 21.1879 12.5794 21.2985 12.4399 21.438C12.3004 21.5775 12.1898 21.743 12.1143 21.9253C12.0388 22.1075 12 22.3028 12 22.5C12 22.6972 12.0388 22.8925 12.1143 23.0748C12.1898 23.257 12.3004 23.4225 12.4399 23.562L15.8809 27L12.4399 30.438C12.1582 30.7197 12 31.1017 12 31.5C12 31.8983 12.1582 32.2803 12.4399 32.562C12.7216 32.8437 13.1036 33.0019 13.5019 33.0019C13.9002 33.0019 14.2822 32.8437 14.5639 32.562L18.0019 29.121L21.4399 32.562C21.7216 32.8437 22.1036 33.0019 22.5019 33.0019C22.9002 33.0019 23.2822 32.8437 23.5639 32.562C23.8456 32.2803 24.0038 31.8983 24.0038 31.5C24.0038 31.1017 23.8456 30.7197 23.5639 30.438L20.1229 27L23.5639 23.562C23.8456 23.2803 24.0038 22.8983 24.0038 22.5C24.0038 22.1017 23.8456 21.7197 23.5639 21.438C23.2822 21.1563 22.9002 20.9981 22.5019 20.9981C22.1036 20.9981 21.7216 21.1563 21.4399 21.438L18.0019 24.879L14.5639 21.438Z"
										fill="#44546F" />
									<path
										d="M36 42V13.5L22.5 0H6C4.4087 0 2.88258 0.632141 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6V42C0 43.5913 0.632141 45.1174 1.75736 46.2426C2.88258 47.3679 4.4087 48 6 48H30C31.5913 48 33.1174 47.3679 34.2426 46.2426C35.3679 45.1174 36 43.5913 36 42ZM22.5 9C22.5 10.1935 22.9741 11.3381 23.818 12.182C24.6619 13.0259 25.8065 13.5 27 13.5H33V42C33 42.7957 32.6839 43.5587 32.1213 44.1213C31.5587 44.6839 30.7957 45 30 45H6C5.20435 45 4.44129 44.6839 3.87868 44.1213C3.31607 43.5587 3 42.7957 3 42V6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3H22.5V9Z"
										fill="#44546F" />
								</svg>
								<p class="font-medium text-gray-600 alert_text">No results found for “{{ serverParams.searchTerm }}”</p>
								<p class="text-sm text-gray-400 detail_text">We couldn’t find any matching result for
									your search.
									Try adjusting your search terms or filters</p>
							</div>
						</slot>
					</td>
				</tr>

				<!-- Render rows if not loading and there is data -->
				<tr v-else-if="!loading && items.length > 0" v-for="row in items" :key="`${row.id}-${pageName}`"
					class="relative text-left border-b hover:bg-gray-50" style="color: #44546F; font-size: 13px;">
					<slot name="tableRow" :row="row">
						<td v-for="column in columns" :key="`td-${column.field}-${pageName}`" class="p-3">
							<slot name="column" :props="{ row, column, formattedRow: formattedRow(row, columns) }">
								{{ getColumnValue(row, column) }}
							</slot>
						</td>
					</slot>
				</tr>
			</tbody>

		</table>
	</div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { computed } from 'vue';
import type { TableColumn, ServerParams } from '@/types/datatable';
// import UpDownIcon from "@/components/old/procurement/icons/UpDownIcon.vue"; // Commented out for now
import _ from 'lodash';
// import LoadingState from '../procurement/state/LoadingState.vue'; // Commented out for now
defineOptions({
	name: "DatatableTable"
});

const props = defineProps({
	items: {
		type: Array as PropType<Record<string, any>[]>,
		default: () => []
	},
	columns: {
		type: Array as PropType<TableColumn[]>,
		default: () => []
	},
	serverParams: {
		type: Object as PropType<ServerParams>,
		required: true
	},
	pageName: {
		type: String,
		default: ""
	},
	tableId: {
		type: String,
		required: true
	},
	loading: {
		type: Boolean,
		default: false
	}

});

const emit = defineEmits(['sort']);


const hasActionColumn = computed(() => props.columns.some((col) => col.field === 'action' || col.field === 'actions'));

const handleSort = (column: TableColumn) => {
	emit('sort', column);
};

const formattedRow = (row: Record<string, any>, columns: TableColumn[]) => {
	let formattedRow: Record<string, any> = {};
	for (const column of columns) {
		formattedRow[column.field] = getColumnValue(row, column);
	}
	return formattedRow;
};

const getColumnValue = (row: Record<string, any>, column: TableColumn) => {
	return column.format ? column.format(_.get(row, column.field)) : _.get(row, column.field);
};

</script>

<style>
.detail_text {
	font-weight: 400;
	font-size: 11px;
	line-height: 14px;
	letter-spacing: 0px;
	text-align: center;
}

.alert_text {
	font-weight: 600;
	font-size: 16px;
	line-height: 20px;
	letter-spacing: 0px;
	text-align: center;
}
</style>
