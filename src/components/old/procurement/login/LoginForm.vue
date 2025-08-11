<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Eye, EyeOff } from "lucide-vue-next";
import { formatPhone } from "@/helpers/formatPhone";

const auth = useAuthStore();

const phone = ref("");
const password = ref("");
const rememberMe = ref(false);
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const onSubmit = async () => {
  const telephone = "234" + formatPhone(phone.value);
  console.log("formatted phone");
  console.log(telephone);
  await auth.login({
    phone: telephone, // assuming 'phone' is sent as 'email'
    password: password.value,
    remember: rememberMe.value,
  });
};
</script>

<template>
  <div
    class="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-blue-100"
  >
    <div class="flex gap-1 items-center justify-center mb-12">
      <img src="/redesign/logo.svg" alt="Logo" class="w-12 h-12" />
      <p class="text-gray-700 text-lg font-semibold">Remedial ERP</p>
    </div>
    <div class="w-full max-w-[386px] bg-white shadow-lg rounded-2xl p-10">
      <h2 class="text-left text-2xl font-semibold text-gray-800 mb-6">
        Sign in to your account
      </h2>
      <p v-if="auth.error" class="text-red-500 text-sm mb-2">
        {{ auth.error }}
      </p>
      <form @submit.prevent="onSubmit">
        <!-- phone input -->
        <div class="mb-4">
          <label class="text-sm text-gray-600 block mb-2">Phone</label>
          <div class="relative">
            <div class="absolute left-3 top-3.5 flex items-center gap-2">
              <img
                src="https://flagsapi.com/NG/flat/64.png"
                alt="Nigeria Flag"
                class="w-6 h-6 rounded-full"
              />
              <span class="text-gray-600 text-sm">234</span>
            </div>
            <input
              type="text"
              v-model="phone"
              placeholder="8010202020"
              maxlength="10"
              class="pl-20 text-sm w-full border bg-white border-gray-300 rounded-lg py-[15px] focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <!-- password input -->
        <div class="mb-4">
          <label class="text-sm text-gray-600 block mb-2">Password</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="************"
              class="w-full border bg-white border-gray-300 rounded-lg p-3 pr-12 focus:ring-blue-500 focus:border-blue-500"
            />
            <div
              class="absolute right-3 top-4 cursor-pointer"
              @click="togglePassword"
            >
              <Eye v-if="!showPassword" class="w-5 h-5 text-gray-400" />
              <EyeOff v-else class="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
        <!-- remember me -->
        <div class="mb-6 flex items-center gap-2 bg-white">
          <input
            type="checkbox"
            v-model="rememberMe"
            class="rounded border border-gray-300 ring focus:ring-blue-500 px-1.5 appearance-none checked:appearance-auto py-1.5 bg-white outline-blue-500"
          />
          <label class="bg-white text-sm text-gray-600">
            Keep me signed in
          </label>
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white rounded-lg py-1 px-3 text-center hover:bg-blue-700 transition"
        >
          Proceed
        </button>
      </form>
      <div class="border border-t border-gray-300 my-6"></div>
      <div class="text-center text-sm text-gray-500">
        <router-link to="/passwords/forgot">
          <span class="hover:text-blue-600">Forgot Password?</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
