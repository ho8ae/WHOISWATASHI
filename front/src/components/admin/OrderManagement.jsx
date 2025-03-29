// components/admin/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import useAdmin from '../../hooks/useAdmin';
import { Search, Eye } from 'lucide-react';

const OrderManagement = () => {
 const { orders, getOrders, updateOrderStatus } = useAdmin();
 const [searchTerm, setSearchTerm] = useState('');
 const [currentPage, setCurrentPage] = useState(1);
 const [selectedStatus, setSelectedStatus] = useState('');
 
 useEffect(() => {
   loadOrders();
 }, [currentPage, selectedStatus]);
 
 const loadOrders = () => {
   const params = { 
     page: currentPage, 
     limit: 10,
     search: searchTerm
   };
   
   if (selectedStatus) {
     params.status = selectedStatus;
   }
   
   getOrders(params);
 };
 
 const handleSearch = (e) => {
   e.preventDefault();
   loadOrders();
 };
 
 const handleStatusChange = async (orderId, status) => {
   await updateOrderStatus(orderId, { status });
   loadOrders();
 };
 
 const { list, pagination, loading, error } = orders;
 
 return (
   <div>
     <div className="flex justify-between items-center mb-6">
       <h1 className="text-2xl font-bold">주문 관리</h1>
     </div>
     
     <div className="bg-white rounded-lg shadow mb-6">
       <div className="p-4 border-b">
         <div className="flex flex-wrap items-center gap-4">
           <form onSubmit={handleSearch} className="flex flex-1">
             <div className="relative flex-1">
               <input
                 type="text"
                 placeholder="주문번호, 이메일 검색..."
                 className="border rounded-lg pl-10 pr-4 py-2 w-full"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
               <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
             </div>
             <button 
               type="submit"
               className="ml-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
             >
               검색
             </button>
           </form>
           
           <div>
             <select
               value={selectedStatus}
               onChange={(e) => setSelectedStatus(e.target.value)}
               className="border rounded-lg px-4 py-2"
             >
               <option value="">모든 상태</option>
               <option value="pending">대기중</option>
               <option value="processing">처리중</option>
               <option value="completed">완료</option>
               <option value="cancelled">취소됨</option>
               <option value="refunded">환불됨</option>
             </select>
           </div>
         </div>
       </div>
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
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문번호</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고객</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">금액</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
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
             list.map((order) => (
               <tr key={order.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-gray-900">{order.email}</div>
                   <div className="text-xs text-gray-500">{order.phone}</div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm font-medium text-gray-900">{order.totalAmount.toLocaleString()}원</div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <select
                     value={order.status}
                     onChange={(e) => handleStatusChange(order.id, e.target.value)}
                     className="border rounded px-2 py-1 text-sm"
                   >
                     <option value="pending">대기중</option>
                     <option value="processing">처리중</option>
                     <option value="completed">완료</option>
                     <option value="cancelled">취소됨</option>
                     <option value="refunded">환불됨</option>
                   </select>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <button
                     className="text-blue-600 hover:text-blue-900"
                     onClick={() => {/* 주문 상세 보기 */}}
                   >
                     <Eye size={18} />
                   </button>
                 </td>
               </tr>
             ))
           ) : (
             <tr>
               <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                 주문이 없습니다
               </td>
             </tr>
           )}
         </tbody>
       </table>
       
       {pagination && pagination.totalPages > 1 && (
         <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
           <div className="flex-1 flex justify-between sm:hidden">
             <button
               onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
               disabled={currentPage === 1}
               className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
             >
               이전
             </button>
             <button
               onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
               disabled={currentPage === pagination.totalPages}
               className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
             >
               다음
             </button>
           </div>
           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
             <div>
               <p className="text-sm text-gray-700">
                 전체 <span className="font-medium">{pagination.total}</span> 개 중{' '}
                 <span className="font-medium">{(currentPage - 1) * pagination.limit + 1}</span>-
                 <span className="font-medium">
                   {Math.min(currentPage * pagination.limit, pagination.total)}
                 </span> 보기
               </p>
             </div>
             <div>
               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                 <button
                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                   disabled={currentPage === 1}
                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                 >
                   이전
                 </button>
                 {[...Array(pagination.totalPages).keys()].map((page) => (
                   <button
                     key={page + 1}
                     onClick={() => setCurrentPage(page + 1)}
                     className={`relative inline-flex items-center px-4 py-2 border ${
                       currentPage === page + 1
                         ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                         : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                     } text-sm font-medium`}
                   >
                     {page + 1}
                   </button>
                 ))}
                 <button
                   onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                   disabled={currentPage === pagination.totalPages}
                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                 >
                   다음
                 </button>
               </nav>
             </div>
           </div>
         </div>
       )}
     </div>
   </div>
 );
};

export default OrderManagement;