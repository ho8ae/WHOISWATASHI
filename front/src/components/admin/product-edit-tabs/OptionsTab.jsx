// // components/admin/product-edit-tabs/OptionsTab.jsx
// import React, { useState, useEffect } from 'react';
// import { Plus, Save, AlertCircle } from 'lucide-react';
// import useAdmin from '../../../hooks/useAdmin';
// import OptionTypeRow from './OptionTypeRow';
// import VariantsList from './VariantsList';

// const OptionsTab = ({ productId, product }) => {
//   const { 
//     addProductVariant, 
//     getProductVariants, 
//     getOptionTypes,
//     addOptionValue,
//   } = useAdmin();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
  
//   // 옵션 상태
//   const [optionTypes, setOptionTypes] = useState([
//     { id: Date.now(), name: '', values: [] }
//   ]);
//   const [newOptionValue, setNewOptionValue] = useState('');
//   const [selectedOptionType, setSelectedOptionType] = useState(null);
  
//   // 서버에서 가져온 옵션 타입 목록
//   const [availableOptionTypes, setAvailableOptionTypes] = useState([]);
  
//   // 변형 상품 정보
//   const [variants, setVariants] = useState([]);
//   const [optionMatrixGenerated, setOptionMatrixGenerated] = useState(false);

//   // 페이지 로드 시 상품 정보 가져오기
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // 변형 정보 조회
//         const variantsResponse = await getProductVariants(productId);
//         const variantsData = 
//           variantsResponse.payload?.variants || 
//           variantsResponse.data?.variants || 
//           variantsResponse.variants || 
//           [];
        
//         if (variantsData && variantsData.length > 0) {
//           setVariants(variantsData);
//           setOptionMatrixGenerated(true);
//         }
        
//         // 옵션 타입 목록 조회
//         const optionTypesResponse = await getOptionTypes();
//         const optionTypesData = 
//           optionTypesResponse.payload?.data || 
//           optionTypesResponse.data || 
//           [];
        
//         setAvailableOptionTypes(optionTypesData);
        
//         if (variantsData.length > 0) {
//           // 기존 옵션 타입 추출
//           const usedOptionTypes = [];
//           const firstVariant = variantsData[0];
          
//           if (firstVariant.options) {
//             firstVariant.options.forEach(opt => {
//               const optionType = opt.optionValue.optionType;
//               if (!usedOptionTypes.some(t => t.id === optionType.id)) {
//                 usedOptionTypes.push({
//                   id: optionType.id,
//                   name: optionType.name,
//                   optionTypeId: optionType.id,
//                   values: []
//                 });
//               }
//             });
            
//             // 옵션 값 추출
//             usedOptionTypes.forEach(type => {
//               variantsData.forEach(variant => {
//                 variant.options.forEach(opt => {
//                   if (opt.optionValue.optionType.id === type.id) {
//                     // 중복 방지
//                     if (!type.values.some(v => v.id === opt.optionValue.id)) {
//                       type.values.push({
//                         id: opt.optionValue.id,
//                         name: opt.optionValue.value,
//                         optionValueId: opt.optionValue.id
//                       });
//                     }
//                   }
//                 });
//               });
//             });
            
//             setOptionTypes(usedOptionTypes);
//           }
//         }
//       } catch (err) {
//         console.error('데이터 로드 오류:', err);
//         setError('상품 또는 옵션 정보를 불러오는 데 실패했습니다.');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, [productId, getProductVariants, getOptionTypes]);

//   // 옵션 타입 추가
//   const addOptionType = () => {
//     setOptionTypes([...optionTypes, { id: Date.now(), name: '', values: [] }]);
//   };

//   // 모든 옵션 조합 생성
//   const generateOptionCombinations = async () => {
//     // 유효한 옵션 타입만 필터링 (이름과 값이 있는 것만)
//     const validOptionTypes = optionTypes.filter(
//       type => type.name.trim() && type.values.length > 0
//     );
    
//     if (validOptionTypes.length === 0) {
//       alert('최소 하나 이상의 옵션 타입과 값이 필요합니다.');
//       return;
//     }
    
//     // 카르테시안 곱 함수 (모든 조합 생성)
//     const cartesian = (...arrays) => {
//       return arrays.reduce((acc, array) => {
//         return acc.flatMap(x => array.map(y => [...x, y]));
//       }, [[]]);
//     };
    
//     // 각 옵션 타입의 값 배열 생성
//     const optionArrays = validOptionTypes.map(type => type.values);
    
//     // 모든 조합 생성
//     const combinations = cartesian(...optionArrays);
    
//     // 옵션 조합을 상품 변형으로 변환
//     const newVariants = combinations.map(combination => {
//       // 옵션 이름 생성 (예: "색상: 레드 / 사이즈: XL")
//       const name = combination
//         .map((value, index) => `${validOptionTypes[index].name}: ${value.name}`)
//         .join(' / ');
      
//       // 기존 변형에서 동일한 이름이 있는지 확인
//       const existingVariant = variants.find(v => {
//         if (!v.options) return false;
        
//         const variantName = v.options.map(opt => 
//           `${opt.optionValue.optionType.name}: ${opt.optionValue.value}`
//         ).join(' / ');
        
//         return variantName === name;
//       });
      
//       return {
//         id: existingVariant?.id || `new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
//         name,
//         price: existingVariant?.price || product.price || 0,
//         salePrice: existingVariant?.salePrice || product.salePrice || null,
//         stock: existingVariant?.stock || 0,
//         optionValues: combination.map((value, index) => ({
//           typeName: validOptionTypes[index].name,
//           valueName: value.name,
//           typeId: validOptionTypes[index].optionTypeId || validOptionTypes[index].id,
//           valueId: value.optionValueId || value.id
//         }))
//       };
//     });
    
//     setVariants(newVariants);
//     setOptionMatrixGenerated(true);
//   };

//   // 변형 상품 초기화
//   const resetVariants = () => {
//     if (window.confirm('정말 모든 옵션을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
//       setVariants([]);
//       setOptionMatrixGenerated(false);
//     }
//   };

//   // 변형 상품 저장 함수 개선
//   const saveVariants = async () => {
//     if (!variants.length) {
//       alert('저장할 옵션이 없습니다.');
//       return;
//     }
    
//     setSaving(true);
//     setError(null);
    
//     try {
//       // 새 변형만 저장 (ID가 숫자가 아닌 것들)
//       const newVariants = variants.filter(variant => 
//         !variant.id || isNaN(Number(variant.id)) || String(variant.id).startsWith('new-')
//       );
      
//       if (newVariants.length === 0) {
//         alert('저장할 새 옵션이 없습니다.');
//         setSaving(false);
//         return;
//       }
      
//       // 변형 저장
//       for (const variant of newVariants) {
//         // 옵션 값 ID 추출 (서버에 있는 실제 ID만)
//         const validOptionValues = variant.optionValues
//           .filter(ov => ov.valueId && !isNaN(Number(ov.valueId)))
//           .map(ov => Number(ov.valueId));
        
//         // 유효한 옵션 값이 없으면 경고 표시
//         if (validOptionValues.length === 0) {
//           setError(`'${variant.name}' 변형에 유효한 옵션 값이 없습니다.`);
//           setSaving(false);
//           return;
//         }
        
//         const variantData = {
//           price: variant.price || product.price,
//           salePrice: variant.salePrice || product.salePrice || null,
//           stock: variant.stock || 0,
//           optionValues: validOptionValues
//         };
        
//         await addProductVariant(productId, variantData);
//       }
      
//       alert('상품 옵션이 성공적으로 저장되었습니다.');
      
//       // 저장 후 변형 정보 다시 로드
//       const response = await getProductVariants(productId);
//       const refreshedVariants = 
//         response.payload?.variants || 
//         response.data?.variants || 
//         response.variants || 
//         [];
      
//       if (refreshedVariants && refreshedVariants.length > 0) {
//         setVariants(refreshedVariants);
//       }
//     } catch (err) {
//       console.error('변형 저장 오류:', err);
//       setError('옵션 저장 중 오류가 발생했습니다: ' + (err.message || '알 수 없는 오류'));
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-full py-20">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         <span className="ml-3 text-gray-600">옵션 정보를 불러오는 중...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden p-6">
//       {error && (
//         <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//           <div className="flex items-center">
//             <AlertCircle size={20} className="mr-2" />
//             <span>{error}</span>
//           </div>
//         </div>
//       )}

//       {!optionMatrixGenerated ? (
//         <div className="mb-6">
//           <div className="flex justify-between items-center mb-2">
//             <label className="block text-sm font-medium text-gray-700">
//               옵션 설정
//             </label>
//             <button
//               type="button"
//               onClick={addOptionType}
//               className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
//             >
//               <Plus size={16} className="mr-1" />
//               옵션 타입 추가
//             </button>
//           </div>
          
//           {optionTypes.map((optionType, index) => (
//             <OptionTypeRow
//               key={optionType.id}
//               optionType={optionType}
//               index={index}
//               availableOptionTypes={availableOptionTypes}
//               optionTypes={optionTypes}
//               setOptionTypes={setOptionTypes}
//               newOptionValue={newOptionValue}
//               setNewOptionValue={setNewOptionValue}
//               selectedOptionType={selectedOptionType}
//               setSelectedOptionType={setSelectedOptionType}
//               addOptionValue={addOptionValue}
//             />
//           ))}
          
//           <div className="mt-4 flex justify-end">
//             <button
//               type="button"
//               onClick={generateOptionCombinations}
//               disabled={saving || optionTypes.every(type => !type.name.trim() || type.values.length === 0)}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//             >
//               {saving ? '처리 중...' : '옵션 조합 생성'}
//             </button>
//           </div>
//         </div>
//       ) : (
//         <VariantsList
//           variants={variants}
//           setVariants={setVariants}
//           resetVariants={resetVariants}
//           saving={saving}
//           saveVariants={saveVariants}
//         />
//       )}

//       <div className="mt-6 flex justify-end">
//         <button
//           onClick={saveVariants}
//           disabled={saving || !optionMatrixGenerated || variants.length === 0}
//           className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
//         >
//           <Save size={18} className="mr-2" />
//           {saving ? '저장 중...' : '옵션 저장'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OptionsTab;