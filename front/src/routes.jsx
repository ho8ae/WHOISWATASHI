import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import {
  ProductDetail,
  NotFound,
  Cart,
  Login,
  Register,
  ProductList,
  MyPage,
  About,
  Order,
  Admin,
  Checkout,
  Payment,
  OrderComplete,
} from "./pages";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 관리자 경로 - Admin.jsx가 모든 관리자 라우팅을 처리 */}
      <Route path="/admin/*" element={<Admin />} />

      {/* 일반 사용자 경로 */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="about" element={<About />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="order" element={<Order />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="payment/:orderId" element={<Payment />} />
        <Route path="order/complete/:orderId" element={<OrderComplete />} />
        
        {/* 404 페이지 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;