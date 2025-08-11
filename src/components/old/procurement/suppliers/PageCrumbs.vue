<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  LucidePencil,
  LucideChevronLeft,
  LucideEllipsis,
} from "lucide-vue-next";
import TrashIcon from "@/Components/procurement/icons/TrashIcon.vue";
import EditIcon from "@/Components/procurement/icons/EditIcon.vue";

const router = useRouter();

const props = defineProps<{
  title: string;
  supplierId: string | number;
}>();

const goBack = () => {
  router.back();
};

const emit = defineEmits(["edit", "delete"]);
</script>


<template>
  <div class="flex flex-col items-center gap-3 justify-between px-5">
    <!-- Left Section: Breadcrumb & Back Button -->
    <div class="flex justify-start items-center gap-2 w-full">
      <nav class="text-gray-500 text-xs flex items-center gap-2">
        <router-link :to="{ name: 'suppliers' }" class="hover:underline"
          >All Suppliers</router-link
        >
        /
        <router-link
          :to="{ name: 'supplier-details', params: { id: supplierId } }"
          class="hover:underline"
          >{{ title }}</router-link
        >
        /
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
      <div class="page-subtitle-text text-text-default">
        {{ title }}
      </div>

      <!-- Right Section: Action Buttons -->
      <div class="flex items-center gap-2">
        <button
          @click="$emit('delete')"
          class="bg-[#C9372C] text-white flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded hover:bg-red-600"
        >
          <TrashIcon class="h-4 w-4 text-white" />
          Delete
        </button>
        <button
          @click="$emit('edit')"
          class="bg-blue-600 text-white py-1 px-2.5 rounded flex items-center gap-1.5 medium-text"
        >
          <!-- <LucidePencil
            class="w-5 h-5 stroke-gray-200 stroke-[3px] fill-white"
          ></LucidePencil> -->
          <!-- <img src="/redesign/edit.svg" alt="" class="h-4 w-4 stroke-white" /> -->
          <EditIcon class="h-4 w-4" />

          Edit
        </button>
      </div>
    </div>

    <!-- Center Section: Title -->
  </div>
</template>
