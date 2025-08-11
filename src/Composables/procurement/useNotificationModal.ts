import { ref } from 'vue';

const notification = ref(false);

export const useNotificationModal = () => {
  return notification;
};