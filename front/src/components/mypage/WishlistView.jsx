import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useMypage from '../../hooks/useMypage';

const WishlistView = () => {
  const {
    getUserWishlist,
    deleteWishlistItem,
    wishlist,
    wishlistPagination,
    loading,
    error,
    resetWishlistError
  } = useMypage();

  const [currentPage, setCurrentPage] = useState(1);

  // 위시리스트 불러오기
  useEffect(() => {
    getUserWishlist(currentPage, 10);
  }, [getUserWishlist, currentPage]);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 위시리스트 아이템 삭제 핸들러
  const handleRemoveItem = async (itemId) => {
    if (window.confirm('정말로 위시리스트에서 삭제하시겠습니까?')) {
      try {
        await deleteWishlistItem(itemId);
      } catch (err) {
        console.error('위시리스트 아이템 삭제 오류:', err);
      }
    }
  };

  if (loading.wishlist && wishlist.length === 0) {
    return <div className="text-center py-4">위시리스트를 불러오는 중...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">위시리스트</h2>
        <p className="text-sm text-gray-500">찜한 상품 목록입니다.</p>
      </div>

      {error.wishlist && (
        <div className="m-4 p-3 bg-red-100 text-red-800 rounded" onClick={resetWishlistError}>
          {error.wishlist}
        </div>
      )}

      <div className="p-4">
        {wishlist.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">위시리스트가 비어있습니다.</p>
            <Link
              to="/products"
              className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              상품 둘러보기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border rounded-lg overflow-hidden"
              >
                <div className="relative">
                  <Link to={`/products/${item.productId}`}>
                    <img
                      src={item.product.image || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  
                </div>
                <div className="p-4">
                  <Link 
                    to={`/products/${item.product.slug}`}
                    className="text-lg font-medium text-gray-900 hover:text-indigo-600"
                  >
                    {item.product.name}
                  </Link>
                  <div className="mt-2 flex items-center">
                    {item.product.salePrice ? (
                      <>
                        <span className="text-lg font-bold text-gray-900">
                          {item.product.salePrice.toLocaleString()}원
                        </span>
                        <span className="ml-2 text-sm line-through text-gray-500">
                          {item.product.price.toLocaleString()}원
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {item.product.price.toLocaleString()}원
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Link
                      to={`/products/${item.productId}`}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                    >
                      상세보기
                    </Link>
                    <button
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {wishlistPagination && wishlistPagination.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                이전
              </button>
              
              {Array.from({ length: wishlistPagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    page === currentPage
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  } text-sm font-medium`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === wishlistPagination.totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                다음
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistView;