import { ref } from "vue";
import type { Supplier, Product } from "~/types";

export function useMetrics() {
  // Top Suppliers Data
  const topSuppliers = ref<Supplier[]>([
    { name: "Emzor Pharmaceuticals", value: 235000, percentage: 85 },
    { name: "Fidson Healthcare", value: 122040, percentage: 65 },
    { name: "Emzor Pharmaceuticals", value: 4609, percentage: 40 },
    { name: "Fidson Healthcare", value: 122040, percentage: 65 },
    { name: "Emzor Pharmaceuticals", value: 4609, percentage: 40 },
  ]);

  // Top Products Data
  const topProducts = ref<Product[]>([
    { name: "Paracetamol", value: 2000, percentage: 90 },
    { name: "Ibuprofen", value: 500, percentage: 60 },
    { name: "Vitamin C Tablets", value: 403, percentage: 50 },
    { name: "Amoxicillin", value: 321, percentage: 40 },
    { name: "Artemether-Lumefantrine", value: 81, percentage: 20 },
  ]);

  // In a real application, you would fetch this data from an API
  const fetchMetrics = async () => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Update data if needed
        resolve();
      }, 1000);
    });
  };

  return {
    topSuppliers,
    topProducts,
    fetchMetrics,
  };
}
