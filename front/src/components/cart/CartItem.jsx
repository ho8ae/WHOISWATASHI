// components/cart/CartItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateCartItem, removeCartItem } from '../../features/cart/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  
  // 수량 변경 핸들러
  const handleQuantityChange = (newQuantity) => {
    dispatch(updateCartItem({ itemId: item.id, quantity: newQuantity }));
  };
  
  // 삭제 핸들러
  const handleRemove = () => {
    if (window.confirm('이 상품을 장바구니에서 삭제하시겠습니까?')) {
      dispatch(removeCartItem(item.id));
    }
  };
  
  // 변형 옵션 정보 표시 문자열 생성
  const getOptionText = () => {
    if (!item.productVariant || !item.productVariant.options || item.productVariant.options.length === 0) {
      return '';
    }
    
    return item.productVariant.options.map(option => 
      `${option.optionValue.optionType.name}: ${option.optionValue.value}`
    ).join(' / ');
  };
  
  return (
    <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* 상품 이미지 */}
      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
        <img 
          src={item.productVariant?.imageUrl || item.product.thumbnail || '/default-product.png'} 
          alt={item.product.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* 상품 정보 */}
      <div className="flex-grow">
        <h3 className="text-sm font-medium text-gray-900">
          <Link to={`/products/${item.product.id}`} className="hover:text-blue-600">
            {item.product.name}
          </Link>
        </h3>
        
        {/* 옵션 정보 표시 */}
        {getOptionText() && (
          <p className="text-xs text-gray-500 mt-1">
            {getOptionText()}
          </p>
        )}
        
        <div className="text-sm text-gray-700 mt-1">
          {item.productVariant && item.productVariant.salePrice ? (
            <>
              <span className="font-medium">{item.productVariant.salePrice.toLocaleString()}원</span>
              <span className="line-through text-gray-400 ml-2">
                {item.productVariant.price.toLocaleString()}원
              </span>
            </>
          ) : (
            <span className="font-medium">
              {(item.productVariant ? item.productVariant.price : item.product.price).toLocaleString()}원
            </span>
          )}
        </div>
      </div>
      
      {/* 수량 및 가격 */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4">
        {/* 수량 선택 */}
        <div className="flex items-center border rounded">
          <button 
            className="px-2 py-1 text-gray-500 hover:text-gray-700"
            onClick={() => handleQuantityChange(Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            value={item.quantity}
            min="1"
            max={item.productVariant ? item.productVariant.stock : item.product.stock}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              const maxStock = item.productVariant ? item.productVariant.stock : item.product.stock;
              if (!isNaN(val) && val >= 1 && val <= maxStock) {
                handleQuantityChange(val);
              }
            }}
            className="w-12 text-center border-x focus:outline-none"
          />
          <button 
            className="px-2 py-1 text-gray-500 hover:text-gray-700"
            onClick={() => handleQuantityChange(Math.min(
              item.productVariant ? item.productVariant.stock : item.product.stock, 
              item.quantity + 1
            ))}
            disabled={item.quantity >= (item.productVariant ? item.productVariant.stock : item.product.stock)}
          >
            +
          </button>
        </div>
        
        {/* 총 가격 */}
        <div className="font-medium whitespace-nowrap">
          {((item.productVariant 
            ? (item.productVariant.salePrice || item.productVariant.price) 
            : (item.product.salePrice || item.product.price)) * item.quantity).toLocaleString()}원
        </div>
        
        {/* 삭제 버튼 */}
        <button 
          onClick={handleRemove}
          className="text-gray-400 hover:text-red-500 ml-2"
          aria-label="Remove item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;