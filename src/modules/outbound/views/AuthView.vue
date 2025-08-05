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
            placeholder="+234 801 020 202020"
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
            :suffix-icon="showPassword ? EyeSlashIcon : EyeIcon"
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

// Eye icons for password visibility toggle
const EyeIcon = () => h('svg', {
  class: 'w-4 h-4',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, h('path', {
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'stroke-width': '2',
  d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
}))

const EyeSlashIcon = () => h('svg', {
  class: 'w-4 h-4',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, h('path', {
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'stroke-width': '2',
  d: 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
}))

const PhoneIcon = () => h('svg', {
  class: 'w-4 h-4',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, h('path', {
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'stroke-width': '2',
  d: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
}))

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
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
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