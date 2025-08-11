<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex justify-center pointer-events-none">
      <Transition enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="transform -translate-y-full opacity-0" enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition-all duration-300 ease-out" leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-full opacity-0" @after-leave="onAfterLeave">
        <div v-if="showToast" class="mt-8 pointer-events-auto">
          <div class="flex items-center px-6 py-4 space-x-3 text-white rounded-full shadow-lg alert_wrapper min-w-max">
            <!-- Success Icon -->
            <div class="flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM9.3824 11.0689C9.50441 11.1213 9.61475 11.1975 9.707 11.293L11 12.586L14.293 9.29302C14.3852 9.19751 14.4956 9.12133 14.6176 9.06892C14.7396 9.01651 14.8708 8.98892 15.0036 8.98777C15.1364 8.98662 15.2681 9.01192 15.391 9.0622C15.5138 9.11248 15.6255 9.18673 15.7194 9.28063C15.8133 9.37452 15.8875 9.48617 15.9378 9.60907C15.9881 9.73196 16.0134 9.86364 16.0122 9.99642C16.0111 10.1292 15.9835 10.2604 15.9311 10.3824C15.8787 10.5044 15.8025 10.6148 15.707 10.707L11.707 14.707C11.5195 14.8945 11.2652 14.9998 11 14.9998C10.7348 14.9998 10.4805 14.8945 10.293 14.707L8.293 12.707C8.19749 12.6148 8.1213 12.5044 8.0689 12.3824C8.01649 12.2604 7.9889 12.1292 7.98775 11.9964C7.98659 11.8636 8.0119 11.732 8.06218 11.6091C8.11246 11.4862 8.18671 11.3745 8.2806 11.2806C8.3745 11.1867 8.48615 11.1125 8.60904 11.0622C8.73194 11.0119 8.86362 10.9866 8.9964 10.9878C9.12918 10.9889 9.2604 11.0165 9.3824 11.0689Z"
                  fill="white" />
              </svg>
            </div>

            <!-- Message -->
            <span class="text-sm font-medium">
              {{ message }}
            </span>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// Props
const props = defineProps({
  message: {
    type: String,
    default: "Operation successful"
  },
  duration: {
    type: Number,
    default: 3000
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close'])

// Reactive state
const showToast = ref(false)

// Watch for prop changes
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    showToast.value = true

    // Auto close after duration
    setTimeout(() => {
      closeToast()
    }, props.duration)
  } else {
    showToast.value = false
  }
})

const closeToast = () => {
  showToast.value = false
}

const onAfterLeave = () => {
  emit('close')
}

// For demo purposes - show toast on mount if isVisible is true
onMounted(() => {
  if (props.isVisible) {
    showToast.value = true

    setTimeout(() => {
      closeToast()
    }, props.duration)
  }
})
</script>

<style scoped>
/* Additional styles if needed */
.alert_wrapper {
  background: rgba(31, 132, 90, 1);
  color: white;
}
</style>