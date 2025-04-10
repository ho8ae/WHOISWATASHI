// src/components/chat/ChatInput.jsx
import React, { useState, useRef, useEffect } from 'react';

// 마지막 전송 메시지 추적을 위한 전역 변수
const lastSentMessage = {
  content: '',
  timestamp: 0,
};

const ChatInput = ({ onSendMessage, chatId, disabled }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // 컴포넌트 마운트 시 입력창에 포커스 설정
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatId]);

  // 메시지 전송 함수 수정
  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending) return;

    try {
      setIsSending(true); // 전송 시작

      // 메시지 전송
      await onSendMessage(trimmedMessage);

      // 성공 시 입력창 초기화
      setMessage('');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      // 오류 처리
    } finally {
      // 약간의 지연 후 전송 상태 초기화 (다음 메시지 전송 가능하도록)
      setTimeout(() => {
        setIsSending(false);
      }, 500);
    }
  };

  // 입력 변경 시 타이핑 상태 업데이트
  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
    }

    // 타이핑 타임아웃 설정 (사용자가 타이핑을 멈추면 isTyping을 false로 설정)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  // 엔터 키로 메시지 전송 (한글 입력 문제 해결)
  const handleKeyDown = (e) => {
    // IME 입력 중이면 무시 (한글, 일본어, 중국어 등의 조합형 문자 입력 시)
    if (e.nativeEvent.isComposing || e.keyCode === 229) {
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 엔터 키의 기본 동작 방지
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700 flex gap-2">
      {disabled ? (
        <div className="w-full p-3 rounded-lg bg-gray-700 text-gray-400 text-center">
          채팅이 종료되었습니다
        </div>
      ) : (
        <>
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="flex-1 p-3 border-none rounded-lg bg-gray-700 text-white placeholder-gray-400 resize-none h-10 outline-none focus:ring-2 focus:ring-blue-500"
            style={{ lineHeight: '16px' }}
          />

          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`rounded-full w-10 h-10 flex items-center justify-center ${
              message.trim()
                ? 'bg-blue-600 text-white cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            type="button" // 명시적으로 button 타입 지정
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default ChatInput;
