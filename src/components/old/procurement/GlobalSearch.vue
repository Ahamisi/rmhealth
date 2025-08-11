<script setup lang="ts">
import {
  LucideSearch,
  LucideFilter,
  LucideArrowUpDown,
  LucideListFilter,
} from "lucide-vue-next";
import { useSearch } from "@/Composables/procurement/useSearch";
import { useSuppliers } from "@/Composables/procurement/useSuppliers";
import { useFilter } from "@/Composables/procurement/useFilter";

import { useDropdown } from "@/Composables/procurement/useDropdown";
import InputBox from "@/Components/procurement/InputBox.vue";
import { useFilterModal } from "@/Composables/procurement/useFilterModal";
import SearchDropdown from "@/Components/procurement/SearchDropdown.vue";

const props = defineProps<{
  //   isAscending: boolean;
  modelValue: string;
  //   selectedStatus: string;
}>();

const emit = defineEmits([
  "update:modelValue",
  "update:isAscending",
  "update:selectedStatus",
  "filterOpen",
  "filterModalOpen",
]);

const { isOpen, toggle } = useDropdown();
const { modalTypeOpen, toggleModal, ModalTypes } = useFilterModal();
</script>

<template>
  <div
    class="flex border-2 border-gray-300 focus-within:border-bg-blueBg rounded-lg overflow-hidden shadow-sm w-[281px] h-[34px]"
  >
    <div class="flex items-center gap-2 px-4 py-2 bg-gray-50 w-full">
      <LucideSearch class="w-4 h-4 text-text-subtlest" />
      <InputBox
        :model-value="props.modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        placeholder="Search pages, customers, orders"
        custom-styles="bg-transparent outline-none w-full text-sm text-gray-700"
      />
    </div>
    <!--
    <SearchDropdown
      :isOpen="modalTypeOpen == 'filter'"
      :toggle="() => toggleModal(`filter`)"
      :alignLeft="true"
    >
      <template #trigger>
        <div
          class="border-l-2 border-gray-300 px-4 py-2 flex items-center bg-gray-50"
        >
          <LucideListFilter
            class="w-4 h-4 text-gray-600"
            @click="emit('filterModalOpen')"
          />
        </div>
      </template>
      <slot name="filter-modal" class=""></slot>


    </SearchDropdown> -->

    <!--
    <SearchDropdown
      :isOpen="modalTypeOpen == 'sort'"
      :toggle="() => toggleModal(`sort`)"
      :alignLeft="false"
    >
      <template #trigger>
        <div
          class="border-l-2 border-gray-300 px-4 py-2 flex items-center bg-gray-50"
        >
          <LucideArrowUpDown
            class="w-4 h-4 text-gray-600"
            @click="emit('filterOpen')"
          />
        </div>
      </template>

      <slot name="filter-dropdown"></slot>
    </SearchDropdown> -->
  </div>
</template>
