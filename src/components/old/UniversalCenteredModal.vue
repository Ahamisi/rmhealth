<template>
    <Transition name="modal" appear>
        <div v-if="show" class="fixed inset-0 bg-black/50 z-[99999999999999] flex items-center justify-center">
            <div class="rounded-lg bg-white w-[450px] max-w-[450px] mx-auto shadow-lg modal-content">
                <div class="relative flex items-center justify-between header">
                    <!-- Header -->
                    <div class="flex items-center gap-3">
                        <slot name="header"></slot>
                    </div>

                    <!-- Close Button -->
                    <button @click="$emit('close')" class="text-gray-400 transition-colors hover:text-gray-600">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M19.1846 11.4L16.0006 14.585L12.8146 11.399C12.7194 11.3058 12.5913 11.2539 12.458 11.2545C12.3248 11.255 12.1971 11.308 12.1026 11.402L11.4026 12.103C11.3547 12.149 11.3165 12.2041 11.2903 12.2651C11.2641 12.3261 11.2504 12.3918 11.25 12.4582C11.2496 12.5246 11.2626 12.5904 11.2881 12.6517C11.3137 12.7129 11.3512 12.7685 11.3986 12.815L14.5836 15.999L11.3996 19.185C11.3066 19.2804 11.2549 19.4086 11.2556 19.5418C11.2564 19.6751 11.3095 19.8027 11.4036 19.897L12.1036 20.597C12.3096 20.804 12.6196 20.797 12.8156 20.601L16.0016 17.416L19.1856 20.601C19.281 20.694 19.4092 20.7458 19.5425 20.745C19.6757 20.7443 19.8033 20.6911 19.8976 20.597L20.5986 19.897C20.6465 19.851 20.6846 19.7958 20.7108 19.7347C20.7369 19.6737 20.7505 19.608 20.7508 19.5416C20.7511 19.4752 20.738 19.4095 20.7124 19.3482C20.6868 19.2869 20.6491 19.2314 20.6016 19.185L17.4156 15.999L20.6016 12.815C20.6948 12.7197 20.7467 12.5916 20.7462 12.4584C20.7456 12.3251 20.6926 12.1975 20.5986 12.103L19.8986 11.403C19.8517 11.355 19.7958 11.3167 19.734 11.2905C19.6722 11.2642 19.6058 11.2504 19.5386 11.25C19.4728 11.2505 19.4078 11.2641 19.3472 11.2898C19.2866 11.3155 19.2317 11.353 19.1856 11.4H19.1846Z"
                                fill="#44546F" />
                        </svg>
                    </button>
                </div>

                <!-- Divider -->
                <div class="border-b border-gray-200 "></div>

                <!-- Body -->
                <div class="body">
                    <slot name="body"></slot>
                </div>

                <!-- Divider -->
                <div class="border-b border-gray-200 "></div>

                <!-- Footer -->
                <div class="footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
defineProps<{
    show: boolean;
}>();
</script>

<style scoped>
/* Modal transition styles */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
    transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
    transform: scale(0.95) translateY(-20px);
}

/* Existing styles */
.footer,
.header {
    padding: 16px;
}

.body {
    padding: 24px;
}

.discard_merge_alert_footer button,
.footer button {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    padding: 8px 16px;
    border-radius: 6px;
    color: rgba(23, 43, 77, 1);
}

.discard_merge_alert_footer .cancel_btn,
.footer .cancel_btn {
    background: rgba(9, 30, 66, 0.06);
}

.discard_merge_alert_footer button.approve_btn,
.footer button.approve_btn,
.discard_merge_alert_footer button.create_btn,
.footer .approve_btn {
    background: rgba(12, 102, 228, 1);
    color: white;
}

.footer .discard_merge_alert_footer .delete_btn,
.discard_merge_alert_footer .delete_btn ,
.footer .delete_btn {
    background: rgba(201, 55, 44, 1);
    color: white;
}

.discard_merge_alert_footer .discard_btn,
.footer .discard_btn {
    background: rgba(245, 205, 71, 1);
}

.body,
.discard_merge_alert_body_text {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    color: rgba(68, 84, 111, 1);
    line-height: 20px;
}
</style>