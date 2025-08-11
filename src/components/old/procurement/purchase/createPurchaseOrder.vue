<template>
  <main class="bg-white px-12 py-3">
    <!-- Breadcrumb -->
    <div class="text-[#626F86] mb-3 space-x-2">
      <router-link to="/purchase">
        <span class="hover:underline cursor-pointer title-text"
          >Purchase Order</span
        >
      </router-link>
      <span>/</span>
      <router-link to="/purchase">
        <span class="hover:underline cursor-pointer title-text" @click="close">
          Awaiting PO Approval
        </span>
      </router-link>
      <span>/</span>
      <router-link to="/">
        <span class="hover:underline cursor-pointer title-text"
          >Create Purchase Order</span
        >
      </router-link>
    </div>

    <div>
      <div class="flex items-center justify-between mb-4">
        <!-- <div
          class="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#44546F]"
		  >
		</div> -->
        <ReusableButton
          @click="close"
          bg-color=""
          text-color="text-[#44546F]"
          class="medium-text -ml-2"
        >
          <!--  -->
          <ChevronLeft class="w-4 h-4" />
          <span>Cancel</span>
        </ReusableButton>
        <p v-if="selectedOrder" class="page-title-text text-text-default">
          Edit Purchase Order
        </p>
        <p v-else class="page-title-text text-text-default">
          Create Purchase Order
        </p>
        <div v-if="selectedOrder" class="flex gap-2 navigation-text">
          <!-- <button
            @click="handleDelete"
            class="bg-bg-danger flex gap-1 text-white px-[12px] py-2 rounded-[6px]"
          >
            <LucideTrash class="h-4 w-4"></LucideTrash>

            <span>Delete</span>
          </button> -->
          <ReusableButton
            bgColor="bg-bg-danger"
            textColor="text-white"
            @click="handleDelete"
          >
            <LucideTrash class="h-4 w-4" />
            <span>Delete</span>
          </ReusableButton>
          <ReusableButton
            bgColor="bg-blue-600"
            textColor="text-white"
            @click="savePurchaseOrder"
          >
            <span>Update</span>
          </ReusableButton>

          <!-- <button
            class="bg-blue-600 text-white px-2 py-2 rounded"
          >
            Create
          </button> -->
        </div>
        <div v-else class="flex gap-2 navigation-text">
          <!-- <button
            @click="handleDelete"
            class="bg-bg-danger flex gap-1 text-white px-[12px] py-2 rounded-[6px]"
          >
            <LucideTrash class="h-4 w-4"></LucideTrash>

            <span>Delete</span>
          </button> -->

          <ReusableButton
            bgColor="bg-blue-600"
            textColor="text-white"
            @click="savePurchaseOrder"
          >
            <span>Create</span>
          </ReusableButton>

          <!-- <button
            class="bg-blue-600 text-white px-2 py-2 rounded"
          >
            Create
          </button> -->
        </div>
      </div>

      <!-- Supplier's Information -->
      <div class="p-4 rounded-xl bg-[#F7F8F9]">
        <h3 class="page-title-text text-text-default mb-4">
          Supplier's Information
        </h3>
        <div class="grid grid-cols-5 gap-4">
          <div>
            <label class="block text-xs text-[#44546F] mb-1 font-medium"
              >Supplier</label
            >
            <select
              v-model="purchaseOrderData.supplier"
              class="appearance-auto text-text-default medium-text w-full p-2 border-[2px] border-[#091E4224] bg-white rounded-lg"
            >
              <option class="text-text-default medium-text" value="" disabled>
                Select supplier
              </option>
              <option
                v-for="supplier in suppliers"
                :key="supplier.id"
                :value="supplier.id"
              >
                {{ supplier.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-[#44546F] mb-1 font-medium"
              >Purchase Date</label
            >
            <input
              type="date"
              v-model="purchaseOrderData.date"
              class="text-text-default medium-text w-full p-2 border-[2px] border-[#091E4224] rounded-lg"
            />
          </div>
          <div>
            <label class="block text-xs text-[#44546F] mb-1 font-medium"
              >Delivery Date</label
            >
            <input
              type="date"
              v-model="purchaseOrderData.deliveryDate"
              class="text-text-default medium-text w-full p-2 border-[2px] border-[#091E4224] rounded-lg"
            />
          </div>
          <div>
            <label class="block text-xs text-[#44546F] mb-1 font-medium"
              >Discount (%)</label
            >
            <input
              type="number"
              v-model="purchaseOrderData.discount"
              class="text-text-default medium-text w-full p-2 border-[2px] border-[#091E4224] rounded-lg"
            />
          </div>
          <div>
            <label class="block text-xs text-[#44546F] mb-1 font-medium"
              >Type</label
            >
            <select
              v-model="purchaseOrderData.type"
              class="appearance-auto bg-white text-text-default medium-text w-full p-2 border-[2px] border-[#091E4224] rounded-lg"
            >
              <option class="text-text-default medium-text" value="" disabled>
                Select a trade type
              </option>
              <option class="text-text-default medium-text" value="trade">
                Trade
              </option>
              <option class="text-text-default medium-text" value="service">
                Service
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- All Items -->
      <div class="mt-6 p-4 rounded-xl bg-[#F7F8F9]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-sm text-[#172B4D]">All Items</h3>
          <button
            class="border border-[#091E4224] text-[#172B4D] text-xs font-medium px-3 py-1 rounded"
            @click="handleAddItem"
          >
            + Add Item
          </button>
        </div>

        <div v-if="purchaseOrderData.items.length > 0">
          <div class="overflow-auto rounded-lg border border-[#D0D4D7]">
            <table class="w-full bg-white">
              <thead
                class="bg-[#F1F3F5] border-b border-[#D0D4D7] text-left text-xs text-[#44546F]"
              >
                <tr>
                  <th class="py-3 px-4">Item name</th>
                  <th class="py-3 px-4">Purchased Qty</th>
                  <th class="py-3 px-4">Price</th>
                  <th class="py-3 px-4">Unit Cost</th>
                  <th class="py-3 px-4">Discount (%)</th>
                  <th class="py-3 px-4">Total Amount</th>
                  <th class="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody class="text-left text-xs text-[#44546F]">
                <tr
                  v-for="item in purchaseOrderData.items"
                  :key="item.id"
                  class="border-t text-sm text-[#626F86]"
                >
                  <td class="py-3 px-4">{{ item.item_name || "N/A" }}</td>
                  <td class="py-3 px-4">{{ item.purchased_quantity }}</td>
                  <td class="py-3 px-4">{{ formatPrice(item.price) }}</td>
                  <td class="py-3 px-4">{{ formatPrice(item.unit_cost) }}</td>
                  <td class="py-3 px-4">{{ item.discount || 0 }}%</td>
                  <td class="py-3 px-4">
                    {{ formatPrice(item.total_amount) }}
                  </td>
                  <td
                    class="py-3 px-4 flex items-center gap-2 border-l border-[#D0D4D7]"
                  >
                    <button
                      @click="handleEditItem(item)"
                      class="text-text-default"
                    >
                      <EditIcon class="w-4 h-4" />
                    </button>
                    <button @click="removeItem(item)" class="text-text-default">
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          v-else
          class="px-4 py-[10rem] bg-white rounded-md border border-[#091E4224] flex justify-center text-center"
        >
          <div
            class="flex flex-col justify-center items-center shadow-[0px_0px_50px_0px_#E5E2E9] p-6 rounded-lg"
          >
            <div class="flex items-center gap-2 mb-2">
              <img
                src="../../../assets/images/InfoIcon.png"
                alt="Info-icon"
                width="24px"
              />
              <p class="text-[#172B4D] font-semibold text-base">
                No Items added yet
              </p>
            </div>
            <p class="text-xs max-w-[390px] text-[#44546F]">
              You haven't added any items to this purchase order. Add items now
              to track and manage your order details
            </p>
            <button
              @click="handleAddItem"
              class="bg-blue-600 text-white mt-5 px-3 py-1 rounded-lg flex items-center gap-1"
            >
              <span class="text-lg mb-[0.5px]">+</span>
              <span class="text-xs font-medium">Add Item</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
  <DiscardModal
    @close="isDiscardOpen = !isDiscardOpen"
    @confirm="close(false)"
    :action="selectedOrder ? 'Edit Purchase Order' : 'Create Purchase Order'"
    :isOpen="isDiscardOpen"
  ></DiscardModal>
  <SuccessModal
    :modelValue="isSuccessModalOpen"
    @update:modelValue="handleSuccessModalClose"
    :title="modalTitle"
    :message="modalMessage"
  />

  <ErrorModal
    v-model="isErrorModalOpen"
    :title="modalTitle"
    :message="modalMessage"
  />
  <PaymentItemForm
    v-model="isItemFormOpen"
    :selected-item="selectedItem"
    @save="saveItem"
  />
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ChevronLeft, LucideTrash } from "lucide-vue-next";
import { useSuppliers } from "@/Composables/procurement/useSuppliers";
import { usePurchaseOrders } from "@/Composables/procurement/usePurchaseOrders";
import ReusableButton from "@/Components/procurement/ui/ReusableButton.vue";
import DiscardModal from "@/Components/procurement/ui/DiscardModal.vue";
import PaymentItemForm from "@/Components/procurement/purchase/PaymentItemForm.vue";
import EditIcon from "@/Components/procurement/icons/EditIcon.vue";
import TrashIcon from "@/Components/procurement/icons/TrashIcon.vue";
import SuccessModal from "@/Components/procurement/ui/SuccessModal.vue";
import ErrorModal from "@/Components/procurement/ui/ErrorModal.vue";

const emit = defineEmits(["close"]);
const props = defineProps({
  selectedOrder: Object,
});

const { fetchAllSuppliers } = useSuppliers();
const { createOrder, editOrder } = usePurchaseOrders();
const suppliers = ref([]);
const route = useRoute();
const router = useRouter();

const purchaseOrderData = reactive({
  supplier: "",
  date: "",
  deliveryDate: "",
  discount: 0,
  type: "",
  items: [],
});

const isItemFormOpen = ref(false);
const selectedItem = ref(null);
const isSuccessModalOpen = ref(false);
const isErrorModalOpen = ref(false);
const modalTitle = ref("");
const modalMessage = ref("");

const formatPrice = (amount) =>
  amount?.toLocaleString("en-NG", { style: "currency", currency: "NGN" }) ||
  "₦0.00";

onMounted(async () => {
  suppliers.value = await fetchAllSuppliers();

  const supplierId = route.query.supplierId;
  if (supplierId) {
    console.log(suppliers.value);
    // console.log(selectedSupplier.value);
    purchaseOrderData.supplier = supplierId;

    // selectedSupplier.value = supplierId;
  }
  // Use selectedOrder if available
  if (props.selectedOrder) {
    purchaseOrderData.supplier = props.selectedOrder.supplierId ?? "";
    purchaseOrderData.date = props.selectedOrder.date ?? "";
    purchaseOrderData.deliveryDate = props.selectedOrder.deliveryDate ?? "";
    purchaseOrderData.discount = props.selectedOrder.discount ?? 0;
    purchaseOrderData.type = props.selectedOrder.type ?? "";

    // Reactive array update
    purchaseOrderData.items.splice(
      0,
      purchaseOrderData.items.length,
      ...(props.selectedOrder.items ?? [])
    );
  }
});

const savePurchaseOrder = async () => {
  try {
    const payload = {
      supplier_id: purchaseOrderData.supplier,
      purchase_date: purchaseOrderData.date,
      delivery_date: purchaseOrderData.deliveryDate,
      discount: purchaseOrderData.discount,
      type: purchaseOrderData.type,
      items: purchaseOrderData.items.map((i) => ({
        product_id: i.itemId,
        quantity: i.purchased_quantity,
        price: i.price,
        unit_cost: i.unit_cost,
        discount: i.discount,
      })),
    };

    if (props.selectedOrder) {
      await editOrder({ ...payload, id: props.selectedOrder.id });
      modalTitle.value = "Update Successful";
      modalMessage.value = "Purchase order has been updated successfully.";
    } else {
      await createOrder(payload);
      modalTitle.value = "Creation Successful";
      modalMessage.value = "Purchase order has been created successfully.";
    }
    isSuccessModalOpen.value = true;
  } catch (err) {
    const action = props.selectedOrder ? "updating" : "creating";
    modalTitle.value = `${action} Failed`;
    modalMessage.value =
      err.response?.data?.error || `Failed while ${action} purchase order.`;
    isErrorModalOpen.value = true;
  }
};

const isDiscardOpen = ref(false);
const close = (discarding = true) => {
  if (discarding) {
    isDiscardOpen.value = true;
    return;
  }
  emit("close");
};

const handleAddItem = () => {
  selectedItem.value = null;
  isItemFormOpen.value = true;
};

const handleEditItem = (item) => {
  selectedItem.value = item;
  isItemFormOpen.value = true;
};

const saveItem = (itemData) => {
  const newItem = {
    id: itemData.id || Date.now(),
    item_name: itemData.name,
    itemId: itemData.itemId,
    purchased_quantity: itemData.quantity,
    price: itemData.price_per_pack,
    unit_cost: itemData.unit_cost,
    discount: itemData.discount,
    total_amount:
      itemData.quantity *
      itemData.price_per_pack *
      (1 - itemData.discount / 100),
  };
  if (itemData.id) {
    // it's an edit
    const index = purchaseOrderData.items.findIndex(
      (i) => i.id === itemData.id
    );
    if (index !== -1) {
      purchaseOrderData.items[index] = newItem;
    }
  } else {
    // it's an add
    purchaseOrderData.items.push(newItem);
  }
};

const removeItem = (itemToRemove) => {
  const index = purchaseOrderData.items.findIndex(
    (item) => item.id === itemToRemove.id
  );
  if (index > -1) {
    purchaseOrderData.items.splice(index, 1);
  }
};

const handleSuccessModalClose = () => {
  isSuccessModalOpen.value = false;
  router.push("/purchase");
};
</script>
