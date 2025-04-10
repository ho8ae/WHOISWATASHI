// src/components/admin/chat/AdminChatActions.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminChatActions = ({ currentChat, onClose, onAssign, isLoading }) => {
  const [confirmClose, setConfirmClose] = useState(false);
  
  // 채팅 상태에 따른 액션 렌더링
  if (!currentChat) return null;
  
  // 채팅이 이미 종료된 경우
  if (currentChat.status === 'closed') {
    return (
      <div className="px-4 py-2 bg-gray-700 bg-opacity-30 text-xs text-gray-400 text-center">
        이 채팅은 {currentChat.closedAt ? new Date(currentChat.closedAt).toLocaleString() : '이전에'} 종료되었습니다.
      </div>
    );
  }
  
  // 채팅이 대기 중인 경우 (관리자 배정 필요)
  if (currentChat.status === 'pending') {
    return (
      <div className="px-4 py-2 bg-gray-700 flex items-center justify-between">
        <div className="text-yellow-400">
          <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
          고객이 문의를 시작했습니다
        </div>
        
        <button
          onClick={() => onAssign(currentChat.id)}
          disabled={isLoading}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '처리 중...' : '내가 담당하기'}
        </button>
      </div>
    );
  }
  
  // 채팅이 진행 중인 경우 (종료 가능)
  return (
    <div className="px-4 py-2 bg-gray-700 flex items-center justify-between">
      <div className="text-blue-400">
        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
        {currentChat.admin?.name ? `${currentChat.admin.name}님이` : '관리자가'} 상담 중입니다
      </div>
      
      {confirmClose ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">종료하시겠습니까?</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setConfirmClose(false)}
            className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm text-white"
          >
            취소
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onClose(currentChat.id)}
            disabled={isLoading}
            className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white disabled:opacity-50"
          >
            확인
          </motion.button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmClose(true)}
          disabled={isLoading}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '처리 중...' : '채팅 종료'}
        </button>
      )}
    </div>
  );
};

export default AdminChatActions;

