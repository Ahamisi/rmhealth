<script setup lang="ts">
import { ref, computed, onMounted, onActivated, watch } from "vue";
import {
  LucideX,
  LucideCheckCircle,
  LucideCircle,
  LucideCheck,
} from "lucide-vue-next";
import { usePurchaseOrders } from "@/Composables/procurement/usePurchaseOrders";
import StateLoadingState from "@/Components/procurement/state/LoadingState.vue";
import ReusableButton from "@/Components/procurement/ui/ReusableButton.vue";

// Props
const props = defineProps<{
  modelValue: boolean;
  //   activities?: {
  //     status: "completed" | "pending";
  //     title: string;
  //     description: string;
  //     time: string;
  //   }[];
  reference?: string;
  selectedOrder?: any;
}>();
const emit = defineEmits(["close"]);
const copy = ref(false);

// Sample fallback activity data
const sampleActivities = [
  {
    status: "completed",
    title: "Purchase order created",
    description: "REF: 1656493689-254 has been created by @Kolade",
    time: "1 day ago",
  },
  {
    status: "completed",
    title: "Purchase order assigned",
    description: "REF: 1656493689-254 has been assigned to @Kolade",
    time: "Yesterday, 10:45pm",
  },
  {
    status: "completed",
    title: "Purchase order approved",
    description: "REF: 1656493689-254 has been approved by @Kolade",
    time: "Yesterday, 10:45pm",
  },
  {
    status: "completed",
    title: "Approved purchase order assigned",
    description: "REF: 1656493689-254 has been assigned to @Kolade",
    time: "Yesterday, 10:55pm",
  },
  {
    status: "completed",
    title: "GRN added to purchase order",
    description: "#LDOPFW has been added to purchase order by @Kolade",
    time: "8:00am",
  },
  {
    status: "completed",
    title: "Unconfirmed GRN assigned",
    description: "#LDOPFW has been assigned to @Kolade",
    time: "8:03am",
  },
  {
    status: "completed",
    title: "Unconfirmed GRN confirmed",
    description: "#LDOPFW has been confirmed by @Kolade",
    time: "8:32am",
  },
  {
    status: "pending",
    title: "Supplier's return created",
    description: "REF: 1656493689-254 has been created by @Kolade",
    time: "10:55am",
  },
];

const { fetchActivityGroups } = usePurchaseOrders();
const activityGroups = ref<any[]>([]);

const roles = ref<any[]>([]);

const fetchActivityGroupsStatus = ref<
  "pending" | "loading" | "success" | "error"
>("pending");

watch(
  () => props.selectedOrder?.id,
  async (orderId) => {
    if (!orderId) return;

    try {
      fetchActivityGroupsStatus.value = "loading";
      activityGroups.value = await fetchActivityGroups(orderId);
      console.log("activity logs", activityGroups.value);
      fetchActivityGroupsStatus.value = "success";
    } catch (error) {
      console.error("Error fetching activityGroups:", error);
      fetchActivityGroupsStatus.value = "error";
    }
  },
  { immediate: true }
);
// Use sample if none provided
// const computedActivities = computed(() => {
//   return props.activities?.length ? props.activities : sampleActivities;
// });
</script>

<template>
  <Transition name="slide">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50"
      @click.self="$emit('close')"
    >
      <div
        class="bg-white w-full flex flex-col md:w-[500px] h-full shadow-lg overflow-y-auto transition-transform relative"
      >
        <!-- Header -->
        <div class="p-6 flex justify-between items-center mb-2 border-b">
          <div class="flex gap-2">
            <p class="text-sm font-semibold text-[#44546F]">Activities</p>
            <img
              src="/redesign/copy.svg"
              v-if="!copy"
              alt="copy"
              class="h-6 w-6 cursor-pointer"
              @click.stop="copy = !copy"
            />
            <LucideCheck v-else class="h-4 w-4 text-text-subtlest" />
            <p class="text-sm text-[#626F86]">
              REF: {{ selectedOrder?.orderNo }}
            </p>
          </div>
          <LucideX
            class="w-5 h-5 text-[#626F86] cursor-pointer"
            @click="$emit('close')"
          />
        </div>

        <div class="p-6 relative flex-1 overflow-y-auto pt-6 pb-20">
          <div v-if="fetchActivityGroupsStatus == 'loading'">
            <StateLoadingState />
          </div>
          <div
            v-else
            v-for="(group, index) in activityGroups"
            :key="index"
            class="mb-5"
          >
            <p class="table-norm-text text-text-subtle mb-4">
              {{ group.date }}
            </p>

            <div class="border-gray-200">
              <div
                v-for="(activity, idx) in group.activities"
                :key="idx"
                class="mb-6 flex items-start md:gap-[10rem]"
              >
                <div class="flex space-x-3 w-3/4">
                  <img :src="activity.icon" alt="" />
                  <div class="">
                    <p
                      class="table-norm-text w-full text-text-default text-pretty"
                    >
                      {{ activity.title }}
                    </p>
                    <p
                      class="w-full text-text-subtle table-sub-text text-nowrap"
                    >
                      #{{ activity.orderId }} has been created by
                      <span class="text-[#0055CC] inline"
                        >@{{ activity.user }}</span
                      >
                    </p>
                  </div>
                </div>
                <p class="text-text-subtlest table-sub-text text-nowrap">
                  {{ activity.time }}
                </p>
              </div>
            </div>
          </div>

          <!-- Fade Overlay -->
          <div
            class="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-white to-transparent pointer-events-none"
          />
        </div>

        <!-- Footer -->
        <div class="p-6 flex justify-end pt-4 border-t">
          <ReusableButton
            @click="$emit('close')"
            bg-color="bg-blue-600"
            text-color="text-white"
            class="medium-text"
          >
            <span>Close</span>
          </ReusableButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
