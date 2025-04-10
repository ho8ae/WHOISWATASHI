// src/components/admin/chat/AdminChatHeader.jsx
import React from 'react';

// 포맷팅 함수
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// 채팅 상태별 라벨과 스타일
const getStatusBadge = (status) => {
  switch(status) {
    case 'pending':
      return <span className="bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-medium">대기 중</span>;
    case 'in_progress':
      return <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">상담 중</span>;
    case 'closed':
      return <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">종료됨</span>;
    default:
      return <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">알 수 없음</span>;
  }
};

const AdminChatHeader = ({ currentChat, socketConnected, onReconnect }) => {
  if (!currentChat) return null;

  return (
    <div className="bg-gray-800 border-b border-gray-700">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-1">
            {currentChat.subject || `채팅 #${currentChat.id}`}
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">고객:</span>
            <span>{currentChat.user?.name || '익명 고객'}</span>
            {getStatusBadge(currentChat.status)}
            
            {/* 소켓 연결 상태 표시 */}
            <div className="ml-2 flex items-center">
              <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-red-500'} mr-1`}></div>
              <span className="text-xs text-gray-400">
                {socketConnected ? '연결됨' : (
                  <button 
                    onClick={onReconnect}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    재연결
                  </button>
                )}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right text-sm text-gray-400">
          <div>시작: {formatDate(currentChat.createdAt)}</div>
          {currentChat.status === 'closed' && currentChat.closedAt && (
            <div>종료: {formatDate(currentChat.closedAt)}</div>
          )}
        </div>
      </div>
      
      {/* 추가 정보 섹션 */}
      <div className="flex bg-gray-700 bg-opacity-30 text-sm">
        {/* 고객 정보 */}
        <div className="flex-1 p-2 border-r border-gray-700">
          <h3 className="font-medium mb-1">고객 정보</h3>
          <div className="grid grid-cols-2 gap-1 text-gray-300">
            <div className="text-gray-400">이메일:</div>
            <div>{currentChat.user?.email || '-'}</div>
            <div className="text-gray-400">연락처:</div>
            <div>{currentChat.user?.phone || '-'}</div>
            <div className="text-gray-400">회원 상태:</div>
            <div>{currentChat.user?.status || '-'}</div>
          </div>
        </div>
        
        {/* 담당자 정보 */}
        <div className="flex-1 p-2">
          <h3 className="font-medium mb-1">담당자 정보</h3>
          {currentChat.adminId ? (
            <div className="grid grid-cols-2 gap-1 text-gray-300">
              <div className="text-gray-400">담당자:</div>
              <div>{currentChat.admin?.name || '알 수 없음'}</div>
              <div className="text-gray-400">배정 시간:</div>
              <div>{currentChat.assignedAt ? formatDate(currentChat.assignedAt) : '-'}</div>
            </div>
          ) : (
            <div className="text-yellow-400">아직 담당자가 배정되지 않았습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatHeader;