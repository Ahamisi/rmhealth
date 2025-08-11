<template>
  <ProfileContainer header="User Roles">
    <div class="px-6 pt-6 pb-20">
      <div v-if="fetchUsersStatus == 'loading'">
        <StateLoadingState> </StateLoadingState>
      </div>
      <UserRoleTable v-else :users="users" :roles="roles" />
    </div>
  </ProfileContainer>
</template>

<script setup lang="ts">
import ProfileContainer from "@/Components/procurement/profile/profileContainer.vue";
import UserRoleTable from "@/Components/procurement/profile/userRoleTable.vue";
import StateLoadingState from "@/Components/procurement/state/LoadingState.vue";

import femiAvater from "@/assets/images/femiImg.png";
import joshAvater from "@/assets/images/joshImg.png";
import janeAvater from "@/assets/images/janeImg.png";
import kaneAvater from "@/assets/images/kaneImg.png";
import { onMounted, ref } from "vue";
import { useUsers } from "@/Composables/procurement/useUsers";
const { fetchUsers, totalUsers, totalPages, isLoading, fetchAllRoles } =
  useUsers();

const users = ref<any[]>([]);
const roles = ref<any[]>([]);
const fetchUsersStatus = ref<"pending" | "loading" | "success" | "error">(
  "pending"
);

onMounted(async () => {
  try {
    fetchUsersStatus.value = "loading";
    users.value = await fetchUsers();
    roles.value = await fetchAllRoles();
    fetchUsersStatus.value = "success";
  } catch (error) {
    console.error("Error fetching users:", error);
    fetchUsersStatus.value = "error";
  }
});
const userList = [
  {
    name: "Esther Joel",
    email: "adabali@remedialhealth.com",
    status: "Active",
    role: "manager",
  },
  {
    name: "Femi Babalola",
    email: "femibabs@remedialhealth.com",
    status: "Active",
    role: "manager",
    image: femiAvater,
  },
  {
    name: "Josh Michael",
    email: "adabali@remedialhealth.com",
    status: "Active",
    role: "officer",
    image: joshAvater,
  },
  {
    name: "Jane Rotanson",
    email: "jane@remedialhealth.com",
    status: "Inactive",
    role: "officer",
    image: janeAvater,
  },
  {
    name: "Kingsley Emeka",
    email: "adabali@remedialhealth.com",
    status: "Inactive",
    role: "officer",
    image: kaneAvater,
  },
];
</script>
