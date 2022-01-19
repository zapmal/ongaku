import { apiClient } from '@/lib/api';

export const verifyEmail = (data) => {
  return apiClient.post('verify-email', data);
};

export const resendVerificationEmail = (data) => {
  return apiClient.post('resend-verification-email', data);
};
