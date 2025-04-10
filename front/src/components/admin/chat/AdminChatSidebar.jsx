// src/components/admin/chat/AdminChatSidebar.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import socketService from '../../../utils/socketService';

// 타임스탬프를 상대 시간으로 포맷팅
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return '방금 전';
  } else if (diffMin < 60) {
    return `${diffMin}분 전`;
  } else if (diffHour < 24) {
    return `${diffHour}시간 전`;
  } else if (diffDay < 7) {
    return `${diffDay}일 전`;
  } else {
    return date.toLocaleDateString();
  }
};

// 채팅 상태별 라벨과 스타일
const getChatStatusInfo = (status) => {
  switch(status) {
    case 'pending':
      return { 
        label: '대기 중', 
        className: 'bg-yellow-500 text-gray-900'
      };
    case 'in_progress':
      return { 
        label: '상담 중', 
        className: 'bg-blue-600 text-white'
      };
    case 'closed':
      return { 
        label: '종료됨', 
        className: 'bg-gray-500 text-white'
      };
    default:
      return { 
        label: '알 수 없음', 
        className: 'bg-gray-500 text-white'
      };
  }
};

const AdminChatSidebar = ({ 
  chats, 
  currentChatId, 
  onSelectChat, 
  isConnected, 
  onReconnect, 
  loading 
}) => {
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'in_progress', 'closed'
  const [searchTerm, setSearchTerm] = useState('');
  const [localConnectionStatus, setLocalConnectionStatus] = useState(isConnected);
  
  // 소켓 연결 상태 로컬 관리 (급작스런 변경 방지)
  useEffect(() => {
    // 연결 상태가 바뀌면 1초 후에 로컬 상태 업데이트
    const timer = setTimeout(() => {
      setLocalConnectionStatus(isConnected);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isConnected]);
  
  // 주기적으로 실제 소켓 연결 상태 확인
  useEffect(() => {
    const checkSocketConnection = () => {
      const actualStatus = socketService.isConnected();
      if (actualStatus !== localConnectionStatus) {
        setLocalConnectionStatus(actualStatus);
      }
    };
    
    const interval = setInterval(checkSocketConnection, 5000);
    return () => clearInterval(interval);
  }, [localConnectionStatus]);
  
  // 채팅 선택 핸들러 (연결 상태 보존)
  const handleSelectChat = (chat) => {
    // 상태 변경을 방지하기 위해 연결 상태를 임시 저장
    const connectionStatus = localConnectionStatus;
    
    // 채팅 선택
    onSelectChat(chat);
    
    // 약간의 지연 후 연결 상태 복원 (필요한 경우)
    setTimeout(() => {
      if (connectionStatus !== localConnectionStatus) {
        setLocalConnectionStatus(connectionStatus);
      }
    }, 100);
  };
  
  // 채팅 필터링
  const filteredChats = chats.filter(chat => {
    // 상태 필터링
    if (filter !== 'all' && chat.status !== filter) {
      return false;
    }
    
    // 검색어 필터링
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const subject = (chat.subject || '').toLowerCase();
      const messages = chat.messages?.[0]?.content?.toLowerCase() || '';
      const userName = (chat.user?.name || '').toLowerCase();
      
      return subject.includes(term) || 
             messages.includes(term) || 
             userName.includes(term);
    }
    
    return true;
  });
  
  return (
    <div className="w-80 h-full bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold">고객 채팅 관리</h1>
          <div className="flex items-center text-sm">
            <div className={`w-2 h-2 rounded-full ${localConnectionStatus ? 'bg-green-500' : 'bg-red-500'} mr-1`}></div>
            {!localConnectionStatus ? (
              <button 
                onClick={onReconnect}
                className="text-red-400 hover:text-red-300 text-xs"
              >
                재연결
              </button>
            ) : (
              <span className="text-gray-400 text-xs">연결됨</span>
            )}
          </div>
        </div>
        
        {/* 검색창 */}
        <div className="relative mb-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="채팅 검색..."
            className="w-full p-2 pl-8 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 absolute left-2 top-3 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* 필터 탭 */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 text-sm font-medium ${
              filter === 'all' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 py-2 text-sm font-medium ${
              filter === 'pending' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            대기
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`flex-1 py-2 text-sm font-medium ${
              filter === 'in_progress' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            상담 중
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`flex-1 py-2 text-sm font-medium ${
              filter === 'closed' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            종료
          </button>
        </div>
      </div>
      
      {/* 채팅 목록 */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-400">로딩 중...</div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-400 text-sm">채팅이 없습니다</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const statusInfo = getChatStatusInfo(chat.status);
            const lastMessage = chat.messages && chat.messages[0];
            const isActive = chat.id === currentChatId;
            
            return (
              <motion.div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                whileHover={{ scale: 1.01 }}
                className={`p-3 mb-2 rounded-lg cursor-pointer ${
                  isActive 
                    ? 'bg-blue-900 bg-opacity-30 border-l-4 border-blue-500' 
                    : 'hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-sm truncate mr-2">
                    {chat.subject || `채팅 #${chat.id}`}
                  </div>
                  <div className="text-xs text-gray-400">
                    {lastMessage ? formatRelativeTime(lastMessage.createdAt) : ''}
                  </div>
                </div>
                
                <div className="text-sm text-gray-400 truncate mb-1">
                  {chat.user?.name || '익명 고객'}: {lastMessage ? lastMessage.content : ''}
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                  
                  {chat.adminId ? (
                    <span className="text-xs text-gray-400">
                      담당: {chat.admin?.name || '배정됨'}
                    </span>
                  ) : chat.status === 'pending' ? (
                    <span className="text-xs text-yellow-400">배정 필요</span>
                  ) : null}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminChatSidebar;