import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../components/admin/Dashboard';
import ProductManagement from '../components/admin/ProductManagement';
import ProductEditPage from '../components/admin/ProductEditPage';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import InquiryManagement from '../components/admin/InquiryManagement';
import OptionManagement from '../components/admin/OptionManagement';
import useAuth from '../hooks/useAuth';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  
  // 인증 및 권한 체크
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="products/new" element={<ProductEditPage />} />
        <Route path="products/edit/:productId" element={<ProductEditPage />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="inquiries" element={<InquiryManagement />} />
        <Route path="options" element={<OptionManagement />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default Admin;