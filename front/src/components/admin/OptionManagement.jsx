import React, { useState, useEffect } from 'react';
import useAdmin from '../../hooks/useAdmin';
import { Plus, Edit, Trash2, PlusCircle } from 'lucide-react';

const OptionManagement = () => {
 const { 
   optionTypes, 
   getOptionTypes, 
   addOptionType, 
   editOptionType, 
   removeOptionType,
   addOptionValue,
   editOptionValue,
   removeOptionValue
 } = useAdmin();
 
 const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
 const [isValueModalOpen, setIsValueModalOpen] = useState(false);
 const [editingType, setEditingType] = useState(null);
 const [editingValue, setEditingValue] = useState(null);
 const [selectedTypeId, setSelectedTypeId] = useState(null);
 
 const [typeFormData, setTypeFormData] = useState({
   name: '',
   displayOrder: 0
 });
 
 const [valueFormData, setValueFormData] = useState({
   value: '',
   displayOrder: 0
 });
 
 useEffect(() => {
   getOptionTypes();
 }, [getOptionTypes]);
 
 // 옵션 타입 추가 모달 열기
 const handleAddTypeClick = () => {
   setTypeFormData({
     name: '',
     displayOrder: 0
   });
   setEditingType(null);
   setIsTypeModalOpen(true);
 };
 
 // 옵션 타입 수정 모달 열기
 const handleEditTypeClick = (type) => {
   setTypeFormData({
     name: type.name,
     displayOrder: type.displayOrder
   });
   setEditingType(type);
   setIsTypeModalOpen(true);
 };
 
 // 옵션 타입 삭제
 const handleDeleteTypeClick = async (typeId) => {
   if (window.confirm('이 옵션 타입을 삭제하시겠습니까? 관련된 모든 옵션 값도 삭제됩니다.')) {
     await removeOptionType(typeId);
     getOptionTypes();
   }
 };
 
 // 옵션 값 추가 모달 열기
 const handleAddValueClick = (typeId) => {
   setValueFormData({
     value: '',
     displayOrder: 0
   });
   setEditingValue(null);
   setSelectedTypeId(typeId);
   setIsValueModalOpen(true);
 };
 
 // 옵션 값 수정 모달 열기
 const handleEditValueClick = (typeId, value) => {
   setValueFormData({
     value: value.value,
     displayOrder: value.displayOrder
   });
   setEditingValue(value);
   setSelectedTypeId(typeId);
   setIsValueModalOpen(true);
 };
 
 // 옵션 값 삭제
 const handleDeleteValueClick = async (valueId) => {
   if (window.confirm('이 옵션 값을 삭제하시겠습니까?')) {
     await removeOptionValue(valueId);
     getOptionTypes();
   }
 };
 
 // 옵션 타입 폼 제출
 const handleTypeSubmit = async (e) => {
   e.preventDefault();
   
   try {
     if (editingType) {
       await editOptionType(editingType.id, typeFormData);
     } else {
       await addOptionType(typeFormData);
     }
     
     setIsTypeModalOpen(false);
     getOptionTypes();
   } catch (error) {
     console.error('옵션 타입 저장 오류:', error);
     alert('옵션 타입 저장 중 오류가 발생했습니다.');
   }
 };
 
 // 옵션 값 폼 제출
 const handleValueSubmit = async (e) => {
   e.preventDefault();
   
   try {
     if (editingValue) {
       await editOptionValue(editingValue.id, valueFormData);
     } else {
       await addOptionValue(selectedTypeId, valueFormData);
     }
     
     setIsValueModalOpen(false);
     getOptionTypes();
   } catch (error) {
     console.error('옵션 값 저장 오류:', error);
     alert('옵션 값 저장 중 오류가 발생했습니다.');
   }
 };
 
 const { list, loading, error } = optionTypes;
 
 return (
   <div>
     <div className="flex justify-between items-center mb-6">
       <h1 className="text-2xl font-bold">옵션 관리</h1>
       <button
         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
         onClick={handleAddTypeClick}
       >
         <Plus size={16} className="mr-2" />
         옵션 타입 추가
       </button>
     </div>
     
     {error && (
       <div className="bg-red-100 p-4 rounded text-red-800 mb-6">
         <p>오류가 발생했습니다: {error}</p>
       </div>
     )}
     
     {loading ? (
       <div className="flex justify-center py-10">
         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
       </div>
     ) : (
       <div className="space-y-6">
         {list && list.length > 0 ? (
           list.map(optionType => (
             <div key={optionType.id} className="bg-white rounded-lg shadow">
               <div className="px-6 py-4 border-b flex justify-between items-center">
                 <div>
                   <h2 className="text-lg font-semibold">{optionType.name}</h2>
                   <p className="text-sm text-gray-500">표시 순서: {optionType.displayOrder}</p>
                 </div>
                 <div className="flex items-center">
                   <button
                     className="text-blue-600 hover:text-blue-900 mr-3"
                     onClick={() => handleEditTypeClick(optionType)}
                   >
                     <Edit size={18} />
                   </button>
                   <button
                     className="text-red-600 hover:text-red-900"
                     onClick={() => handleDeleteTypeClick(optionType.id)}
                   >
                     <Trash2 size={18} />
                   </button>
                 </div>
               </div>
               
               <div className="p-6">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="font-medium">옵션 값 목록</h3>
                   <button
                     className="text-blue-600 hover:text-blue-900 flex items-center text-sm"
                     onClick={() => handleAddValueClick(optionType.id)}
                   >
                     <PlusCircle size={16} className="mr-1" />
                     옵션 값 추가
                   </button>
                 </div>
                 
                 {optionType.values && optionType.values.length > 0 ? (
                   <div className="overflow-hidden border border-gray-200 rounded-lg">
                     <table className="min-w-full divide-y divide-gray-200">
                       <thead className="bg-gray-50">
                         <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                             옵션 값
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                             표시 순서
                           </th>
                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                             관리
                           </th>
                         </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-gray-200">
                         {optionType.values.map(value => (
                           <tr key={value.id} className="hover:bg-gray-50">
                             <td className="px-6 py-4 whitespace-nowrap">
                               <div className="text-sm font-medium text-gray-900">{value.value}</div>
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                               <div className="text-sm text-gray-900">{value.displayOrder}</div>
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                               <button
                                 className="text-blue-600 hover:text-blue-900 mr-3"
                                 onClick={() => handleEditValueClick(optionType.id, value)}
                               >
                                 <Edit size={18} />
                               </button>
                               <button
                                 className="text-red-600 hover:text-red-900"
                                 onClick={() => handleDeleteValueClick(value.id)}
                               >
                                 <Trash2 size={18} />
                               </button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 ) : (
                   <p className="text-gray-500 text-center py-4">등록된 옵션 값이 없습니다</p>
                 )}
               </div>
             </div>
           ))
         ) : (
           <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
             등록된 옵션 타입이 없습니다
           </div>
         )}
       </div>
     )}
     
     {/* 옵션 타입 추가/수정 모달 */}
     {isTypeModalOpen && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white rounded-lg p-6 w-full max-w-md">
           <h2 className="text-xl font-bold mb-4">
             {editingType ? '옵션 타입 수정' : '옵션 타입 추가'}
           </h2>
           
           <form onSubmit={handleTypeSubmit}>
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 이름 <span className="text-red-500">*</span>
               </label>
               <input
                 type="text"
                 name="name"
                 value={typeFormData.name}
                 onChange={(e) => setTypeFormData({...typeFormData, name: e.target.value})}
                 className="border rounded-lg px-3 py-2 w-full"
                 required
                 placeholder="예: 색상, 사이즈"
               />
             </div>
             
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 표시 순서
               </label>
               <input
                 type="number"
                 name="displayOrder"
                 value={typeFormData.displayOrder}
                 onChange={(e) => setTypeFormData({...typeFormData, displayOrder: parseInt(e.target.value)})}
                 className="border rounded-lg px-3 py-2 w-full"
                 min="0"
               />
             </div>
             
             <div className="flex justify-end mt-6">
               <button
                 type="button"
                 onClick={() => setIsTypeModalOpen(false)}
                 className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded mr-2"
               >
                 취소
               </button>
               <button
                 type="submit"
                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
               >
                 저장
               </button>
             </div>
           </form>
         </div>
       </div>
     )}
     
     {/* 옵션 값 추가/수정 모달 */}
     {isValueModalOpen && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white rounded-lg p-6 w-full max-w-md">
           <h2 className="text-xl font-bold mb-4">
             {editingValue ? '옵션 값 수정' : '옵션 값 추가'}
           </h2>
           
           <form onSubmit={handleValueSubmit}>
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 값 <span className="text-red-500">*</span>
               </label>
               <input
                 type="text"
                 name="value"
                 value={valueFormData.value}
                 onChange={(e) => setValueFormData({...valueFormData, value: e.target.value})}
                 className="border rounded-lg px-3 py-2 w-full"
                 required
                 placeholder="예: 빨강, L, 대형"
               />
             </div>
             
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 표시 순서
               </label>
               <input
                 type="number"
                 name="displayOrder"
                 value={valueFormData.displayOrder}
                 onChange={(e) => setValueFormData({...valueFormData, displayOrder: parseInt(e.target.value)})}
                 className="border rounded-lg px-3 py-2 w-full"
                 min="0"
               />
             </div>
             
             <div className="flex justify-end mt-6">
               <button
                 type="button"
                 onClick={() => setIsValueModalOpen(false)}
                 className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded mr-2"
               >
                 취소
               </button>
               <button
                 type="submit"
                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
               >
                 저장
               </button>
             </div>
           </form>
         </div>
       </div>
     )}
   </div>
 );
};

export default OptionManagement;