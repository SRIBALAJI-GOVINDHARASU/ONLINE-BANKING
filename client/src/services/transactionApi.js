import api from './api';

export const deposit = (payload) => api.post('/deposit', payload);
export const withdraw = (payload) => api.post('/withdraw', payload);
export const transfer = (payload) => api.post('/transfer', payload);
export const getTransactions = () => api.get('/transactions');
