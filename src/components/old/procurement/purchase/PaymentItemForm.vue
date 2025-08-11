<script setup lang="ts">
import { ref, watch, reactive, computed } from "vue";
import { LucideX } from "lucide-vue-next";
import SelectWithSearchField from "@/Components/procurement/ui/SelectWithSearchField.vue";
import DiscardModal from "@/Components/procurement/ui/DiscardModal.vue";
import { Option } from "@/types";
import { usePurchaseOrders } from "@/Composables/procurement/usePurchaseOrders";

// Props and Emits
const props = defineProps<{
  modelValue: boolean;
  selectedItem?: any; // Purchase order item
}>();
const emit = defineEmits(["update:modelValue", "save"]);

const { searchProducts } = usePurchaseOrders();
const products = ref<any[]>([]);
const isSearching = ref(false);

// Form state
const getInitialFormState = () => ({
  id: null,
  item: null as any | null,
  unit_cost: "0.00",
  price_per_pack: "0.00",
  quantity: 1,
  discount: 0,
});
const form = reactive(getInitialFormState());
let initialForm = {};

// Watcher for pre-filling
watch(
  () => props.selectedItem,
  (newItem) => {
    Object.assign(form, getInitialFormState());
    products.value = []; // Clear previous search results
    if (newItem) {
      form.id = newItem.id;
      // The `item` object needs `id` and `name` keys for SelectWithSearchField
      form.item = { id: newItem.id, name: newItem.item_name };
      form.unit_cost = newItem.unit_cost;
      form.price_per_pack = newItem.price;
      form.quantity = newItem.purchased_quantity;
      form.discount = newItem.discount;
    }
    initialForm = JSON.parse(JSON.stringify(form));
  },
  { immediate: true, deep: true }
);

// Watch for item selection to update costs
watch(
  () => form.item,
  (selected) => {
    if (selected && typeof selected === "object" && selected.id) {
      // Check if the selected item is a full product object from search results
      if ("unit_cost" in selected && "price_per_pack" in selected) {
        form.unit_cost = selected.unit_cost || "0.00";
        form.price_per_pack = selected.price_per_pack || "0.00";
      }
    } else if (!selected) {
      // Clear costs if item is cleared
      form.unit_cost = "0.00";
      form.price_per_pack = "0.00";
    }
  }
);

// Close/Discard logic
const isDiscardOpen = ref(false);
const hasChanges = computed(
  () => JSON.stringify(initialForm) !== JSON.stringify(form)
);
const close = (discarding = true) => {
  if (discarding && hasChanges.value) {
    isDiscardOpen.value = true;
    return;
  }
  emit("update:modelValue", false);
};

// Search handler
const handleProductSearch = async (query: string) => {
  if (query) {
    isSearching.value = true;
    try {
      products.value = await searchProducts(query);
    } catch (error) {
      console.error("Error searching products:", error);
      products.value = [];
    } finally {
      isSearching.value = false;
    }
  } else {
    products.value = [];
  }
};

// Submit
const onSubmit = () => {
  // Ensure we have a valid item selected before submitting
  if (!form.item || !form.item.id) {
    // Optionally handle error (e.g., show a toast)
    console.error("No item selected");
    return;
  }
  const payload = {
    ...form,
    name: form.item.name,
    itemId: form.item.id,
  };
  emit("save", payload);
  close(false);
};
</script>

<template>
  <Transition name="slide">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      v-if="modelValue"
      @click.self="close(true)"
    >
      <div
        class="w-full sm:w-[500px] bg-white h-full flex flex-col shadow-xl overflow-hidden"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
        >
          <h2 class="header-text text-text-default">
            {{
              form.id ? "Edit Purchase Order Item" : "Add Purchase Order Item"
            }}
          </h2>
          <LucideX
            class="w-5 h-5 text-gray-500 cursor-pointer"
            @click="close(true)"
          />
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Item Name</label>
            <SelectWithSearchField
              v-model="form.item"
              :options="products"
              @search="handleProductSearch"
              :is-searching="isSearching"
              placeholder="Type to search for item"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Unit Cost</label>
              <div class="relative">
                <span
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"
                  >₦</span
                >
                <input
                  v-model="form.unit_cost"
                  type="text"
                  class="w-full border rounded-lg pl-8 pr-3 py-2.5 medium-text focus:ring-2 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1"
                >Price per Pack</label
              >
              <div class="relative">
                <span
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"
                  >₦</span
                >
                <input
                  v-model="form.price_per_pack"
                  type="text"
                  class="w-full border rounded-lg pl-8 pr-3 py-2.5 medium-text"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1"
                >Item Quantity</label
              >
              <input
                v-model="form.quantity"
                type="number"
                min="1"
                class="w-full border rounded-lg px-3 py-2.5 medium-text"
              />
              <p class="text-xs text-gray-500 mt-1">
                Minimum order quantity is 1
              </p>
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1"
                >Discount (%)</label
              >
              <input
                v-model="form.discount"
                type="number"
                class="w-full border rounded-lg px-3 py-2.5 medium-text"
              />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t px-6 py-4 flex items-center justify-end">
          <div class="flex gap-3">
            <button
              @click="close(true)"
              class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              @click="onSubmit"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              {{ form.id ? "Update Item" : "Add Item" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <DiscardModal
    @close="isDiscardOpen = !isDiscardOpen"
    @confirm="close(false)"
    :action="form.id ? 'Edit Item' : 'Add Item'"
    :isOpen="isDiscardOpen"
  />
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