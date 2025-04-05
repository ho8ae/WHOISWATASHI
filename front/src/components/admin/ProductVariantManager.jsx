// components/admin/product-edit-tabs/ProductVariantManagement.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAdmin from '../../hooks/useAdmin';
import OptionTypeSelector from './product-edit-tabs/OptionTypeSelector';
import OptionValueForm from './product-edit-tabs/OptionValueForm';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';

const ProductVariantManagement = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const {
    products,
    getProductDetail,
    getProductVariants,
    getOptionTypes,
    addProductVariant,
    optionTypes,
  } = useAdmin();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedOptionTypes, setSelectedOptionTypes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [generatedVariants, setGeneratedVariants] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 상품 상세 정보 로드
        const productDetail = await getProductDetail(productId);
        console.log('상품 상세 정보 응답:', productDetail);
        
        // 상품 변형 정보 로드
        const variantsResponse = await getProductVariants(productId);
        console.log('변형 정보 응답:', variantsResponse);
        
        // 응답에서 변형 배열을 직접 확인
        if (variantsResponse && variantsResponse.variants) {
          console.log('API에서 받은 변형 배열:', variantsResponse.variants);
          // variants 상태 직접 업데이트
          setVariants(variantsResponse.variants);
        } else if (Array.isArray(variantsResponse)) {
          console.log('API에서 받은 변형 배열(직접 배열):', variantsResponse);
          // variants 상태 직접 업데이트
          setVariants(variantsResponse);
        } else {
          console.log('변형 정보를 찾을 수 없음. 응답 구조:', variantsResponse);
        }
        
        // 옵션 타입 로드
        await getOptionTypes();
        
      } catch (error) {
        console.error('데이터 로드 중 오류 발생:', error);
        setError('데이터를 로드하는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId, getProductDetail, getProductVariants, getOptionTypes]);

  // products 상태 변경 시 선택된 상품 업데이트
  useEffect(() => {
    if (products.selectedProduct) {
      setSelectedProduct(products.selectedProduct);
      
      console.log('선택된 상품 정보:', products.selectedProduct);
      
      // 상품에 이미 등록된 변형 있는 경우
      if (products.selectedProduct.variants && products.selectedProduct.variants.length > 0) {
        console.log('기존 변형 데이터:', products.selectedProduct.variants);
        setVariants(products.selectedProduct.variants);
        
        // 기존 옵션 타입 로드
        const existingOptionTypes = [];
        products.selectedProduct.variants.forEach((variant) => {
          if (variant.options) {
            variant.options.forEach((option) => {
              const optionTypeId = option.optionValue?.optionType?.id;
              if (optionTypeId && !existingOptionTypes.some((ot) => ot.id === optionTypeId)) {
                existingOptionTypes.push({
                  id: optionTypeId,
                  name: option.optionValue?.optionType?.name,
                });
              }
            });
          }
        });
        
        console.log('추출된 기존 옵션 타입:', existingOptionTypes);
        if (existingOptionTypes.length > 0) {
          setSelectedOptionTypes(existingOptionTypes);
        }
      } else {
        console.log('등록된 변형 없음');
      }
    }
  }, [products.selectedProduct]);

  // 옵션 타입 추가/변경 핸들러
  const handleOptionTypeChange = (optionTypes) => {
    setSelectedOptionTypes(optionTypes);
  };

  // 생성된 변형 업데이트 핸들러
  const handleVariantsChange = (newVariants) => {
    setGeneratedVariants(newVariants);
  };

  // 이전 페이지로 돌아가기
  const handleBack = () => {
    navigate('/admin/products');
  };

  // 옵션 저장하기 함수 수정
  const handleSaveOptions = async () => {
    // 유효성 검사
    if (generatedVariants.length === 0) {
      setError('저장할 옵션 변형이 없습니다. 옵션 타입과 값을 추가해주세요.');
      return;
    }

    if (generatedVariants.some((variant) => !variant.price)) {
      setError('모든 변형에 가격을 입력해주세요.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      console.log('저장할 변형 데이터:', generatedVariants);

      // 변형을 한 번에 하나씩 저장
      let successCount = 0;
      let errorCount = 0;
      const errorDetails = [];

      for (const variant of generatedVariants) {
        // 옵션 값 ID 배열 준비 (32비트 정수 범위 확인)
        const optionValueIds = variant.options
          .map((opt) => Number(opt.optionValueId))
          .filter((id) => !isNaN(id) && id > 0 && id < 2147483647);

        if (optionValueIds.length === 0) {
          console.warn(
            '유효한 옵션 값 ID가 없습니다. 변형을 건너뜁니다:',
            variant,
          );
          continue;
        }

        const variantData = {
          sku: variant.sku,
          price: variant.price,
          salePrice: variant.salePrice || null,
          stock: variant.stock || 0,
          isActive: variant.isActive !== undefined ? variant.isActive : true,
          imageUrl: variant.imageUrl || '',
          optionValues: optionValueIds, // 옵션 값 ID 배열
        };

        console.log('백엔드로 전송할 변형 데이터:', {
          ...variantData,
          optionValues: JSON.stringify(variantData.optionValues),
        });

        try {
          // 새 변형 생성 API 호출
          const result = await addProductVariant(productId, variantData);
          console.log('생성된 변형 결과:', result);

          // 응답 형식에 상관없이 오류가 없으면 성공으로 처리
          successCount++;
        } catch (error) {
          console.error('변형 생성 중 오류:', error);
          errorCount++;
          // SKU 중복 오류인 경우 상세 메시지 저장
          if (
            error.message &&
            error.message.includes(
              'Unique constraint failed on the fields: (`sku`)',
            )
          ) {
            errorDetails.push(`SKU '${variant.sku}'가 이미 존재합니다.`);
          } else {
            errorDetails.push(
              `옵션 '${variant.sku}'를 저장하는 중 오류 발생: ${
                error.message || '알 수 없는 오류'
              }`,
            );
          }
        }
      }

      // 결과 메시지 설정
      if (successCount > 0) {
        setSuccess(
          `${successCount}개의 옵션 변형이 성공적으로 저장되었습니다.`,
        );

        // 일부 오류가 있었다면 함께 표시
        if (errorCount > 0) {
          setError(
            `${errorCount}개의 옵션에서 오류가 발생했습니다: ${errorDetails
              .slice(0, 3)
              .join(', ')}${
              errorDetails.length > 3 ? ' 외 더 많은 오류...' : ''
            }`,
          );
        }

        // 성공 후 변형 목록 갱신
        await getProductVariants(productId);
      } else if (errorCount > 0) {
        setError(
          `모든 옵션 저장에 실패했습니다: ${errorDetails
            .slice(0, 3)
            .join(', ')}${
            errorDetails.length > 3 ? ' 외 더 많은 오류...' : ''
          }`,
        );
      } else {
        setError('저장된 옵션 변형이 없습니다. 옵션 값을 확인하세요.');
      }
    } catch (error) {
      console.error('옵션 저장 중 오류 발생:', error);
      setError(
        '옵션 저장 중 오류가 발생했습니다: ' +
          (error.message || '알 수 없는 오류'),
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      <div className="flex justify-between items-center my-6">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">
            {selectedProduct?.name || '상품'} 옵션 관리
          </h1>
        </div>
        <button
          onClick={handleSaveOptions}
          disabled={saving}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {saving ? (
            <span className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
          ) : (
            <Save size={18} className="mr-2" />
          )}
          {saving ? '저장 중...' : '옵션 저장하기'}
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle size={20} className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* 성공 메시지 */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="ml-3 text-green-700">{success}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">1. 옵션 타입 설정</h2>
          <OptionTypeSelector
            optionTypes={optionTypes}
            selectedOptionTypes={selectedOptionTypes}
            onChange={handleOptionTypeChange}
          />
        </div>
      </div>

      {/* 기존 상품 변형 목록 섹션 */}
      {variants && variants.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">현재 등록된 옵션 ({variants.length}개)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">옵션</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">할인가</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">재고</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {variants.map(variant => (
                    <tr key={variant.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{variant.sku || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {variant.options && variant.options.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {variant.options.map(option => (
                              <span 
                                key={option.id} 
                                className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                              >
                                {option.optionValue?.optionType?.name}: {option.optionValue?.value}
                              </span>
                            ))}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {variant.price?.toLocaleString()}원
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {variant.salePrice ? `${variant.salePrice.toLocaleString()}원` : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {variant.stock}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          variant.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {variant.isActive ? '활성화' : '비활성화'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedOptionTypes.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">2. 옵션 값 설정</h2>
            <OptionValueForm
              optionTypes={selectedOptionTypes}
              productId={productId}
              variants={variants}
              onVariantsChange={handleVariantsChange}
            />
          </div>
        </div>
      )}

      {/* 변형 미리보기 */}
      {generatedVariants.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
          <div className="flex items-center text-blue-700 mb-2">
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">정보</span>
          </div>
          <p className="text-blue-700">
            {generatedVariants.length}개의 옵션 변형이 생성되었습니다. 모든
            변형을 검토한 후 상단의 '옵션 저장하기' 버튼을 클릭하여 저장하세요.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductVariantManagement;