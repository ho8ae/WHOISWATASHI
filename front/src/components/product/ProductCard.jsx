// components/product/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  if (!product) {
    return null;
  }
  
  // 할인율 계산
  const discountRate = product.salePrice && product.price ? 
    Math.round((1 - product.salePrice / product.price) * 100) : 0;
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/products/${product.id}`} className="block">
        <div className="h-48 bg-gray-100 relative">
          {product.primaryImage ? (
            <img 
              src={product.primaryImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo192.png';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              이미지 없음
            </div>
          )}
          
          {product.salePrice && product.salePrice < product.price && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discountRate}% OFF
            </div>
          )}
        </div>
        
        <div className="p-4">
          {product.categories && product.categories.length > 0 && (
            <div className="text-xs text-gray-500 mb-1">
              {product.categories[0].name}
            </div>
          )}
          
          <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
          
          <div className="flex items-center space-x-2">
            {product.salePrice ? (
              <>
                <span className="text-red-600 font-bold">{product.salePrice.toLocaleString()}원</span>
                <span className="text-gray-400 line-through text-sm">{product.price.toLocaleString()}원</span>
              </>
            ) : (
              <span className="font-bold">{product.price.toLocaleString()}원</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;