import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import useMypage from '../../hooks/useMypage';

const OrderDetail = ({ orderId, onBack, onTrackingView }) => {
  const {
    getOrderDetail,
    selectedOrder,
    loading,
    error,
    resetOrderDetailError,
    cancelUserOrder
  } = useMypage();

  // 주문 상세 정보 로드
  useEffect(() => {
    if (orderId) {
      getOrderDetail(orderId);
    }
  }, [orderId, getOrderDetail]);

  // 주문 취소 핸들러
  const handleCancelOrder = async () => {
    if (window.confirm('정말로 주문을 취소하시겠습니까?')) {
      try {
        await cancelUserOrder(orderId);
        alert('주문이 취소되었습니다.');
      } catch (err) {
        console.error('주문 취소 오류:', err);
      }
    }
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

  if (loading.orderDetail) {
    return <div className="text-center py-4">주문 정보를 불러오는 중...</div>;
  }

  if (error.orderDetail) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="mb-4">
          <button
            onClick={onBack}
            className="text-indigo-600 hover:text-indigo-900"
          >
            &larr; 주문 목록으로 돌아가기
          </button>
        </div>
        <div className="p-3 bg-red-100 text-red-800 rounded" onClick={resetOrderDetailError}>
          {error.orderDetail}
        </div>
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="mb-4">
          <button
            onClick={onBack}
            className="text-indigo-600 hover:text-indigo-900"
          >
            &larr; 주문 목록으로 돌아가기
          </button>
        </div>
        <div className="text-center py-4">주문 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg shadow-sm"
    >
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="text-indigo-600 hover:text-indigo-900"
          >
            &larr; 주문 목록으로 돌아가기
          </button>
          <div className="flex gap-2">
            {['pending', 'processing'].includes(selectedOrder.status) && (
              <button
                onClick={handleCancelOrder}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                주문 취소
              </button>
            )}
            {['shipped', 'delivered'].includes(selectedOrder.status) && (
              <button
                onClick={() => onTrackingView(orderId)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                배송 조회
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">주문 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">주문번호</p>
              <p>{selectedOrder.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">주문일자</p>
              <p>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">주문 상태</p>
              <p>{getStatusBadge(selectedOrder.status)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">결제 상태</p>
              <p>
                {selectedOrder.paymentStatus === 'paid' ? (
                  <span className="text-green-600">결제 완료</span>
                ) : selectedOrder.paymentStatus === 'pending' ? (
                  <span className="text-yellow-600">결제 대기중</span>
                ) : (
                  <span className="text-red-600">결제 실패</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">주문 상품</h2>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상품
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    옵션
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가격
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수량
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    합계
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedOrder.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.variantInfo?.options?.map((option, index) => (
                        <div key={index}>
                          {option.type}: {option.value}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.unitPrice.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}개
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.totalPrice.toLocaleString()}원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">결제 정보</h2>
          <div className="bg-gray-50 p-4 rounded">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">상품 금액</span>
              <span>{(selectedOrder.totalAmount - selectedOrder.shippingFee).toLocaleString()}원</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">배송비</span>
              <span>{selectedOrder.shippingFee.toLocaleString()}원</span>
            </div>
            {selectedOrder.discountAmount > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">할인 금액</span>
                <span className="text-red-600">-{selectedOrder.discountAmount.toLocaleString()}원</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-t border-gray-300 mt-2 pt-2 font-bold">
              <span>총 결제 금액</span>
              <span>{selectedOrder.totalAmount.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">배송 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">수령인</p>
              <p>{selectedOrder.recipientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">연락처</p>
              <p>{selectedOrder.recipientPhone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">주소</p>
              <p>[{selectedOrder.postalCode}] {selectedOrder.address1} {selectedOrder.address2}</p>
            </div>
            {selectedOrder.notes && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">배송 메모</p>
                <p>{selectedOrder.notes}</p>
              </div>
            )}
          </div>
        </div>

        {selectedOrder.trackingNumber && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">배송 추적</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">운송장 번호</p>
                <p>{selectedOrder.trackingNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">발송 일시</p>
                <p>
                  {selectedOrder.shippedAt
                    ? new Date(selectedOrder.shippedAt).toLocaleString()
                    : '미발송'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">배송 완료 일시</p>
                <p>
                  {selectedOrder.deliveredAt
                    ? new Date(selectedOrder.deliveredAt).toLocaleString()
                    : '배송 중'}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <button
                onClick={() => onTrackingView(orderId)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                배송 상세 조회
              </button>
            </div>
          </div>
        )}

        {selectedOrder.payments && selectedOrder.payments.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">결제 내역</h2>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      결제 방식
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      결제 금액
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      결제 상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      결제 일시
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedOrder.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.provider.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.amount.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {payment.status === 'completed' ? (
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">완료</span>
                        ) : payment.status === 'pending' ? (
                          <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">대기중</span>
                        ) : payment.status === 'failed' ? (
                          <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">실패</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">환불됨</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderDetail;