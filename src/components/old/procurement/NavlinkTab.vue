<template>
  <div class="hidden w-full md:block">
    <div class="flex w-full items-baseline md:space-x-6">
      <!-- Loop through links and render navigation items -->
      <a
        v-for="(link, index) in links"
        :key="index"
        href="#"
        class="relative overflow-hidden py-2 text-[12px] font-semibold text-[#44546F] transition-colors duration-300"
        :class="{
          '!text-[#0C66E4] group': activeLink === link.value,
          'hover:text-[#0C66E4] group': activeLink !== link.value,
        }"
        @click.prevent="$emit('toggleView', link.value)" 
      >
        {{ link.label }}
        <span
          class="bg-blue-700 absolute bottom-[0px] left-0 h-[2px] w-full origin-left scale-x-0 transform transition-transform duration-300 ease-out"
          :class="{
            'scale-x-100': activeLink === link.value,
            'group-hover:scale-x-100': activeLink !== link.value,
          }"
        ></span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">


// Define props for navigation links and currently active link
const props = defineProps<{
  links: Array<{ label: string; value: string }>;
  activeLink: string;
}>();

// Define event to notify parent component when a link is clicked
defineEmits(["toggleView"]);
</script>
