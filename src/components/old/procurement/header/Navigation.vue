<template>
  <!-- Desktop Nav -->
  <nav
    class="relative z-40 hidden px-6 bg-white border-b sm:block app_navigation"
  >
    <div class="mx-auto">
      <ul class="flex px-5 gap-x-4 navbar_menu">
        <li
          v-for="(item, index) in navItems"
          :key="index"
          class="text-center "
        >
          <NavDropDown v-if="item.dropdown" :title="item.label" :items="item.dropdown" />  
          <router-link
            v-else
            :to="item.url"
            class="block py-3 text-xs nav-link navigation-text"
            :class="{
              'border-b-2 border-blue-600 text-blue-600 ': isActive(item.url),
              'text-text-subtle hover:border-b-2 hover:border-gray-200':
                !isActive(item.url),
            }"
          >
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
        <li
          v-for="(item, index) in navItems"
          :key="index"
          class="flex-1 text-center"
        >
          <NavDropDown v-if="item.dropdown" :title="item.label" :items="item.dropdown" />  
          <router-link
            v-else
            :to="item.url"
            class="block py-3"
            :class="{
              'text-blue-600': isActive(item.url),
              'text-gray-500': !isActive(item.url),
            }"
          >
            <component :is="item.icon" class="w-5 h-5 mx-auto" />
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
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
  procurement : [
    { label: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { label: "All Suppliers", url: "/suppliers", icon: Truck },
    { label: "Purchase Order", url: "/purchase", icon: FileText },
    { label: "Payments", url: "/payments", icon: CreditCard },
    { label: "Supplier's Return", url: "/suppliers-return", icon: RotateCcw },
    { label: "Product Requests", url: "/product-requests", icon: PackageSearch },
  ],
  inbound: [
    { label: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { label: "Purchase Order", url: "/suppliers", icon: Truck },
    { label: "Product Management", url: "/purchase", icon: FileText,  dropdown: [
      {title: "All Products", route: 'here', has_bottom_rule: true},
      {title: "Damaged Product", route: 'here 1'},
      {title: "Product Formulation", route: 'here 1', has_bottom_rule: true},
      {title: "Categories", route: 'here 1'},
      {title: "Manufacturers", route: 'here 1'},
      {title: "Bulk Product Update", route: 'here 1', has_bottom_rule: true},
      {title: "Generate Barcode", route: 'here 2'},
    ]},
    { label: "Product Movement", url: "/purchase", icon: FileText,  dropdown: [
      {title: "Product Returns", route: 'here'},
      {title: "Product Requests", route: 'here 1'},
    ]},
    { label: "Product Items", url: "/purchase", icon: FileText,  dropdown: [
      {title: "Pending Product Notifications", route: 'here'},
      {title: "Pending Product Transfers", route: 'here 1'},
    ]},
    { label: "Expiry Report", url: "/suppliers", icon: Truck },
    { label: "Locations", url: "/purchase", icon: FileText,  dropdown: [
      {title: "Warehouses", route: 'here'},
      {title: "Shelves", route: 'here 1'},
      {title: "Branches", route: 'here 1'},
    ]},
    { label: "More Action", url: "/purchase", icon: FileText,  dropdown: [
      {title: "All Customers", route: 'here', has_bottom_rule: true},
      {title: "All Suppliers", route: 'here 1'},
      {title: "Supplier's Return", route: 'here 1', has_bottom_rule: true},
      {title: "Deals", route: 'here 1', has_bottom_rule: true},
      {title: "Delivered Order", route: 'here 1'},
    ]},
  ],
}

const navItems = computed(() => navigation[props.department]);

const isActive = (url: string) => route.path === url;
</script>
<style>
  .app_navigation {
    border-bottom: 0.5px solid rgba(9, 30, 66, 0.14);
  }
  .app_navigation .navbar_menu .navigation-text{
    color: rgba(68, 84, 111, 1);
  }
  
  .app_navigation .navbar_menu .navigation-text.router-link-active.router-link-exact-active{
   color: rgba(12, 102, 228, 1) 
  }
</style>