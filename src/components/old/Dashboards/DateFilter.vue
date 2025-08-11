<template>
  <div class="relative block text-left dateFilter" ref="dropdownRef">
    <!-- Filter Button -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-x-3">
        <button @click="toggleDropdown"
          class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100 filter_btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M6.99999 13H17L18 11H5.99999L6.99999 13ZM3.99299 6C3.44499 6 3.20299 6.405 3.44699 6.895L3.99999 8H20L20.553 6.895C20.8 6.4 20.555 6 20.007 6H3.99299ZM10.778 17.556C10.8509 17.6861 10.9561 17.7953 11.0834 17.8731C11.2107 17.9508 11.3559 17.9945 11.505 18H12.495C12.774 18 13.1 17.8 13.222 17.556L14 16H9.99999L10.778 17.556Z"
              fill="#44546F" />
          </svg>


          Filter
        </button>
        <div class="flex items-center date_filtered gap-x-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M4.995 5H19.005C20.107 5 21 5.895 21 6.994V19.006C21 19.2679 20.9484 19.5273 20.8481 19.7693C20.7478 20.0113 20.6009 20.2312 20.4156 20.4163C20.2304 20.6015 20.0104 20.7484 19.7684 20.8485C19.5263 20.9487 19.2669 21.0001 19.005 21H4.995C4.46607 21 3.95878 20.7899 3.58468 20.416C3.21057 20.0421 3.00027 19.5349 3 19.006V6.994C3 5.893 3.892 5 4.995 5ZM5 9V18C5 18.2652 5.10536 18.5196 5.29289 18.7071C5.48043 18.8946 5.73478 19 6 19H18C18.2652 19 18.5196 18.8946 18.7071 18.7071C18.8946 18.5196 19 18.2652 19 18V9H5ZM6 4C6 3.73478 6.10536 3.48043 6.29289 3.29289C6.48043 3.10536 6.73478 3 7 3C7.26522 3 7.51957 3.10536 7.70711 3.29289C7.89464 3.48043 8 3.73478 8 4V5H6V4ZM16 4C16 3.73478 16.1054 3.48043 16.2929 3.29289C16.4804 3.10536 16.7348 3 17 3C17.2652 3 17.5196 3.10536 17.7071 3.29289C17.8946 3.48043 18 3.73478 18 4V5H16V4ZM7 13V10.999H9V13H7ZM15 13V10.999H17V13H15ZM11 13V10.999H13.001V13H11ZM7 17V15H9V17H7ZM11 17V15H13.001V17H11ZM15 17V15H17V17H15Z"
              fill="#626F86" />
          </svg>

          <span> {{ showDate }}</span>
        </div>
      </div>

      <button class="flex items-center px-1 py-2 text-white rounded download_btn gap-x-1">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.687 17.292C10.5956 17.1997 10.4868 17.1264 10.3669 17.0764C10.247 17.0264 10.1184 17.0007 9.9885 17.0007C9.8586 17.0007 9.72998 17.0264 9.61009 17.0764C9.49019 17.1264 9.3814 17.1997 9.29 17.292C9.10466 17.4792 9.0007 17.732 9.0007 17.9955C9.0007 18.259 9.10466 18.5118 9.29 18.699L11.254 20.679C11.3546 20.7807 11.4744 20.8613 11.6064 20.9164C11.7384 20.9715 11.88 20.9998 12.023 20.9998C12.166 20.9998 12.3076 20.9715 12.4396 20.9164C12.5716 20.8613 12.6914 20.7807 12.792 20.679L14.711 18.746C14.8966 18.5587 15.0008 18.3057 15.0008 18.042C15.0008 17.7783 14.8966 17.5253 14.711 17.338C14.6196 17.2455 14.5107 17.1721 14.3907 17.122C14.2708 17.0719 14.142 17.0462 14.012 17.0462C13.882 17.0462 13.7532 17.0719 13.6333 17.122C13.5133 17.1721 13.4044 17.2455 13.313 17.338L12.023 18.638L10.687 17.292Z"
            fill="white" />
          <path
            d="M13.001 19.993L13 10.006C13 9.451 12.552 9 12 9C11.448 9 11 9.45 11 10.007L11.001 19.994C11.001 20.549 11.449 21 12.001 21C12.553 21 13.001 20.55 13.001 19.993Z"
            fill="white" />
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M7.938 5.48C7.68111 5.4383 7.42125 5.41757 7.161 5.418C4.356 5.418 2 7.62 2 10.498C2 13.409 4.385 16 7.1 16H9.981V14.007H7.1C5.443 14.007 3.985 12.344 3.985 10.499C3.985 8.721 5.454 7.412 7.089 7.412H7.101C7.49 7.412 7.787 7.462 8.071 7.562L8.241 7.625C8.846 7.873 9.116 7.379 9.116 7.379L9.266 7.112C9.996 5.765 11.467 5.016 12.982 4.992C13.9871 5.00203 14.9543 5.37742 15.703 6.04812C16.4517 6.71882 16.9309 7.63901 17.051 8.637L17.097 8.977C17.097 8.977 17.168 9.502 17.762 9.502C17.775 9.502 17.774 9.507 17.785 9.507H18.039C19.175 9.507 20.015 10.466 20.015 11.665C20.015 12.872 19.028 14.007 17.945 14.007H13.981V16H17.945C20.105 16 22 13.955 22 11.665C22 9.665 20.688 8.002 18.862 7.591C18.155 4.884 15.809 3.039 12.976 3C11.001 3.02 9.075 3.9 7.938 5.48Z"
            fill="white" />
        </svg>
        <span>Download Report</span>
      </button>
    </div>

    <!-- Dropdown -->
    <div v-if="isOpen" class="absolute left-0 z-50 bg-white border-gray-300 rounded-md shadow w-fit">
      <h2 class="px-6 py-4 text-sm font-semibold text-gray-700 filter_title">Filter</h2>

      <!-- Date Inputs -->
      <div class="flex items-baseline gap-4 px-4 pb-4 space-y-4 dates">
        <div>
          <label class="block mb-1 text-sm text-gray-600">From</label>
          <div class="relative">
            <input type="date" v-model="from" class="w-40 p-2 pr-10 text-sm border border-gray-300 rounded-md" ref="fromDateInput" @focus="$refs.fromDateInput.showPicker && $refs.fromDateInput.showPicker()"/>
            <div class="absolute text-gray-500 cursor-pointer right-3 top-2" @click="() => $refs.fromDateInput.showPicker ? $refs.fromDateInput.showPicker() : $refs.fromDateInput.focus()">
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M5.32825 5H19.3383C20.4403 5 21.3333 5.895 21.3333 6.994V19.006C21.3333 19.2679 21.2816 19.5273 21.1814 19.7693C21.0811 20.0113 20.9341 20.2312 20.7489 20.4163C20.5636 20.6015 20.3437 20.7484 20.1016 20.8485C19.8596 20.9487 19.6002 21.0001 19.3383 21H5.32825C4.79932 21 4.29203 20.7899 3.91793 20.416C3.54382 20.0421 3.33352 19.5349 3.33325 19.006V6.994C3.33325 5.893 4.22525 5 5.32825 5ZM5.33325 9V18C5.33325 18.2652 5.43861 18.5196 5.62615 18.7071C5.81368 18.8946 6.06804 19 6.33325 19H18.3333C18.5985 19 18.8528 18.8946 19.0404 18.7071C19.2279 18.5196 19.3333 18.2652 19.3333 18V9H5.33325ZM6.33325 4C6.33325 3.73478 6.43861 3.48043 6.62615 3.29289C6.81368 3.10536 7.06804 3 7.33325 3C7.59847 3 7.85282 3.10536 8.04036 3.29289C8.22789 3.48043 8.33325 3.73478 8.33325 4V5H6.33325V4ZM16.3333 4C16.3333 3.73478 16.4386 3.48043 16.6261 3.29289C16.8137 3.10536 17.068 3 17.3333 3C17.5985 3 17.8528 3.10536 18.0404 3.29289C18.2279 3.48043 18.3333 3.73478 18.3333 4V5H16.3333V4ZM7.33325 13V10.999H9.33325V13H7.33325ZM15.3333 13V10.999H17.3333V13H15.3333ZM11.3333 13V10.999H13.3343V13H11.3333ZM7.33325 17V15H9.33325V17H7.33325ZM11.3333 17V15H13.3343V17H11.3333ZM15.3333 17V15H17.3333V17H15.3333Z"
                  fill="#44546F" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label class="block mb-1 text-sm text-gray-600">To</label>
          <div class="relative">
            <input type="date" v-model="to" class="w-40 p-2 pr-10 text-sm border border-gray-300 rounded-md" ref="toDateInput" @focus="$refs.toDateInput.showPicker && $refs.toDateInput.showPicker()" />
            <div class="absolute text-gray-500 cursor-pointer right-3 top-2"  @click="() => $refs.toDateInput.showPicker ? $refs.toDateInput.showPicker() : $refs.toDateInput.focus()">
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M5.32825 5H19.3383C20.4403 5 21.3333 5.895 21.3333 6.994V19.006C21.3333 19.2679 21.2816 19.5273 21.1814 19.7693C21.0811 20.0113 20.9341 20.2312 20.7489 20.4163C20.5636 20.6015 20.3437 20.7484 20.1016 20.8485C19.8596 20.9487 19.6002 21.0001 19.3383 21H5.32825C4.79932 21 4.29203 20.7899 3.91793 20.416C3.54382 20.0421 3.33352 19.5349 3.33325 19.006V6.994C3.33325 5.893 4.22525 5 5.32825 5ZM5.33325 9V18C5.33325 18.2652 5.43861 18.5196 5.62615 18.7071C5.81368 18.8946 6.06804 19 6.33325 19H18.3333C18.5985 19 18.8528 18.8946 19.0404 18.7071C19.2279 18.5196 19.3333 18.2652 19.3333 18V9H5.33325ZM6.33325 4C6.33325 3.73478 6.43861 3.48043 6.62615 3.29289C6.81368 3.10536 7.06804 3 7.33325 3C7.59847 3 7.85282 3.10536 8.04036 3.29289C8.22789 3.48043 8.33325 3.73478 8.33325 4V5H6.33325V4ZM16.3333 4C16.3333 3.73478 16.4386 3.48043 16.6261 3.29289C16.8137 3.10536 17.068 3 17.3333 3C17.5985 3 17.8528 3.10536 18.0404 3.29289C18.2279 3.48043 18.3333 3.73478 18.3333 4V5H16.3333V4ZM7.33325 13V10.999H9.33325V13H7.33325ZM15.3333 13V10.999H17.3333V13H15.3333ZM11.3333 13V10.999H13.3343V13H11.3333ZM7.33325 17V15H9.33325V17H7.33325ZM11.3333 17V15H13.3343V17H11.3333ZM15.3333 17V15H17.3333V17H15.3333Z"
                  fill="#44546F" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex items-center justify-between p-4 footer_buttons">
        <button @click="reset" class="px-3 py-2 text-gray-700 rounded-md hover:bg-gray-200 reset_btn">
          Reset all
        </button>
        <button @click="apply" class="px-4 py-2 text-white rounded-md hover:bg-blue-700 apply_btn">
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount,  computed  } from "vue";
import dayjs from 'dayjs'

const props = defineProps<{
  has_download?: boolean;
  url?: string;
  download_text?: string;
}>()

const isOpen = ref(false);
const from = ref('');
const to = ref('');
const dropdownRef = ref<HTMLElement | null>(null);
const emit = defineEmits(['dateFiltered'])
const showDate = computed(() => {
  let date = '';
  if (from.value && to.value) {
    date = `Date Period: ${dayjs(from.value).format('DD MMM, YYYY')} to ${dayjs(to.value).format('DD MMM, YYYY')}`
  }else if(from.value && !to.value) {
    date = `Start Date: ${dayjs(from.value).format('DD MMM, YYYY')}`;
  }else if(!from.value && to.value) {
    date = `End Date: ${dayjs(to.value).format('DD MMM, YYYY')}`
  }else{
    date = 'This Month: ' + dayjs().format('MMMM YYYY');
  }
  return date;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const reset = () => {
  from.value = '';
  to.value = '';
};

const apply = () => {
  isOpen.value = false;
  emit('dateFiltered', { from_date: from.value, to_date: to.value })
  console.log('Filter applied:', { from_date: from.value, to_date: to.value });
};

// Click outside handler
const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  // to.value = dayjs(new Date().toISOString().split('T')[0]).format('DD MMM, YYYY');
  // from.value = dayjs().startOf('month').format('DD MMM, YYYY'); 
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.filter_title {
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  color: rgba(23, 43, 77, 1);
  border-bottom: 0.5px solid rgba(9, 30, 66, 0.14);
}

.dates {
  border-bottom: 0.5px solid rgba(9, 30, 66, 0.14);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: rgba(98, 111, 134, 1);
}

.footer_buttons button {
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
}

.footer_buttons .reset_btn {
  background: rgba(9, 30, 66, 0.06)
}

.footer_buttons .apply_btn {
  background: rgba(12, 102, 228, 1);
}

.filter_btn {
  font-size: 12px;
  font-style: normal;
  font-weight: 590;
  line-height: 16px;
  letter-spacing: -0.25px;
  height: 32px;
  min-height: 32px;
  padding: 0 8px;
  color: rgba(68, 84, 111, 1);
}

.date_filtered {
  font-size: 12px;
  font-style: normal;
  font-weight: 590;
  line-height: 16px;
  /* 133.333% */
  letter-spacing: -0.25px;
  color: rgba(98, 111, 134, 1);
}

.download_btn {
  background: rgba(12, 102, 228, 1);
  font-size: 12px;
  font-style: normal;
  font-weight: 590;
  line-height: 16px;
  letter-spacing: -0.25px;
  min-height: 32px;
  padding: 2px 8px;
}

.dateFilter input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
}

.dateFilter input[type="date"] {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: rgba(98, 111, 134, 1);
}
</style>
