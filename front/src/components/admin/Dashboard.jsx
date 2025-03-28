import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from './DashboardCard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    userStats: { totalUsers: 0, newUsersToday: 0 },
    productStats: { totalProducts: 0, lowStockProducts: 0 },
    orderStats: { totalOrders: 0, pendingOrders: 0 },
    salesStats: { thisMonth: 0, lastMonth: 0, dailySales: [] },
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API 호출하는 부분 (실제 구현 시 추가)
    // axios.get('/api/admin/dashboard')
    //   .then(response => {
    //     setStats(response.data.data);
    //     setLoading(false);
    //   })
    //   .catch(error => {
    //     console.error('대시보드 데이터를 불러오는데 실패했습니다:', error);
    //     setLoading(false);
    //   });

    // 임시 데이터 (API 연결 전까지 사용)
    setTimeout(() => {
      setStats({
        userStats: { totalUsers: 248, newUsersToday: 5 },
        productStats: { totalProducts: 75, lowStockProducts: 8 },
        orderStats: { totalOrders: 156, pendingOrders: 12 },
        salesStats: { 
          thisMonth: 8450000, 
          lastMonth: 7320000,
          dailySales: [
            { date: "2025-03-22", total: 320000 },
            { date: "2025-03-23", total: 410000 },
            { date: "2025-03-24", total: 380000 },
            { date: "2025-03-25", total: 520000 },
            { date: "2025-03-26", total: 480000 },
            { date: "2025-03-27", total: 650000 },
            { date: "2025-03-28", total: 590000 }
          ]
        },
        recentOrders: [
          {
            id: 1,
            orderNumber: "250328-123456",
            status: "processing",
            totalAmount: 68000,
            paymentStatus: "paid",
            createdAt: "2025-03-28T08:34:56Z",
            items: [
              {
                id: 1,
                productName: "프리미엄 티셔츠",
                variantInfo: {
                  options: [
                    { type: "색상", value: "블랙" },
                    { type: "사이즈", value: "L" }
                  ]
                },
                quantity: 2,
                unitPrice: 32500,
                totalPrice: 65000
              }
            ]
          },
          {
            id: 2,
            orderNumber: "250328-123457",
            status: "pending",
            totalAmount: 45000,
            paymentStatus: "paid",
            createdAt: "2025-03-28T09:12:34Z",
            items: [
              {
                id: 2,
                productName: "캐주얼 셔츠",
                variantInfo: {
                  options: [
                    { type: "색상", value: "화이트" },
                    { type: "사이즈", value: "M" }
                  ]
                },
                quantity: 1,
                unitPrice: 45000,
                totalPrice: 45000
              }
            ]
          },
          {
            id: 3,
            orderNumber: "250328-123458",
            status: "completed",
            totalAmount: 124000,
            paymentStatus: "paid",
            createdAt: "2025-03-28T07:45:22Z",
            items: [
              {
                id: 3,
                productName: "슬림 청바지",
                variantInfo: {
                  options: [
                    { type: "색상", value: "인디고" },
                    { type: "사이즈", value: "32" }
                  ]
                },
                quantity: 1,
                unitPrice: 75000,
                totalPrice: 75000
              },
              {
                id: 4,
                productName: "면 티셔츠",
                variantInfo: {
                  options: [
                    { type: "색상", value: "그레이" },
                    { type: "사이즈", value: "M" }
                  ]
                },
                quantity: 1,
                unitPrice: 49000,
                totalPrice: 49000
              }
            ]
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  if (loading) {
    return <div className="p-8">로딩 중...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="전체 사용자" 
          value={stats.userStats.totalUsers} 
          icon={<span className="text-xl">👤</span>} 
          color="bg-blue-100 text-blue-800" 
        />
        <DashboardCard 
          title="총 상품" 
          value={stats.productStats.totalProducts} 
          icon={<span className="text-xl">📦</span>} 
          color="bg-green-100 text-green-800" 
        />
        <DashboardCard 
          title="전체 주문" 
          value={stats.orderStats.totalOrders} 
          icon={<span className="text-xl">🛒</span>} 
          color="bg-purple-100 text-purple-800" 
        />
        <DashboardCard 
          title="이번 달 매출" 
          value={formatCurrency(stats.salesStats.thisMonth)} 
          icon={<span className="text-xl">💰</span>} 
          color="bg-yellow-100 text-yellow-800" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 오늘의 알림 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">오늘의 알림</h2>
          <ul className="space-y-3">
            <li className="flex items-center space-x-2 text-red-600">
              <span className="text-xl">⚠️</span>
              <span>재고 부족 상품: {stats.productStats.lowStockProducts}개</span>
            </li>
            <li className="flex items-center space-x-2 text-yellow-600">
              <span className="text-xl">⏳</span>
              <span>처리 대기 주문: {stats.orderStats.pendingOrders}건</span>
            </li>
            <li className="flex items-center space-x-2 text-green-600">
              <span className="text-xl">✨</span>
              <span>오늘 신규 가입: {stats.userStats.newUsersToday}명</span>
            </li>
            <li className="flex items-center space-x-2 text-blue-600">
              <span className="text-xl">📈</span>
              <span>전월 대비 매출: {((stats.salesStats.thisMonth - stats.salesStats.lastMonth) / stats.salesStats.lastMonth * 100).toFixed(1)}%</span>
            </li>
          </ul>
          <div className="mt-4 flex justify-between">
            <Link to="/admin/products?filter=lowStock" className="text-sm text-blue-500 hover:underline">재고 관리 &rarr;</Link>
            <Link to="/admin/orders?status=pending" className="text-sm text-blue-500 hover:underline">주문 처리 &rarr;</Link>
          </div>
        </div>
        
        {/* 최근 주문 */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">최근 주문</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">주문번호</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">상태</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">결제상태</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">금액</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">주문일시</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                          order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {order.status === 'pending' ? '대기중' : 
                         order.status === 'processing' ? '처리중' : 
                         order.status === 'completed' ? '완료' : 
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Link to="/admin/orders" className="text-sm text-blue-500 hover:underline">모든 주문 보기 &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;