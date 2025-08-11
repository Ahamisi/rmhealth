<template>
	<div>
		<!-- Dropdown Trigger -->
		<div :class="{
			'bg-gray-200 rounded w-fit p-1': isOpen,
		}">
			<LucideEllipsisVertical class="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800"
				@click.stop="toggleDropdown($event)" />
		</div>

		<!-- Dropdown Menu -->
		<teleport to="body">
			<div v-if="isOpen" :style="dropdownStyle"
				class="absolute z-50 w-48 bg-white rounded border border-gray-200 shadow-lg dropdown-menu">
				<ul class="text-sm text-gray-700 divide-y divide-gray-200">
					<li v-for="(item, index) in menuItems" :key="index"
						class="flex gap-2 items-center px-4 py-2 cursor-pointer hover:bg-gray-100 medium-text"
						@click="handleMenuClick(item)" v-show="!item.condition || item.condition(selectedItem)">
						<component :is="item.icon" v-if="item.icon" class="w-4 h-4" :class="item.iconClass" />
						<img v-else-if="item.iconSrc" :src="item.iconSrc" alt="" class="w-4 h-4" />
						{{ typeof item.label === 'function' ? item.label(selectedItem) : item.label }}
					</li>
				</ul>
			</div>
		</teleport>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onUnmounted, watch } from "vue";
	import { LucideEllipsisVertical } from "lucide-vue-next";
	import { MenuItem } from "@/types";

	const props = defineProps<{
		item: any;
		menuItems: MenuItem[];
	}>();

	const emit = defineEmits<{
		action: [actionId: string, item: any];
	}>();

	const selectedItem = ref(null);
	const isOpen = ref(false);
	const dropdownPosition = ref({ top: 0, left: 0 });
	const anchorEl = ref<HTMLElement | null>(null);

	const dropdownStyle = computed(() => ({
		position: "absolute" as const,
		top: `${dropdownPosition.value.top + 7}px`,
		left: `${dropdownPosition.value.left - 40}px`,
		zIndex: 50,
	}));

	const updateDropdownPosition = () => {
		if (!anchorEl.value) return;
		const rect = anchorEl.value.getBoundingClientRect();
		dropdownPosition.value = {
			top: rect.bottom + window.scrollY,
			left: rect.left - 150 + window.scrollX,
		};
	};

	const toggleDropdown = (event: MouseEvent) => {
		if (isOpen.value) {
			closeDropdown();
		} else {
			selectedItem.value = props.item;
			isOpen.value = true;
			anchorEl.value = event.currentTarget as HTMLElement;
			updateDropdownPosition();
		}
	};

	const closeDropdown = () => {
		isOpen.value = false;
		selectedItem.value = null;
		anchorEl.value = null;
	};

	const handleMenuClick = (menuItem: MenuItem) => {
		emit('action', menuItem.action, selectedItem.value);
		closeDropdown();
	};

	watch(isOpen, (isOpenValue) => {
		if (isOpenValue) {
			window.addEventListener("scroll", updateDropdownPosition, true);
		} else {
			window.removeEventListener("scroll", updateDropdownPosition, true);
			anchorEl.value = null;
		}
	});

	// Document click listener to close dropdown on outside click
	const handleDocumentClick = (e: MouseEvent) => {
		const dropdowns = document.querySelectorAll(".dropdown-menu");
		let clickedInsideDropdown = false;

		dropdowns.forEach((dropdown) => {
			if (dropdown.contains(e.target as Node)) {
				clickedInsideDropdown = true;
			}
		});

		if (!clickedInsideDropdown) {
			closeDropdown();
		}
	};

	document.addEventListener("click", handleDocumentClick);

	onUnmounted(() => {
		document.removeEventListener("click", handleDocumentClick);
		window.removeEventListener("scroll", updateDropdownPosition, true);
	});

	defineOptions({
		name: "ActionDropdown"
	});
</script>
