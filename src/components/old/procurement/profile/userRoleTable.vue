<template>
  <div
    class="bg-white border border-[#091E4224] rounded-xl shadow-sm overflow-x-auto"
  >
    <table class="w-full">
      <thead class="bg-[#F7F8F9]">
        <tr class="text-left border-b border-[#091E4224] text-gray-500 text-sm">
          <th class="py-3 px-4">User</th>
          <th class="py-3 px-4">Status</th>
          <th class="py-3 px-4">Role</th>
          <th class="py-3 px-4 !text-center">Action</th>
        </tr>
      </thead>
      <!--  -->
      <tbody>
        <!-- Show loading state -->

        <!-- Show data -->
        <tr
          v-for="(user, index) in users"
          :key="index"
          class="border-b last:border-0 text-sm"
        >
          <!-- User Info -->
          <td class="py-4 px-4 flex items-center space-x-3 lg:w-[30%]">
            <img
              :src="user.image || defaultAvatar"
              alt="User Avatar"
              class="w-[24px] h-[24px] rounded-full"
            />
            <div>
              <p class="table-norm-text text-nowrap text-text-default">
                {{ user.name }}
              </p>
              <p class="table-sub-text text-text-subtlest">{{ user.email }}</p>
            </div>
          </td>

          <!-- Status -->
          <td class="py-4 px-4 lg:w-[30%]">
            <span
              class="px-3 py-1 text-badge-text rounded-md"
              :class="
                user.status === 'Active'
                  ? 'bg-[#DCFFF1] border border-[#BAF3DB] text-[#216E4E]'
                  : 'bg-[#FFECEB] border border-[#FFD5D2] text-[#AE2E24]'
              "
            >
              {{ user.status }}
            </span>
          </td>

          <!-- Role -->
          <td class="py-4 px-4 lg:w-[30%] relative">
            <div class="relative inline-block">
              <button
                @click.stop="selectUser(user)"
                class="flex items-center border border-gray-300 rounded px-1 py-1.5 text-text-default font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-bg-neutral w-full justify-between"
              >
                {{ user.role }}
                <LucideChevronDown class="ml-1 h-4 w-4 text-gray-500" />
              </button>

              <div
                v-if="selectedUser?.id == user.id"
                class="absolute left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg py-1 text-nowrap max-h-24 overflow-y-auto z-50 w-fit min-w-[100px]"
              >
                <a
                  v-for="role in roles"
                  :key="role.id"
                  @click="selectUserWithRole(user, role)"
                  class="block border-b py-2 px-2 table-norm-text text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {{ role.name }}
                </a>
              </div>
            </div>
          </td>

          <!-- Action -->
          <td class="py-4 px-4 text-center lg:w-[10%]">
            <button class="text-gray-900 hover:text-gray-950 !font-extrabold">
              &#x22EE;
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, reactive, onMounted, onUnmounted } from "vue";
import { LucideChevronDown } from "lucide-vue-next";
import defaultAvatar from "@/assets/images/avatarImage.png";
// import api from "@/api";

// ✅ Props
const props = defineProps<{
  users: Array<{
    id: number;
    name: string;
    email: string;
    image?: string;
    status: string;
    role: string;
  }>;
  roles: Array<{
    name: string;
    id: number;
  }>;
}>();

const selectedUser = ref(null);

const fetchUsersStatus = ref<"pending" | "loading" | "success" | "error">(
  "pending"
);
// const users = ref(props.users || []); // Use prop fallback

// const fetchFakeUsers = async () => {
//   fetchUsersStatus.value = "loading";
//   try {
//     await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate delay
//     const response = await api.get("/fake-users");
//     users.value = response.data;
//     fetchUsersStatus.value = "success";
//   } catch (error) {
//     console.error("Error fetching fake users:", error);
//     fetchUsersStatus.value = "error";
//   }
// };
// const {
//   data,
//   status,
//   execute: executeFakeUsers,
// } = useFetch("/api/fake-users", {
//   server: false,
//   immediate: false,
//   default: () => props.users,
// });
const handleDocumentClick = (e: MouseEvent) => {
  const dropdowns = document.querySelectorAll(".dropdown-menu");
  let clickedInsideDropdown = false;

  dropdowns.forEach((dropdown) => {
    if (dropdown.contains(e.target as Node)) {
      clickedInsideDropdown = true;
    }
  });

  if (!clickedInsideDropdown) {
    selectedUser.value = null;
    // if (isDropdownOpen.value) {
    // } else {
    // }
  }
};

document.addEventListener("click", handleDocumentClick);

onUnmounted(() => {
  document.removeEventListener("click", handleDocumentClick);
});
onMounted(async () => {
  //   fetchUsersStatus.value = "pending"; // optional visual cue
  //   await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate delay
  //   fetchFakeUsers();
});

const selectUserWithRole = (user, role) => {
  //   localUsers[index].role = role;
  selectedUser.value = user;

  //   localUsers[index].isDropdownOpen = false;
};
const selectUser = (user) => {
  selectedUser.value = user;
  //   localUsers[index].role = role;
  //   localUsers[index].isDropdownOpen = false;
};
</script>
