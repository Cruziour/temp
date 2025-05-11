import axiosInstance from '../api/axiosInstance';

export async function sendOtpService(formData) {
  const { data } = await axiosInstance.post('/api/v1/user/send-otp', formData);
  return data;
}

export async function verifyOtpService(formData) {
  const { data } = await axiosInstance.post(
    '/api/v1/user/verify-otp',
    formData
  );
  return data;
}

export async function activationService(formData) {
  const { data } = await axiosInstance.post('/api/v1/user/activate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

export async function logoutUserService() {
  const { data } = await axiosInstance.post('/api/v1/user/logout-user');
  return data;
}

export async function createRoomService(formData) {
  const { data } = await axiosInstance.post('/api/v1/room', formData);
  return data;
}

export async function getAllRoomService(formData) {
  const { data } = await axiosInstance.post('/api/v1/room/fetch-room', formData);
  return data;
}
