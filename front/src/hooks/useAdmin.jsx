import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  // 대시보드
  fetchDashboard,
  
  // 사용자
  fetchUsers,
  fetchUserDetail,
  updateUserRole,
  selectUser,
  
  // 상품
  fetchProducts,
  fetchProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchOutOfStockProducts,
  updateProductStock,
  selectProduct,
  
  // 주문
  fetchOrders,
  fetchOrderDetail,
  updateOrder,
  selectOrder,
  
  // 카테고리
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  selectCategory,
  
  // 문의
  fetchInquiries,
  fetchInquiryDetail,
  answerInquiry,
  updateInquiryStatus,
  selectInquiry,
  
  // 공통
  clearError
} from '../features/admin/adminSlice';

/**
 * Admin 관련 커스텀 훅
 * @returns {Object} Admin 관련 상태 및 액션들
 */
const useAdmin = () => {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin);
  
  // 대시보드 관련 함수
  const getDashboard = useCallback(() => {
    return dispatch(fetchDashboard());
  }, [dispatch]);
  
  // 사용자 관련 함수
  const getUsers = useCallback((params) => {
    return dispatch(fetchUsers(params));
  }, [dispatch]);
  
  const getUserDetail = useCallback((userId) => {
    return dispatch(fetchUserDetail(userId));
  }, [dispatch]);
  
  const changeUserRole = useCallback((userId, role) => {
    return dispatch(updateUserRole({ userId, role }));
  }, [dispatch]);
  
  const chooseUser = useCallback((user) => {
    dispatch(selectUser(user));
  }, [dispatch]);
  
  // 상품 관련 함수
  const getProducts = useCallback((params) => {
    return dispatch(fetchProducts(params));
  }, [dispatch]);
  
  const getProductDetail = useCallback((productId) => {
    return dispatch(fetchProductDetail(productId));
  }, [dispatch]);
  
  const addProduct = useCallback((productData) => {
    return dispatch(createProduct(productData));
  }, [dispatch]);
  
  const editProduct = useCallback((productId, productData) => {
    return dispatch(updateProduct({ productId, productData }));
  }, [dispatch]);
  
  const removeProduct = useCallback((productId) => {
    return dispatch(deleteProduct(productId));
  }, [dispatch]);
  
  const getOutOfStockProducts = useCallback(() => {
    return dispatch(fetchOutOfStockProducts());
  }, [dispatch]);
  
  const updateStock = useCallback((variantId, stock) => {
    return dispatch(updateProductStock({ variantId, stock }));
  }, [dispatch]);
  
  const chooseProduct = useCallback((product) => {
    dispatch(selectProduct(product));
  }, [dispatch]);
  
  // 주문 관련 함수
  const getOrders = useCallback((params) => {
    return dispatch(fetchOrders(params));
  }, [dispatch]);
  
  const getOrderDetail = useCallback((orderId) => {
    return dispatch(fetchOrderDetail(orderId));
  }, [dispatch]);
  
  const updateOrderStatus = useCallback((orderId, orderData) => {
    return dispatch(updateOrder({ orderId, orderData }));
  }, [dispatch]);
  
  const chooseOrder = useCallback((order) => {
    dispatch(selectOrder(order));
  }, [dispatch]);
  
  // 카테고리 관련 함수
  const getCategories = useCallback(() => {
    return dispatch(fetchCategories());
  }, [dispatch]);
  
  const addCategory = useCallback((categoryData) => {
    return dispatch(createCategory(categoryData));
  }, [dispatch]);
  
  const editCategory = useCallback((categoryId, categoryData) => {
    return dispatch(updateCategory({ categoryId, categoryData }));
  }, [dispatch]);
  
  const removeCategory = useCallback((categoryId) => {
    return dispatch(deleteCategory(categoryId));
  }, [dispatch]);
  
  const chooseCategory = useCallback((category) => {
    dispatch(selectCategory(category));
  }, [dispatch]);
  
  // 문의 관련 함수
  const getInquiries = useCallback((params) => {
    return dispatch(fetchInquiries(params));
  }, [dispatch]);
  
  const getInquiryDetail = useCallback((inquiryId) => {
    return dispatch(fetchInquiryDetail(inquiryId));
  }, [dispatch]);
  
  const replyToInquiry = useCallback((inquiryId, answerData) => {
    return dispatch(answerInquiry({ inquiryId, answerData }));
  }, [dispatch]);
  
  const changeInquiryStatus = useCallback((inquiryId, status) => {
    return dispatch(updateInquiryStatus({ inquiryId, status }));
  }, [dispatch]);
  
  const chooseInquiry = useCallback((inquiry) => {
    dispatch(selectInquiry(inquiry));
  }, [dispatch]);
  
  // 에러 초기화
  const resetError = useCallback((section) => {
    dispatch(clearError(section));
  }, [dispatch]);
  
  return {
    // 상태
    dashboard: admin.dashboard,
    users: admin.users,
    products: admin.products,
    orders: admin.orders,
    categories: admin.categories,
    inquiries: admin.inquiries,
    
    // 대시보드 액션
    getDashboard,
    
    // 사용자 액션
    getUsers,
    getUserDetail,
    changeUserRole,
    chooseUser,
    
    // 상품 액션
    getProducts,
    getProductDetail,
    addProduct,
    editProduct,
    removeProduct,
    getOutOfStockProducts,
    updateStock,
    chooseProduct,
    
    // 주문 액션
    getOrders,
    getOrderDetail,
    updateOrderStatus,
    chooseOrder,
    
    // 카테고리 액션
    getCategories,
    addCategory,
    editCategory,
    removeCategory,
    chooseCategory,
    
    // 문의 액션
    getInquiries,
    getInquiryDetail,
    replyToInquiry,
    changeInquiryStatus,
    chooseInquiry,
    
    // 공통 액션
    resetError
  };
};

export default useAdmin;