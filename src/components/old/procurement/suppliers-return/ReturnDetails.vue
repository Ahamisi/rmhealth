<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { LucideChevronLeft, LucideCheck } from "lucide-vue-next";
import { useSuppliers } from "@/Composables/procurement/useSuppliers";
import { useReturns } from "@/Composables/procurement/useReturns";
import SelectWithSearchField from "@/Components/procurement/ui/SelectWithSearchField.vue";
import type { Option } from "@/types";

const props = defineProps({
  s_return: {
    type: Object as () => any,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const { fetchAllSuppliers, fetchSupplierGRNs } = useSuppliers();
const { fetchReturn } = useReturns();

const suppliers = ref<Option[]>([]);
const grns = ref<Option[]>([]);
const copy = ref(false);
const tableItems = ref<any[]>([]);

const selectedSupplier = ref<Option | null>(null);
const selectedGrn = ref<Option | null>(null);

const returnData = reactive({
  return_date: "",
});

const formatPrice = (amount: number) =>
  `₦${
    amount?.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) || "0.00"
  }`;

const copyDetailsToClipboard = async () => {
  if (!props.s_return) return;
  const textToCopy = `${props.s_return.invoiceNo} ${props.s_return.supplierName}`;
  try {
    await navigator.clipboard.writeText(textToCopy);
    copy.value = true;
    setTimeout(() => {
      copy.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

watch(
  () => selectedSupplier.value,
  async (newSupplier) => {
    if (newSupplier && newSupplier.id !== props.s_return.supplierId) {
      grns.value = [];
      selectedGrn.value = null;
      const fetchedGRNs = await fetchSupplierGRNs({ id: newSupplier.id });
      grns.value = fetchedGRNs.map((g: any) => ({
        id: g.id,
        name: String(g.orderNo),
      }));
    }
  }
);

watch(
  () => props.s_return,
  async (newReturn) => {
    if (newReturn) {
      // Pre-fill supplier from prop
      if (newReturn.supplierName) {
        selectedSupplier.value = {
          id: newReturn.supplierId,
          name: newReturn.supplierName,
        };
      }
      // Pre-fill GRN from prop
      if (newReturn.invoiceNo) {
        selectedGrn.value = {
          id: newReturn.grnId,
          name: newReturn.invoiceNo,
        };
      }
      // Pre-fill return date
      returnData.return_date = newReturn.date;

      // Fetch all suppliers for the dropdown search list
      const fetchedSuppliers = await fetchAllSuppliers();
      suppliers.value = fetchedSuppliers.map((s: any) => ({
        id: s.id,
        name: s.name,
      }));
    }
  },
  { immediate: true, deep: true }
);

onMounted(async () => {
  if (props.s_return?.id) {
    const details = await fetchReturn({ id: props.s_return.id });
    if (details && details.items) {
      tableItems.value = details.items;
    }
  }
});

const close = () => emit("close");
</script>

<script lang="ts">
export default {
  name: "ReturnDetails",
};
</script>

<template>
  <main class="bg-white px-12 py-4 w-full">
    <!-- Breadcrumb -->
    <nav class="text-[#626F86] mb-6 text-sm space-x-2">
      <a href="#" @click.prevent="close" class="hover:underline"
        >Supplier's Return</a
      >
      <span>/</span>
      <span class="crumb-text cursor-pointer underline uppercase">{{
        s_return?.invoiceNo || "Unavailable"
      }}</span>
      <span> - </span>
      <span class="crumb-text cursor-pointer underline uppercase">{{
        s_return?.supplierName || "Unavailable"
      }}</span>
    </nav>

    <div class="flex justify-between w-1/2 items-center mb-6">
      <div
        class="flex items-center gap-2 cursor-pointer text-xs text-[#44546F]"
        @click="close"
      >
        <LucideChevronLeft class="w-5 h-5 text-[#44546F]"> </LucideChevronLeft>
        <span>Back</span>
      </div>
      <div class="flex items-center gap-2">
        <p class="page-title-text text-[#172B4D]">View Supplier's Return</p>
        <img
          src="/redesign/copy.svg"
          v-if="!copy"
          alt="copy"
          class="h-6 w-6 cursor-pointer"
          @click="copyDetailsToClipboard"
        />
        <LucideCheck class="h-4 w-4 text-text-subtlest" v-else></LucideCheck>
        <div class="">
          <span class="crumb-text cursor-pointer underline uppercase">{{
            s_return?.invoiceNo || "Unavailable"
          }}</span>
          <span> - </span>
          <span class="crumb-text cursor-pointer underline uppercase">{{
            s_return?.supplierName || "Unavailable"
          }}</span>
        </div>
      </div>
    </div>

    <!-- Supplier's Information -->
    <section class="bg-[#F7F8F9] rounded-lg p-6 mb-6">
      <h3 class="page-title-text text-[#172B4D] mb-4">
        Supplier's Information
      </h3>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block navigation-text text-[#44546F] mb-1"
            >Supplier</label
          >
          <SelectWithSearchField
            v-model="selectedSupplier"
            :options="suppliers"
            placeholder="Type to search for a supplier"
          />
        </div>
        <div>
          <label class="block navigation-text text-[#44546F] mb-1">GRN</label>
          <SelectWithSearchField
            v-model="selectedGrn"
            :options="grns"
            placeholder="Type to search for a GRN"
          />
        </div>
        <div>
          <label class="block navigation-text text-[#44546F] mb-1"
            >Return Date</label
          >
          <input
            type="date"
            v-model="returnData.return_date"
            class="medium-text text-text-default w-full p-2 border-[2px] bg-white border-[#091E4224] rounded-lg"
          />
        </div>
      </div>
    </section>

    <!-- All Items -->
    <section class="bg-[#F7F8F9] rounded-lg p-6">
      <div class="overflow-auto rounded-lg border border-[#D0D4D7]">
        <table class="w-full bg-white">
          <thead
            class="bg-[#F1F3F5] border-b border-[#D0D4D7] text-left text-xs text-[#44546F]"
          >
            <tr>
              <th class="py-3 px-4"><input type="checkbox" /></th>
              <th class="py-3 px-4">Item</th>
              <th class="py-3 px-4">Batch No</th>
              <th class="py-3 px-4">Quantity Supplied</th>
              <th class="py-3 px-4">Quantity to Return</th>
              <th class="py-3 px-4">Price</th>
              <th class="py-3 px-4">Discount (%)</th>
              <th class="py-3 px-4">Total</th>
            </tr>
          </thead>
          <tbody class="text-left text-xs text-[#44546F]">
            <tr
              v-for="(item, index) in tableItems"
              :key="index"
              class="border-t text-sm text-[#626F86]"
            >
              <td class="py-3 px-4"><input type="checkbox" /></td>
              <td class="py-3 px-4">
                {{ item.name || "Unavailable" }}
              </td>
              <td class="py-3 px-4">{{ item.batch_no }}</td>
              <td class="py-3 px-4">{{ item.quantity_supplied }}</td>
              <td class="py-3 px-4">{{ item.quantity_to_return }}</td>
              <td class="py-3 px-4">{{ formatPrice(item.price) }}</td>
              <td class="py-3 px-4">{{ item.discount || "--" }}</td>
              <td class="py-3 px-4">{{ formatPrice(item.total_amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template> 