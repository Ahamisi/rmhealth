
import { ref } from "vue";
const hannahAvatr = "/redesign/returns/hannah.png";
// import hannahAvatr from ""

export const useReturns = () => {
  const returns = ref<Array<Return>>(
    [
      {
        id: 87,
        supplierName: "Hannah Pedro",
        invoiceNo: "RHSP00028",
        date: "12/10/13",
        total: "₦96,700.00",
        adminName: "Dave Free",
        avatar: hannahAvatr, 
      },
      {
        id: 54,
        supplierName: "Adese Samson",
        invoiceNo: "RHSP00028",
        date: "12/4/17",
        total: "₦90,600.00",
        adminName: "Michael Raymond",
        avatar: hannahAvatr,
      },
      {
        id: 25,
        supplierName: "Hammed Yusuf",
        invoiceNo: "RHSP00028",
        date: "8/21/15",
        total: "₦37,850.00",
        adminName: "Esther Joel",
        avatar: hannahAvatr,
      },
      {
        id: 30,
        supplierName: "Josh Michael",
        invoiceNo: "RHSP00026",
        date: "9/23/16",
        total: "₦12,500.00",
        adminName: "Esther Joel",
        avatar: hannahAvatr,
      },
      {
        id: 51,
        supplierName: "Toluwani Bakare",
        invoiceNo: "RHSP00026",
        date: "1/31/14",
        total: "₦17,450.00",
        adminName: "Esther Joel",
        avatar: "",
      },
      {
        id: 21,
        supplierName: "Femi Babalola",
        invoiceNo: "RHSP00026",
        date: "8/30/14",
        total: "₦5,600.00",
        adminName: "Femi Babalola",
        avatar: "",
      },
      {
        id: 31,
        supplierName: "Oyebamiji Oluwasola",
        invoiceNo: "RHSP00026",
        date: "8/2/19",
        total: "₦48,900.00",
        adminName: "Femi Babalola",
        avatar: "",
      },
      {
        id: 23,
        supplierName: "Ebubechukwu Agnes",
        invoiceNo: "RHSP00014",
        date: "5/30/14",
        total: "₦45,600.00",
        adminName: "Sarah Badmus",
        avatar: "",
      },
      {
        id: 33,
        supplierName: "Justina Ogbonnaya",
        invoiceNo: "RHSP00014",
        date: "6/21/19",
        total: "₦43,900.00",
        adminName: "Sarah Badmus",
        avatar: "",
      },
      {
        id: 87,
        supplierName: "Esther Joel",
        invoiceNo: "RHSP00014",
        date: "6/19/14",
        total: "₦52,850.00",
        adminName: "Josh Michael",
        avatar: "",
      },
      {
        id: 82,
        supplierName: "Solomon Ideh",
        invoiceNo: "RHSP00014",
        date: "9/4/12",
        total: "₦84,500.00",
        adminName: "Josh Michael",
        avatar: "",
      },
      {
        id: 81,
        supplierName: "Ogunromedede-Smart Olusegun",
        invoiceNo: "RHSP00014",
        date: "7/11/19",
        total: "₦77,850.00",
        adminName: "Femi Babalola",
        avatar: "",
      },
      {
        id: 80,
        supplierName: "Yusuf Ahmed",
        invoiceNo: "RHSP00014",
        date: "5/27/15",
        total: "₦11,250.00",
        adminName: "Esther Joel",
        avatar: "",
      },
      {
        id: 15,
        supplierName: "Jichola Oyebola",
        invoiceNo: "RHSP00014",
        date: "8/15/17",
        total: "₦20,500.00",
        adminName: "Josh Michael",
        avatar: "",
      },
      {
        id: 55,
        supplierName: "Boluwatife Olusola",
        invoiceNo: "RHSP00014",
        date: "1/15/12",
        total: "₦89,500.00",
        adminName: "Femi Babalola",
        avatar: "",
      },
    ]
  
)  
  const search = ref("");
  const selectedStatus = ref("");


  
    return { returns, search, selectedStatus}
  }

  export type Return = {
    id: number;
    supplierName: string;
    invoiceNo: string;
    date: string;
    total: string;
    adminName: string;
    avatar: string;
  };
  