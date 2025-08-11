<script setup lang="ts">
import { ref } from "vue";

// Form State
const phone = ref("");
const otp = ref("");
const newPin = ref("");

// Submit Function
const submitForgotPassword = () => {
  console.log("Reset Password with:", {
    phone: phone.value,
    otp: otp.value,
    newPin: newPin.value,
  });
};
</script>

<template>
  <div
    class="flex flex-col space-y-6 items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-blue-100"
  >
    <router-link to="/">
      <button class="absolute top-6 left-6 text-gray-600 hover:text-gray-900">
        <ArrowLeft class="cursor-pointer w-6 h-6 text-gray-600">
        </ArrowLeft>
      </button>
    </router-link>
    <!-- Form Card -->
    <div class="flex justify-center mb-6">
      <img src="/logo.svg" alt="Logo" class="w-12 h-12" />
    </div>
       <!--
    
    <div class="flex gap-1 items-center justify-center mb-12">
      <img src="/logo.svg" alt="Logo" class="w-12 h-12" />
      <p class="text-gray-700 text-lg font-semibold">Remedial ERP</p>
    </div>
  -->
    <div class="w-full max-w-[386px] bg-white shadow-lg rounded-2xl p-10">
      <!-- Logo (Centered) -->

      <!-- Back Button -->
      <!-- <h3 class="text-left text-gray-500 text-sm mb-2">PROCUREMENT</h3> -->
      <h2 class="text-left text-2xl font-semibold text-default mb-6">
        Forgot Password?
      </h2>

      <!-- Form -->
      <form @submit.prevent="submitForgotPassword" class="mt-4 space-y-6">
        <!-- Phone Input -->
        <div>
          <label class="text-gray-700 text-sm font-medium">Phone</label>
          <div class="flex items-center border border-gray-300 rounded-md p-2">
            <img
              src="https://flagsapi.com/NG/flat/64.png"
              alt="Nigeria Flag"
              class="w-5 h-5 mr-2"
            />
            <input
              type="tel"
              v-model="phone"
              placeholder="+234"
              class="w-full focus:outline-none text-gray-900 bg-white"
              required
            />
          </div>
        </div>

        <!-- OTP Code -->
        <div class="space-y-3">
          <label class="text-gray-700 text-sm font-medium bg-white">OTP Code</label>
          <input
            type="text"
            v-model="otp"
            placeholder=" -  -  -  -  -  - "
            class="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
            required
          />
          <div class="flex justify-center">
            <button class="text-blue-600 text-sm mt-1 hover:underline">
              Send OTP to phone
            </button>
          </div>
        </div>

        <!-- New PIN -->
        <div>
          <label class="text-gray-700 text-sm font-medium"
            >New 4-Digit PIN</label
          >
          <input
            type="password"
            v-model="newPin"
            placeholder="****"
            class="bg-white w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <!-- Proceed Button -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-medium py-1 rounded-md hover:bg-blue-700 transition"
        >
          Proceed
        </button>
      </form>
    </div>
  </div>
</template>
