<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { LucideX, LucideChevronDown, LucideChevronUp } from "lucide-vue-next";
import { onClickOutside } from "@vueuse/core";
import { Option } from "@/types";

const props = defineProps<{
  modelValue: Option | null;
  options: any[]; // The search results from parent
  placeholder: string;
  isSearching?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "search"]);

const searchTerm = ref("");
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

watch(searchTerm, (newVal) => {
  if (props.modelValue && newVal === props.modelValue.name) {
    return;
  }
  if (newVal.length >= 3) {
    emit("search", newVal);
    isOpen.value = true;
  } else {
    isOpen.value = false;
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    searchTerm.value = newValue ? newValue.name : "";
  },
  { immediate: true }
);

const selectOption = (option: any) => {
  emit("update:modelValue", option);
  isOpen.value = false;
};

const clearSelection = () => {
  emit("update:modelValue", null);
  searchTerm.value = "";
  isOpen.value = false;
};

const handleBlur = () => {
  if (props.modelValue) {
    searchTerm.value = props.modelValue.name;
  }
};

onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});
</script>

<script lang="ts">
export default {
  name: "SelectWithSearchField",
};
</script>

<template>
  <div class="w-full relative" ref="dropdownRef">
    <div
      class="py-1.5 px-3 bg-white flex border border-gray-300 rounded-md relative transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
    >
      <input
        :placeholder="placeholder"
        class="px-2 appearance-none outline-none w-full medium-text text-text-default bg-white"
        v-model="searchTerm"
        @blur="handleBlur"
      />
      <div
        class="text-text-default w-8 pl-2 pr-1 flex items-center border-gray-200"
      >
        <button
          class="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none flex items-center justify-center"
        >
          <LucideX
            v-if="modelValue"
            @click.stop="clearSelection"
            class="w-4 h-4"
          />
          <LucideChevronDown
            v-else-if="!isOpen"
            @click="isOpen = true"
            class="w-4 h-4"
          />
          <LucideChevronUp v-else @click="isOpen = false" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div
      v-if="isOpen"
      class="absolute shadow bg-white border-2 border-gray-100 top-full mt-1 z-40 w-full left-0 rounded max-h-60 overflow-y-auto"
    >
      <div v-if="isSearching" class="p-3 text-sm text-gray-500">
        Searching...
      </div>
      <div v-else-if="!options.length" class="p-3 text-sm text-gray-500">
        {{
          searchTerm.length < 3
            ? "Type 3 or more characters to search"
            : "No results found"
        }}
      </div>
      <ul v-else class="flex flex-col w-full">
        <li
          v-for="option in options"
          :key="option.id"
          class="cursor-pointer w-full border-gray-100 border-b hover:bg-gray-100 p-3"
          @click="selectOption(option)"
        >
          <div class="text-text-subtle medium-text">{{ option.name }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>