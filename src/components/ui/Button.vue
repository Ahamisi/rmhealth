<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    :style="buttonStyles"
    @click="$emit('click', $event)"
  >
    <component
      v-if="icon"
      :is="icon"
      :class="iconClasses"
    />
    <span v-if="$slots.default" :class="textClasses">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

// Button variant styles
const buttonVariants = {
  variant: {
    default: 'text-white shadow',
    destructive: 'bg-red-500 text-white shadow-sm hover:bg-red-600',
    outline: 'border border-gray-300 bg-white shadow-sm hover:bg-gray-50',
    secondary: 'bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200',
    ghost: 'hover:bg-gray-100',
    link: 'text-primary-500 underline-offset-4 hover:underline',
  },
  size: {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-11 rounded-lg px-8',
    icon: 'h-9 w-9',
  },
}

const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  icon?: any
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
  loading: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const variant = props.variant || 'default'
  const size = props.size || 'default'
  
  return cn(
    baseClasses,
    buttonVariants.variant[variant],
    buttonVariants.size[size],
    variant === 'default' ? 'hover:opacity-90' : ''
  )
})

const buttonStyles = computed(() => {
  const variant = props.variant || 'default'
  if (variant === 'default') {
    return {
      backgroundColor: '#0C66E4'
    }
  }
  return {}
})

const iconClasses = computed(() => {
  const baseClasses = 'flex-shrink-0'
  if (props.size === 'sm') return `${baseClasses} w-3 h-3`
  if (props.size === 'lg') return `${baseClasses} w-5 h-5`
  return `${baseClasses} w-4 h-4`
})

const textClasses = computed(() => {
  if (props.icon && props.size !== 'icon') {
    return 'ml-2'
  }
  return ''
})
</script> 