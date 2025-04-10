// src/components/chat/ChatHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ChatHeader = ({ 
  currentChat, 
  onClose, 
  onMinimize, 
  isMinimized, 
  onNewChat, 
  unreadCount,
  socketConnected,
  onReconnect,
  onBack // 뒤로가기 함수 추가
}) => {
  // 제목 설정
  let title = '고객 채팅';
  
  if (currentChat) {
    title = currentChat.subject || `채팅 #${currentChat.id}`;
  }
  
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center flex-1 overflow-hidden">
        {/* 뒤로가기 버튼 (현재 채팅이 있을 때만 표시) */}
        {currentChat && (
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded mr-2"
            title="뒤로 가기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        )}
        
        <div className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
          {title}
          {unreadCount > 0 && !currentChat && (
            <span className="inline-block ml-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center text-xs">
        <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-red-500'} mr-1`}></div>
        {!socketConnected && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReconnect}
            className="text-red-400 text-xs cursor-pointer ml-1"
          >
            재연결
          </motion.button>
        )}
      </div>
      
      <div className="flex gap-2">
        {!currentChat && !isMinimized && (
          <button 
            className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded"
            onClick={onNewChat}
            title="새 채팅"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        )}
        
        <button 
          className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded"
          onClick={onMinimize}
          title={isMinimized ? "최대화" : "최소화"}
        >
          {isMinimized ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          )}
        </button>
        
        <button 
          className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded"
          onClick={onClose}
          title="닫기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;