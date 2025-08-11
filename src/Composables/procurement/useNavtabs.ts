import { ref } from "vue"

export const useNavtabs = () => {
    const tabs = ref([
      { name: 'Dashboard' },
      { name: 'All Suppliers' },
      { name: 'Purchase Orders' },
      { name: 'Payments' },
      { name: "Supplier's Return" },
      { name: 'Product Requests' }
    ])
  
    const activeTab = ref('All Suppliers')
  
    const setActiveTab = (tab: string) => {
      activeTab.value = tab
    }
  
    return { tabs, activeTab, setActiveTab }
  }
  