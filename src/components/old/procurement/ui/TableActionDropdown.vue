<template>
    <div class="flex items-center justify-center">
        <!-- Dropdown Trigger -->
        <div class="px-1 rounded hover:bg-gray-200 w-fit" v-click-outside="closeDropdown">
            <LucideEllipsisVertical class="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800"
                @click.stop="toggleDropdown($event)" />
        </div>

        <!-- Dropdown Menu -->
        <teleport to="body">
            <div v-if="isCurrentDropdownOpen" :style="dropdownStyle"
                class="absolute z-50 bg-white border border-gray-200 rounded shadow-lg w-fit dropdown-menu">
                <ul class="text-sm text-gray-700 divide-y divide-gray-200">
                    <slot :selectedItem="rowData" :closeDropdown="closeDropdown">
                        <!-- Default menu items if no slot content provided -->
                        <li v-for="(item, index) in menuItems" :key="index"
                            class="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 medium-text"
                            @click="handleItemClick(item)" v-show="!item.condition || item.condition(rowData)">
                            <component :is="item.icon" v-if="item.icon" class="w-4 h-4" :class="item.iconClass" />
                            <img v-else-if="item.iconSrc" :src="item.iconSrc" alt="" class="w-4 h-4" />
                            {{ typeof item.label === 'function' ? item.label(rowData) : item.label }}
                        </li>
                    </slot>
                </ul>
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
    import { computed, onUnmounted, watch, ref } from "vue";
    import { LucideEllipsisVertical } from "lucide-vue-next";
    import { MenuItem } from "@/types";
    import { useGlobalStore } from "@/stores/global";

    const props = defineProps<{
        rowData: any;
        menuItems?: MenuItem[];
        dropdownId?: string;
    }>();

    const emit = defineEmits<{
        menuAction: [actionId: string, item: any];
        itemSelected: [item: any];
        actionOpened;
    }>();

    // Global state for managing dropdowns (shared across all instances)
    const globalDropdownState = (() => {
        // Use a global object to share state between component instances
        if (!window.__dropdownStore) {
            window.__dropdownStore = {
                activeDropdownId: ref<string | null>(null),
                dropdownPosition: ref({ top: 0, left: 0 }),
                anchorEl: ref<HTMLElement | null>(null)
            };
        }
        return window.__dropdownStore;
    })();

    const { activeDropdownId, dropdownPosition, anchorEl } = globalDropdownState;

    // Generate unique ID for this dropdown
    const dropdownId = computed(() => 
        props.dropdownId || `dropdown-${props.rowData?.id || Math.random().toString(36).substr(2, 9)}`
    );

    const globalStore = useGlobalStore();

    // Check if this specific dropdown is open
    const isCurrentDropdownOpen = computed(() => activeDropdownId.value === dropdownId.value && activeDropdownId.value == globalStore.openDropdownId );

    const dropdownStyle = computed(() => ({
        position: "absolute" as const,
        top: `${dropdownPosition.value.top}px`,
        left: `${dropdownPosition.value.left}px`,
        zIndex: 50,
    }));

    const updateDropdownPosition = () => {
        if (!anchorEl.value) return;
        const rect = anchorEl.value.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = 200; // Estimated dropdown height
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // Show above if there's not enough space below and there's more space above
        const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
        
        dropdownPosition.value = {
            top: showAbove 
                ? rect.top + window.scrollY - dropdownHeight - 7
                : rect.bottom + window.scrollY + 7,
            left: rect.left - 150 + window.scrollX,
        };
    };

    const openDropdown = (id: string, element: HTMLElement) => {
        activeDropdownId.value = id;
        anchorEl.value = element;
        updateDropdownPosition();
    };

    const closeDropdown = () => {
        activeDropdownId.value = null;
        anchorEl.value = null;
    };

    const toggleDropdown = (event: MouseEvent) => {
        emit('actionOpened');
        globalStore.toggleDropdown(activeDropdownId.value);
        if (isCurrentDropdownOpen.value) {
            closeDropdown();
            // globalStore.closeDropdown()
        } else {
            // globalStore.toggleDropdown(activeDropdownId.value);
            openDropdown(dropdownId.value, event.currentTarget as HTMLElement);
            emit('itemSelected', props.rowData);
        }
    };

    const handleItemClick = (menuItem: MenuItem) => {
        emit('menuAction', menuItem.action, props.rowData);
        closeDropdown();
    };

    // Watch for dropdown state changes to handle scroll listeners
    watch(isCurrentDropdownOpen, (isOpen) => {
        if (isOpen) {
            window.addEventListener("scroll", updateDropdownPosition, true);
        } else {
            window.removeEventListener("scroll", updateDropdownPosition, true);
        }
    });

    onUnmounted(() => {
        window.removeEventListener("scroll", updateDropdownPosition, true);
    });

    defineOptions({
        name: "TableActionDropdown"
    });

    // Expose methods for parent component
    defineExpose({
        closeDropdown,
        isDropdownOpen: isCurrentDropdownOpen
    });
</script>