// pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById } from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux store에서 상품 데이터 가져오기
  const { product, loading, error } = useSelector(state => state.products);
  
  // 상태들
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  // 변형 관련 상태
  const [optionTypes, setOptionTypes] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);

  // 컴포넌트 마운트시 상품 상세 조회
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  // 상품 데이터 로드 후 변형 데이터 처리
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      // 옵션 타입 정보 추출
      const types = extractOptionTypes(product.variants);
      setOptionTypes(types);
      
      // 초기 옵션 선택 상태 설정
      const initialOptions = {};
      types.forEach(type => {
        initialOptions[type.id] = '';
      });
      setSelectedOptions(initialOptions);
    }
  }, [product]);

  // 변형 정보에서 옵션 타입 추출
  const extractOptionTypes = (variants) => {
    if (!variants || variants.length === 0) return [];
    
    const typeMap = new Map();
    
    variants.forEach(variant => {
      if (variant.options) {
        variant.options.forEach(opt => {
          const optionType = opt.optionValue.optionType;
          if (!typeMap.has(optionType.id)) {
            typeMap.set(optionType.id, optionType);
          }
        });
      }
    });
    
    return Array.from(typeMap.values());
  };

  // 특정 옵션 타입에 대한 사용 가능한 옵션 값 목록 조회
  const getAvailableOptionValues = (optionTypeId) => {
    if (!product || !product.variants) return [];
    
    // 현재 선택된 다른 옵션들에 맞는 변형들 필터링
    const compatibleVariants = product.variants.filter(variant => {
      if (!variant.options) return false;
      
      return Object.entries(selectedOptions).every(([typeId, value]) => {
        // 현재 확인 중인 옵션 타입은 건너뛰기
        if (Number(typeId) === optionTypeId || value === '') {
          return true;
        }
        
        // 선택된 다른 옵션 값과 일치하는지 확인
        return variant.options.some(opt => 
          opt.optionValue.optionType.id === Number(typeId) && 
          opt.optionValue.id === Number(value)
        );
      });
    });
    
    // 호환되는 변형들에서 해당 옵션 타입의 값들 수집
    const valuesMap = new Map();
    compatibleVariants.forEach(variant => {
      variant.options.forEach(opt => {
        if (opt.optionValue.optionType.id === optionTypeId) {
          valuesMap.set(opt.optionValue.id, opt.optionValue);
        }
      });
    });
    
    return Array.from(valuesMap.values());
  };

  // 옵션 선택 변경 시
  const handleOptionChange = (optionTypeId, optionValueId) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [optionTypeId]: optionValueId
    };
    setSelectedOptions(newSelectedOptions);
    
    // 선택된 옵션에 맞는 변형 찾기
    findMatchingVariant(newSelectedOptions);
  };

  // 선택된 옵션에 맞는 변형 찾기
  const findMatchingVariant = (options) => {
    if (!product || !product.variants) {
      setSelectedVariant(null);
      return;
    }
    
    // 모든 옵션이 선택되었는지 확인
    const allSelected = Object.values(options).every(value => value !== '');
    if (!allSelected) {
      setSelectedVariant(null);
      return;
    }
    
    // 선택된 옵션 조합과 일치하는 변형 찾기
    const found = product.variants.find(variant => {
      if (!variant.options) return false;
      
      return Object.entries(options).every(([typeId, valueId]) => {
        return variant.options.some(opt => 
          opt.optionValue.optionType.id === Number(typeId) && 
          opt.optionValue.id === Number(valueId)
        );
      });
    });
    
    setSelectedVariant(found || null);
  };

  // 수량 증가
  const increaseQuantity = () => {
    const maxStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };

  // 수량 감소
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // 장바구니 추가
  const handleAddToCart = () => {
    if (!product) return;
    
    // 변형이 있고 선택되지 않았으면 알림
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      alert('모든 옵션을 선택해주세요.');
      return;
    }
    
    try {
      // 변형이 있는 경우 selectedVariant.id를 사용, 없는 경우 기본 상품 ID 사용
      const productVariantId = selectedVariant ? selectedVariant.id : product.id;
      
      dispatch(addToCart({ productVariantId, quantity }));
      alert('장바구니에 추가되었습니다.');
    } catch (e) {
      console.error('장바구니 추가 실패:', e);
    }
  };

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  // 상품이 없는 경우
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
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [{ id: 0, imageUrl: '/logo192.png' }];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 이미지 섹션 */}
        <div>
          {/* 메인 이미지 */}
          <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={selectedVariant?.imageUrl || (productImages[selectedImageIndex]?.imageUrl)}
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
                    ${
                      selectedImageIndex === index
                        ? 'border-blue-500'
                        : 'border-gray-200'
                    }
                  `}
                  onClick={() => setSelectedImageIndex(index)}
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
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {product.name}
          </h1>

          {/* 가격 정보 */}
          <div className="mb-4">
            {selectedVariant ? (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-red-600">
                  {selectedVariant.salePrice ? 
                    selectedVariant.salePrice.toLocaleString() : 
                    selectedVariant.price.toLocaleString()}원
                </span>
                {selectedVariant.salePrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {selectedVariant.price.toLocaleString()}원
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-red-600">
                  {product.salePrice ? 
                    product.salePrice.toLocaleString() : 
                    product.price.toLocaleString()}원
                </span>
                {product.salePrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {product.price.toLocaleString()}원
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 기본 정보 */}
          <div className="border-t border-b py-4 mb-4">
            <div className="grid grid-cols-4 gap-2">
              <div className="text-gray-600">상품 코드</div>
              <div className="col-span-3">{selectedVariant?.sku || product.sku || '-'}</div>

              <div className="text-gray-600">재고</div>
              <div className="col-span-3">
                {selectedVariant ? 
                  (selectedVariant.stock > 0 ? `${selectedVariant.stock}개` : '품절') : 
                  (product.stock > 0 ? `${product.stock}개` : '품절')}
              </div>
            </div>
          </div>

          {/* 옵션 선택 */}
          {optionTypes.length > 0 && (
            <div className="mb-6">
              {optionTypes.map(type => (
                <div key={type.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {type.name}
                  </label>
                  <select
                    value={selectedOptions[type.id] || ''}
                    onChange={(e) => handleOptionChange(type.id, e.target.value)}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- 선택해주세요 --</option>
                    {getAvailableOptionValues(type.id).map(optValue => (
                      <option key={optValue.id} value={optValue.id}>
                        {optValue.value}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

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
                max={selectedVariant ? selectedVariant.stock : product.stock}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  const maxStock = selectedVariant ? selectedVariant.stock : product.stock;
                  if (!isNaN(val) && val >= 1 && val <= maxStock) {
                    setQuantity(val);
                  }
                }}
                className="w-16 text-center border-x focus:ring-0 focus:border-gray-300"
              />
              <button
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-r-md"
                onClick={increaseQuantity}
                disabled={(selectedVariant ? selectedVariant.stock : product.stock) <= quantity}
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
                {(
                  (selectedVariant 
                    ? (selectedVariant.salePrice || selectedVariant.price) 
                    : (product.salePrice || product.price)) * quantity
                ).toLocaleString()}
                원
              </span>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 font-medium"
              disabled={(optionTypes.length > 0 && !selectedVariant) || 
                (selectedVariant ? selectedVariant.stock <= 0 : product.stock <= 0)}
            >
              장바구니
            </button>
            <button
              className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              disabled={(optionTypes.length > 0 && !selectedVariant) || 
                (selectedVariant ? selectedVariant.stock <= 0 : product.stock <= 0)}
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
              onClick={() => setActiveTab('description')}
            >
              상품 상세정보
            </button>
            <button
              className={`px-6 py-3 text-center font-medium ${
                activeTab === 'delivery'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('delivery')}
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
                dangerouslySetInnerHTML={{
                  __html: product.description || '상품 상세 정보가 없습니다.',
                }}
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