<template>
  <div class="relative">
    <!-- Trigger Button -->
    <button
      @click="$emit('toggle')"
      class="block py-3 text-xs border-b-2 border-transparent nav-link navigation-text text-text-subtle hover:border-gray-200 flex items-center"
      :class="{
        '!border-blue-600 !text-blue-600': isOpen,
      }"
    >
      {{ title }}
      <svg
        v-if="!useThreeDots"
        class="ml-1 w-3 h-3 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        v-else
        class="ml-1 w-3 h-3"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
        />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute top-full left-0 z-50 min-w-48 py-1 bg-white border border-gray-200 rounded-md shadow-lg"
      >
        <div v-for="(item, index) in items" :key="index">
          <router-link
            v-if="item.route && typeof item.route === 'object'"
            :to="item.route"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click="$emit('close')"
          >
            {{ item.title }}
          </router-link>
          <a
            v-else-if="item.route"
            :href="item.route"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click="$emit('close')"
          >
            {{ item.title }}
          </a>
          <button
            v-else
            class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click="$emit('close')"
          >
            {{ item.title }}
          </button>
          <hr v-if="item.has_bottom_rule" class="border-gray-200" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface DropdownItem {
  title: string
  route?: string | object
  has_bottom_rule?: boolean
}

interface Props {
  title: string
  items: DropdownItem[]
  isOpen: boolean
  useThreeDots?: boolean
}

defineProps<Props>()

defineEmits<{
  toggle: []
  close: []
}>()
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.navigation-text {
  color: rgba(68, 84, 111, 1);
  font-weight: 500;
}

.text-text-subtle {
  color: rgba(68, 84, 111, 1);
}
</style> 