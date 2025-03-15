import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';

// 아직 구현되지 않은 페이지들은 임시 컴포넌트로 대체
const ProductList = () => <div>상품 목록 페이지</div>;
const ProductDetail = () => <div>상품 상세 페이지</div>;
const Cart = () => <div>장바구니 페이지</div>;
const Login = () => <div>로그인 페이지</div>;
const Register = () => <div>회원가입 페이지</div>;
const NotFound = () => <div>페이지를 찾을 수 없습니다.</div>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;