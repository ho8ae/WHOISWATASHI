// components/common/Pagination.jsx
import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;
  
  const { page, totalPages } = pagination;
  
  // 페이지 번호 생성
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxPageButtons / 2));
    let endPage = startPage + maxPageButtons - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="flex justify-center space-x-1 mt-6">
      {/* 첫 페이지 버튼 */}
      <button
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        className={`px-2 py-1 rounded ${
          page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        &laquo;
      </button>
      
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`px-2 py-1 rounded ${
          page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        &lsaquo;
      </button>
      
      {/* 페이지 번호 버튼 */}
      {getPageNumbers().map(num => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-1 rounded ${
            page === num 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {num}
        </button>
      ))}
      
      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`px-2 py-1 rounded ${
          page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        &rsaquo;
      </button>
      
      {/* 마지막 페이지 버튼 */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
        className={`px-2 py-1 rounded ${
          page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;