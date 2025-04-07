import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import useMypage from '../../hooks/useMypage';

const OrderTracking = ({ orderId, onBack }) => {
  const {
    getOrderTracking,
    orderTracking,
    loading,
    error,
    resetOrderTrackingError
  } = useMypage();

  // 배송 추적 정보 로드
  useEffect(() => {
    if (orderId) {
      getOrderTracking(orderId);
    }
  }, [orderId, getOrderTracking]);

  if (loading.orderTracking) {
    return <div className="text-center py-4">배송 정보를 불러오는 중...</div>;
  }

  if (error.orderTracking) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="mb-4">
          <button
            onClick={onBack}
            className="text-indigo-600 hover:text-indigo-900"
          >
            &larr; 주문 상세로 돌아가기
          </button>
        </div>
        <div className="p-3 bg-red-100 text-red-800 rounded" onClick={resetOrderTrackingError}>
          {error.orderTracking}
        </div>
      </div>
    );
  }

  if (!orderTracking) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="mb-4">
          <button
            onClick={onBack}
            className="text-indigo-600 hover:text-indigo-900"
          >
            &larr; 주문 상세로 돌아가기
          </button>
        </div>
        <div className="text-center py-4">배송 정보를 찾을 수 없습니다.</div>
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
            &larr; 주문 상세로 돌아가기
          </button>
          {orderTracking.externalTrackingUrl && (
            <a
              href={orderTracking.externalTrackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              배송사 홈페이지에서 조회
            </a>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">배송 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">주문번호</p>
              <p>{orderTracking.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">현재 상태</p>
              <p className="font-semibold text-indigo-600">{orderTracking.currentStatus === 'shipped' ? '배송 중' : '배송 완료'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">배송사</p>
              <p>{orderTracking.shippingDetails.carrier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">운송장 번호</p>
              <p>{orderTracking.shippingDetails.trackingNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">발송 일시</p>
              <p>
                {orderTracking.shippingDetails.shippedAt
                  ? new Date(orderTracking.shippingDetails.shippedAt).toLocaleString()
                  : '미발송'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">예상 배송 완료일</p>
              <p>
                {orderTracking.shippingDetails.estimatedDelivery
                  ? new Date(orderTracking.shippingDetails.estimatedDelivery).toLocaleDateString()
                  : '정보 없음'}
              </p>
            </div>
          </div>
        </div>

        {orderTracking.externalTrackingDetails && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">배송 현황</h2>
            <div className="border rounded-lg p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-500">현재 상태</p>
                <p className="font-semibold text-lg">{orderTracking.externalTrackingDetails.status}</p>
              </div>

              <div className="relative">
                {orderTracking.externalTrackingDetails.trackingDetails.map((detail, index, arr) => (
                  <div key={index} className="mb-8 relative">
                    {/* 타임라인 선 */}
                    {index < arr.length - 1 && (
                      <div className="absolute left-3 top-6 bottom-0 w-0.5 h-full bg-gray-200"></div>
                    )}
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center z-10">
                        <span className="text-white text-xs">{arr.length - index}</span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">{detail.status}</div>
                        <div className="text-sm text-gray-500">{detail.location}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(detail.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {orderTracking.statusHistory && orderTracking.statusHistory.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">주문 상태 변경 내역</h2>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      메시지
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      일시
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderTracking.statusHistory.map((history, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs">
                          {history.displayStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {history.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(history.timestamp).toLocaleString()}
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

export default OrderTracking;