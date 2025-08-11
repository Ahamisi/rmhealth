import { ref } from "vue"

export const useSuppliers = () => {
  const suppliers = ref([
    {
      id: 87,
      supplierName: 'Fidson Healthcare',
      contactName: 'Hannah Pedro',
      phone: '0814 567 8901',
      category: 'Local',
      status: 'Active'
    },
    {
      id: 54,
      supplierName: 'Emzor Pharmaceuticals',
      contactName: 'Adese Samson',
      phone: '0812 345 6789',
      category: 'Local',
      status: 'Active'
    },
    {
      id: 30,
      supplierName: 'Emzor Pharmaceuticals',
      contactName: 'Yusuf Ahmed',
      phone: '0901 123 4567',
      category: 'Overseas',
      status: 'Inactive'
    },
    {
      id: 40,
      supplierName: 'Emzor Pharmaceuticals',
      contactName: 'Yusuf Ahmed',
      phone: '0901 123 4567',
      category: 'Overseas',
      status: 'Inactive'
    },
    {
      id: 12,
      supplierName: 'GSK Pharma',
      contactName: 'Mary Johnson',
      phone: '0803 456 7890',
      category: 'Local',
      status: 'Active'
    },
    {
      id: 76,
      supplierName: 'Pfizer Inc.',
      contactName: 'David Olamide',
      phone: '0701 234 5678',
      category: 'Overseas',
      status: 'Inactive'
    },
    {
      id: 22,
      supplierName: 'Swiss Pharma',
      contactName: 'Jane Doe',
      phone: '0802 345 6789',
      category: 'Local',
      status: 'Active'
    },
    {
      id: 45,
      supplierName: 'Sanofi',
      contactName: 'Adekunle Adebayo',
      phone: '0903 567 8901',
      category: 'Overseas',
      status: 'Inactive'
    },
    {
      id: 18,
      supplierName: 'May & Baker',
      contactName: 'Ifeoma Okonkwo',
      phone: '0810 678 9012',
      category: 'Local',
      status: 'Active'
    },
    {
      id: 29,
      supplierName: 'Merck Group',
      contactName: 'Thomas Edet',
      phone: '0805 234 6789',
      category: 'Overseas',
      status: 'Inactive'
    },
    {
      id: 38,
      supplierName: 'Johnson & Johnson',
      contactName: 'Samuel Opata',
      phone: '0702 678 1234',
      category: 'Local',
      status: 'Active'
    },
    {
      id: 60,
      supplierName: 'Novartis',
      contactName: 'Tolu Fashola',
      phone: '0904 567 2345',
      category: 'Overseas',
      status: 'Active'
    },
    {
      id: 55,
      supplierName: 'Reckitt Benckiser',
      contactName: 'Amaka Ugo',
      phone: '0816 345 6789',
      category: 'Local',
      status: 'Inactive'
    },
    {
      id: 10,
      supplierName: 'Roche Pharma',
      contactName: 'James Ikede',
      phone: '0807 890 1234',
      category: 'Overseas',
      status: 'Active'
    },
    {
      id: 34,
      supplierName: 'Bayer AG',
      contactName: 'Olivia Daniels',
      phone: '0812 345 6780',
      category: 'Local',
      status: 'Active'
    },
    {
      id: 28,
      supplierName: 'AstraZeneca',
      contactName: 'Musa Ibrahim',
      phone: '0809 567 8901',
      category: 'Overseas',
      status: 'Inactive'
    },
    {
      id: 71,
      supplierName: 'GlaxoSmithKline',
      contactName: 'Esther Adepoju',
      phone: '0705 123 4567',
      category: 'Local',
      status: 'Active'
    },
    {
      id: 49,
      supplierName: 'Takeda Pharmaceuticals',
      contactName: 'Henry Osei',
      phone: '0819 234 5678',
      category: 'Overseas',
      status: 'Inactive'
    },
    {
      id: 15,
      supplierName: 'Cipla Ltd.',
      contactName: 'Adeola Olatunji',
      phone: '0804 567 8902',
      category: 'Local',
      status: 'Active'
    },
    {
      id: 63,
      supplierName: 'Eli Lilly',
      contactName: 'Nkechi Eze',
      phone: '0908 678 1234',
      category: 'Overseas',
      status: 'Inactive'
    }
  ])  
    const statuses = {
      Active: 'bg-green-100 text-green-600',
      Inactive: 'bg-red-100 text-red-600'
    }
  
    return { suppliers, statuses }
  }