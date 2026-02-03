import api from './axios';

export const login = async (data: { phone: string; password: string }): Promise<{ token: string }> => {
  const response = await api.post<{ token: string }>('/login', data);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/profile/');
  return response.data;
};

export const updateProfile = async (data: any) => {
  const response = await api.put('/profile/', data);
  return response.data;
};
