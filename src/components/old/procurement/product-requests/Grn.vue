<template>
  <main>
    <div class="bg-gray-100 border-b border-[#091E4224] px-6 relative">
      <!-- Breadcrumb -->
      <!-- <div class="text-[#626F86] text-xs mb-5 space-x-2">
                <span>Purchase Order</span>
                <span>/</span>
                <span class="font-semibold">{{ activeLink.label }}</span>
            </div> -->

      <!-- Navigation Tabs -->
      <div class="flex w-full items-baseline">
        <a
          v-for="(link, index) in links"
          :key="index"
          href="#"
          class="py-3 px-4 text-xs font-semibold text-[#44546F] transition-colors duration-300 rounded-t-md relative"
          :class="{
            'bg-white text-[#172B4D] font-medium border border-[#091E4224] border-b-0':
              activeLink.value === link.value,
            'hover:text-[#172B4D] font-semibold text-[#44546F]':
              activeLink.value !== link.value,
            'after:absolute after:left-0 after:bottom-[-1px] after:w-full after:h-[1px] after:bg-white':
              activeLink.value === link.value,
          }"
          @click.prevent="toggleView(link)"
        >
          {{ link.label }}
        </a>
      </div>
    </div>
    <section class="bg-white p-6">
      <AwaitingPo v-if="activeLink.value == 'awaiting'" />
      <ApprovedPo v-else-if="activeLink.value == 'approved'" />
    </section>
  </main>
</template>

<script setup lang="ts">
import AwaitingPo from "@/Components/procurement/purchase/supplierDetails/AwaitingPo.vue";
import ApprovedPo from "@/Components/procurement/purchase/supplierDetails/ApprovedPo.vue";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const search = ref("");

// Define the navigation links
const links = [
  { label: "Awaiting PO Approval", value: "awaiting" },
  { label: "Approved PO", value: "approved" },
  { label: "Unconfirmed GRN", value: "unconfirmed_grn" },
  { label: "Confirmed GRN", value: "confirmed_grn" },
  { label: "Price Confirmation", value: "price_confirmation" },
  { label: "Completed PO", value: "completed" },
];

// Helper function to find link by value
const findLinkByValue = (value: string) =>
  links.find((link) => link.value === value) || links[0];

// Get active tab from query or default to first link
const activeLink = ref(findLinkByValue(route.query.tab as string));

// Watch for route changes and update `activeLink`
watch(
  () => route.query.tab,
  (newTab) => {
    if (typeof newTab === "string") {
      activeLink.value = findLinkByValue(newTab);
    }
  }
);

// Function to switch tabs
const toggleView = (link: { label: string; value: string }) => {
  if (link.value !== activeLink.value.value) {
    activeLink.value = link;
    router.push({ query: { tab: link.value } });
  }
};
</script>
