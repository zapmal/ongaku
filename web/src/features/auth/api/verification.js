import { apiClient } from '@/lib/api';

export const markEmailAsVerified = (data) => {
  return apiClient.post('verify', data);
};

export const resendVerificationEmail = (data) => {
  return apiClient.post('resend-verification', data);
};
