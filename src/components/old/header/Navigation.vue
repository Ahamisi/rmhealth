<template>
  <!-- Desktop Nav -->
  <nav class="relative z-40 hidden px-6 bg-white border-b sm:block app_navigation">
    <div class="mx-auto">
      <ul class="flex gap-x-6 navbar_menu">
        <li v-for="(item, index) in navItems" :key="`nav_dropdown_${index}`" class="text-center ">
          <!-- <NavDropDown v-if="item.dropdown" :title="item.label" :items="item.dropdown" /> -->
          <NavDropDown v-if="item.dropdown" :title="item.label" :items="item.dropdown"
            :isOpen="openDropdownIndex === index" @toggle="toggleDropdown(index)" @close="closeDropdown"
            :useThreeDots="item.useThreeDots" />
          <!-- <router-link v-else :to="item.url" class="block py-3 text-xs nav-link navigation-text" :class="{
            'border-b-2 border-blue-600 text-blue-600 ': isActive(item.url),
            'text-text-subtle hover:border-b-2 hover:border-gray-200':
              !isActive(item.url),
          }"> -->
          <router-link v-else :to="item.url"
            class="block py-3 text-xs border-b-2 border-transparent nav-link navigation-text text-text-subtle hover:border-gray-200"
            :class="{
              '!border-blue-600 !text-blue-600': isActive(item.url),
            }">
            {{ item.label }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>

  <!-- Mobile Nav -->
  <nav class="block px-4 bg-white border-b border-gray-200 sm:hidden">
    <div class="mx-auto">
      <ul class="flex justify-between">
        <li v-for="(item, index) in navItems" :key="index" class="flex-1 text-center">
          <NavDropDown v-if="item.dropdown" :title="item.label" :items="item.dropdown" />
          <router-link v-else :to="item.url" class="block py-3" :class="{
            'text-blue-600': isActive(item.url),
            'text-gray-500': !isActive(item.url),
          }">
            <component :is="item.icon" class="w-5 h-5 mx-auto" />
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import NavDropDown from '@/Components/NavDropDown.vue'
interface Props {
  department: string;
}
import {
  LayoutDashboard,
  Truck,
  FileText,
  CreditCard,
  RotateCcw,
  PackageSearch,
} from "lucide-vue-next";

const props = defineProps<Props>();

const route = useRoute();

const navigation = {
  procurement: [
    { label: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { label: "All Suppliers", url: "/suppliers", icon: Truck },
    { label: "Purchase Order", url: "/purchase", icon: FileText },
    { label: "Payments", url: "/payments", icon: CreditCard },
    { label: "Supplier's Return", url: "/suppliers-return", icon: RotateCcw },
    { label: "Product Requests", url: "/product-requests", icon: PackageSearch },
  ],
  inbound: [
    { label: "Dashboard", url: { name: "inbound.dashboard" }, icon: LayoutDashboard },
    { label: "Purchase Order", url: { name: "inbound.purchase_orders" }, icon: Truck },
    {
      label: "Products Management", url: "/purchase", icon: FileText, dropdown: [
        { title: "All Products", route: { name: 'admin.products' }, has_bottom_rule: true },
        { title: "Damaged Product", route: { name: 'admin.products.damages' } },
        { title: "Product Formulation", route: { name: 'admin.products.product_types' }, has_bottom_rule: true },
        { title: "Categories", route: { name: 'admin.categories' } },
        { title: "Manufacturers", route: { name: 'admin.manufacturers' } },
        { title: "Bulk Product Update", route: { name: 'admin.products.bulk_updates' }, has_bottom_rule: true },
        // { title: "Generate Barcode", route: 'here 2' },
      ]
    },
    {
      label: "Product Movement", url: "/purchase", icon: FileText, dropdown: [
        { title: "Returned Products", route: { name: 'admin.products.returned' } },
        { title: "Product Requests", route: { name: 'admin.products.requests' } },
      ]
    },
    {
      label: "Product Items", url: "/purchase", icon: FileText, dropdown: [
        { title: "Pending Product Notifications", route: { name: "admin.products.pending_notifications" } },
        { title: "Pending Product Transfers", route: { name: 'admin.products.pending_transfers' } },
        { title: "Pending Product Returns", route: { name: 'admin.products.returns' } },
      ]
    },
    { label: "Expiry Report", url: { name: 'admin.products.expiry_reports' }, icon: Truck },
    {
      label: "Locations", url: "/purchase", icon: FileText, dropdown: [
        { title: "Warehouses", route: { name: 'admin.locations.warehouses' } },
        { title: "Shelves", route: { name: 'admin.locations.shelves' } },
        { title: "Branches", route: { name: 'admin.locations.branches' } },
      ]
    },
    {
      label: "More Action", url: "/purchase", icon: FileText, useThreeDots: true, dropdown: [
        { title: "All Customers", route: { name: 'customer-success.customers' }, has_bottom_rule: true },
        { title: "All Suppliers", route: { name: 'inbound.suppliers.index' } },
        { title: "Supplier's Return", route: { name: 'inbound.suppliers.returns.index' }, has_bottom_rule: true },
        { title: "Deals", route: { name: 'inbound.deals.index' }, has_bottom_rule: true },
        { title: "Delivered Order", route: { name: 'inbound.orders.delivered' } },
      ]
    },
  ],
}

const navItems = computed(() => navigation[props.department]);

const isActive = (url: string) => route.path === url;

const openDropdownIndex = ref<number | null>(null)

const toggleDropdown = (index: number) => {
  openDropdownIndex.value = openDropdownIndex.value === index ? null : index
}

const closeDropdown = () => {
  openDropdownIndex.value = null
}
</script>
<style>
.app_navigation {
  border-bottom: 0.5px solid rgba(9, 30, 66, 0.14);
}

.app_navigation .navbar_menu .navigation-text {
  color: rgba(68, 84, 111, 1);
  font-weight: 500;
}

.app_navigation .navbar_menu .navigation-text.router-link-active.router-link-exact-active {
  color: rgba(12, 102, 228, 1);
  border-bottom: 2px solid rgba(12, 102, 228, 1);
}
</style>