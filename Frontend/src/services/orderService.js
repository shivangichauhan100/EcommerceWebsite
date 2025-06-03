// src/services/orderService.js
import API from './api';

export const createOrder = async (orderData) => {
  const response = await API.post('/orders', orderData);
  return response.data;
};

export const getOrder = async (orderNumber) => {
  const response = await API.get(`/orders/${orderNumber}`);
  return response.data;
};