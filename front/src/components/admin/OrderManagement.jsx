import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  
  // 필터 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    // 임시 데이터 (API 연결 전까지 사용)
    setTimeout(() => {
      const orderStatuses = ['pending', 'processing', 'completed', 'cancelled'];
      const mockOrders = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        orderNumber: `25032${i + 1}-12345${i + 1}`,
        userId: 100 + i,
        email: `user${i + 1}@example.com`,
        phone: `010${Math.floor(10000000 + Math.random() * 90000000)}`,
        status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
        totalAmount: Math.floor(30000 + Math.random() * 150000),
        shippingFee: 3000,
        discountAmount: Math.floor(Math.random() * 10000),
        paymentMethod: Math.random() > 0.5 ? 'card' : 'transfer',
        paymentStatus: Math.random() > 0.8 ? 'pending' : 'paid',
        recipientName: `수령인 ${i + 1}`,
        recipientPhone: `010${Math.floor(10000000 + Math.random() * 90000000)}`,
        postalCode: Math.floor(10000 + Math.random() * 90000),
        address1: '서울시 강남구 테헤란로 123',
        address2: `${Math.floor(Math.random() * 999)}호`,
        notes: Math.random() > 0.7 ? '부재시 경비실에 맡겨주세요' : '',
        trackingNumber: Math.random() > 0.5 ? `${Math.floor(Math.random() * 9000000000) + 1000000000}` : null,
        createdAt: new Date(2025, 2, Math.floor(1 + Math.random() * 28)).toISOString(),
        updatedAt: new Date(2025, 2, Math.floor(1 + Math.random() * 28)).toISOString(),
        items: [
          {
            id: i * 2 + 1,
            productId: 100 + i,
            productVariantId: 200 + i,
            productName: `상품 ${i + 1}`,
            variantInfo: {
              options: [
                { type: "색상", value: Math.random() > 0.5 ? "블랙" : "화이트" },
                { type: "사이즈", value: ["S", "M", "L", "XL"][Math.floor(Math.random() * 4)] }
              ],
              sku: `SKU-${i + 1}`
            },
            quantity: Math.floor(1 + Math.random() * 3),
            unitPrice: Math.floor(15000 + Math.random() * 50000),
            get totalPrice() { return this.quantity * this.unitPrice; }
          }
        ]
      }));

      setOrders(mockOrders);
      setPagination({
        total: 45,
        page: 1,
        limit: 10,
        totalPages: 5
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // 실제로는 API 호출하여 검색
    console.log('검색어:', searchQuery, '상태:', statusFilter, '기간:', fromDate, toDate);
  };

  const handleChangePage = (newPage) => {
    // 실제로는 API 호출하여 페이지 변경
    console.log('페이지 변경:', newPage);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    // 실제로는 API 호출하여 상태 변경
    console.log('상태 변경:', orderId, newStatus);
    
    // 임시로 상태 업데이트
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  if (loading) {
    return <div className="p-8">로딩 중...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">주문 관리</h1>
      
      {/* 검색 및 필터 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
            <div className="flex-1">
              <input
                type="text"
                placeholder="주문번호, 이메일, 전화번호 검색"
                className="w-full px-4 py-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full md:w-auto px-4 py-2 border rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">모든 상태</option>
                <option value="pending">대기중</option>
                <option value="processing">처리중</option>
                <option value="completed">완료</option>
                <option value="cancelled">취소</option>
                <option value="refunded">환불</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
            <div className="flex-1 flex items-center space-x-2">
              <span>기간:</span>
              <input
                type="date"
                className="flex-1 px-4 py-2 border rounded-md"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <span>~</span>
              <input
                type="date"
                className="flex-1 px-4 py-2 border rounded-md"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              검색
            </button>
          </div>
        </form>
      </div>
      
      {/* 주문 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">주문번호</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">주문자</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">상태</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">결제상태</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">금액</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">주문일시</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <div>{order.email}</div>
                    <div className="text-sm text-gray-500">{order.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                        order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        order.status === 'refunded' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {order.status === 'pending' ? '대기중' : 
                       order.status === 'processing' ? '처리중' : 
                       order.status === 'completed' ? '완료' : 
                       order.status === 'cancelled' ? '취소' :
                       order.status === 'refunded' ? '환불' :
                       order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {order.paymentStatus === 'paid' ? '결제완료' : '미결제'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-4 py-3">{new Date(order.createdAt).toLocaleString('ko-KR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col space-y-1">
                      <Link 
                        to={`/admin/orders/${order.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        상세
                      </Link>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'processing')}
                          className="text-blue-500 hover:underline"
                        >
                          처리중으로 변경
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'completed')}
                          className="text-green-500 hover:underline"
                        >
                          완료로 변경
                        </button>
                      )}
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                          className="text-red-500 hover:underline"
                        >
                          취소
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 페이지네이션 */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handleChangePage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                pagination.page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              이전
            </button>
            <button
              onClick={() => handleChangePage(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                pagination.page === pagination.totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              다음
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                전체 <span className="font-medium">{pagination.total}</span> 건 중{' '}
                <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>-
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>
                건 표시
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handleChangePage(1)}
                  disabled={pagination.page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    pagination.page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">처음</span>
                  &laquo;
                </button>
                <button
                  onClick={() => handleChangePage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium ${
                    pagination.page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">이전</span>
                  &lt;
                </button>
                
                {/* 페이지 번호 */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    page =>
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= pagination.page - 1 && page <= pagination.page + 1)
                  )
                  .map((page, i, array) => (
                    <React.Fragment key={page}>
                      {i > 0 && array[i - 1] !== page - 1 && (
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700">
                          ...
                        </span>
                      )}
                      <button
                        onClick={() => handleChangePage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                          page === pagination.page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
                
                <button
                  onClick={() => handleChangePage(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium ${
                    pagination.page === pagination.totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">다음</span>
                  &gt;
                </button>
                <button
                  onClick={() => handleChangePage(pagination.totalPages)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                    pagination.page === pagination.totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">마지막</span>
                  &raquo;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;