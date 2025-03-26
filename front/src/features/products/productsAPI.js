import { apiClient } from '../../services/api/client';
import { API_ENDPOINTS } from '../../services/api/endpoints';

export const productsAPI = {
  getProducts: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
    return response.data;
  },
  
  getProductById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.DETAIL(id));
    return response.data;
  },
};