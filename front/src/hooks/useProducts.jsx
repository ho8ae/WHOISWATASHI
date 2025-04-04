// hooks/useProducts.js
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchProducts,
  fetchProductById,
  fetchCategories,
  setFilters,
  resetFilters,
  clearError
} from '../features/products/productsSlice';

/**
 * 상품 관련 커스텀 훅
 * @returns {Object} 상품 관련 상태 및 액션들
 */
const useProducts = () => {
  const dispatch = useDispatch();
  
  // products 상태 가져오기
  const {
    products,
    product,
    categories,
    pagination,
    filters,
    loading,
    error
  } = useSelector((state) => state.products);
  
  // 상품 목록 조회 함수
  const getProducts = useCallback((params) => {
    return dispatch(fetchProducts(params));
  }, [dispatch]);
  
  // 상품 상세 조회 함수
  const getProductById = useCallback((id) => {
    return dispatch(fetchProductById(id));
  }, [dispatch]);
  
  // 카테고리 목록 조회 함수
  const getCategories = useCallback(() => {
    return dispatch(fetchCategories());
  }, [dispatch]);
  
  // 필터 설정 함수
  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);
  
  // 필터 초기화 함수
  const clearFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);
  
  // 에러 초기화 함수
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  return {
    // 상태
    products,
    product,
    categories,
    pagination,
    filters,
    loading,
    error,
    
    // 액션
    getProducts,
    getProductById,
    getCategories,
    updateFilters,
    clearFilters,
    resetError
  };
};

export default useProducts;