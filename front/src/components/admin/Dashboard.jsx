// components/admin/Dashboard.jsx
import React, { useEffect } from 'react';
import useAdmin from '../../hooks/useAdmin';
import DashboardCard from './DashboardCard';
import { Users, Package, ShoppingBag, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { dashboard, getDashboard } = useAdmin();
  
  useEffect(() => {
    getDashboard();
  }, [getDashboard]);
  
  const { data, loading, error } = dashboard;

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded text-red-800">
        <p>오류가 발생했습니다: {error}</p>
        <button 
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
          onClick={getDashboard}
        >
          다시 시도
        </button>
      </div>
    );
  }
  
  if (!data) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>
      <Link 
      className='mb-4 shadow rounded-l p-2 justify-center items-center flex bg-white hover:bg-gray-100'
      to='/'>
        <span className='font-[NanumBarunpen]'>CLICK WHOISWATASHI</span>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard 
          title="총 회원수" 
          value={data.userStats.totalUsers} 
          icon={<Users className="text-blue-500" />}
          subValue={`오늘 ${data.userStats.newUsersToday}명 가입`}
        />
        <DashboardCard 
          title="총 상품" 
          value={data.productStats.totalProducts} 
          icon={<Package className="text-green-500" />}
          subValue={`품절 ${data.productStats.lowStockProducts}개`}
        />
        <DashboardCard 
          title="총 주문" 
          value={data.orderStats.totalOrders} 
          icon={<ShoppingBag className="text-purple-500" />}
          subValue={`대기 ${data.orderStats.pendingOrders}건`}
        />
        <DashboardCard 
          title="이번달 매출" 
          value={`${data.salesStats.thisMonth.toLocaleString()}원`} 
          icon={<DollarSign className="text-yellow-500" />}
          subValue={`전월대비 ${getGrowthRate(data.salesStats.thisMonth, data.salesStats.lastMonth)}%`}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">최근 주문</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">주문번호</th>
                <th className="px-4 py-2 text-left">고객</th>
                <th className="px-4 py-2 text-left">상태</th>
                <th className="px-4 py-2 text-left">금액</th>
                <th className="px-4 py-2 text-left">날짜</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{order.orderNumber}</td>
                  <td className="px-4 py-2">{order.email}</td>
                  <td className="px-4 py-2">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-2">{order.totalAmount.toLocaleString()}원</td>
                  <td className="px-4 py-2">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">재고 부족 상품</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">상품명</th>
                <th className="px-4 py-2 text-left">옵션</th>
                <th className="px-4 py-2 text-left">재고</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.outOfStockProducts?.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{product.product.name}</td>
                  <td className="px-4 py-2">
                    {product.options?.map(option => (
                      <span key={option.optionValue.id} className="inline-block bg-gray-100 rounded px-2 py-1 text-xs mr-1">
                        {option.optionValue.optionType.name}: {option.optionValue.value}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-2 text-red-600 font-medium">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 헬퍼 함수
const getGrowthRate = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous * 100).toFixed(1);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR');
};

const OrderStatusBadge = ({ status }) => {
  const statusMap = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '대기중' },
    processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: '처리중' },
    completed: { bg: 'bg-green-100', text: 'text-green-800', label: '완료' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: '취소' },
    refunded: { bg: 'bg-purple-100', text: 'text-purple-800', label: '환불' }
  };
  
  const style = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
  
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
};

export default Dashboard;