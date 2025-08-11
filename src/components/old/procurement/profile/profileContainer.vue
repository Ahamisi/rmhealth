<template>
  <main class="bg-white rounded-xl shadow-sm">
    <div class="px-6 py-4 border-b-[0.5px] border-[#091E4224]">
      <div>
        <div :class="buttonLabel ? 'flex w-full items-center' : ''">
          <p class="w-full text-base font-semibold text-[#172B4D]">
            {{ header }}
          </p>
          <div class="flex w-full justify-end">
            <button
              v-if="buttonLabel"
              :label="buttonLabel"
              :is-loading="loading"
              class="!h-9 !text-sm !font-semibold shadow-sm"
              @click="click"
            />
          </div>
        </div>
      </div>
    </div>
    <div>
      <slot />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";

const selectedTimeRange = ref("last 30 days");

const props = defineProps<{
  header: string;
  buttonLabel?: string;
  loading?: boolean;
}>();

const emit = defineEmits(["button-click"]);

const click = () => {
  emit("button-click");
};
</script>
