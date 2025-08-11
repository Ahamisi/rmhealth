<template>
  <div class="relative w-full" ref="dropdownRef">
    <div class="flex flex-col items-center">
      <div class="w-full">
        <div class="relative flex p-2 transition-all bg-white rounded-lg dropdown"
          :class="isFocused ? 'border-blue-600 border' : 'border-gray-300'">
          <img v-if="displayImage" :src="displayImage" alt="Profile Image"
            class="relative top-[3px] w-6 h-6 object-contain" />
          <!-- Display Lucide Icon -->
          <component v-else-if="displayIcon" :is="displayIcon" class="w-5 h-6 text-text-default" />
          <input :placeholder="placeholder"
            class="w-full bg-white outline-none appearance-none medium-text text-text-default" v-model="searchTerm"
            @focus="handleFocus" @blur="handleBlur" />
          <div class="flex items-center w-8 pl-2 pr-1 border-gray-200 text-text-default">
            <button class="w-6 h-6 text-gray-600 outline-none cursor-pointer focus:outline-none"
              @click="toggleDropdown">
              <LucideX v-if="!!searchTerm" @click="selectOption()" class="w-4 h-4" />
              <LucideChevronDown v-else-if="!isOpen" class="w-4 h-4" />
              <LucideChevronUp v-else class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Dropdown -->
      <div v-if="isOpen && filteredOptions.length"
        class="absolute left-0 z-40 w-full overflow-y-auto bg-white border-2 border-gray-100 rounded shadow shad-md top-100 max-h-select">
        <div class="flex flex-col w-full max-h-32">
          <div v-for="option in filteredOptions" :key="option.id"
            class="w-full border-b border-gray-100 cursor-pointer hover:bg-gray-100" @click="selectOption(option)">
            <div @click="selectOption(option)"
              class="relative flex items-center w-full px-3 py-3 pl-2 border-l-2 border-transparent hover:border-gray-200">
              <div class="flex items-center justify-between w-full">
                <div class="mx-2 -mt-1 text-text-subtle medium-text">
                  {{ option.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { LucideChevronDown, LucideChevronUp, LucideX } from "lucide-vue-next";
import { onClickOutside } from "@vueuse/core";

import { Option } from "@/types";

import type { Component } from "vue";

const props = defineProps<{
  modelValue: Option | null;
  options: Option[];
  placeholder: string;
  displayIcon?: Component;
  displayImage?: string;
  reduce?: (option: Option) => any;
}>();

const emit = defineEmits(["update:modelValue"]);

const searchTerm = ref("");
// const imageUrl = ref("/supplier-placeholder.png");
const isOpen = ref(false);
const isFocused = ref(false); // ✅ New state to track focus
const dropdownRef = ref<HTMLElement | null>(null);

// Watch for changes in modelValue to update the searchTerm
watch(
  () => props.modelValue,
  (newValue) => {
    // console.log("Model value changed:", newValue, typeof newValue, props.options, searchTerm.value);
    if (newValue) {
      if(typeof newValue === "object" && "name" in newValue) searchTerm.value = newValue.name;
      else searchTerm.value = props.options.find(opt => opt.id == newValue)?.name;
    } else {
      searchTerm.value = "";
    }
  },
  { immediate: true }
);

// Computed: Filters options based on search
const filteredOptions = computed(() => {
  if (!searchTerm.value || !props.modelValue) return props.options;
  return props.options.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Open dropdown
const openDropdown = () => {
  isOpen.value = true;
};

// Toggle dropdown open/close
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Select option and close dropdown
const selectOption = (option?: Option) => {
  const valueToEmit = props.reduce && option ? props.reduce(option) : option;
  emit("update:modelValue", valueToEmit);
  isOpen.value = false;
  if (!!option) {
    searchTerm.value = option.name; // Update input with selected value
  } else {
    searchTerm.value = "";
  }
};

const handleFocus = () => {
  isFocused.value = true;
  // When focusing, if there's a selected value, clear the search term
  // to show all options. Otherwise, behave as before.
  if (props.modelValue) {
    searchTerm.value = "";
  }
  toggleDropdown();
};

const handleBlur = () => {
  isFocused.value = false;
  // If the user clicks away without selecting, restore the displayed value
  if (props.modelValue) {
    searchTerm.value = props.modelValue.name;
  }
};

onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});
</script>

<style scoped>
.top-100 {
  top: 100%;
}

.max-h-select {
  max-height: 300px;
}

.dropdown {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: rgba(98, 111, 134, 1);
  border: 2px solid rgba(9, 30, 66, 0.14);
}
</style>

<script lang="ts">
export default {
  name: "UiSelectField",
};
</script>
