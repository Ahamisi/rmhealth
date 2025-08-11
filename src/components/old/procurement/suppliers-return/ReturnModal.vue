<script setup lang="ts">
import { LucideX, LucideCamera } from "lucide-vue-next";
import { useModal } from "@/Composables/procurement/useModal";
import UiSelectField from "@/Components/procurement/ui/SelectField.vue";
import UiUpload from "@/Components/procurement/ui/Upload.vue";
import { ref } from "vue";
import { useCategory } from "@/Composables/procurement/useCategory";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue"]);
const { closeModal } = useModal();

const close = () => {
  emit("update:modelValue", false);
};

const onSubmit = () => {
  console.log("Creating Supplier...");
  close();
};
const supplierTypes = ref([
  {
    id: 1,
    name: "Local",
    position: "CEO",
    avatar: "https://randomuser.me/api/portraits/men/62.jpg",
  },
  {
    id: 2,
    name: "Overseas",
    position: "COO",
    avatar: "https://randomuser.me/api/portraits/women/62.jpg",
  },
]);

// const supplierCategories = ref([
//   {
//     id: 1,
//     name: "Medical",
//     position: "CEO",
//     avatar: "https://randomuser.me/api/portraits/men/62.jpg",
//   },
//   {
//     id: 2,
//     name: "Logistics",
//     position: "COO",
//     avatar: "https://randomuser.me/api/portraits/women/62.jpg",
//   },
// ]);
// const supplierCategory = ref(null);
const { supplierCategory, supplierCategories } = useCategory();

const supplierBanks = ref([
  {
    id: 1,
    name: "UBA",
    position: "CEO",
    avatar: "https://randomuser.me/api/portraits/men/62.jpg",
  },
  {
    id: 2,
    name: "Access Bank",
    position: "COO",
    avatar: "https://randomuser.me/api/portraits/women/62.jpg",
  },
  {
    id: 2,
    name: "Zenith Bank",
    position: "COO",
    avatar: "https://randomuser.me/api/portraits/women/62.jpg",
  },
]);

const supplierType = ref(null);
const supplierBank = ref(null);
</script>

<template>
  <Transition name="slide">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-center z-50"
      v-if="modelValue"
      @click.stop="close"
    >
      <div
        class="fixed top-0 right-0 max-w-1/2 h-full bg-white shadow-lg z-50 overflow-y-auto transition-transform"
        @click.stop
      >
        <div class="p-8 text-gray-600">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Create Supplier</h2>
            <LucideX
              class="cursor-pointer w-6 h-6 text-gray-600"
              @click="close"
            />
          </div>

          <UiUpload :imagePlaceholder="'/supplier-placeholder.png'"></UiUpload>

          <div class="grid grid-cols-2 gap-6 mt-6 text-gray-500">
            <div>
              <label class="text-xs font-semibold mb-2 block"
                >Supplier Name</label
              >
              <input
                type="text"
                placeholder="Enter a supplier name"
                class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3 bg-white"
              />
            </div>

            <div>
              <label class="text-xs font-semibold mb-2 block"
                >Type of Supplier</label
              >

              <UiSelectField
                v-model="supplierType"
                :options="supplierTypes"
                :placeholder="`Search a Type`"
              />
              <!-- <p class="mt-4">Selected: {{ selectedPerson?.name }}</p> -->
            </div>

            <div>
              <label class="text-xs font-semibold mb-2 block">Category</label>
              <UiSelectField
                v-model="supplierCategory"
                :options="supplierCategories"
                :placeholder="`Select a category`"
              />
            </div>

            <div>
              <label class="text-xs font-semibold mb-2 block"
                >Contact Person</label
              >
              <input
                type="text"
                placeholder="Enter contact person name"
                class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3 bg-white"
              />
            </div>

            <div>
              <label class="text-xs font-semibold mb-2 block">Email</label>
              <input
                type="email"
                placeholder="Enter email address"
                class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3 bg-white"
              />
            </div>

            <div>
              <label class="text-xs font-semibold mb-2 block">Phone</label>
              <input
                type="tel"
                placeholder="e.g 0801 234 5678"
                class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3 bg-white"
              />
            </div>

            <div>
              <label class="text-xs font-semibold mb-2 block"
                >Balance Date</label
              >
              <input
                type="date"
                class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3 bg-white"
              />
            </div>

            <div>
              <label class="text-xs font-semibold mb-2 block"
                >Opening Balance</label
              >
              <input
                type="text"
                placeholder="₦ Enter the initial balance"
                class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3 bg-white"
              />
            </div>
          </div>

          <h3 class="text-lg font-semibold text-gray-600 mt-10">
            Bank Details
          </h3>

          <div class="grid grid-cols-2 gap-6 mt-4">
            <div>
              <label class="text-xs font-semibold mb-2 block">Bank Name</label>
              <UiSelectField
                :displayIcon="`/supplier-placeholder.png`"
                v-model="supplierBank"
                :options="supplierBanks"
                :placeholder="`Select an institution`"
              />
            </div>

            <div>
              <label class="text-xs font-semibold mb-2 block">Bank Code</label>
              <input
                type="text"
                placeholder="--"
                class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3 bg-white"
                disabled
              />
            </div>

            <div>
              <label class="text-xs font-semibold mb-2 block"
                >Account Number</label
              >
              <input
                type="text"
                placeholder="Enter the account number"
                class="appearance-none w-full border-2 border-gray-300 rounded-lg py-1.5 px-3 bg-white"
                style="--tw-shadow: none"
              />
            </div>

            <div>
              <label class="text-xs font-semibold mb-2 block"
                >Account Holder</label
              >
              <input
                type="text"
                placeholder="--"
                class="w-full border-2 border-gray-300 rounded-lg py-1.5 px-3 bg-white"
                disabled
              />
            </div>
          </div>

          <div class="flex justify-end mt-10 gap-4">
            <button @click="close" class="bg-gray-200 px-6 py-2 rounded-lg">
              Cancel
            </button>
            <button
              @click="onSubmit"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
