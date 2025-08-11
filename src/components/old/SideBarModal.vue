<template>
	<!-- Dark overlay -->
	<div v-if="isOpen" class="fixed inset-0 transition-opacity duration-300 bg-black bg-opacity-50 sidebar_overlay"
		:class="{ 'opacity-100': showModal, 'opacity-0': !showModal }" @click="closeModal">

		<!-- Sidebar modal -->
		<div class="fixed top-0 right-0 h-full overflow-y-auto transition-transform duration-300 ease-in-out bg-white shadow-2xl content"
			:class="[
				showModal ? 'translate-x-0' : 'translate-x-full',
				widthClass
			]" @click.stop>
			<!-- Header -->
			<div class="flex items-center justify-between py-3 pl-6 pr-2 modal_header">
				<h2 class="flex items-center gap-2 modal_title">{{ title }} <span v-html="extraHeader"></span></h2>
				<button @click="closeModal" class="text-gray-400 transition-colors hover:text-gray-600">
					<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd"
							d="M19.1846 11.4L16.0006 14.585L12.8146 11.399C12.7194 11.3058 12.5913 11.2539 12.458 11.2545C12.3248 11.255 12.1971 11.308 12.1026 11.402L11.4026 12.103C11.3547 12.149 11.3165 12.2041 11.2903 12.2651C11.2641 12.3261 11.2504 12.3918 11.25 12.4582C11.2496 12.5246 11.2626 12.5904 11.2881 12.6517C11.3137 12.7129 11.3512 12.7685 11.3986 12.815L14.5836 15.999L11.3996 19.185C11.3066 19.2804 11.2549 19.4086 11.2556 19.5418C11.2564 19.6751 11.3095 19.8027 11.4036 19.897L12.1036 20.597C12.3096 20.804 12.6196 20.797 12.8156 20.601L16.0016 17.416L19.1856 20.601C19.281 20.694 19.4092 20.7458 19.5425 20.745C19.6757 20.7443 19.8033 20.6911 19.8976 20.597L20.5986 19.897C20.6465 19.851 20.6846 19.7958 20.7108 19.7347C20.7369 19.6737 20.7505 19.608 20.7508 19.5416C20.7511 19.4752 20.738 19.4095 20.7124 19.3482C20.6868 19.2869 20.6491 19.2314 20.6016 19.185L17.4156 15.999L20.6016 12.815C20.6948 12.7197 20.7467 12.5916 20.7462 12.4584C20.7456 12.3251 20.6926 12.1975 20.5986 12.103L19.8986 11.403C19.8517 11.355 19.7958 11.3167 19.734 11.2905C19.6722 11.2642 19.6058 11.2504 19.5386 11.25C19.4728 11.2505 19.4078 11.2641 19.3472 11.2898C19.2866 11.3155 19.2317 11.353 19.1856 11.4H19.1846Z"
							fill="#44546F" />
					</svg>
				</button>
			</div>

			<!-- Form content slot -->
			<div class="p-6 modal_content">
				<slot :close-modal="closeModal" :form-data="internalFormData" :update-form-data="updateFormData"></slot>
			</div>

			<!-- Footer slot -->
			<div v-if="$slots.footer" class="p-6 border-t border-gray-200">
				<slot name="footer" :close-modal="closeModal" :form-data="internalFormData"
					:update-form-data="updateFormData" :show-discard-warning="showDiscardWarning"
					:trigger-discard-warning="() => emit('showDiscardWarning')"></slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed, onUnmounted } from 'vue'

// defineOptions({
// 	name: 'SideBarModal'
// });

interface Props {
	title: string;
	isOpen: boolean;
	showDiscardWarning?: boolean;
	width?: 'sm' | 'md' | 'lg' | 'xl';
	initialFormData?: Record<string, any>;
	extraHeader?: HTMLElement
}

const props = withDefaults(defineProps<Props>(), {
	width: 'md',
	initialFormData: () => ({})
})

const emit = defineEmits<{
	'update:isOpen': [value: boolean]
	'close': []
	'formDataChange': [data: Record<string, any>]
	'showDiscardWarning': []
}>()

const showModal = ref(false)
const internalFormData = ref({ ...props.initialFormData })

// Store original body style to restore later
const originalBodyStyle = ref('')

const widthClass = computed(() => {
	const widthMap = {
		sm: 'md:w-80 w-[90vw]',
		md: 'md:w-96 w-[90vw]',
		lg: 'md:w-[28rem] w-[90vw]',
		xl: 'md:w-[45rem] w-[90vw]'
	}
	return widthMap[props.width]
})

const preventBodyScroll = () => {
	const body = document.body;
	originalBodyStyle.value = body.style.cssText;

	body.classList.add('modal-open');
	// Additional styles for better mobile support
	body.style.overflow = 'hidden';
	body.style.position = 'fixed';
	body.style.top = '0';
	body.style.left = '0';
	body.style.right = '0';
	body.style.bottom = '0';
}

const restoreBodyScroll = () => {
	const body = document.body;
	body.classList.remove('modal-open');

	// Restore original styles
	if (originalBodyStyle.value) {
		body.style.cssText = originalBodyStyle.value;
	} else {
		// Fallback: remove the styles we added
		body.style.overflow = '';
		body.style.position = '';
		body.style.top = '';
		body.style.left = '';
		body.style.right = '';
		body.style.bottom = '';
	}
}

watch(() => props.isOpen, async (newValue) => {
	if (newValue) {
		preventBodyScroll();
		showModal.value = false;
		// Wait for DOM update before triggering animation
		await nextTick()
		// Small delay to ensure the modal is rendered in hidden state first
		setTimeout(() => {
			showModal.value = true
		}, 50)
	} else {
		// Start closing animation
		showModal.value = false
		// Wait for animation to complete before restoring scroll
		setTimeout(() => {
			restoreBodyScroll();
			emit('update:isOpen', false)
			emit('close')
		}, 300) // Match transition duration
	}
})

// Cleanup if component unmounts while modal is open
onUnmounted(() => {
	if (props.isOpen) {
		restoreBodyScroll();
	}
});

watch(() => props.initialFormData, (newValue) => {
	internalFormData.value = { ...newValue }
}, { deep: true })

const closeModal = () => {
	showModal.value = false
	setTimeout(() => {
		restoreBodyScroll();
		emit('update:isOpen', false)
		emit('close')
	}, 300) // Match transition duration
}

const updateFormData = (updates: Record<string, any>) => {
	internalFormData.value = { ...internalFormData.value, ...updates }
	emit('formDataChange', internalFormData.value)
}

// Initialize showModal based on isOpen prop
if (props.isOpen) {
	preventBodyScroll();
	// Start hidden and animate in
	showModal.value = false
	nextTick(() => {
		setTimeout(() => {
			showModal.value = true
		}, 50)
	})
}

defineExpose({
	closeModal
})

</script>

<style>
.sidebar_overlay {
	z-index: 9999;
}

.sidebar_overlay .content {
	z-index: 99999;
}

.sidebar_overlay .modal_header {
	font-size: 16px;
	font-style: normal;
	font-weight: 450;
	line-height: 20px;
	color: rgba(23, 43, 77, 1);
	border-bottom: 0.5px solid rgba(9, 30, 66, 0.14);
}

.sidebar_overlay .modal_content {
	height: 85vh;
	overflow-y: auto;
}

.sidebar_overlay .modal_content label {
	font-size: 12px;
	font-style: normal;
	font-weight: 350;
	line-height: 16px;
	color: rgba(68, 84, 111, 1);
	display: block;
	margin-bottom: 0.5em;
}

.sidebar_overlay .modal_content input:not(.vs__search):not(.dataTableSearch),
.sidebar_overlay .modal_content select {
	border: 2px solid rgba(9, 30, 66, 0.14);
	padding: 8px;
	border-radius: 8px;
	background: white;
	overflow: hidden;
	color: rgba(98, 111, 134, 1);
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 14px;
	font-style: normal;
	font-weight: 300;
	line-height: 20px;
}

.sidebar_overlay .modal_content input.price {
	padding-left: 1.65em;
}

.sidebar_overlay .cancel_btn,
.sidebar_overlay .grey_btn,
.sidebar_overlay .create_btn,
.sidebar_overlay .approve_btn {
	padding: 8px 16px;
	border-radius: 6px;
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	line-height: 16px;
}

.sidebar_overlay .cancel_btn,
.sidebar_overlay .grey_btn {
	color: rgba(23, 43, 77, 1);
	background: rgba(9, 30, 66, 0.06);
}

.sidebar_overlay .create_btn,
.sidebar_overlay .approve_btn {
	background: rgba(12, 102, 228, 1);
	color: white;
}

/* Enhanced body scroll prevention - works on all devices including mobile */
body.modal-open {
	overflow: hidden !important;
	position: fixed !important;
	top: 0 !important;
	left: 0 !important;
	right: 0 !important;
	bottom: 0 !important;
	width: 100% !important;
	height: 100vh !important;
}

/* Prevent touch scrolling on iOS */
.sidebar_overlay {
	-webkit-overflow-scrolling: touch;
}

/* Ensure modal content can still scroll */
.sidebar_overlay .modal_content {
	-webkit-overflow-scrolling: touch;
	overflow-y: auto;
}

input[type="text"]:focus:not(.vs__search):not(.dataTableSearch),
input[type="number"]:focus:not(.vs__search):not(.dataTableSearch),
select:focus:focus:not(.vs__search):not(.dataTableSearch) {
	border: 2px solid rgb(8, 8, 197);
	color: rgb(14, 14, 97);
}
</style>