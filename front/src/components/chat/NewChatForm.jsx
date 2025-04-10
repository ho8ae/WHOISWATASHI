// src/components/chat/NewChatForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import useChat from '../../hooks/useChat';

const NewChatForm = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { startChat, error: chatError, resetError } = useChat();
  const subjectInputRef = useRef(null);
  
  // 컴포넌트 마운트 시 제목 입력에 포커스
  useEffect(() => {
    if (subjectInputRef.current) {
      subjectInputRef.current.focus();
    }
  }, []);
  
  // 채팅 에러 변경 시
  useEffect(() => {
    if (chatError) {
      setError(chatError);
      setIsSubmitting(false);
    }
  }, [chatError]);
  
  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // 입력 유효성 검사
    if (!subject.trim()) {
      setError('문의 제목을 입력해주세요.');
      return;
    }
    
    if (!message.trim()) {
      setError('문의 내용을 입력해주세요.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      resetError();
      
      await startChat(subject.trim(), message.trim());
      
      // 폼 초기화
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
    } catch (err) {
      setError('문의를 시작하는데 문제가 발생했습니다. 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="subject" className="text-sm font-semibold">
          문의 제목
        </label>
        <input
          ref={subjectInputRef}
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="어떤 문의를 하실건가요?"
          className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-semibold">
          문의 내용
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="문의 내용을 자세히 작성해주세요"
          className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 resize-none h-32 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {error && (
        <div className="text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`p-3 rounded-lg font-semibold mt-2 ${
          isSubmitting 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-black cursor-pointer'
        }`}
      >
        {isSubmitting ? '처리 중...' : '문의 시작하기'}
      </motion.button>
    </form>
  );
};

export default NewChatForm;