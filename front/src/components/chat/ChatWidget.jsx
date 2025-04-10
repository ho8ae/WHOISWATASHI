// src/components/chat/ChatWidget.jsx
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useChat from '../../hooks/useChat';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatList from './ChatList';
import NewChatForm from './NewChatForm';

const ChatWidget = () => {
  const {
    chats,
    currentChat,
    messages,
    isWidgetOpen,
    isWidgetMinimized,
    isNewChatMode,
    unreadCount,
    loading,
    socketConnected,
    
    openWidget,
    closeWidget,
    toggleWidget,
    selectCurrentChat,
    startNewChatMode,
    sendChatMessage,
    reconnectSocket,
    checkSocketConnection,
    initializeSocket
  } = useChat();
  
  const messagesEndRef = useRef(null);
  
  // 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (messagesEndRef.current && !isWidgetMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isWidgetMinimized]);
  
  // 위젯 열기 시 소켓 연결 함수
  const handleOpenWidget = () => {
    // 소켓 연결 상태 확인
    const isConnected = checkSocketConnection();
    
    // 연결되지 않았으면 초기화
    if (!isConnected) {
      initializeSocket();
    }
    
    // 위젯 열기
    openWidget();
  };
  
  // 뒤로가기 함수
  const handleBack = () => {
    // 현재 채팅 선택 해제 - null 전달
    selectCurrentChat(null);
  };
  
  // 위젯이 닫혀있을 때 표시할 버튼
  if (!isWidgetOpen) {
    return (
      <motion.button
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg z-50"
        onClick={handleOpenWidget}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </motion.button>
    );
  }
  
  return (
    <AnimatePresence>
      <motion.div
        className={`fixed bottom-5 right-5 w-[350px] ${isWidgetMinimized ? 'h-auto' : 'h-[500px]'} bg-gray-900 rounded-xl overflow-hidden flex flex-col shadow-lg z-50 text-white`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        <ChatHeader
          currentChat={currentChat}
          onClose={closeWidget}
          onMinimize={toggleWidget}
          isMinimized={isWidgetMinimized}
          onNewChat={startNewChatMode}
          unreadCount={unreadCount}
          socketConnected={socketConnected}
          onReconnect={reconnectSocket}
          onBack={handleBack} // 뒤로가기 함수 전달
        />
        
        {!isWidgetMinimized && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {!isNewChatMode && !currentChat && (
              <ChatList
                chats={chats}
                onSelectChat={selectCurrentChat}
                onNewChat={startNewChatMode}
                loading={loading}
                hideClosedChats={true} // 종료된 채팅 숨기기 옵션 추가
              />
            )}
            
            {isNewChatMode && (
              <NewChatForm />
            )}
            
            {currentChat && (
              <>
                <ChatMessages
                  messages={messages}
                  currentChat={currentChat}
                  messagesEndRef={messagesEndRef}
                />
                
                <ChatInput
                  onSendMessage={(message) => sendChatMessage(currentChat.id, message)}
                  chatId={currentChat.id}
                  disabled={currentChat.status === 'closed'}
                />
              </>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatWidget;