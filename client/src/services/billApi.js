import api from './api';

export const payBill = (payload) => api.post('/pay-bill', payload);
