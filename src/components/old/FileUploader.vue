<template>
    <FileUpload
        name="images"
        :multiple="allowMultiple !== false"
        :accept="acceptType"
        :maxFileSize="maxFileSize"
        @select="onSelectedFiles"
        :auto="false"
        :customUpload="true"
        :showUploadButton="false"
        :showCancelButton="false"
        ref="fileUploadRef"
    >
        <!-- Header Slot -->
        <template #header="{ chooseCallback, clearCallback, files }">
            <div class="flex flex-wrap items-center justify-between flex-1 gap-4">
                <div class="flex gap-2">
                    <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined severity="secondary" />
                    <Button @click="emitFiles" icon="pi pi-cloud-upload" rounded outlined severity="success"
                        :disabled="!files || files.length === 0" />
                    <Button @click="clearCallback()" icon="pi pi-times" rounded outlined severity="danger"
                        :disabled="!files || files.length === 0" />
                </div>
                <ProgressBar :value="totalSizePercent" :showValue="false" class="w-full h-1 md:w-20rem md:ml-auto">
                    <span class="whitespace-nowrap">{{ formatSize(totalSize) }} / {{ formatSize(maxFileSize) }}</span>
                </ProgressBar>
            </div>
        </template>

        <!-- Content Slot -->
        <template #content="{ files, removeFileCallback, messages }">
            <div class="flex flex-col gap-8 pt-4">
                <Message v-for="(message, i) in messages" :key="i" class="mb-2" severity="error">
                    {{ message }}
                </Message>

                <div v-if="files.length > 0">
                    <h5>Selected Files</h5>
                    <div class="flex flex-wrap gap-4">
                        <div v-for="(file, index) in files" :key="file.name + file.type + file.size"
                            class="flex flex-col items-center gap-4 p-8 border rounded-border border-surface">
                            <img :src="file.objectURL" :alt="file.name" width="100" height="50" />
                            <span class="overflow-hidden font-semibold text-ellipsis max-w-60 whitespace-nowrap">
                                {{ file.name }}
                            </span>
                            <div>{{ formatSize(file.size) }}</div>
                            <Badge value="Pending" severity="warn" />
                            <Button icon="pi pi-times" @click="removeFileCallback(index)" outlined rounded
                                severity="danger" />
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- Empty Slot -->
        <template #empty>
            <div class="flex flex-col items-center justify-center">
                <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
                <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
            </div>
        </template>
    </FileUpload>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { FileUploadSelectEvent } from 'primevue/fileupload';

// Props
const props = defineProps<{
    maxFileSize?: number;
    fileType?: string;
    allowMultiple?: boolean;
}>();

// Emits
const emit = defineEmits<{
    (e: 'update:files', files: File[]): void;
}>();

// Defaults
const maxFileSize = props.maxFileSize ?? 1000000;
const acceptType = props.fileType ?? 'image/*';

const fileUploadRef = ref<any>(null);

// File selection handler
const onSelectedFiles = (event: FileUploadSelectEvent) => {
    emit('update:files', event.files);
};

// Trigger emit manually (e.g., via button click)
const emitFiles = () => {
    const files = fileUploadRef.value?.files || [];
    emit('update:files', files);
};

// Format bytes nicely
const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Computed total size
const totalSize = computed(() => {
    const files: File[] = fileUploadRef.value?.files || [];
    return files.reduce((sum, file) => sum + file.size, 0);
});

// Computed percent used
const totalSizePercent = computed(() => {
    return (totalSize.value / maxFileSize) * 100;
});
</script>
