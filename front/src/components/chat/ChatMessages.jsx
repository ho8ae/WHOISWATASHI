// src/components/chat/ChatMessages.jsx
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // 오늘, 어제, 또는 날짜를 표시
  if (date.toDateString() === today.toDateString()) {
    return '오늘';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '어제';
  } else {
    return date.toLocaleDateString();
  }
};

const ChatMessages = ({ messages, currentChat, messagesEndRef }) => {
  // 중복 제거된 메시지 저장 state
  const [uniqueMessages, setUniqueMessages] = useState([]);
  const containerRef = useRef(null);
  
  // 메시지 중복 제거 처리
  useEffect(() => {
    if (!messages || !Array.isArray(messages)) {
      setUniqueMessages([]);
      return;
    }
    
    // 메시지 ID 기반 중복 제거
    const messageMap = new Map();
    const contentTimeMap = new Map(); // 내용 + 시간 기반 중복 체크용
    
    // 정렬된 메시지 배열 준비 (시간순)
    const sortedMessages = [...messages].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeA - timeB;
    });
    
    // 중복 제거 처리
    sortedMessages.forEach(msg => {
      if (!msg) return;
      
      // ID가 있으면 ID로 중복 체크
      if (msg.id) {
        messageMap.set(msg.id, msg);
      } else {
        // ID가 없으면 내용 + 생성시간으로 중복 체크
        const content = msg.content || msg.message || '';
        const time = msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now();
        const key = `${content}-${time}`;
        
        // 5초 이내 같은 내용 메시지는 중복으로 처리
        let isDuplicate = false;
        contentTimeMap.forEach((value, existingKey) => {
          const [existingContent, existingTimeStr] = existingKey.split('-');
          const existingTime = parseInt(existingTimeStr);
          
          if (content === existingContent && Math.abs(time - existingTime) < 5000) {
            isDuplicate = true;
          }
        });
        
        if (!isDuplicate) {
          contentTimeMap.set(key, msg);
        }
      }
    });
    
    // ID 기반과 내용 기반 중복 제거 결과 합치기
    const uniqueMessagesArray = [
      ...Array.from(messageMap.values()),
      ...Array.from(contentTimeMap.values()).filter(msg => !msg.id) // ID 없는 메시지만 추가
    ];
    
    // 다시 시간순 정렬
    uniqueMessagesArray.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeA - timeB;
    });
    
    setUniqueMessages(uniqueMessagesArray);
  }, [messages]);
  
  // 메시지 변경 시 자동 스크롤
  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      // 스크롤을 최하단으로 이동
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
      
      // 추가적으로 살짝 더 스크롤 (여백 추가)
      setTimeout(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight + 100;
      }, 100);
    }
  }, [uniqueMessages]);
  
  // 메시지가 없는 경우
  if (!uniqueMessages || uniqueMessages.length === 0) {
    return (
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 flex flex-col">
        <div className="self-center bg-gray-800 px-3 py-2 rounded-lg text-xs text-gray-400">
          {currentChat?.status === 'pending' ? (
            '문의가 접수되었습니다. 잠시만 기다려주세요.'
          ) : currentChat?.status === 'closed' ? (
            '상담이 종료되었습니다.'
          ) : (
            '대화를 시작하세요!'
          )}
        </div>
        <div ref={messagesEndRef} className="h-4" /> {/* 여백 추가 */}
      </div>
    );
  }
  
  // 메시지 그룹화 (날짜별)
  const groupedMessages = [];
  let currentDate = null;
  
  uniqueMessages.forEach((message, index) => {
    // message가 비어있거나 null인 경우 건너뛰기
    if (!message) return;
    
    const messageDate = message.createdAt ? formatDate(message.createdAt) : null;
    
    // 날짜가 변경되면 날짜 구분선 추가
    if (messageDate && messageDate !== currentDate) {
      currentDate = messageDate;
      groupedMessages.push({ 
        type: 'date', 
        date: messageDate, 
        id: `date-${message.id || index}` 
      });
    }
    
    groupedMessages.push(message);
  });
  
  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
      {groupedMessages.map((item, index) => {
        // item이 비어있거나 null인 경우 건너뛰기
        if (!item) return null;
        
        // 날짜 구분선인 경우
        if (item.type === 'date') {
          return (
            <div key={item.id} className="self-center bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-400 my-2">
              {item.date}
            </div>
          );
        }
        
        // 시스템 메시지인 경우
        if (item.type === 'system') {
          return (
            <div key={item.id || `system-${index}`} className="self-center bg-gray-800 px-3 py-2 rounded-lg text-xs text-gray-400">
              {item.content || '시스템 메시지'}
            </div>
          );
        }
        
        // 일반 메시지인 경우
        const isUserMessage = currentChat && item.senderId === currentChat.userId;
        
        // 메시지 내용 확인
        const messageContent = item.content || item.message || '';
        
        return (
          <motion.div
            key={item.id || `msg-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`max-w-[80%] ${isUserMessage ? 'self-end' : 'self-start'}`}
          >
            <div 
              className={`px-3 py-2 rounded-xl text-white ${
                isUserMessage 
                  ? 'bg-blue-600 rounded-br-sm' 
                  : 'bg-gray-700 rounded-bl-sm'
              }`}
            >
              {messageContent}
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">
              {formatTime(item.createdAt)}
            </div>
          </motion.div>
        );
      })}
      {/* 스크롤 여백 확보를 위한 요소 */}
      <div ref={messagesEndRef} className="h-8" />
    </div>
  );
};

export default ChatMessages;