<script lang="ts" setup>
import { useSuppliers } from "@/Composables/procurement/useDashboard";
import { LucideEllipsisVertical } from "lucide-vue-next";

const { suppliers, statuses } = useSuppliers();
</script>

<template>
  <div class="bg-white p-5 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-5">
      <h1 class="text-lg font-semibold text-gray-800">All Suppliers</h1>
      <Button icon="pi pi-plus" label="New Supplier" class="p-button-primary" />
    </div>

    <DataTable :value="suppliers" paginator :rows="10" stripedRows>
      <Column field="id" header="ID" />
      <Column field="supplierName" header="Supplier's Name" />
      <Column field="contactName" header="Contact Name" />
      <Column field="phone" header="Phone" />
      <Column field="category" header="Category" />

      <Column header="Status">
        <template #body="slotProps">
          <span
            :class="['px-2 py-1 rounded-full', statuses[slotProps.data.status]]"
          >
            {{ slotProps.data.status }}
          </span>
        </template>
      </Column>

      <Column header="Action">
        <template #body>
          <LucideEllipsisVertical
            class="cursor-pointer text-gray-500 hover:text-gray-800"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.p-button-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
</style>
