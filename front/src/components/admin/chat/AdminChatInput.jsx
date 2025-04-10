// src/components/admin/chat/AdminChatInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// 자주 사용하는 응답 템플릿
const QUICK_REPLIES = [
  {
    id: 'greeting',
    label: '인사',
    message: '안녕하세요, 고객센터입니다. 무엇을 도와드릴까요?',
  },
  {
    id: 'thanks',
    label: '감사',
    message:
      '문의해주셔서 감사합니다. 더 필요하신 사항이 있으시면 언제든지 말씀해주세요.',
  },
  {
    id: 'wait',
    label: '대기',
    message:
      '확인을 위해 잠시만 기다려주시겠어요? 최대한 빨리 답변 드리겠습니다.',
  },
  {
    id: 'contact',
    label: '연락처',
    message:
      '추가 문의사항은 고객센터(1234-5678)로 연락주시거나 여기에 남겨주시면 빠르게 답변 드리겠습니다.',
  },
];

const AdminChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isSending, setIsSending] = useState(false); // 전송 중 상태 추가
  const inputRef = useRef(null);
  const quickRepliesRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);


  // 바깥 영역 클릭 시 빠른 응답 패널 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        quickRepliesRef.current &&
        !quickRepliesRef.current.contains(event.target)
      ) {
        setShowQuickReplies(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 메시지 전송 함수
  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending) return;

    try {
      setIsSending(true); // 전송 시작
      console.log('관리자 메시지 전송 시작:', trimmedMessage);

      // 메시지 전송
      await onSendMessage(trimmedMessage);

      console.log('관리자 메시지 전송 완료');
      setMessage(''); // 성공 시 입력창 초기화
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSending(false); // 전송 상태 초기화

      // 전송 후 자동 포커스
      // 렌더 후에 포커스 주도록 약간 지연
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  // 빠른 응답 선택 처리
  const handleQuickReplySelect = (replyMessage) => {
    setMessage(replyMessage);
    setShowQuickReplies(false);

    // 자동으로 포커스 설정
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 엔터 키로 메시지 전송 (한글 입력 문제 해결)
  const handleKeyDown = (e) => {
    // IME 입력 중이면 무시 (한글, 일본어, 중국어 등의 조합형 문자 입력 시)
    if (e.nativeEvent.isComposing || e.keyCode === 229) {
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 bg-gray-800">
      {disabled ? (
        <div className="w-full p-3 rounded-lg bg-gray-700 text-gray-400 text-center">
          채팅이 종료되었습니다
        </div>
      ) : (
        <div className="flex items-end gap-2">
          {/* 빠른 응답 버튼 */}
          <div className="relative">
            <button
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white focus:outline-none"
              title="빠른 응답"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </button>

            {/* 빠른 응답 패널 */}
            {showQuickReplies && (
              <motion.div
                ref={quickRepliesRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-0 mb-2 w-64 bg-gray-700 rounded-lg shadow-lg overflow-hidden z-10"
              >
                <div className="p-2 bg-gray-800 border-b border-gray-600 text-sm font-medium">
                  자주 사용하는 응답
                </div>
                <div className="p-2">
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => handleQuickReplySelect(reply.message)}
                      className="block w-full text-left px-3 py-2 rounded hover:bg-gray-600 text-sm mb-1 last:mb-0"
                      type="button"
                    >
                      <span className="font-medium">{reply.label}:</span>{' '}
                      {reply.message.substring(0, 30)}...
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* 메시지 입력 영역 */}
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            disabled={isSending}
            className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 resize-none min-h-[60px] max-h-32 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />

          {/* 전송 버튼 */}
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isSending}
            className={`rounded-full w-10 h-10 flex items-center justify-center ${
              message.trim() && !isSending
                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            type="button"
          >
            {isSending ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
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
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminChatInput;
