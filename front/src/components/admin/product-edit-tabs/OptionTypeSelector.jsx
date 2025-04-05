// components/admin/product-edit-tabs/OptionTypeSelector.jsx
import React, { useState } from 'react';
import useAdmin from '../../../hooks/useAdmin';
import { Plus, X } from 'lucide-react';

const OptionTypeSelector = ({ optionTypes = [], selectedOptionTypes = [], onChange }) => {
  const { addOptionValue, addOptionType } = useAdmin();
  const [newOptionType, setNewOptionType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  // 옵션 타입 선택 토글
  const toggleOptionType = (optionType) => {
    const isSelected = selectedOptionTypes.some(ot => ot.id === optionType.id);
    let updatedOptionTypes;
    
    if (isSelected) {
      updatedOptionTypes = selectedOptionTypes.filter(ot => ot.id !== optionType.id);
    } else {
      updatedOptionTypes = [...selectedOptionTypes, optionType];
    }
    
    onChange(updatedOptionTypes);
  };
  
  // 새 옵션 타입 추가
  const handleAddOptionType = async () => {
    if (!newOptionType.trim()) return;
    
    try {
      setIsCreating(true);
      // 실제 API 호출로 옵션 타입 생성
      const response = await addOptionType({ 
        name: newOptionType,
        displayOrder: optionTypes.length + 1
      });
      
      // 생성된 옵션 타입 자동 선택
      if (response && response.data) {
        const newType = response.data;
        onChange([...selectedOptionTypes, newType]);
      }
      
      setNewOptionType('');
    } catch (error) {
      console.error('옵션 타입 생성 중 오류 발생:', error);
      alert('옵션 타입 생성 중 오류가 발생했습니다.');
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {optionTypes.map(optionType => (
          <button
            key={optionType.id}
            onClick={() => toggleOptionType(optionType)}
            className={`px-4 py-2 rounded-lg border ${
              selectedOptionTypes.some(ot => ot.id === optionType.id)
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {optionType.name}
          </button>
        ))}
      </div>
      
      <div className="flex mt-4">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="새 옵션 타입 이름 (예: 사이즈, 색상)"
          value={newOptionType}
          onChange={(e) => setNewOptionType(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isCreating) {
              e.preventDefault();
              handleAddOptionType();
            }
          }}
        />
        <button
          onClick={handleAddOptionType}
          disabled={isCreating}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-r-lg border border-l-0 flex items-center"
        >
          {isCreating ? (
            <span className="h-4 w-4 border-2 border-t-blue-500 border-r-blue-500 border-b-blue-500 border-l-transparent rounded-full animate-spin mr-2"></span>
          ) : (
            <Plus size={18} />
          )}
          {isCreating ? '생성 중...' : '생성'}
        </button>
      </div>
      
      {selectedOptionTypes.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">선택된 옵션 타입:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedOptionTypes.map(optionType => (
              <div
                key={optionType.id}
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              >
                {optionType.name}
                <button
                  onClick={() => toggleOptionType(optionType)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionTypeSelector;