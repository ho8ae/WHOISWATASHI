// src/components/admin/chat/AdminChatView.jsx
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useChat from '../../../hooks/useChat';
import AdminChatHeader from './AdminChatHeader';
import AdminChatMessages from './AdminChatMessages';
import AdminChatInput from './AdminChatInput';
import AdminChatActions from './AdminChatActions';
import socketService from '../../../utils/socketService';

const AdminChatView = () => {
  const { 
    currentChat, 
    messages, 
    sendChatMessage, 
    closeChat, 
    assignChatToMe,
    loading,
    error,
    socketConnected: reduxSocketConnected,
    reconnectSocket,
    joinAdminChat
  } = useChat();
  
  // 별도의 소켓 연결 상태 관리
  const [localSocketConnected, setLocalSocketConnected] = useState(true);
  const [sendingError, setSendingError] = useState('');
  const messagesEndRef = useRef(null);
  
  // 실제 소켓 상태 체크 (채팅방 선택 시 오류 방지)
  useEffect(() => {
    // 컴포넌트 마운트 시 초기 상태 설정
    setLocalSocketConnected(socketService.isConnected());
    
    // 주기적으로 실제 연결 상태 확인
    const checkInterval = setInterval(() => {
      const isConnected = socketService.isConnected();
      setLocalSocketConnected(isConnected);
    }, 5000);
    
    return () => clearInterval(checkInterval);
  }, []);
  
  // 채팅방 재입장 효과 (소켓 연결/재연결 시)
  useEffect(() => {
    if (currentChat?.id && (reduxSocketConnected || localSocketConnected)) {
      console.log(`관리자 채팅방 재입장: ${currentChat.id}`);
      joinAdminChat(currentChat.id);
    }
  }, [currentChat?.id, reduxSocketConnected, localSocketConnected, joinAdminChat]);
  
  // 메시지 전송 핸들러
  const handleSendMessage = async (content) => {
    try {
      setSendingError('');
      
      // 소켓 연결 확인 및 재연결 시도
      if (!localSocketConnected) {
        console.log('메시지 전송 전 소켓 재연결 시도');
        reconnectSocket();
        // 약간의 지연 후 재연결 대기
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // 메시지 전송
      console.log(`관리자 메시지 전송: ${content}`);
      await sendChatMessage(currentChat.id, content);
      console.log('관리자 메시지 전송 완료');
      
      return true;
    } catch (error) {
      console.error('관리자 메시지 전송 실패:', error);
      setSendingError('메시지 전송에 실패했습니다. 네트워크 연결을 확인해주세요.');
      throw error;
    }
  };
  
  // 실제 소켓 연결 확인하고 재연결 처리하는 함수
  const handleReconnect = () => {
    reconnectSocket();
    setTimeout(() => {
      setLocalSocketConnected(socketService.isConnected());
    }, 1000);
  };
  
  // 채팅이 없는 경우 대체 UI
  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        선택된 채팅이 없습니다
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 헤더 */}
      <AdminChatHeader 
        currentChat={currentChat} 
        socketConnected={localSocketConnected}
        onReconnect={handleReconnect}
      />
      
      {/* 채팅 컨텐츠 */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* 메시지 목록 */}
        <AdminChatMessages 
          messages={messages} 
          currentChat={currentChat} 
          messagesEndRef={messagesEndRef}
        />
        
        {/* 소켓 연결 상태 표시 - 연결이 끊긴 경우에만 표시 */}
        {!localSocketConnected && (
          <div className="p-2 bg-red-600 bg-opacity-80 text-white text-center text-sm flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-red-300 rounded-full animate-pulse"></span>
            연결이 끊어졌습니다
            <button 
              onClick={handleReconnect}
              className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30"
            >
              재연결
            </button>
          </div>
        )}
        
        {/* 입력 영역 */}
        <div className="border-t border-gray-700">
          {/* 상태 따른 액션 버튼 */}
          <AdminChatActions 
            currentChat={currentChat}
            onClose={closeChat}
            onAssign={assignChatToMe}
            isLoading={loading}
          />
          
          {/* 에러 메시지 */}
          {(error || sendingError) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2 bg-red-500 text-white text-center text-sm"
            >
              {error || sendingError}
            </motion.div>
          )}
          
          {/* 메시지 입력 */}
          <AdminChatInput
            onSendMessage={handleSendMessage}
            disabled={currentChat.status === 'closed'}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminChatView;