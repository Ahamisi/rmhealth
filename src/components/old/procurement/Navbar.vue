<script setup>
import {
  Bell,
  MessageCircle,
  UserCircle2,
  ChevronDown,
} from "lucide-vue-next";

const branch = ref("Lagos Branch");
</script>

<template>
  <div class="bg-white py-1 shadow-md flex justify-between items-center">
    <div class="flex gap-4 justify-start items-center">
      <!-- <LucideGrip class="w-20 h-6 text-gray-700" /> -->

      <!-- <h2 class="text-xl font-semibold">Atlas</h2> -->

      <img
        src="/icons/remedial-icon.svg"
        alt="Logo"
        class="h-[32px] rounded-lg border w-[160px]"
      />

      <button
        class="flex items-center gap-1.5 justify-center w-full py-2 text-xs font-normal tracking-tight text-gray-700 transition duration-150 ease-in-out bg-gray-200 border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
        type="button"
        aria-haspopup="true"
        aria-expanded="true"
        aria-controls="headlessui-menu-items-117"
      >
        <span>Lagos Branch</span>
        <ChevronDown class="h-6 w-6" />
      </button>
    </div>
    <div class="flex items-center gap-4">
      <span class="relative inline-block">
        <Bell class="cursor-pointer rotate-45 text-gray-800 w6-h6" />
        <span
          class="absolute top-0 right-0 inline-flex items-center justify-center px-[0.350rem] py-1 text-xs font-light leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-rose-700 rounded-full"
        >
          9+
        </span>
      </span>
      <MessageCircle class="cursor-pointer text-gray-800 w-6 h-6" />
      <UserCircle2 class="cursor-pointer text-gray-800 w-6 h-6" />
    </div>
  </div>
</template>
