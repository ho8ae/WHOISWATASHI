// components/admin/product-edit-tabs/OptionValueForm.jsx
import React, { useState, useEffect } from 'react';
import useAdmin from '../../../hooks/useAdmin';
import { Plus, Trash } from 'lucide-react';

const OptionValueForm = ({
  optionTypes = [],
  productId,
  variants = [],
  onVariantsChange,
}) => {
  const { addOptionValue, getAllOptionValues, getOptionTypes } = useAdmin();
  const [optionValues, setOptionValues] = useState({});
  const [newValues, setNewValues] = useState({});
  const [generatedVariants, setGeneratedVariants] = useState([]);
  const [isAddingValue, setIsAddingValue] = useState(false);
  const [allOptionValues, setAllOptionValues] = useState([]);

  // 컴포넌트 마운트 시 모든 옵션 값 로드
  useEffect(() => {
    const loadAllData = async () => {
      try {
        // 모든 옵션 타입과 옵션 값 로드
        await getOptionTypes();

        const response = await getAllOptionValues();
        console.log('getAllOptionValues 응답:', response);

        // 응답 구조 확인 후 적절한 데이터 추출 - 수정된 부분
        let optionValuesData = [];
        if (response && response.payload && response.payload.data) {
          // payload.data 배열이 있는 경우 (Redux Toolkit 응답 구조)
          optionValuesData = response.payload.data;
        } else if (response && response.data) {
          // 일반 API 응답에서 data 배열이 있는 경우
          optionValuesData = response.data;
        } else if (Array.isArray(response)) {
          // 응답 자체가 배열인 경우
          optionValuesData = response;
        } else if (response && Array.isArray(response.payload)) {
          // payload가 직접 배열인 경우
          optionValuesData = response.payload;
        }

        console.log('추출된 옵션 값 데이터:', optionValuesData);
        setAllOptionValues(optionValuesData);

        // 옵션 값을 옵션 타입별로 그룹화
        const groupedValues = {};
        optionValuesData.forEach((value) => {
          if (!groupedValues[value.optionTypeId]) {
            groupedValues[value.optionTypeId] = [];
          }

          groupedValues[value.optionTypeId].push({
            id: value.id,
            value: value.value,
          });
        });

        console.log('옵션 타입별 그룹화된 옵션 값:', groupedValues);
        setOptionValues(groupedValues);

        // 각 옵션 타입에 대한 빈 입력 필드 초기화
        const initialNewValues = {};
        optionTypes.forEach((type) => {
          initialNewValues[type.id] = '';
        });
        setNewValues(initialNewValues);

        // 변형 생성 시도
        setTimeout(() => {
          generateVariants(groupedValues);
        }, 300);
      } catch (error) {
        console.error('데이터 로드 중 오류:', error);
      }
    };

    loadAllData();
  }, [getAllOptionValues, getOptionTypes, optionTypes]);

  // 새 옵션 값 추가
  const handleAddOptionValue = async (optionTypeId) => {
    const value = newValues[optionTypeId];
    if (!value.trim()) return;

    try {
      setIsAddingValue(true);

      // API 호출
      const optionValueData = {
        value: value.trim(),
        displayOrder: (optionValues[optionTypeId] || []).length + 1,
      };

      console.log(
        `옵션 타입 ID ${optionTypeId}에 값 추가 시도:`,
        optionValueData,
      );

      const response = await addOptionValue(optionTypeId, optionValueData);
      console.log('옵션 값 추가 응답:', response);

      // 응답 구조에 따라 처리 - 수정된 부분
      let newOptionValue;
      if (response && response.optionValue) {
        newOptionValue = response.optionValue;
      } else if (response && response.payload && response.payload.data) {
        newOptionValue = response.payload.data;
      } else if (response && response.data) {
        newOptionValue = response.data;
      } else if (response) {
        // 응답 자체가 옵션 값인 경우
        newOptionValue = response;
      }

      if (newOptionValue) {
        console.log('추가된 옵션 값:', newOptionValue);

        // 옵션 값 상태 업데이트
        const updatedValues = { ...optionValues };
        if (!updatedValues[optionTypeId]) {
          updatedValues[optionTypeId] = [];
        }

        // 중복 방지
        if (
          !updatedValues[optionTypeId].some((v) => v.id === newOptionValue.id)
        ) {
          updatedValues[optionTypeId] = [
            ...updatedValues[optionTypeId],
            {
              id: newOptionValue.id,
              value: newOptionValue.value,
            },
          ];
        }

        setOptionValues(updatedValues);

        // 변형 재생성
        setTimeout(() => {
          generateVariants(updatedValues);
        }, 100);

        // 전체 옵션 값 목록 다시 로드
        const allValuesResponse = await getAllOptionValues();
        let optionValuesData = [];

        // 응답 구조 확인 후 적절한 데이터 추출 - 수정된 부분
        if (
          allValuesResponse &&
          allValuesResponse.payload &&
          allValuesResponse.payload.data
        ) {
          optionValuesData = allValuesResponse.payload.data;
        } else if (allValuesResponse && allValuesResponse.data) {
          optionValuesData = allValuesResponse.data;
        } else if (Array.isArray(allValuesResponse)) {
          optionValuesData = allValuesResponse;
        } else if (
          allValuesResponse &&
          Array.isArray(allValuesResponse.payload)
        ) {
          optionValuesData = allValuesResponse.payload;
        }

        setAllOptionValues(optionValuesData);
      }

      // 입력 필드 초기화
      setNewValues((prev) => ({
        ...prev,
        [optionTypeId]: '',
      }));
    } catch (error) {
      console.error('옵션 값 추가 중 오류 발생:', error);
      alert('옵션 값 추가 중 오류가 발생했습니다.');
    } finally {
      setIsAddingValue(false);
    }
  };

  // 옵션 값 삭제
  const handleRemoveOptionValue = (optionTypeId, valueId) => {
    const updatedValues = { ...optionValues };
    updatedValues[optionTypeId] = updatedValues[optionTypeId].filter(
      (v) => v.id !== valueId,
    );
    setOptionValues(updatedValues);

    // 변형 재생성
    setTimeout(() => {
      generateVariants(updatedValues);
    }, 100);
  };

  // 새 값 입력 핸들러
  const handleNewValueChange = (optionTypeId, value) => {
    setNewValues((prev) => ({
      ...prev,
      [optionTypeId]: value,
    }));
  };

  // 모든 옵션 조합의 카테시안 곱 계산
  const generateCartesianProduct = (arrays) => {
    if (arrays.length === 0) return [[]];

    return arrays.reduce(
      (acc, array) => acc.flatMap((x) => array.map((y) => [...x, y])),
      [[]],
    );
  };

  // 옵션 값 조합에 따른 변형 자동 생성
  const generateVariants = (currentValues = optionValues) => {
    console.log('변형 생성 시작, 현재 옵션 값:', currentValues);

    // 옵션 값이 있는 옵션 타입만 필터링
    const validOptionTypes = optionTypes.filter(
      (type) => currentValues[type.id] && currentValues[type.id].length > 0,
    );

    console.log('유효한 옵션 타입:', validOptionTypes);

    if (validOptionTypes.length === 0) {
      console.log('유효한 옵션 타입이 없어 변형을 생성할 수 없습니다.');
      setGeneratedVariants([]);
      if (onVariantsChange) {
        onVariantsChange([]);
      }
      return;
    }

    // 각 옵션 타입의 값 배열 생성
    const optionArrays = validOptionTypes.map((optionType) => {
      const values = currentValues[optionType.id] || [];
      console.log(
        `옵션 타입 ${optionType.name}(ID: ${optionType.id})의 값들:`,
        values,
      );

      return values.map((value) => ({
        optionTypeId: optionType.id,
        optionTypeName: optionType.name,
        optionValueId: value.id,
        optionValue: value.value,
      }));
    });

    // 모든 옵션 조합 생성
    const combinations = generateCartesianProduct(optionArrays);
    console.log('생성된 옵션 조합:', combinations);

    // 기존 변형에서 정보 가져오기 위한 맵 생성
    const existingVariantMap = {};
    if (variants && variants.length > 0) {
      variants.forEach((variant) => {
        if (variant.options && variant.options.length > 0) {
          // 옵션 값 ID를 키로 사용하여 맵 생성
          const key = variant.options
            .map((opt) => opt.optionValue?.id)
            .filter((id) => id) // null/undefined 값 제거
            .sort()
            .join('-');

          if (key) {
            existingVariantMap[key] = variant;
          }
        }
      });
    }

    // 변형 생성
    const newVariants = combinations.map((combination) => {
      // 변형의 고유 키 생성
      const key = combination
        .map((opt) => opt.optionValueId)
        .sort()
        .join('-');

      // 기존 변형 정보 가져오기
      const existingVariant = existingVariantMap[key];

      // 변형의 SKU 기본값 생성 (옵션 값 조합)
      const defaultSku = `${productId}-${combination
        .map((opt) => opt.optionValue)
        .join('-')}`;

      // 옵션 값 ID 배열 (백엔드 요청용)
      // 중요: 32비트 정수 범위(2147483647) 내의 유효한 ID만 필터링
      const optionValueIds = combination
        .map((opt) => Number(opt.optionValueId))
        .filter((id) => !isNaN(id) && id > 0 && id < 2147483647);

      console.log('변형을 위한 옵션 값 ID 배열:', optionValueIds);

      return {
        id: existingVariant?.id || null,
        productId: parseInt(productId),
        sku: existingVariant?.sku || defaultSku,
        price: existingVariant?.price || 0,
        salePrice: existingVariant?.salePrice || 0,
        stock: existingVariant?.stock || 0,
        isActive:
          existingVariant?.isActive !== undefined
            ? existingVariant.isActive
            : true,
        imageUrl: existingVariant?.imageUrl || '',
        options: combination,
        // 중요: 백엔드 API가 필요로 하는 형식으로 옵션 값 ID
        optionValues: optionValueIds,
      };
    });

    console.log('생성된 변형들:', newVariants.length, newVariants);
    setGeneratedVariants(newVariants);
    // 부모 컴포넌트에 생성된 변형 전달
    if (onVariantsChange) {
      onVariantsChange(newVariants);
    }
  };

  // 변형 정보 업데이트 핸들러
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...generatedVariants];
    updatedVariants[index][field] = value;
    setGeneratedVariants(updatedVariants);

    // 부모 컴포넌트에 업데이트된 변형 전달
    if (onVariantsChange) {
      onVariantsChange(updatedVariants);
    }
  };

  // 변형 수동 생성 버튼 핸들러
  const handleManualGenerate = () => {
    generateVariants();
  };

  return (
    <div>
      {optionTypes.length === 0 ? (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 mb-6">
          <p className="text-yellow-700">
            옵션 타입이 없습니다. 먼저 옵션 타입을 선택해주세요.
          </p>
        </div>
      ) : (
        optionTypes.map((optionType) => (
          <div
            key={optionType.id}
            className="mb-6 pb-6 border-b border-gray-200"
          >
            <h3 className="text-md font-medium mb-3">
              {optionType.name} (ID: {optionType.id})
            </h3>

            {/* 옵션 값 칩 목록 */}
            <div className="flex flex-wrap gap-2 mb-3">
              {optionValues[optionType.id]?.map((value) => (
                <div
                  key={value.id}
                  className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-lg"
                >
                  {value.value}{' '}
                  <span className="text-xs text-gray-500 ml-1">
                    (ID: {value.id})
                  </span>
                  <button
                    onClick={() =>
                      handleRemoveOptionValue(optionType.id, value.id)
                    }
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}

              {(!optionValues[optionType.id] ||
                optionValues[optionType.id].length === 0) && (
                <div
                  key={`empty-${optionType.id}`}
                  className="text-gray-500 text-sm"
                >
                  옵션 값이 없습니다. 새 옵션 값을 추가하세요.
                </div>
              )}
            </div>

            {/* 새 옵션 값 추가 폼 */}
            <div className="flex">
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`새 ${optionType.name} 값 추가...`}
                value={newValues[optionType.id] || ''}
                onChange={(e) =>
                  handleNewValueChange(optionType.id, e.target.value)
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isAddingValue) {
                    e.preventDefault();
                    handleAddOptionValue(optionType.id);
                  }
                }}
              />
              <button
                onClick={() => handleAddOptionValue(optionType.id)}
                disabled={isAddingValue}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-r-lg border border-l-0 flex items-center"
              >
                {isAddingValue ? (
                  <span className="h-4 w-4 border-2 border-t-blue-500 border-r-blue-500 border-b-blue-500 border-l-transparent rounded-full animate-spin mr-2"></span>
                ) : (
                  <Plus size={18} />
                )}
                추가
              </button>
              
            </div>
            <p className="text-sm text-gray-500 mt-2">
              옵션값을 추가 한후 새로고침후 옵션 조합에 작성해주세요. 그리고 저장하기 버튼을 눌러주세요
            </p>
          </div>
        ))
      )}

      {/* 변형 재생성 버튼 */}
      {optionTypes.length > 0 && (
        <div className="mb-6">
          <button
            onClick={handleManualGenerate}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            옵션 조합 생성하기
          </button>
          <p className="text-sm text-gray-500 mt-2">
            옵션 값을 모두 추가한 후 이 버튼을 클릭하여 변형을 생성하세요.
          </p>
        </div>
      )}

      {/* 변형 미리보기 및 관리 */}
      {generatedVariants.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-md font-medium mb-3">
            옵션 조합 ({generatedVariants.length}개)
          </h3>
          <div className="border rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {optionTypes
                    .filter((type) => optionValues[type.id]?.length > 0)
                    .map((optionType) => (
                      <th
                        key={optionType.id}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {optionType.name}
                      </th>
                    ))}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가격
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    할인가
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    재고
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {generatedVariants.map((variant, index) => (
                  <tr key={index}>
                    {optionTypes
                      .filter((type) => optionValues[type.id]?.length > 0)
                      .map((optionType) => {
                        const option = variant.options.find(
                          (opt) => opt.optionTypeId === optionType.id,
                        );
                        return (
                          <td
                            key={optionType.id}
                            className="px-4 py-3 whitespace-nowrap"
                          >
                            <span className="text-sm text-gray-900">
                              {option ? `${option.optionValue}` : '-'}
                            </span>
                          </td>
                        );
                      })}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="text"
                        className="w-full px-2 py-1 text-sm border rounded"
                        placeholder="SKU"
                        value={variant.sku || ''}
                        onChange={(e) =>
                          handleVariantChange(index, 'sku', e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        className="w-full px-2 py-1 text-sm border rounded"
                        placeholder="가격"
                        value={variant.price || ''}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            'price',
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        className="w-full px-2 py-1 text-sm border rounded"
                        placeholder="할인가"
                        value={variant.salePrice || ''}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            'salePrice',
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        className="w-full px-2 py-1 text-sm border rounded"
                        placeholder="재고"
                        value={variant.stock || ''}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            'stock',
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        className="w-full px-2 py-1 text-sm border rounded"
                        value={variant.isActive ? 'true' : 'false'}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            'isActive',
                            e.target.value === 'true',
                          )
                        }
                      >
                        <option value="true">활성화</option>
                        <option value="false">비활성화</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            * 모든 옵션 조합에 따른 변형이 자동으로 생성됩니다. 각 변형의 SKU,
            가격, 재고를 설정하세요.
          </p>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-600">
            {Object.keys(optionValues).some(
              (key) => optionValues[key]?.length > 0,
            )
              ? "옵션 값을 모두 추가한 후 '옵션 조합 생성하기' 버튼을 클릭하세요."
              : '옵션 값을 추가하면 변형 상품 옵션이 여기에 표시됩니다.'}
          </p>
        </div>
      )}

      {/* 디버깅 정보 */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">디버깅 정보:</h3>
        <p>옵션 타입 수: {optionTypes.length}</p>
        <p>
          옵션 값이 있는 옵션 타입 수:{' '}
          {
            Object.keys(optionValues).filter(
              (key) => optionValues[key]?.length > 0,
            ).length
          }
        </p>
        <p>생성된 변형 수: {generatedVariants.length}</p>
        <p>전체 옵션 값 수: {allOptionValues.length}</p>
      </div>
    </div>
  );
};

export default OptionValueForm;
