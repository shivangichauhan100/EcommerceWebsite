// src/services/productService.js
import API from './api';

// src/services/productService.js
export const getProducts = async () => {
  try {
    const response = await API.get('/products');
    console.log('API Response:', response.data); // Debug log
    
    // Handle both response formats
    if (response.data && Array.isArray(response.data)) {
      return response.data; // Direct array response
    } else if (response.data && response.data.data) {
      return response.data.data; // Wrapped response
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};