import api from './api';

export const getAccount = () => api.get('/account');
export const verifyPin = (pin) => api.post('/account/verify-pin', { pin });
export const getBalance = () => api.get('/balance');
export const updateProfile = (updates) => api.put('/account/update', updates);
export const changePassword = (payload) => api.put('/account/change-password', payload);
export const getPassbook = () => api.get('/passbook');
