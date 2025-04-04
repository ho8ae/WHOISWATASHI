// components/product/ProductFilter.jsx
import React, { useState, useEffect } from 'react';

const ProductFilter = ({ categories, filters, onFilterChange, onFilterApply, onFilterReset }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  
  // filters prop이 변경되면 localFilters 업데이트
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };
  
  const handleApply = () => {
    if (onFilterApply) {
      onFilterApply(localFilters);
    }
  };
  
  const handleReset = () => {
    if (onFilterReset) {
      onFilterReset();
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* 카테고리 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            카테고리
          </label>
          <select
            name="categoryId"
            value={localFilters.categoryId || ''}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">전체 카테고리</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* 가격 범위 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            가격 범위
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="minPrice"
              placeholder="최소"
              value={localFilters.minPrice || ''}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="flex items-center">~</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="최대"
              value={localFilters.maxPrice || ''}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* 정렬 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            정렬
          </label>
          <select
            name="sort"
            value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              handleChange({ 
                target: { 
                  name: 'sortBy', 
                  value: sortBy 
                } 
              });
              handleChange({ 
                target: { 
                  name: 'sortOrder', 
                  value: sortOrder 
                } 
              });
            }}
            className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="createdAt-desc">최신순</option>
            <option value="createdAt-asc">오래된순</option>
            <option value="price-asc">가격 낮은순</option>
            <option value="price-desc">가격 높은순</option>
            <option value="name-asc">이름 (가나다순)</option>
            <option value="name-desc">이름 (역순)</option>
          </select>
        </div>
        
        {/* 검색 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            검색
          </label>
          <div className="flex">
            <input
              type="text"
              name="search"
              placeholder="상품명 검색"
              value={localFilters.search || ''}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              검색
            </button>
          </div>
        </div>
      </div>
      
      {/* 필터 버튼 */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
        >
          필터 초기화
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          필터 적용
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;