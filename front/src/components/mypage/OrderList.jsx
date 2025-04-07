import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useMypage from '../../hooks/useMypage';

const OrderList = ({ onOrderSelect, onTrackingView }) => {
  const {
    getUserOrders,
    orders,
    ordersPagination,
    loading,
    error,
    resetOrdersError
  } = useMypage();

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  // 주문 목록 불러오기
  useEffect(() => {
    getUserOrders(currentPage, 10, statusFilter);
  }, [getUserOrders, currentPage, statusFilter]);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 상태 필터 변경 핸들러
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // 필터 변경 시 1페이지로 리셋
  };

  // 주문 상태에 따른 뱃지 색상 및 텍스트
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">주문 접수</span>;
      case 'processing':
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">처리 중</span>;
      case 'shipped':
        return <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs">배송 중</span>;
      case 'delivered':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">배송 완료</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">완료</span>;
      case 'cancelled':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">취소됨</span>;
      case 'refunded':
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">환불됨</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">상태 미정</span>;
    }
  };

  if (loading.orders && orders.length === 0) {
    return <div className="text-center py-4">주문 내역을 불러오는 중...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">주문 내역</h2>
        <p className="text-sm text-gray-500">최근 주문 내역을 확인하세요.</p>
      </div>

      {error.orders && (
        <div className="m-4 p-3 bg-red-100 text-red-800 rounded" onClick={resetOrdersError}>
          {error.orders}
        </div>
      )}

      <div className="p-4">
        <div className="mb-4 flex justify-end">
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">모든 상태</option>
            <option value="pending">주문 접수</option>
            <option value="processing">처리 중</option>
            <option value="shipped">배송 중</option>
            <option value="delivered">배송 완료</option>
            <option value="completed">완료</option>
            <option value="cancelled">취소됨</option>
            <option value="refunded">환불됨</option>
          </select>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">주문 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    주문번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    주문일자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상품정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    결제금액
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                        onClick={() => onOrderSelect(order.id)}
                      >
                        {order.orderNumber}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="truncate max-w-xs">
                        {order.items.length > 0 
                          ? `${order.items[0].productName} ${order.items.length > 1 ? `외 ${order.items.length - 1}개` : ''}`
                          : '상품 정보 없음'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.totalAmount.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onOrderSelect(order.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          상세보기
                        </button>
                        {['shipped', 'delivered'].includes(order.status) && (
                          <button
                            onClick={() => onTrackingView(order.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            배송조회
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 페이지네이션 */}
        {ordersPagination && ordersPagination.totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                이전
              </button>
              
              {Array.from({ length: ordersPagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    page === currentPage
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  } text-sm font-medium`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === ordersPagination.totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                다음
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;