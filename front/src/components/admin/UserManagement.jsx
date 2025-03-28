import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    // 임시 데이터 (API 연결 전까지 사용)
    setTimeout(() => {
      const mockUsers = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        email: `user${i + 1}@example.com`,
        name: `사용자 ${i + 1}`,
        phone: `010${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: i < 2 ? 'admin' : 'customer',
        createdAt: new Date(2024, 8, Math.floor(1 + Math.random() * 28)).toISOString(),
        orderCount: Math.floor(Math.random() * 10)
      }));

      setUsers(mockUsers);
      setPagination({
        total: 25,
        page: 1,
        limit: 10,
        totalPages: 3
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // 실제로는 API 호출하여 검색
    console.log('검색어:', searchQuery, '역할:', roleFilter);
  };

  const handleChangePage = (newPage) => {
    // 실제로는 API 호출하여 페이지 변경
    console.log('페이지 변경:', newPage);
  };

  const handleRoleChange = async (userId, newRole) => {
    // 실제로는 API 호출하여 역할 변경
    console.log('역할 변경:', userId, newRole);
    
    // 임시로 상태 업데이트
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  if (loading) {
    return <div className="p-8">로딩 중...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">사용자 관리</h1>
      
      {/* 검색 및 필터 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
          <div className="flex-1">
            <input
              type="text"
              placeholder="이름, 이메일 또는 전화번호 검색"
              className="w-full px-4 py-2 border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full md:w-auto px-4 py-2 border rounded-md"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">모든 역할</option>
              <option value="customer">고객</option>
              <option value="admin">관리자</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            검색
          </button>
        </form>
      </div>
      
      {/* 사용자 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">이름</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">이메일</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">전화번호</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">역할</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">가입일</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">주문수</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? '관리자' : '고객'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString('ko-KR')}</td>
                  <td className="px-4 py-3">{user.orderCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Link 
                        to={`/admin/users/${user.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        상세
                      </Link>
                      <button
                        onClick={() => handleRoleChange(
                          user.id, 
                          user.role === 'admin' ? 'customer' : 'admin'
                        )}
                        className="text-purple-500 hover:underline"
                      >
                        {user.role === 'admin' ? '고객으로 변경' : '관리자로 변경'}
                      </button>
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
                전체 <span className="font-medium">{pagination.total}</span> 명 중{' '}
                <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>-
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>
                명 표시
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

export default UserManagement;