// components/chat/ChatDebugPanel.jsx
import React from 'react';
import useChat from '../../hooks/useChat';

const ChatDebugPanel = () => {
  const {
    socketConnected,
    checkSocketConnection,
    reconnectSocket,
    currentChat,
    messages,
    getChatMessages,
  } = useChat();
  
  
  
  return (
    <div className="fixed bottom-2 left-2 z-50 bg-black bg-opacity-80 text-white p-2 rounded text-xs">
      <div className="flex items-center space-x-2">
        <span>Socket: {socketConnected ? '연결됨' : '끊김'}</span>
        <button
          onClick={checkSocketConnection}
          className="px-2 py-1 bg-blue-600 rounded"
        >
          상태확인
        </button>
        <button
          onClick={reconnectSocket}
          className="px-2 py-1 bg-green-600 rounded"
        >
          재연결
        </button>
        {currentChat && (
          <button
            onClick={() => getChatMessages(currentChat.id)}
            className="px-2 py-1 bg-purple-600 rounded"
          >
            메시지 새로고침
          </button>
        )}
        <span>Messages: {messages?.length || 0}</span>
      </div>
    </div>
  );
};

export default ChatDebugPanel;