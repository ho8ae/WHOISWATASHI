// pages/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import useProducts from '../hooks/useProducts';

// 컴포넌트 import
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/layout/Pagination';

const ProductList = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    products, 
    categories, 
    pagination, 
    filters, 
    loading, 
    error, 
    getProducts, 
    getCategories
  } = useProducts();

  // 상품 목록 조회
  const fetchProducts = () => {
    try {
      const params = {
        page: searchParams.get('page') || 1,
        limit: searchParams.get('limit') || 12,
        search: searchParams.get('search') || null,
        categoryId: searchParams.get('categoryId') || null,
        minPrice: searchParams.get('minPrice') || null,
        maxPrice: searchParams.get('maxPrice') || null,
        sortBy: searchParams.get('sortBy') || 'createdAt',
        sortOrder: searchParams.get('sortOrder') || 'desc'
      };
    
      getProducts(params);
    } catch (err) {
      console.error('상품 목록 조회 에러:', err);
    }
  };
  
  // 컴포넌트 마운트시 & URL 파라미터 변경시 상품 목록 조회
  useEffect(() => {
    // 카테고리 목록 조회
    // getCategories();
    
    // 상품 목록 조회
    fetchProducts();
    

  }, [location.search]);


  // 페이지 변경 처리
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  };
  
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">상품 목록</h1>
      
      {/* 로딩 상태 */}
      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {/* 검색 결과 없음 */}
      {!loading && !error && (!products || products.length === 0) && (
        <div className="text-center py-10">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}
      
      {/* 상품 그리드 */}
      {!loading && !error && products && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
            
          ))}
          
        </div>
      )}
      
      {/* 페이지네이션 */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination 
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductList;