import axiosInstance from '../api/axiosInstance';

export async function sendOtpService(formData) {
  const { data } = await axiosInstance.post('/api/v1/user/send-otp', formData);
  return data;
}

export async function verifyOtpService(formData) {
  const { data } = await axiosInstance.post('/api/v1/user/verify-otp', formData);
  return data;
}
