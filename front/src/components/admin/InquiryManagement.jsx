// components/admin/InquiryManagement.jsx
import React, { useState, useEffect } from 'react';
import useAdmin from '../../hooks/useAdmin';
import { Search, MessageCircle } from 'lucide-react';

const InquiryManagement = () => {
  const { inquiries, getInquiries, getInquiryDetail, replyToInquiry, changeInquiryStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState('');
  
  useEffect(() => {
    loadInquiries();
  }, [currentPage, statusFilter]);
  
  const loadInquiries = () => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchTerm,
      status: statusFilter || undefined
    };
    
    getInquiries(params);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    loadInquiries();
  };
  
  const handleViewInquiry = async (inquiryId) => {
    const response = await getInquiryDetail(inquiryId);
    if (response?.payload) {
      setSelectedInquiry(response.payload);
    }
  };
  
  const handleSendReply = async () => {
    if (!selectedInquiry || !replyText.trim()) return;
    
    try {
      await replyToInquiry(selectedInquiry.id, { content: replyText });
      setReplyText('');
      // 답변 후 문의 상세 다시 불러오기
      await handleViewInquiry(selectedInquiry.id);
      // 목록 다시 불러오기
      loadInquiries();
    } catch (error) {
      console.error('답변 작성 오류:', error);
      alert('답변 작성 중 오류가 발생했습니다.');
    }
  };
  
  const handleStatusChange = async (inquiryId, status) => {
    await changeInquiryStatus(inquiryId, status);
    // 선택된 문의가 있고, 그 문의의 상태를 변경했다면
    if (selectedInquiry && selectedInquiry.id === inquiryId) {
      handleViewInquiry(inquiryId);
    }
    loadInquiries();
  };
  
  const handleCloseDetail = () => {
    setSelectedInquiry(null);
    setReplyText('');
  };
  
  const { list, pagination, loading, error } = inquiries;
  
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      answered: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      pending: '대기중',
      answered: '답변완료',
      closed: '종료'
    };
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };
  
  return (
    <div className="h-full flex">
      <div className={`${selectedInquiry ? 'w-7/12 pr-4' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">문의 관리</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <div className="flex flex-wrap items-center gap-4">
              <form onSubmit={handleSearch} className="flex flex-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="제목, 내용, 작성자 검색..."
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                >
                  <option value="">모든 상태</option>
                  <option value="pending">대기중</option>
                  <option value="answered">답변완료</option>
                  <option value="closed">종료</option>
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
        
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  </td>
                </tr>
              ) : list && list.length > 0 ? (
                list.map((inquiry) => (
                  <tr 
                    key={inquiry.id}
                    className={`hover:bg-gray-50 cursor-pointer ${selectedInquiry?.id === inquiry.id ? 'bg-blue-50' : ''}`}
                    onClick={() => handleViewInquiry(inquiry.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {inquiry.isPrivate && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded mr-2">비공개</span>
                        )}
                        <div className="text-sm font-medium text-gray-900">{inquiry.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{inquiry.name}</div>
                      <div className="text-xs text-gray-500">{inquiry.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(inquiry.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewInquiry(inquiry.id);
                        }}
                      >
                        <MessageCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    문의가 없습니다
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
      
      {selectedInquiry && (
        <div className="w-5/12 bg-white rounded-lg shadow p-6 h-full overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">문의 상세</h2>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={handleCloseDetail}
            >
              ✕
            </button>
          </div>
          
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{selectedInquiry.title}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {selectedInquiry.name} ({selectedInquiry.email}) | 
                  {new Date(selectedInquiry.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="pending">대기중</option>
                  <option value="answered">답변완료</option>
                  <option value="closed">종료</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="whitespace-pre-line">{selectedInquiry.content}</p>
          </div>
          
          {selectedInquiry.answers && selectedInquiry.answers.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">답변 내역</h3>
              {selectedInquiry.answers.map(answer => (
                <div key={answer.id} className="bg-blue-50 p-4 rounded-lg mb-2">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-500">
                      {answer.admin?.name || '관리자'} | {new Date(answer.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-2 whitespace-pre-line">{answer.content}</p>
                </div>
              ))}
            </div>
          )}
          
          <div>
            <h3 className="font-medium mb-2">답변 작성</h3>
            <textarea
              className="border rounded-lg w-full p-3 mb-3"
              rows="5"
              placeholder="답변 내용을 입력하세요..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            ></textarea>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded float-right"
              onClick={handleSendReply}
              disabled={!replyText.trim()}
            >
              답변 등록
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryManagement;