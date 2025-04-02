// components/admin/product-edit-tabs/OptionsTab.jsx
import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

const OptionsTab = ({ formData, setFormData }) => {
  // 옵션 설정 상태
  const [optionTypes, setOptionTypes] = useState([
    { id: formData.options?.length > 0 ? 'existing' : Date.now(), name: '', values: [] }
  ]);
  const [newOptionValue, setNewOptionValue] = useState('');
  const [selectedOptionType, setSelectedOptionType] = useState(optionTypes[0].id);
  
  // 옵션 행렬 생성 여부
  const [optionMatrixGenerated, setOptionMatrixGenerated] = useState(
    formData.options && formData.options.length > 0
  );

  // 옵션 타입 추가
  const addOptionType = () => {
    setOptionTypes([...optionTypes, { id: Date.now(), name: '', values: [] }]);
  };

  // 옵션 타입 이름 변경
  const handleOptionTypeNameChange = (id, name) => {
    setOptionTypes(optionTypes.map(type => 
      type.id === id ? { ...type, name } : type
    ));
  };

  // 옵션 타입 삭제
  const removeOptionType = (id) => {
    setOptionTypes(optionTypes.filter(type => type.id !== id));
  };

  // 옵션 값 추가
  const addOptionValue = () => {
    if (!newOptionValue.trim()) return;
    
    setOptionTypes(optionTypes.map(type => 
      type.id === selectedOptionType 
        ? { ...type, values: [...type.values, { id: Date.now(), name: newOptionValue }] }
        : type
    ));
    
    setNewOptionValue('');
  };

  // 옵션 값 삭제
  const removeOptionValue = (typeId, valueId) => {
    setOptionTypes(optionTypes.map(type => 
      type.id === typeId 
        ? { ...type, values: type.values.filter(value => value.id !== valueId) }
        : type
    ));
  };

  // 모든 옵션 조합 생성
  const generateOptionCombinations = () => {
    // 유효한 옵션 타입만 필터링 (이름과 값이 있는 것만)
    const validOptionTypes = optionTypes.filter(
      type => type.name.trim() && type.values.length > 0
    );
    
    if (validOptionTypes.length === 0) {
      alert('최소 하나 이상의 옵션 타입과 값이 필요합니다.');
      return;
    }
    
    // 카르테시안 곱 함수 (모든 조합 생성)
    const cartesian = (...arrays) => {
      return arrays.reduce((acc, array) => {
        return acc.flatMap(x => array.map(y => [...x, y]));
      }, [[]]);
    };
    
    // 각 옵션 타입의 값 배열 생성
    const optionArrays = validOptionTypes.map(type => type.values);
    
    // 모든 조합 생성
    const combinations = cartesian(...optionArrays);
    
    // 옵션 조합을 상품 옵션으로 변환
    const newOptions = combinations.map(combination => {
      // 옵션 이름 생성 (예: "색상: 레드 / 사이즈: XL")
      const name = combination
        .map((value, index) => `${validOptionTypes[index].name}: ${value.name}`)
        .join(' / ');
      
      // 기존 옵션에서 동일한 옵션이 있는지 확인
      const existingOption = formData.options?.find(opt => opt.name === name);
      
      return {
        id: existingOption?.id || Date.now() + Math.random(),
        name,
        stock: existingOption?.stock || 0,
        price: existingOption?.price || 0,
        optionValues: combination.map((value, index) => ({
          typeName: validOptionTypes[index].name,
          valueName: value.name
        }))
      };
    });
    
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
    
    setOptionMatrixGenerated(true);
  };

  // 옵션 수정
  const updateOption = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(option => 
        option.id === id ? { ...option, [field]: field === 'stock' || field === 'price' ? Number(value) : value } : option
      )
    }));
  };

  // 옵션 삭제
  const removeOption = (id) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter(option => option.id !== id)
    }));
  };

  // 옵션 초기화
  const resetOptions = () => {
    if (window.confirm('정말 모든 옵션을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      setFormData(prev => ({
        ...prev,
        options: []
      }));
      setOptionMatrixGenerated(false);
    }
  };

  return (
    <div className="py-4">
      {!optionMatrixGenerated ? (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              옵션 설정
            </label>
            <button
              type="button"
              onClick={addOptionType}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              옵션 타입 추가
            </button>
          </div>
          
          {optionTypes.map((optionType, index) => (
            <div key={optionType.id} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 mr-2">옵션 {index + 1}</span>
                  <input
                    type="text"
                    value={optionType.name}
                    onChange={(e) => handleOptionTypeNameChange(optionType.id, e.target.value)}
                    placeholder="옵션명 (예: 색상, 사이즈)"
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {optionTypes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOptionType(optionType.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              
              <div className="mb-3">
                <div className="flex">
                  <select
                    value={selectedOptionType === optionType.id ? selectedOptionType : optionType.id}
                    onChange={(e) => setSelectedOptionType(e.target.value)}
                    className="sr-only"
                  >
                    {optionTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name || `옵션 ${optionTypes.indexOf(type) + 1}`}
                      </option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    value={selectedOptionType === optionType.id ? newOptionValue : ''}
                    onChange={(e) => setNewOptionValue(e.target.value)}
                    onClick={() => setSelectedOptionType(optionType.id)}
                    placeholder="옵션값 입력 (예: 레드, XL)"
                    className="flex-1 p-2 border rounded-l focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  <button
                    type="button"
                    onClick={addOptionValue}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
                    disabled={selectedOptionType !== optionType.id || !newOptionValue.trim()}
                  >
                    추가
                  </button>
                </div>
              </div>
              
              {optionType.values.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {optionType.values.map(value => (
                    <div key={value.id} className="flex items-center bg-white px-2 py-1 rounded border">
                      <span className="text-sm">{value.name}</span>
                      <button
                        type="button"
                        onClick={() => removeOptionValue(optionType.id, value.id)}
                        className="ml-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">옵션값이 없습니다</p>
              )}
            </div>
          ))}
          
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={generateOptionCombinations}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={optionTypes.every(type => !type.name.trim() || type.values.length === 0)}
            >
              옵션 조합 생성
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">옵션 목록</h3>
            <button
              type="button"
              onClick={resetOptions}
              className="text-sm text-red-600 hover:text-red-800"
            >
              옵션 초기화
            </button>
          </div>
          
          {formData.options && formData.options.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      옵션명
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      추가 가격
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      재고
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.options.map((option) => (
                    <tr key={option.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {option.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={option.price}
                            onChange={(e) => updateOption(option.id, 'price', e.target.value)}
                            min="0"
                            className="w-24 p-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="ml-1 text-sm text-gray-500">원</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="number"
                          value={option.stock}
                          onChange={(e) => updateOption(option.id, 'stock', e.target.value)}
                          min="0"
                          className="w-24 p-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => removeOption(option.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">옵션이 없습니다</p>
            </div>
          )}
        </>
      )}
      
      {!optionMatrixGenerated && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              기본 재고 관리
            </label>
            <div className="text-sm text-gray-500">
              옵션이 없는 경우 사용됩니다
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  재고 수량
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                  min="0"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  안전 재고 (알림용)
                </label>
                <input
                  type="number"
                  name="safetyStock"
                  value={formData.safetyStock || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, safetyStock: Number(e.target.value) }))}
                  min="0"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  재고가 이 수량 이하로 떨어지면 알림이 발송됩니다
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionsTab;