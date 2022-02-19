import { apiClient } from '@/lib/api';

export const sendRecoveryCode = (data) => {
  return apiClient.post('send-recovery-code', data);
};

export const changePassword = (data) => {
  return apiClient.put('change-password', data);
};
