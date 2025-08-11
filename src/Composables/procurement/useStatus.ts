import { ref, onMounted, onUnmounted } from "vue";

interface Option {
  id: number;
  name: string;
}

export const useStatus = () => {
  const status = ref<Option | null>(null);

  const statuses = ref([
    {
      id: 1,
      name: "Pending",
      position: "CEO",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    },
    {
      id: 2,
      name: "Active",
      position: "COO",
      avatar: "https://randomuser.me/api/portraits/women/62.jpg",
    },
    {
      id: 2,
      name: "Inactive",
      position: "COO",
      avatar: "https://randomuser.me/api/portraits/women/62.jpg",
    },
  ]);

  const setStatus = (st: Option) => {
    status.value = st;
  };
  return { status, statuses, setStatus };
};
