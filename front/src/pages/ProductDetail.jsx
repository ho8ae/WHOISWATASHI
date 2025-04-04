// pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error, getProductById } = useProducts();
  
  // 상태들
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  // 컴포넌트 마운트시 상품 상세 조회
  useEffect(() => {
    // id가 있고 숫자로 변환 가능한 경우에만 API 호출
    if (id) {
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        console.log(`상품 상세 조회 요청: ID=${numericId}`);
        getProductById(numericId);
      } else {
        console.error('유효하지 않은 상품 ID:', id);
        // 에러 처리 또는 리다이렉션 추가
      }
    }
  }, [id, getProductById]);
  
  console.log('상품 상세 데이터:', product);
  
  // 수량 증가
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  // 수량 감소
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // 이미지 선택
  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };
  
  // 탭 활성화
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // 장바구니 추가
  const handleAddToCart = () => {
    console.log('장바구니 추가:', { productId: product.id, quantity });
    alert('장바구니에 추가되었습니다.');
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center">
          <p className="text-gray-500">상품을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }
  
  // 이미지 배열 생성
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [{ id: 0, imageUrl: 'https://via.placeholder.com/500?text=No+Image' }];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 이미지 섹션 */}
        <div>
          {/* 메인 이미지 */}
          <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={productImages[selectedImageIndex].imageUrl} 
              alt={product.name} 
              className="w-full h-auto object-contain"
              style={{ height: '400px' }}
            />
          </div>
          
          {/* 이미지 갤러리 */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {productImages.map((image, index) => (
                <div 
                  key={index}
                  className={`
                    border-2 rounded cursor-pointer overflow-hidden
                    ${selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'}
                  `}
                  onClick={() => handleImageSelect(index)}
                >
                  <img 
                    src={image.imageUrl} 
                    alt={`${product.name} ${index + 1}`} 
                    className="w-full h-16 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 상품 정보 섹션 */}
        <div>
          {/* 카테고리 */}
          {product.categories && product.categories.length > 0 && (
            <div className="text-sm text-gray-500 mb-2">
              {product.categories[0].category.name}
            </div>
          )}
          
          {/* 상품명 */}
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
          
          {/* 가격 정보 */}
          <div className="mb-4">
            {product.salePrice ? (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-red-600">{product.salePrice.toLocaleString()}원</span>
                <span className="text-lg text-gray-400 line-through">{product.price.toLocaleString()}원</span>
              </div>
            ) : (
              <div className="text-2xl font-bold">{product.price.toLocaleString()}원</div>
            )}
          </div>
          
          {/* 기본 정보 */}
          <div className="border-t border-b py-4 mb-4">
            <div className="grid grid-cols-4 gap-2">
              <div className="text-gray-600">상품 코드</div>
              <div className="col-span-3">{product.sku || '-'}</div>
              
              <div className="text-gray-600">재고</div>
              <div className="col-span-3">
                {product.stock > 0 ? `${product.stock}개` : '품절'}
              </div>
            </div>
          </div>
          
          {/* 수량 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              수량
            </label>
            <div className="flex items-center border rounded-md">
              <button 
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-l-md"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1 && val <= product.stock) {
                    setQuantity(val);
                  }
                }}
                className="w-16 text-center border-x focus:ring-0 focus:border-gray-300"
              />
              <button 
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-r-md"
                onClick={increaseQuantity}
                disabled={product.stock <= quantity}
              >
                +
              </button>
            </div>
          </div>
          
          {/* 총 가격 */}
          <div className="mb-6">
            <div className="text-lg">
              총 상품 금액: 
              <span className="text-xl font-bold ml-2">
                {((product.salePrice || product.price) * quantity).toLocaleString()}원
              </span>
            </div>
          </div>
          
          {/* 버튼 */}
          <div className="flex space-x-4">
            <button 
              onClick={handleAddToCart}
              className="flex-1 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 font-medium"
              disabled={product.stock <= 0}
            >
              장바구니
            </button>
            <button 
              className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              disabled={product.stock <= 0}
            >
              바로구매
            </button>
          </div>
        </div>
      </div>
      
      {/* 상품 상세 탭 */}
      <div className="mt-16">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 text-center font-medium ${
                activeTab === 'description'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('description')}
            >
              상품 상세정보
            </button>
            <button
              className={`px-6 py-3 text-center font-medium ${
                activeTab === 'delivery'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('delivery')}
            >
              배송/교환/반품 안내
            </button>
          </div>
        </div>
        
        <div className="py-6">
          {activeTab === 'description' && (
            <div>
              <div 
                className="product-description" 
                dangerouslySetInnerHTML={{ __html: product.description || '상품 상세 정보가 없습니다.' }}
              />
            </div>
          )}
          
          {activeTab === 'delivery' && (
            <div>
              <h3 className="text-lg font-medium mb-4">배송 안내</h3>
              <div className="bg-gray-50 p-4 rounded mb-6">
                <p>• 배송 방법: 택배</p>
                <p>• 배송 지역: 전국</p>
                <p>• 배송 비용: 3,000원 (30,000원 이상 구매 시 무료)</p>
                <p>• 배송 기간: 평균 3일 이내 배송 (주말/공휴일 제외)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;