<template>
    <div class="">
        <slot name="label"></slot>
        <v-select v-if="props.options" :options="props.options" :label="label" :placeholder="placeholder"
            @option:selected="optionSelected" v-model="tempValue">
            <template #no-options>
                Type to search {{ tag }}...
            </template>
        </v-select>
        <v-select v-else-if="props.url" :options="data" :label="label" :placeholder="placeholder"
            @option:selected="optionSelected" v-model="tempValue" @search="onSearch" :loading="loading">
            <template #no-options>
                Type to search {{ tag }}...
            </template>
        </v-select>
        <slot name="description"></slot>
    </div>
    <div class="flex flex-wrap gap-2 multi_select_item_container">
        <section class="flex items-center gap-2 py-[6px] rounded-lg px-2 w-fit multi_select_item"
            v-for="item in selectedItems" :key="`secondary_${item.id}`">
            <span>{{ item[label] }}</span>
            <button @click="removeItem(item)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8.00027 7.05739L4.4716 3.52872C4.34587 3.40728 4.17747 3.34009 4.00267 3.3416C3.82787 3.34312 3.66066 3.41324 3.53706 3.53684C3.41345 3.66045 3.34334 3.82766 3.34182 4.00245C3.3403 4.17725 3.4075 4.34565 3.52894 4.47139L7.05761 8.00005L3.52894 11.5287C3.4075 11.6545 3.3403 11.8229 3.34182 11.9977C3.34334 12.1725 3.41345 12.3397 3.53706 12.4633C3.66066 12.5869 3.82787 12.657 4.00267 12.6585C4.17747 12.66 4.34587 12.5928 4.4716 12.4714L8.00027 8.94272L11.5289 12.4714C11.6547 12.5928 11.8231 12.66 11.9979 12.6585C12.1727 12.657 12.3399 12.5869 12.4635 12.4633C12.5871 12.3397 12.6572 12.1725 12.6587 11.9977C12.6602 11.8229 12.593 11.6545 12.4716 11.5287L8.94294 8.00005L12.4716 4.47139C12.5353 4.40989 12.5861 4.33633 12.621 4.25499C12.6559 4.17365 12.6743 4.08617 12.6751 3.99766C12.6759 3.90914 12.659 3.82135 12.6255 3.73942C12.592 3.65749 12.5425 3.58305 12.4799 3.52046C12.4173 3.45786 12.3428 3.40836 12.2609 3.37484C12.179 3.34132 12.0912 3.32445 12.0027 3.32522C11.9142 3.32599 11.8267 3.34438 11.7453 3.37932C11.664 3.41426 11.5904 3.46505 11.5289 3.52872L8.00027 7.05739Z"
                        fill="#44546F" />
                </svg>
            </button>
        </section>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from "@/stores/auth";



interface Props {
    options?: Array<{ id: number }>;
    url?: string;
    tag: string;
    placeholder: string;
    label: string,
    excludeId?: number | null;
    axiosResultField?: string;
    modelValue?: Array<{ id: number }>;
}

const props = defineProps<Props>();
const emit = defineEmits(['selected', 'update:modelValue']);

const selectedItems = ref([]);
watch(() => props.modelValue, (newValue) => {
    if (newValue && Array.isArray(newValue) && newValue.length) {
        selectedItems.value = props.options ? props.options.filter(item => newValue.some(v => v.id === item.id)) : newValue;
    }
}, { immediate: true });

const tempValue = ref(null);
const loading = ref(false);
const data = ref([]);
const toast = useToast();
const authStore = useAuthStore();
let debounceTimeout: ReturnType<typeof setTimeout>;

const optionSelected = (option) => {
    if (!selectedItems.value.some(item => item.id === option.id)) {
        selectedItems.value.push(option);
        emit('update:modelValue', selectedItems.value);
    }
    tempValue.value = null;
};

const removeItem = (item) => {
    selectedItems.value = selectedItems.value.filter(i => i.id !== item.id);
    emit('update:modelValue', selectedItems.value);
};

const onSearch = (query: string) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        if (query.length >= 3) {
            fetchData(query);
        }
    }, 500);
};

const fetchData = (query: string) => {
    loading.value = true;
    axios.get(props.url, { params: { search: query, searchTerm: query, current_branch: authStore.selectedBranch.id } })
        .then(response => {
            data.value = props.axiosResultField ? response.data[props.axiosResultField] : response.data;
            if (props.excludeId) {
                data.value = data.value.filter(item => item.id !== props.excludeId);
            }
            loading.value = false;
        })
        .catch(err => {
            error(err);
            loading.value = false;
        });
};

const error = (err) => {
    let errorMessage = '';
    if (Array.isArray(err.response.data.error)) {
        errorMessage = "<p>" + err.response.data.error.join("</p><p>") + "</p>";
    } else {
        errorMessage = err.response.data.error != undefined ? "<p>" + err.response.data.error + "</p>" : "<p>" + err.response.data.message + "</p>";
    }
    toast.error(errorMessage);
}
</script>

<style>
div.flex.flex-wrap.gap-2.multi_select_item_container {
    margin-top: 0.35em;
}

.multi_select_item {
    border: 2px solid rgba(9, 30, 66, 0.14);
    font-size: 11px;
    font-style: normal;
    font-weight: 700;
    line-height: 16px;
    color: rgba(98, 111, 134, 1);
}

.vs__dropdown-option {
    font-size: 14px;
    padding: 0.5em 1.5em;
    color: rgb(31, 37, 49);
}

.vs__dropdown-option--highlight {
    background: rgb(236, 236, 236);
}
</style>