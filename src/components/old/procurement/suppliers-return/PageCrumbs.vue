<script setup lang="ts">
import { useRouter } from "vue-router";
import { LucidePencil } from "lucide-vue-next";

const router = useRouter();

defineProps<{
  title: string;
}>();

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="flex flex-col items-center justify-between px-5">
    <!-- Left Section: Breadcrumb & Back Button -->
    <div class="flex justify-start items-center gap-2 w-full">
      <nav class="text-gray-500 text-xs">
        <span class="">All Suppliers</span> /
        <span class="">Fidson Healthcare</span> /
        <span class="">Purchase Order</span>
      </nav>
    </div>
    <div class="flex justify-between w-full">
      <button
        @click="goBack"
        class="text-gray-700 flex items-center gap-2 justify-center"
      >
        <LucideChevronLeft class="w-5 h-5 -ml-1"> </LucideChevronLeft>
        <span class="font-medium text-xs">Back</span>
      </button>
      <div class="text-xs font-semibold tracking-wide uppercase text-gray-700">
        {{ title }}
      </div>

      <!-- Right Section: Action Buttons -->
      <div class="flex items-center gap-2">
        <button
          class="bg-blue-600 text-white p-2 rounded flex items-center gap-2 text-xs"
        >
          <LucidePencil
            class="w-5 h-5 stroke-gray-200 stroke-[3px] fill-white"
          ></LucidePencil>
          Edit
        </button>
        <button class="bg-gray-200 p-2 rounded">
          <LucideEllipsis class="w-5 h-5"></LucideEllipsis>
        </button>
      </div>
    </div>

    <!-- Center Section: Title -->
  </div>
</template>
