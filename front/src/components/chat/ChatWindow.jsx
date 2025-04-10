import React, { useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatList from './ChatList';
import NewChatForm from './NewChatForm';
import  useChat  from '../../hooks/useChat';

const ChatWindow = () => {
  const { 
    isWidgetMinimized, 
    isNewChatMode, 
    currentChat, 
    messages,
    sendChatMessage,
    closeChat
  } = useChat();
  
  if (isWidgetMinimized) {
    return null;
  }
  
  const handleSendMessage = (content) => {
    if (currentChat) {
      sendChatMessage(currentChat.id, content);
    }
  };
  
  const handleCloseChat = () => {
    if (currentChat) {
      closeChat(currentChat.id);
    }
  };
  
  // 채팅이 종료된 경우 메시지 전송 비활성화
  const isChatClosed = currentChat?.status === 'closed';
  
  // 현재 채팅 표시 화면
  const renderChatView = () => {
    if (isNewChatMode) {
      return <NewChatForm />;
    }
    
    if (!currentChat) {
      return <ChatList />;
    }
    
    return (
      <>
        <ChatMessages messages={messages} />
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isChatClosed}
          placeholder={isChatClosed ? '채팅이 종료되었습니다' : '메시지를 입력하세요...'}
        />
        {!isChatClosed && (
          <div className="px-3 py-2 bg-gray-50 border-t text-center">
            <button
              onClick={handleCloseChat}
              className="text-xs text-red-600 hover:text-red-800"
            >
              채팅 종료하기
            </button>
          </div>
        )}
      </>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      {renderChatView()}
    </div>
  );
};

export default ChatWindow;