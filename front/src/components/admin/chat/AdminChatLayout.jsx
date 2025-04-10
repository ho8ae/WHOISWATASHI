// src/components/admin/chat/AdminChatLayout.jsx
import React, { useEffect, useState } from 'react';
import useChat from '../../../hooks/useChat';
import AdminChatSidebar from './AdminChatSidebar';
import AdminChatView from './AdminChatView';
import AdminEmptyState from './AdminEmptyState';
import socketService from '../../../utils/socketService';

const AdminChatLayout = () => {
  const { 
    adminChats, 
    currentChat, 
    getAdminChats, 
    selectCurrentChat,
    socketConnected,
    reconnectSocket,
    loading 
  } = useChat();
  
  // 소켓 연결 상태를 추적하는 별도의 상태
  const [realSocketConnected, setRealSocketConnected] = useState(socketConnected);
  
  // 실제 소켓 연결 상태를 주기적으로 업데이트
  useEffect(() => {
    const checkSocketConnection = () => {
      const isSocketConnected = socketService.isConnected();
      setRealSocketConnected(isSocketConnected);
    };
    
    // 초기 체크
    checkSocketConnection();
    
    // 주기적으로 체크 (3초마다)
    const intervalId = setInterval(checkSocketConnection, 3000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // 소켓 연결이 끊어진 경우 자동 재연결 시도
  useEffect(() => {
    if (!realSocketConnected) {
      console.log('소켓 연결이 끊어졌습니다. 자동 재연결 시도...');
      const reconnectTimer = setTimeout(() => {
        reconnectSocket();
      }, 5000);
      
      return () => clearTimeout(reconnectTimer);
    }
  }, [realSocketConnected, reconnectSocket]);
  
  // 컴포넌트 마운트 시 관리자 채팅 목록 로드
  useEffect(() => {
    getAdminChats();
    
    // 일정 간격으로 채팅 목록 새로고침
    const intervalId = setInterval(() => {
      getAdminChats();
    }, 30000); // 30초마다
    
    return () => clearInterval(intervalId);
  }, [getAdminChats]);
  
  // 채팅 선택 핸들러 (소켓 연결 상태 보존)
  const handleSelectChat = (chat) => {
    // 현재 연결 상태 저장
    const currentConnectionStatus = realSocketConnected;
    
    // 채팅 선택
    selectCurrentChat(chat);
    
    // 연결 상태 유지
    setRealSocketConnected(currentConnectionStatus);
  };
  
  // 재연결 핸들러
  const handleReconnect = () => {
    reconnectSocket();
    
    // 약간의 지연 후 상태 업데이트
    setTimeout(() => {
      setRealSocketConnected(socketService.isConnected());
    }, 1000);
  };
  
  return (
    <div className="flex h-full w-full bg-gray-900 text-white overflow-hidden">
      {/* 사이드바 */}
      <AdminChatSidebar 
        chats={adminChats}
        currentChatId={currentChat?.id}
        onSelectChat={handleSelectChat}
        isConnected={realSocketConnected}
        onReconnect={handleReconnect}
        loading={loading}
      />
      
      {/* 메인 채팅 영역 */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {currentChat ? (
          <AdminChatView />
        ) : (
          <AdminEmptyState />
        )}
      </div>
    </div>
  );
};

export default AdminChatLayout;