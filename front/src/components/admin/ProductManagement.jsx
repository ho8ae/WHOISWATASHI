import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' 또는 'outOfStock'

  useEffect(() => {
    // 임시 데이터 (API 연결 전까지 사용)
    setTimeout(() => {
      const mockProducts = Array.from({ length: 10 }, (_, i) => {
        const stock = Math.random() > 0.3 ? Math.floor(Math.random() * 50) + 1 : 0;
        return {
          id: i + 1,
          name: `상품 ${i + 1}`,
          price: Math.floor(10000 + Math.random() * 90000),
          stock: stock,
          isOutOfStock: stock === 0,
          category: ['의류', '신발', '악세서리', '가방'][Math.floor(Math.random() * 4)],
        };
      });

      const outOfStock = mockProducts.filter(product => product.isOutOfStock);

      setProducts(mockProducts);
      setOutOfStockProducts(outOfStock);
      setLoading(false);
    }, 500);
  }, []);

  const formatCurrency = (amount) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  const handleUpdateStock = (productId, newStock) => {
    // 실제로는 API 호출하여 재고 업데이트
    console.log('재고 업데이트:', productId, newStock);
    
    // 임시로 상태 업데이트
    setProducts(products.map(product => 
      product.id === productId ? 
      { ...product, stock: newStock, isOutOfStock: newStock === 0 } : 
      product
    ));
  };

  if (loading) {
    return <div className="p-6">로딩 중...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">상품 관리</h1>
      
      {/* 탭 */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex -mb-px">
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'all'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('all')}
          >
            모든 상품
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'outOfStock'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('outOfStock')}
          >
            품절 상품 ({outOfStockProducts.length})
          </button>
        </div>
      </div>
      
      {/* 모든 상품 */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex justify-end p-4">
            <Link
              to="/admin/products/new"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              + 새 상품 등록
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">상품명</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">가격</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">카테고리</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">재고</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{product.id}</td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stock === 0 ? '품절' : `${product.stock}개`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Link 
                          to={`/admin/products/${product.id}/edit`}
                          className="text-blue-500 hover:underline"
                        >
                          수정
                        </Link>
                        <button 
                          onClick={() => handleUpdateStock(product.id, 0)}
                          className="text-red-500 hover:underline"
                        >
                          품절처리
                        </button>
                        {product.stock === 0 && (
                          <button 
                            onClick={() => handleUpdateStock(product.id, 10)}
                            className="text-green-500 hover:underline"
                          >
                            재입고
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* 품절 상품 */}
      {activeTab === 'outOfStock' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">상품명</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">카테고리</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">재입고</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {outOfStockProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{product.id}</td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleUpdateStock(product.id, 10)}
                        className="text-green-500 hover:underline"
                      >
                        재입고
                      </button>
                    </td>
                  </tr>
                ))}
                {outOfStockProducts.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                      품절된 상품이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;