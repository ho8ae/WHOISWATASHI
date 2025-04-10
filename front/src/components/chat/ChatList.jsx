// src/components/chat/ChatList.jsx
import React from 'react';
import { motion } from 'framer-motion';

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

const ChatList = ({ chats, onSelectChat, onNewChat, loading, hideClosedChats = true }) => {
  // 종료된 채팅 필터링 (hideClosedChats가 true인 경우)
  const filteredChats = hideClosedChats 
    ? chats.filter(chat => chat.status !== 'closed') 
    : chats;
  
  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
        <div className="animate-pulse text-gray-400">로딩 중...</div>
      </div>
    );
  }
  
  if (!filteredChats || filteredChats.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
        <div className="text-gray-400 mb-4">아직 채팅 내역이 없습니다</div>
        <button
          onClick={onNewChat}
          className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium"
        >
          새 문의하기
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-2">
      {filteredChats.map((chat) => {
        const statusInfo = getChatStatusInfo(chat.status);
        const lastMessage = chat.messages && chat.messages[0];
        const hasUnread = chat.unreadCount && chat.unreadCount > 0;
        
        return (
          <motion.div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            whileHover={{ scale: 1.01 }}
            className={`p-3 rounded-lg cursor-pointer mb-2 ${
              hasUnread ? 'border-l-4 border-blue-500' : ''
            } hover:bg-gray-800`}
          >
            <div className="flex justify-between mb-1">
              <div className="font-semibold text-sm truncate mr-2">
                {chat.subject || `채팅 #${chat.id}`}
              </div>
              <div className="text-xs text-gray-400">
                {lastMessage ? formatRelativeTime(lastMessage.createdAt) : ''}
              </div>
            </div>
            
            <div className="text-sm text-gray-400 truncate mb-1">
              {lastMessage ? lastMessage.content : '새 채팅'}
            </div>
            
            <div className="flex justify-between items-center mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.className}`}>
                {statusInfo.label}
              </span>
              
              {hasUnread && (
                <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ChatList;