<template>
  <nav class="bg-white border-b border-gray-200 px-6">
    <div class="mx-auto">
      <ul class="flex px-5">
        <li v-for="(item, index) in navItems" :key="index" class="mr-8">
          <router-link
            :to="item.url"
            class="block py-6 nav-link navigation-text"
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
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const navItems = [
  { label: "Dashboard", url: "/dashboard" },
  { label: "All Suppliers", url: "/suppliers" },
  { label: "Purchase Order", url: "/purchase" },
  { label: "Payments", url: "/payments" },
  { label: "Supplier's Return", url: "/suppliers-return" },
  { label: "Product Requests", url: "/product-requests" },
];

const isActive = (url: string) => route.path === url;
</script>
