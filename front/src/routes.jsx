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
} from "./pages";

// 아직 구현되지 않은 페이지들은 임시 컴포넌트로 대체

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<Admin />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="about" element={<About />} />
        <Route path="mypage" element={<MyPage />} />
        
        {/* orderPage 및 API 주소 잘 봐야함 */}
        <Route path="order" element={<Order />} /> 
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
