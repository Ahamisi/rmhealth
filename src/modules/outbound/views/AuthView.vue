<template>
  <!-- Show preloader during login -->
  <Preloader v-if="isLoading" />
  
  <!-- Auth form -->
  <div v-else class="min-h-screen flex items-center justify-center p-4 relative" style="background-color: #f7f8f9;">
    <!-- Gradient at bottom -->
    <div class="absolute bottom-0 left-0 right-0 h-64" style="background: 
      radial-gradient(ellipse 800px 300px at 20% 100%, rgba(12, 102, 228, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 700px 300px at 90% 100%, rgba(163, 249, 78, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 400px 200px at 50% 100%, rgba(12, 102, 228, 0.1) 0%, transparent 50%)
    "></div>
    
    <div class="w-full max-w-md relative z-10">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center">
          <img src="/src/assets/icons/logo.svg" alt="Remedial ERP" class="w-22 h-15" />
          <!-- <span class="ml-3 text-2xl font-display font-semibold text-gray-900">Remedial ERP</span> -->
        </div>
      </div>

      <!-- Login Form Card -->
      <div class="bg-white rounded-2xl p-6 space-y-5" style="border-radius: 16px;">
        <!-- Header inside card -->
        <div class="text-left mb-5">
          <h2 class="text-xl font-display font-semibold" style="color: #172B4D;">Sign in to your account</h2>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Phone Number Input -->
          <UiInput
            v-model="form.phone"
            type="tel"
            label="Phone"
            placeholder="234 801 020 202020"
            required
            :error="errors.phone"
            :prefix-icon="PhoneIcon"
            @blur="validatePhone"
          />

          <!-- Password Input -->
          <UiInput
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            placeholder="••••••••••"
            required
            :error="errors.password"
            :suffix-icon="EyeIcon"
            @suffix-click="togglePassword"
            @blur="validatePassword"
          />

          <!-- Keep me signed in -->
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 border-gray-300 rounded"
              style="accent-color: #0C66E4;"
            >
            <label for="remember-me" class="ml-2 block text-sm" style="color: #44546F;">
              Keep me signed in
            </label>
          </div>

          <!-- Submit Button -->
          <UiButton
            type="submit"
            :disabled="isLoading || !isFormValid"
            :loading="isLoading"
            size="lg"
            class="w-full"
          >
            {{ isLoading ? 'Signing in...' : 'Proceed' }}
          </UiButton>
        </form>

        <!-- Divider line -->
        <div class="border-t border-gray-200"></div>

        <!-- Forgot Password -->
        <div class="text-center">
          <button
            type="button"
            class="text-sm transition-colors"
            style="color: #0C66E4;"
            @click="handleForgotPassword"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, h } from 'vue'
import { useRouter } from 'vue-router'
import UiButton from '@/components/ui/Button.vue'
import UiInput from '@/components/ui/Input.vue'
import Preloader from '@/components/ui/Preloader.vue'
import { validatePhone as isValidPhone } from '@/lib/utils'

// Phone icon using Nigeria flag
const PhoneIcon = () => h('img', {
  src: '/src/assets/icons/nigeria.svg',
  alt: 'Phone',
  class: 'w-4 h-4'
})

// Eye icon for password visibility
const EyeIcon = () => h('img', {
  src: '/src/assets/icons/eye.svg',
  alt: 'Toggle password visibility',
  class: 'w-4 h-4 cursor-pointer'
})

const router = useRouter()

// Form state
const form = reactive({
  phone: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  phone: '',
  password: ''
})

const isLoading = ref(false)
const showPassword = ref(false)

// Computed properties
const isFormValid = computed(() => {
  return form.phone && form.password && !errors.phone && !errors.password
})

// Methods
const validatePhone = () => {
  if (!form.phone) {
    errors.phone = 'Phone number is required'
  } else if (!isValidPhone(form.phone)) {
    errors.phone = 'Please enter a valid phone number'
  } else {
    errors.phone = ''
  }
}

const validatePassword = () => {
  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 4) {
    errors.password = 'Password must be at least 4 characters'
  } else {
    errors.password = ''
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  // Validate form
  validatePhone()
  validatePassword()
  
  if (!isFormValid.value) return
  
  isLoading.value = true
  
  try {
    // TODO: Implement actual authentication API call
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
    
    // Store auth token (temporary)
    localStorage.setItem('auth_token', 'dummy_token')
    
    // Redirect to dashboard
    router.push('/outbound/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
    // Handle error - show notification
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = () => {
  // TODO: Implement forgot password functionality
  console.log('Forgot password clicked')
}
</script> 