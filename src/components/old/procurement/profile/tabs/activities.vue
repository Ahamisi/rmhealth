<template>
  <ProfileContainer header="Activities">
    <!-- Scrollable Activity List -->
    <div class="max-h-[400px] overflow-y-auto relative">
      <div class="relative pt-6 pb-20 flex flex-col items-center">
        <div v-if="fetchActivityGroupsStatus == 'loading'">
          <StateLoadingState> </StateLoadingState>
        </div>
        <div
          v-else
          v-for="(group, index) in activityGroups"
          :key="index"
          class="mb-5"
        >
          <p class="text-gray-500 text-sm font-semibold mb-4">
            {{ group.date }}
          </p>

          <div class="border-gray-200">
            <div
              v-for="(activity, idx) in group.activities"
              :key="idx"
              class="mb-6 flex items-start md:gap-[10rem]"
            >
              <!-- Activity Details -->
              <div class="flex space-x-3">
                <!-- Status Icon -->
                <img :src="activity.icon" alt="" />
                <div>
                  <p class="font-semibold text-sm text-gray-800">
                    {{ activity.title }}
                  </p>
                  <p class="text-gray-500 text-xs">
                    #{{ activity.orderId }} has been created by
                    <span class="text-[#0055CC]">@{{ activity.user }}</span>
                  </p>
                </div>
              </div>

              <!-- Timestamp -->
              <p class="text-gray-400 text-xs">{{ activity.time }}</p>
            </div>
          </div>
        </div>
        <!-- Bottom Fade Overlay (Covers 40% of Container) -->
        <div
          class="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-white to-transparent pointer-events-none"
        ></div>
      </div>
    </div>
  </ProfileContainer>
</template>

<script setup lang="ts">
import ProfileContainer from "@/Components/procurement/profile/profileContainer.vue";
import StateLoadingState from "@/Components/procurement/state/LoadingState.vue";

import { onMounted, ref } from "vue";
// import createdImg from "@/assets/images/createdImg.svg";
// import confirmedImg from "@/assets/images/confirmedImg.svg";
// import rejectedImg from "@/assets/images/rejectedImg.svg";

import { useUsers } from "@/Composables/procurement/useUsers";

const { fetchActivityGroups } = useUsers();

const activityGroups = ref<any[]>([]);

const roles = ref<any[]>([]);
const fetchActivityGroupsStatus = ref<
  "pending" | "loading" | "success" | "error"
>("pending");
onMounted(async () => {
  try {
    fetchActivityGroupsStatus.value = "loading";
    activityGroups.value = await fetchActivityGroups();
    // roles.value = await fetchAllRoles();
    console.log("activity logs");
    console.log(activityGroups.value);
    fetchActivityGroupsStatus.value = "success";
  } catch (error) {
    console.error("Error fetching activityGroups:", error);
    fetchActivityGroupsStatus.value = "error";
  }
});
// const activityGroupss = ref([
//   {
//     date: "Today",
//     activities: [
//       {
//         title: "Purchase order created",
//         orderId: "556789",
//         user: "Kolade",
//         status: "created",
//         time: "Today 10:45pm",
//         icon: createdImg,
//       },
//       {
//         title: "Purchase order confirmed",
//         orderId: "556789",
//         user: "Kolade",
//         status: "confirmed",
//         time: "Today 10:45pm",
//         icon: confirmedImg,
//       },
//       {
//         title: "Purchase order rejected",
//         orderId: "556789",
//         user: "Kolade",
//         status: "rejected",
//         time: "Today 10:45pm",
//         icon: rejectedImg,
//       },
//     ],
//   },
//   {
//     date: "Yesterday",
//     activities: [
//       {
//         title: "Purchase order created",
//         orderId: "556789",
//         user: "Kolade",
//         status: "created",
//         time: "Today 10:45pm",
//         icon: createdImg,
//       },
//       {
//         title: "Purchase order confirmed",
//         orderId: "556789",
//         user: "Kolade",
//         status: "confirmed",
//         time: "Today 10:45pm",
//         icon: confirmedImg,
//       },
//       {
//         title: "Purchase order rejected",
//         orderId: "556789",
//         user: "Kolade",
//         status: "rejected",
//         time: "Today 10:45pm",
//         icon: rejectedImg,
//       },
//     ],
//   },
// ]);
</script>
