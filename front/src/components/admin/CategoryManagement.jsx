// components/admin/CategoryManagement.jsx
import React, { useState, useEffect } from 'react';
import useAdmin from '../../hooks/useAdmin';
import { Plus, Edit, Trash2 } from 'lucide-react';

const CategoryManagement = () => {
 const { categories, getCategories, addCategory, editCategory, removeCategory } = useAdmin();
 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [editingCategory, setEditingCategory] = useState(null);
 const [formData, setFormData] = useState({
   name: '',
   slug: '',
   description: '',
   parentId: '',
   isActive: true,
   displayOrder: 0
 });
 
 useEffect(() => {
   getCategories();
 }, [getCategories]);
 
 const handleAddClick = () => {
   setFormData({
     name: '',
     slug: '',
     description: '',
     parentId: '',
     isActive: true,
     displayOrder: 0
   });
   setIsAddModalOpen(true);
 };
 
 const handleEditClick = (category) => {
   setFormData({
     name: category.name,
     slug: category.slug,
     description: category.description || '',
     parentId: category.parentId || '',
     isActive: category.isActive,
     displayOrder: category.displayOrder
   });
   setEditingCategory(category);
   setIsAddModalOpen(true);
 };
 
 const handleDeleteClick = async (categoryId) => {
   if (window.confirm('이 카테고리를 삭제하시겠습니까? 관련된 상품들의 카테고리 정보가 변경될 수 있습니다.')) {
     await removeCategory(categoryId);
     getCategories();
   }
 };
 
 const handleInputChange = (e) => {
   const { name, value, type, checked } = e.target;
   setFormData({
     ...formData,
     [name]: type === 'checkbox' ? checked : value
   });
 };
 
 const generateSlug = () => {
   if (formData.name) {
     const slug = formData.name
       .toLowerCase()
       .replace(/[^a-z0-9가-힣]/g, '-')
       .replace(/-+/g, '-')
       .replace(/^-|-$/g, '');
     
     setFormData({
       ...formData,
       slug
     });
   }
 };
 
 const handleSubmit = async (e) => {
   e.preventDefault();
   
   try {
     if (editingCategory) {
       await editCategory(editingCategory.id, formData);
     } else {
       await addCategory(formData);
     }
     
     setIsAddModalOpen(false);
     setEditingCategory(null);
     getCategories();
   } catch (error) {
     console.error('카테고리 저장 오류:', error);
     alert('카테고리 저장 중 오류가 발생했습니다.');
   }
 };
 
 const closeModal = () => {
   setIsAddModalOpen(false);
   setEditingCategory(null);
 };
 
 const { list, loading, error } = categories;
 
 return (
   <div>
     <div className="flex justify-between items-center mb-6">
       <h1 className="text-2xl font-bold">카테고리 관리</h1>
       <button
         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
         onClick={handleAddClick}
       >
         <Plus size={16} className="mr-2" />
         카테고리 추가
       </button>
     </div>
     
     {error && (
       <div className="bg-red-100 p-4 rounded text-red-800 mb-6">
         <p>오류가 발생했습니다: {error}</p>
       </div>
     )}
     
     <div className="bg-white rounded-lg shadow overflow-hidden">
       <table className="min-w-full divide-y divide-gray-200">
         <thead className="bg-gray-50">
           <tr>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리명</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">슬러그</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상위 카테고리</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">순서</th>
             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
           </tr>
         </thead>
         <tbody className="bg-white divide-y divide-gray-200">
           {loading ? (
             <tr>
               <td colSpan="6" className="px-6 py-4 text-center">
                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
               </td>
             </tr>
           ) : list && list.length > 0 ? (
             list.map((category) => (
               <tr key={category.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4">
                   <div className="text-sm font-medium text-gray-900">{category.name}</div>
                   {category.description && (
                     <div className="text-xs text-gray-500">{category.description}</div>
                   )}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-gray-900">{category.slug}</div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-gray-900">
                     {category.parent ? category.parent.name : '-'}
                   </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                     category.isActive 
                       ? 'bg-green-100 text-green-800' 
                       : 'bg-gray-100 text-gray-800'
                   }`}>
                     {category.isActive ? '활성화' : '비활성화'}
                   </span>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-gray-900">{category.displayOrder}</div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <button
                     className="text-blue-600 hover:text-blue-900 mr-3"
                     onClick={() => handleEditClick(category)}
                   >
                     <Edit size={18} />
                   </button>
                   <button
                     className="text-red-600 hover:text-red-900"
                     onClick={() => handleDeleteClick(category.id)}
                   >
                     <Trash2 size={18} />
                   </button>
                 </td>
               </tr>
             ))
           ) : (
             <tr>
               <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                 카테고리가 없습니다
               </td>
             </tr>
           )}
         </tbody>
       </table>
     </div>
     
     {isAddModalOpen && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white rounded-lg p-6 w-full max-w-lg">
           <h2 className="text-xl font-bold mb-4">
             {editingCategory ? '카테고리 수정' : '카테고리 추가'}
           </h2>
           
           <form onSubmit={handleSubmit}>
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 카테고리명 <span className="text-red-500">*</span>
               </label>
               <input
                 type="text"
                 name="name"
                 value={formData.name}
                 onChange={handleInputChange}
                 onBlur={generateSlug}
                 className="border rounded-lg px-3 py-2 w-full"
                 required
               />
             </div>
             
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 슬러그 <span className="text-red-500">*</span>
               </label>
               <div className="flex">
                 <input
                   type="text"
                   name="slug"
                   value={formData.slug}
                   onChange={handleInputChange}
                   className="border rounded-lg px-3 py-2 w-full"
                   required
                 />
                 <button
                   type="button"
                   onClick={generateSlug}
                   className="ml-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded"
                 >
                   자동생성
                 </button>
               </div>
             </div>
             
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 설명
               </label>
               <textarea
                 name="description"
                 value={formData.description}
                 onChange={handleInputChange}
                 className="border rounded-lg px-3 py-2 w-full"
                 rows="3"
               ></textarea>
             </div>
             
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 상위 카테고리
               </label>
               <select
                 name="parentId"
                 value={formData.parentId}
                 onChange={handleInputChange}
                 className="border rounded-lg px-3 py-2 w-full"
               >
                 <option value="">선택 안함 (최상위 카테고리)</option>
                 {list && list
                   .filter(cat => !editingCategory || cat.id !== editingCategory.id)
                   .map(cat => (
                     <option key={cat.id} value={cat.id}>
                       {cat.name}
                     </option>
                   ))
                 }
               </select>
             </div>
             
             <div className="flex mb-4">
               <div className="mr-6">
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   표시 순서
                 </label>
                 <input
                   type="number"
                   name="displayOrder"
                   value={formData.displayOrder}
                   onChange={handleInputChange}
                   className="border rounded-lg px-3 py-2 w-24"
                   min="0"
                 />
               </div>
               
               <div className="flex items-center">
                 <input
                   type="checkbox"
                   id="isActive"
                   name="isActive"
                   checked={formData.isActive}
                   onChange={handleInputChange}
                   className="mr-2 h-4 w-4"
                 />
                 <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                   활성화
                 </label>
               </div>
             </div>
             
             <div className="flex justify-end mt-6">
               <button
                 type="button"
                 onClick={closeModal}
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

export default CategoryManagement;