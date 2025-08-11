<script setup lang="ts">
import { useRouter } from "vue-router";
import loaderSvg from "@/assets/icons/loader.svg";
const router = useRouter();

defineProps<{
  //   title: string;
}>();

// const goBack = () => {
//   router.back();
// };
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-2 text-center">
    <!-- Loader Icon -->
    <img :src="loaderSvg" class="w-10 h-10 animate-pulse" alt="Loading" />

    <!-- Title -->
    <p class="text-base font-semibold leading-5 text-text-default">
      Loading
    </p>

    <!-- Subtitle -->
    <p class="text-text-default leading-[14px] text-[11px]">
      <!-- Please wait while we fetch your data -->
    </p>
  </div>
</template>
