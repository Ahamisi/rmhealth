<script setup lang="ts">
import { ref } from "vue";
import { LucideCamera } from "lucide-vue-next";

const props = defineProps<{
  imagePlaceholder: string;
}>();

const imageUrl = ref(props.imagePlaceholder); // Default icon
const fileInput = ref<HTMLInputElement | null>(null);

const uploadImage = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const openFilePicker = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div class="relative w-24 h-24">
    <!-- Profile Image -->
    <div
      class="w-full h-full bg-blue-100 flex items-center justify-center rounded-lg overflow-hidden"
    >
      <img
        :src="imageUrl"
        alt="Profile Image"
        class="w-10 h-10 object-contain"
      />
    </div>

    <!-- Camera Icon (Upload Button) -->
    <button
      @click="openFilePicker"
      class="absolute bottom-0 right-0 bg-white shadow-md p-1.5 rounded-sm flex items-center justify-center"
    >
      <LucideCamera class="w-5 h-5"></LucideCamera>
      <!-- <img src="/icons/camera-icon.svg" alt="Upload" class="w-5 h-5" /> -->
    </button>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="uploadImage"
    />
  </div>
</template>
