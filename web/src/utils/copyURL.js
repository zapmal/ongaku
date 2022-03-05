import { useNotificationStore } from '@/stores/useNotificationStore';

export const copyURL = (content) => {
  const path = import.meta.env.VITE_APP_URL;
  navigator.clipboard.writeText(`${path}/${content}`);

  useNotificationStore.getState().addNotification({
    id: 'ctc',
    title: '¡Copiado!',
    message: 'URL copiada al portapapeles',
  });
};
